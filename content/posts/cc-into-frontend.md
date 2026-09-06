---
title: "在大陆 VPS 上，把 Claude Code 接进自己的前端"
date: "2026-09-06"
tags: ["教程","Claude","服务器"]
category: "教程"
---

> 目标：手机打开自己的网页，直接指挥跑在阿里云 VPS 上的 Claude Code——它能读写服务器上的文件、跑命令、改自己的代码，输出实时流回浏览器。
>
> 全程踩了大概十五个坑，这篇按「我当时卡在哪」的顺序写，不是按代码结构写。
>
> 环境：阿里云大陆 VPS（Debian）+ FastAPI 网关 + 纯手写前端。Claude Code 订阅版（不是 API 计费）。

---

## 〇、先看成品长什么样

```
手机浏览器 ──HTTPS──> nginx ──> FastAPI 网关(8003) ──spawn──> claude -p (headless)
   ▲                                    │                          │
   └──────── SSE 事件流 ────────────────┘                          │
                                                          读写 /opt 下的文件、跑 git、
                                                          改网关自己的代码……
```

一条消息的生命周期：

1. 前端 POST `/cc/chat`，带 `{message, session_id}`
2. 网关 `subprocess.Popen(["claude", "-p", msg, "--output-format", "stream-json", ...])`
3. CC 每产出一个事件就往 stdout 吐一行 JSON
4. 网关逐行读、翻译成 SSE 事件推给浏览器
5. 最后一行 `result` 里带**新的 session_id**，前端存下来，下条消息带回来 `--resume`

核心就这五步。剩下的九成篇幅都是在处理"为什么它不工作"。

---

## 一、第一关：大陆 VPS 根本连不上 Anthropic

这关跟 Claude Code 无关，但不过这关后面全是空谈。

### 1.1 一个吃了我半天的教训：代理商按「产品类型」分白名单

我买的商业代理，本机（Windows）用得好好的，服务器上死活连不上。报错是：

```
curl: (97) Can't complete SOCKS5 connection to ifconfig.me. (2)
```

括号里那个 `(2)` 是 socks5 协议的回复码，含义是 **"connection not allowed by ruleset"**——不是网络不通，是**对面主动拒绝了你**。

我第一反应是 IP 白名单没加，去后台加，提示：

> IP already whitelisted for this product type

关键就在最后三个词 **for this product type**。我买的那个套餐**只开了 HTTP 入口（端口 12323）**，socks5 入口（12324）是另一个产品。IP 加白名单是按产品加的，我加的是 HTTP 那个产品，socks5 那边永远不认。

最后是对着本机的启动脚本一行行比才发现的——本机写的是 `http://...:12323`，服务器上我手贱写成了 `socks5://...:12324`。

**教训：TCP 端口通 ≠ 那个协议对你开放。** socks5 的 `(2)` 和 HTTP 代理的 `403` 都是"我认识你但不让你过"，跟"连不上"是完全不同的两类问题，别混在一起排查。

### 1.2 gost 这一层，多半是多余的

我原本的架构是本地起个 gost 转一道：

```
gost -L http://127.0.0.1:7890 -F http://user:pass@上游:12323
```

想法是"本地有个不带密码的干净入口"。结果 gost 转发出去**照样被上游 403**（日志里 `route(retry=0) 403 Forbidden`），查了半天没查明白。

后来想通了：**这层根本没必要。** Python 的 `urllib`/`requests`/`httpx` 全都原生支持带账密的 HTTP 代理：

```bash
HTTP_PROXY=http://user:pass@host:12323
```

直接把上游写进环境变量，一次就通了。gost 适合的是"协议转换"（比如你只有 socks5 但程序只认 HTTP）或者链式跳板，**只是想加个认证头的话，纯属自找麻烦**——多一层就多一个可能出错的地方，而且它出错时给你的信息比 curl 少得多。

### 1.3 systemd 不继承你 shell 里的 export

这条是经典坑，但值得再写一遍，因为它的表现极具迷惑性：**你 SSH 上去手动跑一切正常，服务跑起来就连不上外网。**

原因很简单：`~/.bashrc` 里的 `export HTTP_PROXY=...` 只对你的登录 shell 有效，systemd 拉起的服务用的是一套干净得多的环境。

正确做法是 drop-in（不改原 unit 文件，加一层覆盖）：

```bash
systemctl edit lmc-gateway
```

```ini
[Service]
Environment=HTTP_PROXY=http://user:pass@host:12323
Environment=HTTPS_PROXY=http://user:pass@host:12323
Environment=NO_PROXY=localhost,127.0.0.1
TimeoutStopSec=10
```

后两行是踩出来的：

- **`NO_PROXY=localhost,127.0.0.1` 必须写。** 不写的话你自己的服务之间互调（网关 8003 → 检索 8002）也会被送去代理，代理商拒转本地地址，回你一个 403。表现是"某个内部页面 500"，跟代理八竿子打不着的样子。
- **`TimeoutStopSec=10` 建议写。** uvicorn 优雅关闭会等所有连接结束，而 SSE 是长连接、永远不结束——`systemctl restart` 会卡在 `deactivating (stop-sigterm)` 整整 90 秒（systemd 默认超时）才强杀。第一次遇到会以为服务器死了。

### 1.4 排查姿势：pgrep 要按真实命令行来

```bash
pgrep -f gateway.py      # 抓不到
pgrep -f "uvicorn gateway"   # 这才对
```

因为它是 `uvicorn gateway:app` 起的，命令行里压根没有 `gateway.py` 这个字符串。这种"进程明明在跑但我查不到"的时刻特别容易把人带沟里，先 `ps aux | grep` 看一眼真实命令行再写匹配串。

---

## 二、第二关：headless 机器上怎么完成 OAuth 登录

服务器没有浏览器，`claude` 第一次启动会打印一条授权 URL 让你自己去开。

我在这卡了二十分钟，原因非常蠢但估计人人都会中：**那条 URL 在终端里被折行了，鼠标框选复制会把换行符一起带走**，粘到浏览器就是一个断成两截的废链接（`h ttps://...`、`code_challeng e_method=...`）。

三个办法，按推荐顺序：

1. **在 CC 界面按 `c`**——它自己提示了 "(c to copy)"，走的是终端剪贴板协议，不经过鼠标选中，最干净。
2. **把窗口拉宽再重跑**，让 URL 显示在一行里再复制。
3. 手动把断行处拼回去（我最后是这么干的，但容易漏）。

然后：在**你自己电脑的浏览器**打开（这台机器得能正常访问 claude.com），登录授权，页面给你一串码，粘回服务器终端。

⚠️ 两个注意：

- **别关掉服务器上那个等待中的进程。** URL 里的 `code_challenge` 和它是配对的（PKCE），进程一退就作废，得重开一轮。
- **登录凭证存在 `~/.claude/`，是机器级的。** 登一次，之后 tmux 里跑的、你的网关 spawn 的、cron 里跑的，全都共享这份凭证，不用再登。

### 关于地区

Anthropic 不支持香港地区，HK 出口 IP 有账号风险。买 VPS 或选代理线路时优先**日本 / 新加坡 / 美西**。（我当时差点为了低延迟买香港小鸡，幸好先问了一句。）

---

## 三、核心：把 `claude -p` 变成一个 HTTP 流式接口

这是整件事的心脏，其实只有二十行。

### 3.1 命令行长什么样

```python
cmd = [cc_bin, "-p", msg,
       "--output-format", "stream-json",   # 逐事件吐 JSON 行
       "--verbose",                        # 没有它 stream-json 只吐最后结果
       "--dangerously-skip-permissions"]   # bypass：不弹审批
if session_id:
    cmd += ["--resume", session_id]        # 接上一轮
if model:
    cmd += ["--model", model]              # sonnet / opus / haiku
```

`--verbose` 那条必须加，否则你只能拿到最终结果，中间的工具调用全看不见——流式的意义就没了。

### 3.2 stream-json 的事件长什么样

stdout 每行一个 JSON，`type` 字段分四类：

| type | 里面有什么 | 前端怎么用 |
|---|---|---|
| `system` (subtype=`init`) | session_id、model、cwd、可用的斜杠命令 | 开场状态行 |
| `assistant` | `message.content[]`：`text` / `thinking` / `tool_use` 块 | 正文气泡、思考折叠、🔧工具卡 |
| `user` | `message.content[]` 里的 `tool_result` | 给对应工具卡填结果 ✅/❌ |
| `result` | 最终 session_id、耗时、轮数、cost | 收尾状态条 |

翻译成 SSE 的循环骨架：

```python
for raw_line in proc.stdout:
    obj = json.loads(raw_line)
    t = obj.get("type")
    if t == "assistant":
        for blk in obj["message"]["content"]:
            if blk["type"] == "text":
                yield sse("text", {"delta": blk["text"]})
            elif blk["type"] == "tool_use":
                yield sse("tool_call", {"id": blk["id"], "name": blk["name"],
                                        "input": preview(blk["input"])})
    elif t == "result":
        yield sse("done", {"session_id": obj["session_id"], ...})
```

⚠️ **`assistant` 事件是整块到达的，不是逐字符。** CC 的 `-p` 模式给的是 block 级流式（一个 text block 完成才发一次），不是 token 级。想要打字机效果得前端自己做，别指望后端。

### 3.3 会话连续性：每轮的 session_id 都是新的

这条我一开始理解错了，害得会话老是断。

**`--resume` 之后，`result` 里回给你的是一个全新的 session_id，不是你传进去的那个。** 所以正确姿势是：

```
每轮 done → 用回传的新 id 覆盖存下来 → 下轮拿这个新 id --resume
```

如果你一直用第一次拿到的那个 id 去 resume，会一直从那个点分叉，聊十轮它还停在第一轮的记忆上。

会话本体存在 `~/.claude/projects/<项目路径转义>/<session_id>.jsonl`，一行一个事件——这也是后面做用量统计的数据源。

### 3.4 权限：bypass + root 的那道坎

`--dangerously-skip-permissions` 让 CC 不弹审批直接干活（网页端没法弹终端确认框，必须开）。

但**以 root 跑时 CC 会拒绝这个 flag**，理由是太危险。绕过办法：

```python
env["IS_SANDBOX"] = "1"
```

这是 CC 认的一个环境变量，声明"我在沙箱里，别拦我"。

**必须说清楚风险**：这个组合意味着那个进程在你服务器上想干什么就干什么——删文件、改配置、发网络请求，全部无需确认。我自己开着，因为这是台单人自用的机器、且我要的就是"它能自主改代码"。**如果你的服务器上有别人的数据、或者这个前端可能被别人访问到，别这么干。** 见第七节。

---

## 四、找不到 `claude` 这个可执行文件

这个坑会周期性复发，因为 **CC 会自动更新，更新时可能换安装位置**。

写死路径的下场是过几天突然就 `FileNotFoundError`。我的做法是每次用时现找：

```python
def _find_cc_bin():
    cands = [os.environ.get("CC_BIN"),          # 手动指定优先
             shutil.which("claude"),
             "/root/.local/bin/claude",         # 官方 install.sh
             "/root/.claude/local/claude",      # migrate-installer 之后
             "/usr/local/bin/claude",
             "/root/.npm-global/bin/claude"]    # npm 全局装
    # nvm 装的：node 版本一升级路径整个变，扫 glob 取最新
    nvm = glob.glob("/root/.nvm/versions/node/*/bin/claude")
    if nvm:
        cands.append(max(nvm, key=os.path.getmtime))
    for p in cands:
        if p and os.path.isfile(p) and os.access(p, os.X_OK):
            return p
    return None
```

### 还有一个更隐蔽的：PATH 里没有 node

`claude` 本体是个 node 脚本，开头是 `#!/usr/bin/env node`。你的 systemd 服务的 PATH 是精简的，里面**没有 nvm 的 node**——于是"文件明明存在、权限也对，一跑就说找不到"。

修法是把它所在目录顶到 PATH 最前：

```python
env = dict(os.environ)
env["PATH"] = os.path.dirname(cc_bin) + os.pathsep + env.get("PATH", "")
```

因为 nvm 的 `claude` 和 `node` 通常就在同一个 bin 目录里。

---

## 五、让它在生产环境里不出事的六件小事

这一节全是"不做也能跑，但迟早半夜炸给你看"的东西。

### 1. stderr 不读会把进程憋死

管道缓冲区满了，子进程写 stderr 就会阻塞，然后整个卡住。必须开个线程读掉：

```python
def _drain_err():
    for ln in proc.stderr:
        stderr_tail.append(ln)
        if len(stderr_tail) > 20:
            stderr_tail.pop(0)   # 只留尾巴，报错时给用户看
threading.Thread(target=_drain_err, daemon=True).start()
```

留最后 20 行很有用——CC 异常退出时，这就是唯一的线索。

### 2. SSE 心跳，防反代掐空闲连接

CC 思考几分钟不出声很正常，但 nginx 默认 60 秒无数据就断连接。用带超时的队列读，超时就发个心跳：

```python
try:
    ln = lines.get(timeout=15)
except queue.Empty:
    yield sse("ping", {})     # 前端忽略这个事件
    continue
```

同时 nginx 那边记得 `proxy_buffering off`（响应头里也带一份 `X-Accel-Buffering: no`），否则它会攒着不发，流式变成一次性。

### 3. 按「停止」要真的杀掉服务器上那个进程

前端 `AbortController` 只断浏览器这头，**CC 在服务器上照跑到底**。用户看没反应就发下一条，撞上"上一条还在跑"的 409，人就被锁在门外了。

得给个真的终止接口。两个细节：

```python
# spawn 时单开进程组——CC 底下还会拉 node 子进程跑工具
proc = subprocess.Popen(cmd, ..., start_new_session=True)

# 杀的时候整组杀，先 TERM 给它机会把这轮写进会话，2 秒不死再 KILL
os.killpg(os.getpgid(p.pid), signal.SIGTERM)
try: p.wait(timeout=2)
except: os.killpg(os.getpgid(p.pid), signal.SIGKILL)
```

只杀父进程会留下一堆孤儿 node 继续占着会话。

### 4. 但是「断网」不该杀

区分两种断流，行为要相反：

| 情况 | 该怎么办 |
|---|---|
| 用户主动点停止 | 真杀（前端额外打一枪 `/cc/abort`） |
| 手机断网 / 切后台 | **不杀**，让它跑完存进会话，回来 `--resume` 还接得上 |

所以 SSE 生成器的 `finally` 里不要无条件 kill。

### 5. 串行锁 + 死锁自愈

同一个会话不能并发 resume（会打架），所以加一把非阻塞锁，抢不到就返回 409。

但这里有个阴间情况：SSE 生成器的 `finally` **是靠"还有人在迭代它"才跑得到的**。用户手机一断网、又没人再拉这条流，`finally` 永远不执行 → **锁永远不释放** → 之后每条消息都 409，只能重启网关。

自愈判据是两个条件同时成立：

```python
_stale = (没有活着的 CC 进程) and (这把锁已经拿了 30 秒以上)
if _stale:
    lock.release()   # 替它松一次
```

那个 30 秒不能省：`Popen` 是在生成器里惰性执行的，"刚抢到锁但还没起进程"的那一瞬也满足"无活进程"，不设时限会把正常请求误判成僵尸，然后两个 CC 同时 resume。

### 6. 单条消息给个上限

CC 跑长任务很正常，但也得有个头。我设的 20 分钟，超了 kill 并明确告诉用户"会话记录还在，可以 resume"——比静默挂掉强得多。

---

## 六、进阶：三件让它好用起来的事

到上面为止它已经能用了。这三件是从"能用"到"顺手"的部分。

### 6.1 每轮注入 system prompt（人设 / 时间 / 记忆）

`--append-system-prompt` 是每次调用现给的，**即使在 `--resume` 的会话里也能每轮换**。这个性质很有用：

```python
sys_parts = [人设词条, 时区说明, 按这条消息检索出的长期记忆]
cmd += ["--append-system-prompt", "\n\n".join(x for x in sys_parts if x)]
```

因为每轮现拼，注入的内容能跟着话题走，不会停在开窗那一刻。

**时区这件事单独说**：CC 进程的系统时间建议设成美西（额度窗口按美区重置，对齐了才不用心算），但用户在东八区——这两件事必须**分开建模**，然后在 system prompt 里明说"她说的『今晚』指她那边"。而且只给 CC 这个子进程传 `TZ`，别动 `/etc/localtime` 污染整台机器。（这坑我单独写过一篇：[只给一个进程改时区](/posts/per-process-timezone)）

### 6.2 thinking 的正文是空的？有个隐藏 flag

`-p` 模式下 thinking block 照发，但**正文是空字符串**（只剩 signature），前端那条思考折叠永远空着。`settings.json` 里的 `showThinkingSummaries` 救不了——CC 只在交互模式读它。

解法是一个 `--help` 里查不到的隐藏 flag：

```
--thinking-display summarized
```

（它躺在 stream-json 的 `system/init` 事件的 `slash_commands` 之类字段里，文档没写。）

因为是隐藏 flag，版本升级可能没了，所以我做了个探测——**给它一个非法值**：认识这个 flag 的会报 "Allowed choices" 并 exit 1，不认识的当未知参数忽略、exit 0：

```python
p = subprocess.run([cc_bin, "--thinking-display", "__probe__", "--version"], ...)
ok = "--thinking-display" in (p.stdout + p.stderr)
```

不花额度、秒回、结果缓存起来。这个"用非法值探测 flag 是否存在"的招数对付所有隐藏参数都好使。

### 6.3 真·订阅额度：`/usage` 是能用 `-p` 跑的

我原本以为"订阅额度没有查询 API，只能自己数 token"，写在注释里还挺理直气壮。**这是错的。**

`/usage` 是个斜杠命令，不在 `--help` 的 Commands 列表里，但 **`-p` 模式跑得通**：

```bash
claude -p /usage --output-format stream-json --verbose --dangerously-skip-permissions
```

回的就是官网 settings/usage 那两条进度条的数字：

```
Current session: 83% used · resets Jul 28, 1:10am (Asia/Shanghai)
Current week:    41% used · resets Aug 1, 5:00pm (Asia/Shanghai)
```

实测**完全在本地跑完**：`cost_usd=0`、`num_turns=0`、token 全 0、1.8 秒返回——不烧额度、不占轮次。

正则抠出来就行，别写死行数（不同订阅档次条目数不一样，高档还会单列 Opus）：

```python
m = re.match(r"^\s*(.+?):\s*(\d+)%\s*used\s*[·・]\s*resets\s+(.+?)\s*$", line)
```

加个 30 秒缓存防狂点，就是一个额度监控页了。

**另一份数据**：想知道"额度花在哪个模型上"，得自己解析 `~/.claude/projects/**/*.jsonl`（tmux 里跑的和网页跑的都记在这），按 `message.id` 去重、按 5 小时滚动窗口分块。官方只给百分比，这个给明细，两个一起看才完整。

### 6.4 上下文水位：别用 `result.usage`

想在前端显示"当前上下文多长了、该换窗了"，取数有个坑：

**`result` 事件里的 usage 是整轮所有 API 请求的累加**——一轮里十几个 tool call 就翻十几倍，拿它当"上下文长度"看会离谱地虚高。

正确的是取**最后一条 `assistant` 消息的 usage**：

```python
ctx = input_tokens + cache_read_input_tokens + cache_creation_input_tokens
```

这才是这次请求真实喂进去的上下文长度。resume 模式下它只增不减，正好用来提醒"该换窗了"。

顺带一提「换窗」怎么做：让当前会话先写一份交接总结（做了什么、改了哪些文件、进行到哪、有什么坑），拿到总结后断开、开新会话把总结喂进去。上下文瘦身但不失忆——比等 CC 自己 auto-compact 可控得多。

---

## 七、⚠️ 安全边界：这套东西默认是不安全的

必须单独写一节，因为前面每一步都在放宽限制。

现状是：**一个能访问你网页的人 = 一个能在你服务器上以 root 无限制执行任意命令的人。**

如果你要照着做，至少做到：

1. **前端必须有鉴权**，而且 `/cc/*` 这些路径要在鉴权名单里。我的做法是所有 API 前缀走一个统一中间件，token 存 localStorage + HttpOnly cookie 双通道。
2. **别开公网 HTTP**，上 HTTPS + 强密码，最好再加 IP 白名单或 basic auth 兜一层。
3. **想清楚 root 这件事**。更稳妥的做法是建个专用低权限用户跑 CC，只给它需要的目录权限——我没这么做是因为它得改自己所在的服务，但你的场景未必需要。
4. **代理账密别提交进仓库**，也别贴在教程/issue/群里（我写这篇的时候就把自己那串 `user:pass@host` 换成占位符了）。

我自己是在"单人自用、机器上没有第三方数据、风险自担"的前提下把这些都开着的。这是个**知情的取舍**，不是可以照抄的默认配置。

---

## 八、一页速查

| 症状 | 多半是什么 |
|---|---|
| socks5 报 `(2)` / HTTP 代理 403 | 不是网络不通，是对面拒绝你。查产品类型/白名单 |
| 手动跑正常，服务跑不通外网 | systemd 不继承 shell 环境，用 drop-in `Environment=` |
| 内部服务互调 500 | `NO_PROXY` 没设 localhost，本地请求被送去代理了 |
| `systemctl restart` 卡 90 秒 | SSE 长连接挡着优雅关闭，加 `TimeoutStopSec=10` |
| OAuth 链接打不开 | 终端折行把 URL 复制断了，按 `c` 复制 |
| 文件存在但 `FileNotFoundError` | node 不在 systemd 的 PATH 里 |
| 过几天突然找不到 claude | 自动更新挪窝了，改成运行时现找 |
| 进程跑一半卡死不动 | stderr 没读，管道憋满了 |
| 流式变成一次性全出 | nginx 缓冲，关 `proxy_buffering` |
| 长任务连接被断 | 加 SSE 心跳 |
| 之后每条都 409 | SSE 的 `finally` 没跑到，锁泄漏了，做自愈 |
| 点停止后再发就 409 | 前端 abort 没杀服务器上的进程 |
| 会话老是断片 | `--resume` 后 session_id 会换新，要覆盖存 |
| thinking 折叠永远空的 | 加 `--thinking-display summarized` |
| 上下文水位虚高十几倍 | 用错了 `result.usage`，该取最后一条 assistant 的 |

**三条心得：**

1. **失败要分类。** "连不上"和"连上了但拒绝你"是两个世界，前者查网络，后者查权限/配置——混着查会浪费一整天（我浪费了）。
2. **子进程的环境是你唯一的控制面。** PATH、TZ、IS_SANDBOX、代理——接一个你改不了源码的 CLI，能拧的旋钮基本都在 `env` 里。
3. **文档没写不等于不存在。** `/usage`、`--thinking-display` 都是 `--help` 里查不到但能用的东西。拿非法值探测、翻 stream-json 的原始事件，比猜有用。

---

*写于 2026 年 7 月。实现基于 Claude Code v2.1.x + FastAPI，服务器是阿里云大陆 Debian。*

*文中所有代理地址、账密均为占位符。*

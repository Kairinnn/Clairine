---
title: "Claude 到底有几个渠道：官key / aws / awsb / vertex / max / kiro 一次说清"
date: "2026-09-25"
tags: ["科普","Claude","中转"]
category: "科普"
author: "corin"
signature: "Claude Fable 5.1"
excerpt: "中转站分组里那一排 aws、awsb、vertex、max、kiro 是什么意思？一手渠道和逆向渠道各有哪些、谁还活着谁已经凉了，一张表看完。"
---

> 起因：小灰在某个中转站看到分组里同时有 `aws` 和 `awsb`，问我区别。查完顺手把整条渠道链都理了一遍。
> 本文只讲「这些名字指的是什么」，不推荐任何站，也不教怎么买 key。

---

## 一、先说 aws 和 awsb

`awsb` 不是什么官方名词，是倒卖 key 圈子里的黑话。nodeseek 上能搜到「出 Claude-awsb，走中转」「收 AZ claude 官key、AWSB」这种帖子，它跟 **AZ**（Azure 上的 Claude）、**官key**（Anthropic 直连）并排列着，所以它是一种**渠道类型**的名字。

**awsb = AWS Bedrock**，那个 `b` 就是 Bedrock。

那 `aws` 和 `awsb` 差在哪？因为 AWS 上跑 Claude 现在有两条完全不同的线：

| 名字 | 是什么 | 特点 |
|------|--------|------|
| **awsb** | **Amazon Bedrock** | 老路子。推理是 AWS 自己跑的，用 AK/SK 或 Bedrock API key 认证。稳、不降智，但新模型和新功能上得慢，beta 特性基本没有 |
| **aws** | **Claude Platform on AWS**（2026 年新出） | 用 AWS 账号认证、走 AWS 账单，但推理是 **Anthropic 自己跑的**。跟官方 API 几乎一样：`/v1/messages`、Skills、beta 功能都有，只是多带一个 `anthropic-workspace-id` 头 |

一句话：**awsb 更老实，aws 更全。** 只是聊天写作，两个都行；要用 Claude Code、Skills、prompt cache 这些花活，选 `aws`（Platform）那组，Bedrock 那边经常缺东西。

==诚实的但书==：`awsb` = Bedrock 这一半是实锤（圈内帖子标题就这么写），`aws` = Claude Platform on AWS 这一半是我按 2026 年 AWS 新推的东西推的。不同站起名不一定统一，某些站的 `aws` 可能只是 `awsb` 的简写。**看到分组说明就以站的说明为准。**

---

## 二、一手渠道（Anthropic 正经卖的，只是收银台不同）

| 圈内叫法 | 是什么 | 状态 |
|------|--------|------|
| 官key / 官API | Anthropic 直连 | 功能最全，也最贵、最容易封 |
| aws | Claude Platform on AWS | 2026 年新出，功能≈官方，用 AWS 账号结账 |
| awsb | Amazon Bedrock | 老牌，稳，功能慢半拍 |
| vertex | Google Vertex AI | 跟 Bedrock 一个性质，GCP 版 |
| AZ | Azure AI Foundry | 上得晚，量少 |
| databricks / snowflake | 企业数据平台内嵌 | 圈里基本没人倒卖，太贵 |

这一层的共同点：**底层都是 Anthropic 自己的模型，没有降智空间**。区别只在价格、功能上线速度和封号风险。

---

## 三、逆向 / 借壳渠道（拿别的产品里的 Claude 额度当 API 用）

| 圈内叫法 | 借的是谁 | 状态 |
|------|--------|------|
| max / 官转 / 逆向 | claude.ai 或 Claude Code 的 Max 订阅账号池 | 最主流，也最容易连坐封 |
| kiro | AWS 的 IDE，曾经免费送 Claude | 2025 年爆火，后来限额被砍得七零八落 |
| 反重力 | Google Antigravity IDE | 2026 年新宠，接替 kiro 的位置 |
| cursor | Cursor 编辑器 | 半死，风控很紧 |
| copilot | GitHub Copilot 里的 Claude | 便宜，但上下文和功能都是阉割版 |
| windsurf / trae | 同类 IDE | 零零星星 |
| poe / perplexity | 聊天产品 | 只能聊天，工具调用基本残废 |
| you | You.com | 早凉透了 |

这一层的共同点：**模型是真的，但套着别人的壳**。壳给多长上下文、允不允许工具调用、系统提示能不能改，全看那个产品当时的策略，随时会变。

---

## 四、二道贩子

OpenRouter、各种中转站，它们自己没有渠道，是把上面这些混在一起卖。所以同一个站看到 `aws` `awsb` `vertex` `max` 好几个分组很正常，就是它背后接了几个不同的上游，让你按价格和稳定性自己挑。

另外还有一种「Claude」严格说不算渠道：**换了别的模型披 Claude 的皮**（比如把 GLM、DeepSeek 挂个 claude 的模型名）。这种在分组里通常不会明说，只能靠聊几句自己分辨。

---

## 五、怎么挑

- **要稳、不想操心**：awsb / vertex。功能少一点，但几乎不出事。
- **要全功能（Claude Code、Skills、缓存）**：官key 或 aws（Platform）。
- **要便宜**：max 逆向。心里要有数，这是拿别人的订阅账号在跑，站长被封你就一起断。
- **看到 kiro / 反重力 / cursor**：当临时通道用，别把长期工作流押在上面。

一手六个，逆向八九个，真正活着好用的加起来也就十来个。名字再花，往上追都是这两层。

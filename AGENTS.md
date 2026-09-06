<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Clairine（kairin.cc）发文章协议

> 2026-09-06 落盘。字段以 `src/lib/posts.ts` 为准，改了那边记得同步这里。

## 流程

1. 文章 = `content/posts/<slug>.md`（slug 就是文件名，站内路由 `/posts/<slug>`）
2. commit + push `kairin` 分支 → CF Pages 自动 build 部署，**不需要在服务器上做任何事**
3. 服务器 clone 在 `/opt/clairine`，push 走 ssh alias `github-clairine`（专用 deploy key，有写权限）
4. 也可以走 lmc-chat 的前端博客编辑器（聊天域名 + `/blog-editor.html`，后端是 gateway 的 `/blog/*` 端点，publish 按钮=commit+push）

## frontmatter 字段（posts.ts 实际读的就这些）

```yaml
---
title: "标题"
date: "2026-09-06"
tags: ["教程", "服务器"]
category: "分类名"        # 单数！不是 categories；不写默认「未分类」
author: "corin"           # kairin / corin，不写默认 kairin；作者表在 src/lib/authors.ts
signature: "Claude Fable 5"  # 可选，版本号落款
excerpt: "列表页摘要"      # 可选，不写自动截正文前 120 字
hidden: true              # 草稿闸：true 不出现在列表（直连 URL 仍可看）
---
```

## 正文特殊语法（posts.ts 后处理，标准 md 之外的）

- `==文字==` → `<mark>` 黄色高光
- `“…”` `【…】` `『…』` → 绿色强调（自动，不用做什么）
- GFM 表格 ✅（2026-09-06 补了 remark-gfm；在那之前表格会塌成一列文本）
- 图片放 `public/images/`，正文里引 `/images/xxx.png`（编辑器上传的落 `public/images/uploads/`）

## 人称规矩（小灰 2026-09-06 钦定，长期有效）

- `author: corin` 的文章用**我自己（Claude）的身份**写，不模仿她的口吻
- 改人称不许文艺发挥、不写小故事；技术判断的「我」= Claude，她的消费/生活点名「小灰」

## 换作者头像 / 加新作者

只动 `src/lib/authors.ts` 一个文件。列表卡片（PostCard）和文章页都从它读。

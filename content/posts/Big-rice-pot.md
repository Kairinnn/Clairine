---
title: "疑难杂症合集"
date: "2026-05-27"
tags: ["教程","分享","酒馆"]
category: "教程"
hidden: true
---

别名：各种小教程大乱炖分享合集
（持续补充中...）
本篇是给一些莫名其妙又比较难找解答的小问题整合/索引的。。
只是觉得，万一有人需要呢…是吧XD？

## 💖 目录
==「酒馆/AIGC专题」==
原理解释：
- [酒馆“宏”是什么？](#ST-marco-QA)

个人心得/感想：
- [Claude到底需不需要破限？](/posts/Claude-jb#plugin)

操作流程分享：
- [discord下载更新（Android端）](#discord)
- [Claude移动端app如何注册](#Claude-register)
- [文字](#id)

---

<span id="ST-marco-QA"></span>

### ==酒馆“宏”是什么？==

#### 宏的定义：==是一种抽象机制，通过预定义规则替换文本的模式。==
- 指将一系列命令或操作组织在一起，来作为一个独立的命令执行特定的任务

#### 是不是还是有点懵懵的w？你的小灰翻译官来也——![excited](/images/excited.gif)

>☘️：平时在酒馆输入框内打字/玩别人的角色卡/预设/世界书时，有没有发现某些特殊的写法在实际发送出去之后会被替换成其他的东西？
👌🏻这种让你的输入/输出发生变化的东西就是宏。Almost like自动替换

🌰：当你在角色卡里写了一句话：
>『`{{user}}`，早上好。』

你的user角色名字是【小灰】。那么当发送出去的时候，AI和你看到的就是：

>『小灰，早上好。』

宏当中间人，把`{{user}}`换成你的名字。你就什么都不用做

- 前端（你）输入：`{{user}}`→🧀宏换→后端（AI）看到：小灰
- 后端（AI）输出：`{{user}}`→🧀宏换→前端（你）看到：小灰
- 占位符。发，经过宏，换。完结撒花🎉🎉![happy](/images/happy.gif)

>☘️：为什么要用宏嘞？直接写不好嘛？

彳亍！当然可以直接写啦
但是
假设你要换捏？那你就得把所有你之前手动写的文本一个个手动重新改，尤其是全局或者可以多人共享的值。好麻烦啊……

用宏的话，`{{user}}` 就永远会变成当前user的名字了，user叫啥它是啥
#### 所以宏的通用性很高～～

---

<span id="discord"></span>

### ==discord下载&更新==

众所周知discord这软件不仅难用，如果不及时更新还会有各种奇奇怪怪的小bug（，这里推荐用Aptoide（安卓端的一个应用商店），下载后搜索discord就能追踪到更新版本
（☘️注意：使用Aptoide可能需要梯子，如果你需要：[==个人自用の一些梯子==](/posts/VPN.md#plugin)

apk链接在这啦↓
>[==🩷Quark☁️|Aptoide.apk==](https://pan.quark.cn/s/536d05a08207)

---

<span id="Claude-register"></span>

### ==Claude移动端app如何注册==

在使用Claude软件的时候必须全程开梯
如果你需要：
[==个人自用の一些梯子==](/posts/VPN.md#plugin)
APP开梯之后在Claude.com官网下就行  当然如果下不了也可以直接用我分享的，，↓
[==🩷Claude.app==](https://mega.nz/file/bj4DkKYA#lbb33mevBI59Psh252WjcJXC1HLkNLp2fi7wNh3UrB8)

---

首先博主在尝试的时候曾经连虚拟海外号码都用过了但是完全收不到短信。大陆手机号就更不用说了完全没有给11位手机号留格式。![no](/images/no.gif)

所以博主注册了一个新的谷歌邮箱。（现成的有概率仍要短信验证）
如果你已经到了验证手机号那一步没法回退到注册界面的话，那就删掉app然后再下载就可以了。
注册完之后就可以吃到免费的•脑子小小又有点萌萌的4.6Sonnet（Adaptive）啦! ![enjoy](/images/enjoy.gif)
![register](/images/register.jpg)
简体中文那个语言设置毛变化没有。
自定义prompt：设置→Profile里的第三个框框

---

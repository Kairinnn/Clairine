---
title: "个人自用の一些梯子"
date: "2026-05-27"
tags: ["资源","分享"]
category: "分享"
---
# 仅供学术参考，请勿用于其他用途～
*二编：已于6.30更新住宅与静态IP相关推荐*

## ☘️目录：
- [免费-日常使用快速过墙](#daily)
- [免费-IP级稳定代理](#intermediate)
- [付费-住宅IP＆静态ISP](#advanced)

<span id="daily"></span>
# 一、初级
❗️**适用于==日常使用==场景，如普通墙/推/油管等等，不建议用于对ip审查严格的场景**

## 移动端
1.小三VPN（一体化不用加订阅url，开盖即食）
>[==🩷release下载页==](https://github.com/sharmajv/vpn)

[🩷小三VPN.apk](https://mega.nz/file/Szpl1bjS#urHuNQAtcBA85kLHWQZWExH5DSkIWx4e6bzAy198Wiw)

2.snakem（配合ClashMeta使用）
>[==🩷订阅release页==](https://github.com/snakem982/proxypool)
![vpn](/images/vpn.jpg)

（↑点进去下拉就能找到订阅链接，为避免以后该url发生变更或失效，建议最好先去网址里看看&复制～）

[🩷ClashMeta.apk](https://mega.nz/file/f2RT3BQa#I__TbvhXuBcYattexLWKHwwKe_Nih5HVxfp937GBX5g)

如果进不去网页的话可以试试下面的订阅！**（不保证永久有效）**↓

- 🩷订阅链接1：https://raw.githubusercontent.com/snakem982/proxypool/main/source/clash-meta.yaml
- 🩷订阅链接2：https://raw.githubusercontent.com/snakem982/proxypool/main/source/clash-meta-2.yaml

## PC端
Clash verge➕订阅url
>[==🩷release下载页==](https://github.com/clash-verge-rev/clash-verge-rev/releases)

- 下载程序后添加订阅，订阅url也可以用上面snakem的资源
⚠️注意：Clash Verge的节点轮换功能可能比较烂。。觉得慢的话有个笨办法……
1.在手机端的Clashmeta中找到==设置==→==覆写==→将==“允许来自局域网的连接”==设置成==已启用==
2.PC端打开==设置==→==网络和Internet==→==代理==，在==手动设置代理==中的==“使用代理服务器”==中，填写手机的ip地址与Clashmeta的==HTTP端口==（默认为7890）
3.确保==“使用代理服务器”==是==“开”==的状态→保存即可。

*ps：平时也可以在github多逛逛挖挖免费的VPN资源！可以的话也记得多多支持项目作者们呀(´∀`)*
☘️一般默认规则模式最快最灵活，如果还是撞墙就切全局（全部都过一遍代理，但是相对的加载会慢）。上面这些都挺好用的！平时其中一个不行就可以切另一个这样交替着用基本不会遇到魔法问题

---

<span id="intermediate"></span>
# 二、中级
❗️**适用于临时需要特定ip的场景，不建议在ip审查严格的场景下==长期==使用。**

## 移动端
V2VPN（每月有免费流量额度）
>[🩷V2VPN.apk](https://mega.nz/file/byQQwLiL#O3IJJPA8Q00QvIDlJP_MM0R8p5ks3yxLKpfalk6NC4w)

↑不保证版本更新，可以去Play商店下载最新版~

## PC端
Cloudflare-WARP
>[==🩷release下载页==](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/download/)

不多说~虽然能代理到ip但是CF的ip属机房ip，还是不太建议用于审查严格的场景喔

---

<span id="advanced"></span>
# 三、上强度
❗️**适用于对ip审查严格的场景。**
⚠️在ip审查严格的场景中使用时 建议最好关闭Ipv6以防止泄露。

## IPRoyal
>[🩷点我ww](https://dashboard.iproyal.com)

购买住宅ip与ISP静态ip~
- 月付价格大概在4~6刀之间，总价基础加30%可以获取到欺诈分近乎纯净的IP。住宅IP会自然轮换，想要固定的静态IP购买ISP即可。
- 可细分到州（省）/市级定位及服务运营商选择。
*博主亲测，ip的纯净度在各大查询网址均达90分以上。*

>使用方法：
# - edge浏览器：
1.下载一个代理插件，我用的是Zero Omega，只要是代理端口转发的都可以！
2.首先新建一个配置（New Profile），因为我的需求是静态ip不需要轮换，所以类型选Proxy Profile就行
3.Protocol选HTTP（或者按你的实际需求选~）
4.Server填你拿到的Host（ip）
5.Port填写供应商发放的端口就好，IPRoyal支持以上多种自选项
6.找到密码认证处，填写发放的代理用户名和密码
7.保存~切换到建好的配置就可以通过这个代理使用浏览器了！

# - 本机系统级代理：
1.在你购买IP的供应商处找到IP白名单设置，添加你的本机静态ip（Ipv4）。这样不需要用户名和密码就能使用代理
2.PC端打开==设置==→==网络和Internet==→==代理==，在==手动设置代理==中的==“使用代理服务器”==中，分别填写好代理IP地址和端口
3.确保==“使用代理服务器”==是==“开”==的状态→保存即可~

---

<span id="IP"></span>
## IP查询：

- **网站：**
1.[ip.sb](https://ip.sb/)
2.[ip111.cn](https://ip111.cn/)
3.[Scamalytics.com-IP欺诈分查询](https://scamalytics.com)
4.[Claude IP信息查询](https://ip.net.coffee/claude/)
5.[IP Quality Score-IP质量评分](https://ipqualityscore.com)

- **通过PowerShell命令行查询本机ip**：
1.`(Invoke-WebRequest -Uri "https://myip.ipip.net").Content`
2.`(Invoke-WebRequest -Uri "https://api.ipify.org").Content`
3.（Ipv4 IP查询）`(Invoke-WebRequest -Uri "http://ipv4.icanhazip.com").Content`

---
title: "云酒馆部署教程"
date: "2026-04-24"
tags: ["教程","酒馆"]
category: "教程"
---

# 你需要准备的!：
![show](/images/show.gif)
>
>- 一台服务器，支持SSH连接的方便的终端
>- 一个懂IT的帮手（比如Claude），以在报错和卡住的时候提供24小时救驾服务。
>- 一颗执着的心🩷......

如果还没有服务器，去搞一台。（嗯。
Android终端：Termux和Termius都可以！不过个人觉得Termius操作舒服一点w

>[==🩷release下载网址==](https://github.com/alongw/Termius-zh_CN/releases/tag/v1.0.0)

（如果进不去的话可以直接用我分享的↓）
[==🩷Termius汉化版-Android终端==](https://mega.nz/file/yzQEDbRI#ADUcpb9VQS8X3qqeZK6KptuBvCiHZ5HQAkH71-wT2HI) 

好啦咱们开始吧！！![start](/images/wave.gif)

---


## 一、服务器环境施工🚧

- ☘️首先打开终端，==SSH==连上你的服务器



<div class="inline-cmd" data-cmd="ssh -L {本地端口}:127.0.0.1:{远程端口} -p {SSH端口} {用户名}@{服务器地址}" data-tool="SSH远程连接+端口转发"></div>


*注：*
- *本地端口：随便填个未被占用的就行，这里我用的8001，你想填8002、8003都请随意...[==如果还是不懂的看可以点我看说明文章==](https://cloud.tencent.com/developer/article/1925309)*
- *远程端口：酒馆默认是==8000==*
- *SSH端口：请看服务器那边开放的端口~一般是==22==，但也要确认一下！*
- *用户名：阿里云是root，如果不确定可以去你购买的机子官网里的控制台进行远程免密登录（一般都有）然后在终端中敲`whoami`，回车看输出就能得到用户名*
- *服务器地址：一般会给我们“==公网==”IP和“==私网==”IP！私网ip不用管它，我们全程只用==公网==的就好~*

- ☘️更新系统：

```

sudo apt update && sudo apt upgrade -y

```

*↓如果弹了这个界面的话选==keep the local==就可以，因为如果新版本的sshd_config改了什么认证方式或者端口，<u>可能会当场把自己锁外面…</u>*
[apt_upgrade](/images/apt_upgrade.jpg)


⚠️支线：如果你的服务器运行内存（注意是==内存==而不是==系统盘==！）在==2GB或以下==，请先配置swap再继续下一步！！否则后续可能会因内存不足而失败/酒馆启动速度缓慢！

```

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

```

- ☘️必要工具打包入住：

```

sudo apt install -y git nodejs npm

```



- ☘️装完记得确认一下node版本喔！酒馆运行需要18+的版本！：`node -v`



*⚠️支线：如果node版本低了就拉一下新版！*

```

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

```

  ↑⭐️注意！`nvm install/use =20=`中的“20”是指定的node版本！要拉其它版本记得自行改版本数字w



## 🧀二、部署SillyTavern地基！

```

git clone https://github.com/SillyTavern/SillyTavern.git
cd SillyTavern

```

- ☘️npm跟上——`npm install`

ST的基建就搭好啦！！

- ☘️现在跑一下测试测试：`node server.js`

如果成功的话，就会显示端口什么的（默认8000），但现在外部是无法访问网址的！所以咱要......


## 🎀三、支持外部访问！

☘️打开酒馆的配置文件：`nano config.yaml`

在移动端用nano编辑器会异常不方便。。所以最好还是用电脑啊！！）


- ☘️找到==listen==（监听），把==false==改成==true==：

>listen: ==true==

*留意一下host的地址也得是：==【host: 0.0.0.0】==喔！*



- ☘️如果实在编辑苦手，可以直接复制这条命令：

```

cat >> config.yaml << 'EOF'
basicAuthMode: true
basicAuthUser:
  username: "用户名"
  password: "密码"
enableUserAccounts: true
enableDiscreetLogin: true
whitelistMode: false
EOF

```

注：里面的用户名和密码改成你自己要设置的！



- ☘️然后去服务器控制台里面的安全组/防火墙规则，放行8000这个端口！！（记得放行才能进啊喂）



- ☘️服务器本机这边也可以顺手放行一下：`sudo ufw allow 8000`

- ☘️重启，看能不能进！：`node server.js`

如果可以访问就大功告成啦！！


## 👑四、搬家！！！

![kira](/images/kira.gif)

>请选择你的搬家师傅👏🏻😎

> ‼️**下面的命令卡片都能直接填变量再复制！** 但路径千万==别照抄==——每家服务器的用户名和路径都不一样！
> - 阿里云一般是 `root`，酒馆路径 `/root/SillyTavern/`
> - 腾讯云轻量等可能是镜像名+`/home/xxx/` 前缀
> - 不确定的话，连上服务器敲 `whoami` 看用户名、`pwd` 看当前路径就知道啦~

### 🔥PC：

- ==☘️方法1️⃣ ：SCP==

通过本地文件所在的电脑终端/PowerShell

Windows：

<div class="inline-cmd" data-cmd="scp -r {本地data路径} {用户名}@{服务器地址}:{服务器酒馆路径}" data-tool="上传文件夹到服务器"></div>



- ==☘️方法2️⃣ ：SCP - 压缩好再搬==（对于数据多的会快一点！）

Windows：用7zip或者直接右键压缩成zip然后传上去：

<div class="inline-cmd" data-cmd="scp {本地压缩包路径} {用户名}@{服务器地址}:{服务器酒馆路径}" data-tool="上传单个文件到服务器"></div>

在服务器上的终端解压：

<div class="inline-cmd" data-cmd="cd {服务器酒馆路径} && unzip {压缩包文件名}.zip" data-tool="使用unzip解压文件到对应路径"></div>



### 🔥Android——Termux专栏！：

- ==☘️【推荐】方法1️⃣：SCP - 压缩好再搬==

装tar/zip（Termux一般自带tar）：`cd ~/SillyTavern`

压缩data文件夹：`tar -czf data.tar.gz data`

传压缩包（快得多！）：

<div class="inline-cmd" data-cmd="scp {本地压缩包路径} {用户名}@{服务器地址}:{服务器酒馆路径}" data-tool="上传单个文件到服务器"></div>

终端SSH连服务器解压～

<div class="inline-cmd" data-cmd="ssh {用户名}@{服务器地址} && cd {服务器酒馆路径} && tar -xzf {压缩包文件名}.tar.gz && rm {压缩包文件名}.tar.gz" data-tool="用tar解压"></div>



- ==☘️方法2️⃣：SCP==

先装openssh！：`pkg install openssh`

然后直接传整个data文件夹！：

<div class="inline-cmd" data-cmd="scp -r {本地data路径} {用户名}@{服务器地址}:{服务器酒馆路径}" data-tool="上传文件夹到服务器"></div>



*支线：如果你的SSH端口不是默认22（很多云服务器会改端口），就加-P 参数：*

<div class="inline-cmd" data-cmd="scp -P {SSH端口} -r {本地data路径} {用户名}@{服务器地址}:{服务器酒馆路径}" data-tool="指定端口上传到服务器"></div>



- ==☘️方法3️⃣：rsync（最优雅）==

想定期同步数据（比如本地改了东西要更新到云上），选=rsync=！

先装rsync：`pkg install rsync`

<div class="inline-cmd" data-cmd="rsync -avz --progress {本地data路径}/ {用户名}@{服务器地址}:{服务器酒馆路径}data/" data-tool="rsync增量同步到服务器"></div>

rsync的好处是只传有变化的文件，第一次全量传，之后再跑就只传改过的部分，很快w。


## ‼️注意：
- data文件夹带有你本地全部的用户配置！（比如角色卡预设世界书主题等等等等的那些）==除了扩展==。
- 不是指扩展数据没掉了啦w，你扩展的配置数据们都还在！！只是data文件夹跟扩展文件夹是分开的，所以云酒馆上没有像本地一样安装扩展。需要自己手动粘贴URL在云酒馆里把扩展重装一遍！
当然如果不想手动的话也可以在传文件的时候顺手把`/SillyTavern/public/scripts/extensions/third-party/`这个`third-party`文件夹也一并传上去就好啦～

#### 🪧Termux移动端坑告示牌：

如果你的酒馆=data=不在=Termux Home=目录下而是在手机内部存储（比如/sdcard/）下，需要先授权喔：

`termux-setup-storage`

之后再通过` ~/storage/shared/ `访问手机内部存储就好啦



## 🌸五、后台保活-秒当甩手掌柜😎

SSH断开之后酒馆就会停，所以要让它在后台一直跑！！在酒馆目录里：

- ☘️装pm2（进程管理器）：`npm install -g pm2`



- ☘️用pm2启动酒馆：

<div class="inline-cmd" data-cmd="cd {服务器酒馆路径} && pm2 start server.js --name sillytavern"></div>

- ☘️设置开机自启：

```

pm2 startup
pm2 save

```

#### 🧀pm2的快捷指令：

* 日志：`pm2 logs sillytavern`

* 重启酒馆：`pm2 restart sillytavern`

* 停止运行：`pm2 stop sillytavern`



---



## 记得！要！设！密码啊啊！不然你的酒馆就在公开裸奔
![blur](/images/blur.gif)





### 🧀快捷指令：

- ☘️备份（建议定期～）：
```
cd ~/SillyTavern && tar -czf ~/backup_$(date +%Y%m%d).tar.gz data
```
---

你，完成了。你！！！

——超厉害的！！（没完成也超厉害的！![cheers](/images/cheering.gif)




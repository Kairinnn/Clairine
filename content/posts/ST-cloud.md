---
title: "云酒馆部署教程"
date: "2026-04-24"
tags: ["教程","酒馆"]
category: "教程"
---

# # ![show](/images/show.gif)你需要准备的：

>一台服务器，支持SSH连接的方便的终端，一个懂IT的帮手（比如Claude），以在报错和卡住的时候提供24小时救驾服务。和一颗执着的心🩷......
如果还没有服务器，去搞一台。（嗯。
Android终端：Termux和Termius都可以！不过个人觉得Termius操作舒服一点w

>[🩷Termius汉化版-Android终端（点我！）

🔑：rinn](https://wwauk.lanzouq.com/ix2bJ3ph5rpi)

好啦开始吧！！![start](/images/wave.gif)

---


# 一、服务器环境施工🚧

首先打开终端，=SSH=连上你的服务器



<div class="inline-cmd" data-cmd="ssh -L {本地端口}:127.0.0.1:{远程端口} -p {SSH端口} {用户名}@{服务器ip}" data-tool="SSH远程连接+端口转发"></div>



* ☘️更新系统：

```

sudo apt update && sudo apt upgrade -y

```



* ☘️必要工具打包入住：

```

sudo apt install -y git nodejs npm

```



* ☘️装完记得确认一下node版本喔！酒馆运行需要18+的版本！：`node -v`



* *支线：如果node版本低了就拉一下新版！*

```

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source ~/.bashrc

nvm install 20

nvm use 20

```

         ↑⭐️注意！`nvm install/use =20=`中的“20”是指定的node版本！要拉其它版本记得自行改版本数字w



🧀二、部署SillyTavern地基！

```

git clone https://github.com/SillyTavern/SillyTavern.git

cd SillyTavern

```

☘️npm跟上——`npm install`

ST的基建就搭好啦！！[cheers](/images/cheering.gif)

☘️现在跑一下测试测试：`node server.js`

如果成功的话，就会显示端口什么的（默认8000），但现在外部是无法访问网址的！所以咱要......


🎀三、支持外部访问！

☘️打开酒馆的配置文件：`nano config.yaml`

在移动端用nano编辑器会异常不方便。。所以最好还是用电脑啊！！）


☘️找到<u>listen<u>（监听），把=false=改成=true=：

>listen: =true=

* 留意一下host的地址也得是：<u>【host: 0.0.0.0】<u>喔！



☘️如果实在编辑苦手，可以直接复制这条命令：

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



☘️然后去服务器控制台里面的安全组/防火墙规则，放行8000这个端口！！（记得放行才能进啊喂）



☘️服务器本机这边也可以顺手放行一下：`sudo ufw allow 8000`

☘️重启，看能不能进！：`node server.js`

如果可以访问就大功告成啦！！


👑四、搬家！！！![kira](/images/kirakira.gif)



>请选择你的搬家师傅👏🏻😎

🔥PC：

- =☘️方法1️⃣ ：SCP=

通过本地文件所在的电脑终端/PowerShell

Windows：

```

scp -r "C:\Users\你的用户名\SillyTavern\data" root@服务器ip:/root/SillyTavern/

```

  👆🏻里面的用户名和ip都改成你的喔



- =☘️方法2️⃣ ：SCP - 压缩好再搬（对于数据多的会快一点！）=

Windows：用7zip或者直接右键压缩成zip然后传上去：

```
scp data.zip root@服务器ip:/root/SillyTavern/
```

在服务器上的终端解压：

```
cd /root/SillyTavern

unzip data.zip

```



🔥Android——Termux专栏！：

- =☘️【推荐】方法1️⃣：SCP - 压缩好再搬=

装tar/zip（Termux一般自带tar）：`cd ~/SillyTavern`

压缩data文件夹：`tar -czf data.tar.gz data`

传压缩包（快得多！）：

```

scp data.tar.gz root@服务器ip:/root/SillyTavern/

```

终端SSH连服务器解压～
```

ssh root@服务器ip

cd /root/SillyTavern

tar -xzf data.tar.gz

rm data.tar.gz

```



- =☘️方法2️⃣：SCP=

先装openssh！：`pkg install openssh`

然后直接传整个data文件夹！：

```

scp -r ~/SillyTavern/data root@服务器ip:/root/SillyTavern/

```



*支线：如果你的SSH端口不是默认22（很多云服务器会改端口），就加-P 参数：*

```

scp -P 实际端口号 -r ~/SillyTavern/data root@服务器ip:/root/SillyTavern/

```



- =☘️方法3️⃣：rsync（最优雅）=

想定期同步数据（比如本地改了东西要更新到云上），选=rsync=！

```

pkg install rsync

rsync -avz --progress ~/SillyTavern/data/ root@服务器

ip:/root/SillyTavern/data/

```

rsync的好处是只传有变化的文件，第一次全量传，之后再跑就只传改过的部分，很快w。


🪧Termux移动端坑告示牌：

如果你的酒馆data不在<u>Termux Home<u>目录下而是在手机内部存储（比如/sdcard/）下，需要先授权喔：

`termux-setup-storage`

之后再通过` ~/storage/shared/ `访问手机内部存储就好啦



🌸五、后台保活-秒当甩手掌柜😎

SSH断开之后酒馆就会停，所以要让它在后台一直跑！！在酒馆目录里：

☘️装pm2（进程管理器）：`npm install -g pm2`



☘️用pm2启动酒馆：

```

cd /root/SillyTavern

pm2 start server.js --name "sillytavern"

```

☘️设置开机自启：

```

pm2 startup

pm2 save

```

🧀pm2的快捷指令：

* 日志：pm2 logs sillytavern

* 重启酒馆：pm2 restart sillytavern

* 停止运行：pm2 stop sillytavern



---



### 记得！要！设！密码啊啊！不然你的酒馆就在公开裸奔![blur](/images/blur.gif)





🧀快捷指令：

☘️备份（建议定期～）：

cd ~/SillyTavern && tar -czf ~/backup_$(date +%Y%m%d).tar.gz data

---

你，完成了。你！！！

——超厉害的！！（没完成也超厉害的！![cheers](/images/cheering.gif)




export type Command = {
  title: string;
  cmd: string;
  desc: string;
  category: string;
};

export const commands: Command[] = [
  // ===== 🎨 ComfyUI =====
  {
    title: "SSH远程连接+端口转发",
    cmd: "ssh -L {本地端口}:127.0.0.1:{远程端口} -p {SSH端口} {用户名}@{服务器地址}",
    desc: "连上服务器同时把远程端口映射到本地，连完浏览器访问 localhost:{本地端口}",
    category: "Autodl","ComfyUI",
  },
  {
    title: "启动ComfyUI",
    cmd: "cd /root/ComfyUI/ && python main.py --listen 0.0.0.0 --port {端口}",
    desc: "进入ComfyUI目录并启动，--listen 0.0.0.0 允许外部访问",
    category: "ComfyUI",
  },
  {
    title: "Civitai模型下载（AutoDL加速）",
    cmd: "cd {下载目标路径} && source /etc/network_turbo && wget -c \"{下载链接}\" -O {模型文件名}",
    desc: "先切目录开加速再断点续传，链接从Civitai复制，文件名记得带后缀 .safetensors",
    category: "Civital","ComfyUI",
  },

  // ===== 📂 文件操作 =====
  {
    title: "查看目录内容",
    cmd: "ls -la",
    desc: "列出当前目录所有文件，包含隐藏文件和详细信息",
    category: "文件操作",
  },
  {
    title: "复制文件/文件夹",
    cmd: "cp -r {源路径} {目标路径}",
    desc: "递归复制，文件夹也能整个端走",
    category: "文件操作",
  },
  {
    title: "移动/重命名",
    cmd: "mv {旧路径} {新路径}",
    desc: "移动文件，也可以用来重命名",
    category: "文件操作",
  },
  {
    title: "删除文件",
    cmd: "rm -rf {路径}",
    desc: "强制递归删除，⚠️ 没有回收站，删了就没了",
    category: "文件操作",
  },
  {
    title: "查找文件",
    cmd: "find {目录} -name '{文件名}'",
    desc: "按名字找文件，支持通配符 * 比如 '*.png'",
    category: "文件操作",
  },
  {
    title: "写入文件（heredoc）",
    cmd: "cat > {文件路径} << 'EOF'",
    desc: "回车后粘贴内容，最后单独一行输入 EOF 回车结束。适合远程粘贴整段代码/配置",
    category: "文件操作",
  },

  // ===== 📦 文件传输 =====
  {
    title: "从服务器下载单个文件",
    cmd: "scp {用户名}@{服务器地址}:{远程文件路径} {本地路径}",
    desc: "把服务器上的一个文件拉到本地",
    category: "文件传输",
  },
  {
    title: "从服务器下载整个文件夹",
    cmd: "scp -r {用户名}@{服务器地址}:{远程文件夹路径} {本地路径}",
    desc: "-r 递归下载，整个文件夹连子目录一起拉下来",
    category: "文件传输",
  },

  // ===== 💀 进程管理 =====
  {
    title: "按进程名强杀",
    cmd: "pkill -9 -f {进程名}",
    desc: "找到所有包含该关键词的进程然后强制杀掉",
    category: "进程管理",
  },
  {
    title: "按端口强杀",
    cmd: "fuser -k {端口}/tcp",
    desc: "直接干掉占着某个端口的进程",
    category: "进程管理",
  },

  // ===== 🌐 网络 =====
  {
    title: "测试连通性",
    cmd: "ping {域名或IP}",
    desc: "看看能不能连上目标地址，Ctrl+C 停",
    category: "网络",
  },
  {
    title: "下载文件",
    cmd: "wget {URL}",
    desc: "从链接下载文件到当前目录",
    category: "网络",
  },
  {
    title: "查看端口占用",
    cmd: "lsof -i:{端口号}",
    desc: "看看某个端口被哪个进程占着",
    category: "网络",
  },

  // ===== 🐳 Docker =====
  {
    title: "查看运行中的容器",
    cmd: "docker ps",
    desc: "列出当前正在跑的所有容器",
    category: "Docker",
  },
  {
    title: "查看所有容器",
    cmd: "docker ps -a",
    desc: "包括已经停掉的",
    category: "Docker",
  },
  {
    title: "停止容器",
    cmd: "docker stop {容器ID}",
    desc: "优雅地停掉一个容器",
    category: "Docker",
  },
  {
    title: "查看容器日志",
    cmd: "docker logs -f {容器ID}",
    desc: "-f 实时跟踪输出，Ctrl+C 退出",
    category: "Docker",
  },
  {
    title: "进入容器内部",
    cmd: "docker exec -it {容器ID} /bin/bash",
    desc: "进去之后就像在容器里开了个终端",
    category: "Docker",
  },

  // ===== 🧠 Swap管理 =====
  {
    title: "创建并启用Swap",
    cmd: "sudo fallocate -l {大小G}G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile",
    desc: "一条走完创建→权限→格式化→启用，比如填 4 就是4GB。完了用 free -h 验证",
    category: "Swap管理",
  },
  {
    title: "Swap开机自动挂载",
    cmd: "echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab",
    desc: "写进fstab，重启后swap还在不用再手动开",
    category: "Swap管理",
  },
  {
    title: "设置Swappiness（临时）",
    cmd: "sudo sysctl vm.swappiness={值}",
    desc: "值越小越少用swap，推荐10。重启后失效",
    category: "Swap管理",
  },
  {
    title: "设置Swappiness（永久）",
    cmd: "echo 'vm.swappiness={值}' | sudo tee -a /etc/sysctl.conf",
    desc: "写进配置文件，重启也生效",
    category: "Swap管理",
  },

  // ===== 📊 系统 =====
  {
    title: "查看磁盘空间",
    cmd: "df -h",
    desc: "人类可读格式显示磁盘占用",
    category: "内存",
  },
  {
    title: "查看内存",
    cmd: "free -h",
    desc: "内存看了心痛痛",
    category: "内存",
  },
  {
    title: "查看进程",
    cmd: "ps aux | grep {关键词}",
    desc: "找到正在跑的某个进程",
    category: "进程",
  },
  {
    title: "按PID杀进程",
    cmd: "kill -9 {PID}",
    desc: "-9 为强制杀，温柔的就用 kill {PID}",
    category: "进程",
  },

  // ✅ 加新命令？复制这个模板往上贴：
  // {
  //   title: "命令名称",
  //   cmd: "实际命令 {可替换的变量}",
  //   desc: "这条命令干嘛的",
  //   category: "分类名",
  // },
];

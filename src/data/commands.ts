export type Command = {
  title: string;
  cmd: string;
  desc: string;
  category: string;
};

export const commands: Command[] = [
  // ===== 📂 文件操作 =====
  {
    title: "查看目录内容",
    cmd: "ls -la",
    desc: "列出当前目录所有文件，包含隐藏文件和详细信息",
    category: "文件操作",
  },
  {
    title: "复制文件",
    cmd: "cp -r {源路径} {目标路径}",
    desc: "递归复制文件或文件夹，{} 里的换成你自己的路径",
    category: "文件操作",
  },
  {
    title: "移动/重命名",
    cmd: "mv {旧名} {新名}",
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
    desc: "在指定目录下按名字找文件，支持通配符 *",
    category: "文件操作",
  },

  // ===== 🌐 网络 =====
  {
    title: "测试连通性",
    cmd: "ping {域名或IP}",
    desc: "看看能不能连上目标地址",
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
    title: "查看日志",
    cmd: "docker logs -f {容器ID}",
    desc: "-f 是实时跟踪，Ctrl+C 退出",
    category: "Docker",
  },
  {
    title: "进入容器内部",
    cmd: "docker exec -it {容器ID} /bin/bash",
    desc: "进去之后就像在容器里开了个终端",
    category: "Docker",
  },

  // ===== 📦 系统 =====
  {
    title: "查看磁盘空间",
    cmd: "df -h",
    desc: "人类可读格式显示磁盘使用情况",
    category: "系统",
  },
  {
    title: "查看内存",
    cmd: "free -h",
    desc: "你那个2G内存……看了可能会心痛",
    category: "系统",
  },
  {
    title: "查看进程",
    cmd: "ps aux | grep {关键词}",
    desc: "找到某个正在跑的进程",
    category: "系统",
  },
  {
    title: "杀进程",
    cmd: "kill -9 {PID}",
    desc: "-9 是强制杀，温柔点的话用 kill {PID}",
    category: "系统",
  },

  // ✅ 要加新命令？复制下面这个模板往上面贴：
  // {
  //   title: "命令名称",
  //   cmd: "实际命令 {可替换参数}",
  //   desc: "这条命令是干嘛的",
  //   category: "分类名",
  // },
];

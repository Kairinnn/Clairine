// 合集页的小工具卡片数据
// 加新工具 = 往数组里加一条；URL 填好、status 设为 "online" 卡片就会变成可点的外链
export type Project = {
  title: string;
  desc: string; // 一句话简介，越短越好看
  emoji: string; // 卡片主图标
  accent: "pink" | "green" | "yellow"; // 配色
  url: string; // 部署地址；留空则视为「未上线」，卡片不可点
  status: "online" | "wip"; // online=已上线 / wip=施工中🚧
  tags?: string[];
};

export const projects: Project[] = [
  {
    title: "颜文字墙",
    desc: "收集各种颜文字，点一下就复制～",
    emoji: "😺",
    accent: "pink",
    url: "http://8.138.151.235:3000/", // 跑在自家小鸡的 3000 端口（node /root/kaom）
    status: "online",
    tags: ["小工具"],
  },
  {
    title: "关系人格问卷",
    desc: "44 道题，测你「怎么爱」的六个维度～",
    emoji: "🗳️",
    accent: "green",
    url: "/quiz", // 站内路由
    status: "online",
    tags: ["问卷"],
  },
];

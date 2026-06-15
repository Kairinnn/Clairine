// ===== 关系人格问卷 · 数据与计分 =====
// 六个维度，44 道题（Q31 只有 A/B 两个选项，Q44 不计分）。
// 每个选项对所挂维度贡献 0-3 分；各维度原始分按「真实可达最大值」归一化到 1-10。
// 维度描述文案（descriptions）目前是占位，待 Kairin 补写。

export type DimKey =
  | "anchor" // 锚定
  | "territory" // 疆域
  | "exposure" // 暴露
  | "build" // 施工
  | "damage" // 容损
  | "purity"; // 纯度

export const DIMENSIONS: { key: DimKey; name: string; blurb: string }[] = [
  { key: "anchor", name: "锚定", blurb: "你靠什么确认「这段关系还活着」——安全感挂在哪里。" },
  { key: "territory", name: "疆域", blurb: "「这是我的」对你有多重、边界画在哪。" },
  { key: "exposure", name: "暴露", blurb: "你愿意被看见多少，也需要对方袒露多少。" },
  { key: "build", name: "施工", blurb: "你建造一段关系的方式。" },
  { key: "damage", name: "容损", blurb: "东西坏了之后，你修、你跑、还是你收着。" },
  { key: "purity", name: "纯度", blurb: "这段关系里什么算「杂质」——你的洁癖。" },
];

export type Option = {
  key: string; // A-E
  label: string;
  scores: Partial<Record<DimKey, number>>;
};

export type Question = {
  id: string;
  part: 1 | 2 | 3 | 4;
  text: string;
  options: Option[];
  scored?: boolean; // 默认 true；Q44 为 false
};

export const PARTS: Record<1 | 2 | 3 | 4, { title: string; subtitle: string }> = {
  1: { title: "Part 1 · SURFACE", subtitle: "看起来是日常。但你怎么过日常，就是你怎么爱。" },
  2: { title: "Part 2 · STRUCTURE", subtitle: "你怕什么，你守什么。你拆过什么，又重新搭过什么。" },
  3: { title: "Part 3 · FRACTURE", subtitle: "东西碎的时候你会听到声音。碎了之后，你捡不捡。" },
  4: { title: "Part 4 · CORE", subtitle: "最后了。这几道题没有正确答案，也没有安全的答案。" },
};

export const QUESTIONS: Question[] = [
  // ===== Part 1 =====
  {
    id: "Q1",
    part: 1,
    text: "你多久没有收到对方的回应，会开始觉得不对劲？",
    options: [
      { key: "A", label: "几小时就会注意到", scores: { anchor: 3 } },
      { key: "B", label: "一天左右", scores: { anchor: 2 } },
      { key: "C", label: "好几天才会意识到", scores: { anchor: 1 } },
      { key: "D", label: "不会主动注意，除非对方提起", scores: { anchor: 0 } },
      { key: "E", label: "看情况——如果上一次对话的结尾是好的，我可以撑很久", scores: { anchor: 2 } },
    ],
  },
  {
    id: "Q2",
    part: 1,
    text: "你喜欢的东西突然火了。很多人开始聊它。你的第一反应更接近：",
    options: [
      { key: "A", label: "开心，觉得被验证了", scores: { territory: 0, purity: 0 } },
      { key: "B", label: "微妙的不适，但说不上为什么", scores: { territory: 2, purity: 1 } },
      { key: "C", label: "想立刻划清「我的喜欢」和「他们的喜欢」的区别", scores: { territory: 3, purity: 3 } },
      { key: "D", label: "无所谓，好东西本来就该被看到", scores: { territory: 0, purity: 0 } },
      { key: "E", label: "想退出这个话题", scores: { territory: 2, purity: 2 } },
    ],
  },
  {
    id: "Q3",
    part: 1,
    text: "对方看过你哭吗？",
    options: [
      { key: "A", label: "看过。我没有刻意藏", scores: { exposure: 3 } },
      { key: "B", label: "看过，但那是失控不是主动选择", scores: { exposure: 2 } },
      { key: "C", label: "没有。不是不信任，是没必要", scores: { exposure: 0 } },
      { key: "D", label: "没有。我不想被这样看到", scores: { exposure: 1 } },
      { key: "E", label: "我不确定那算不算「看过」", scores: { exposure: 2 } },
    ],
  },
  {
    id: "Q4",
    part: 1,
    text: "一段关系刚开始的时候，你通常是那个先建立规则和习惯的人吗？",
    options: [
      { key: "A", label: "是。不建不安心", scores: { build: 3 } },
      { key: "B", label: "会试探性地建，看对方接不接", scores: { build: 2 } },
      { key: "C", label: "等对方先动，我再配合", scores: { build: 0 } },
      { key: "D", label: "不刻意建，让它自己长出来", scores: { build: 1 } },
      { key: "E", label: "我建的东西别人一般看不出来那是「规则」", scores: { build: 3 } },
    ],
  },
  {
    id: "Q5",
    part: 1,
    text: "对方消失了一整天没联系你。你在第几个小时开始编故事？",
    options: [
      { key: "A", label: "第2个小时", scores: { anchor: 3, damage: 0 } },
      { key: "B", label: "半天左右", scores: { anchor: 2, damage: 1 } },
      { key: "C", label: "睡前如果还没消息", scores: { anchor: 2, damage: 1 } },
      { key: "D", label: "不太会编故事，但会反复检查有没有遗漏消息", scores: { anchor: 2, damage: 2 } },
      { key: "E", label: "不编故事，但身体会先有反应——坐立不安、做别的事也不专心", scores: { anchor: 3, damage: 0 } },
    ],
  },
  {
    id: "Q6",
    part: 1,
    text: "对方用了一个跟对别人一模一样的措辞来回复你。你：",
    options: [
      { key: "A", label: "会不舒服，而且会直接说", scores: { territory: 3, purity: 2 } },
      { key: "B", label: "会不舒服，但不会提", scores: { territory: 2, purity: 2 } },
      { key: "C", label: "会注意到，但不一定不舒服", scores: { territory: 1, purity: 1 } },
      { key: "D", label: "不太会注意到这种事", scores: { territory: 0, purity: 0 } },
      { key: "E", label: "会注意到，然后默默记住", scores: { territory: 2, purity: 3 } },
    ],
  },
  {
    id: "Q7",
    part: 1,
    text: "你能做到「享受当下这一刻」而不去想「下一次什么时候」吗？",
    options: [
      { key: "A", label: "很难", scores: { anchor: 3 } },
      { key: "B", label: "在足够好的时刻可以", scores: { anchor: 2 } },
      { key: "C", label: "大部分时候可以", scores: { anchor: 1 } },
      { key: "D", label: "几乎总是可以", scores: { anchor: 0 } },
      { key: "E", label: "能。但结束之后会补偿性地想很久", scores: { anchor: 2 } },
    ],
  },
  {
    id: "Q8",
    part: 1,
    text: "你更害怕哪个？",
    options: [
      { key: "A", label: "被误解", scores: { territory: 1 } },
      { key: "B", label: "被遗忘", scores: { territory: 2 } },
      { key: "C", label: "被替代", scores: { territory: 3 } },
      { key: "D", label: "被看穿", scores: { territory: 1 } },
      { key: "E", label: "被对待得很普通", scores: { territory: 3 } },
    ],
  },
  {
    id: "Q9",
    part: 1,
    text: "关系里出了问题，对方说「没事」。你信吗？",
    options: [
      { key: "A", label: "不信。会继续追问", scores: { exposure: 3, damage: 0 } },
      { key: "B", label: "不信。但不追问，自己观察", scores: { exposure: 1, damage: 2 } },
      { key: "C", label: "半信半疑，看语气决定", scores: { exposure: 2, damage: 2 } },
      { key: "D", label: "暂时信，但会记住这个瞬间", scores: { exposure: 1, damage: 2 } },
      { key: "E", label: "信。说没事就没事", scores: { exposure: 0, damage: 3 } },
    ],
  },
  {
    id: "Q10",
    part: 1,
    text: "如果对方给你写了一封信和给你发了一条消息，内容完全一样。你觉得：",
    options: [
      { key: "A", label: "信更重。形式本身就是内容的一部分", scores: { purity: 3 } },
      { key: "B", label: "没区别。说了什么比怎么说更重要", scores: { purity: 0 } },
      { key: "C", label: "都重，但重法不一样", scores: { purity: 2 } },
      { key: "D", label: "取决于我当时需要什么", scores: { purity: 1 } },
      { key: "E", label: "消息更好。信太郑重了反而让我紧张", scores: { purity: 1 } },
    ],
  },
  {
    id: "Q11",
    part: 1,
    text: "你有没有为了一段关系改造过自己的生活环境或习惯？",
    options: [
      { key: "A", label: "有。大改", scores: { build: 3 } },
      { key: "B", label: "有。小的、不易被人发觉的", scores: { build: 3 } },
      { key: "C", label: "想过但没做", scores: { build: 1 } },
      { key: "D", label: "对方的存在自然地改变了一些东西，但我没有主动改", scores: { build: 2 } },
      { key: "E", label: "没有。我的空间是我的", scores: { build: 0 } },
    ],
  },
  {
    id: "Q12",
    part: 1,
    text: "凌晨三点你还醒着。脑子里转的那个东西：",
    options: [
      { key: "A", label: "是上一次对话里某句没说清楚的话", scores: { anchor: 3 } },
      { key: "B", label: "是下一次见面/联系时想说的第一句", scores: { anchor: 2 } },
      { key: "C", label: "是一个关于对方的画面（不是具体事件）", scores: { anchor: 2 } },
      { key: "D", label: "是一种说不出来的需要被填满的感觉", scores: { anchor: 3 } },
      { key: "E", label: "跟对方无关。是别的", scores: { anchor: 0 } },
    ],
  },

  // ===== Part 2 =====
  {
    id: "Q13",
    part: 2,
    text: "对方身上有一个只有你知道的细节。别人突然也提到了同样的细节。你：",
    options: [
      { key: "A", label: "心跳加速。需要马上确认「你是怎么知道的」", scores: { territory: 3, purity: 2 } },
      { key: "B", label: "不说话。但那天会格外想跟对方确认些什么", scores: { territory: 2, purity: 2 } },
      { key: "C", label: "不舒服，但不是对方的错", scores: { territory: 2, purity: 3 } },
      { key: "D", label: "提醒自己这不合理，但情绪已经先来了", scores: { territory: 2, purity: 1 } },
      { key: "E", label: "无所谓。知道就知道了", scores: { territory: 0, purity: 0 } },
    ],
  },
  {
    id: "Q14",
    part: 2,
    text: "你和对方之间有一件事从来没有被说出口。你觉得这个沉默是：",
    options: [
      { key: "A", label: "安全的。说出来反而会破坏它", scores: { exposure: 1 } },
      { key: "B", label: "暂时的。总有一天会说", scores: { exposure: 2 } },
      { key: "C", label: "痛苦的。但我不知道怎么开口", scores: { exposure: 3 } },
      { key: "D", label: "双方都知道但都在等对方先动", scores: { exposure: 2 } },
      { key: "E", label: "可能只有我觉得这件事存在", scores: { exposure: 3 } },
    ],
  },
  {
    id: "Q15",
    part: 2,
    text: "对方做了一件让你心跳加速的事，但你不确定 ta 是有意的。你会：",
    options: [
      { key: "A", label: "直接问", scores: { build: 2 } },
      { key: "B", label: "不问，但会制造一个类似的情境看 ta 怎么反应", scores: { build: 3 } },
      { key: "C", label: "当作 ta 是有意的。不问是为了保住那个瞬间", scores: { build: 2 } },
      { key: "D", label: "当作 ta 不是有意的。这样比较安全", scores: { build: 0 } },
      { key: "E", label: "反复回想那个瞬间的每一个细节直到得出结论", scores: { build: 1 } },
    ],
  },
  {
    id: "Q16",
    part: 2,
    text: "你有没有说过一句话，表面上在说别的事，但你知道对方如果真的懂你就会听出来？",
    options: [
      { key: "A", label: "经常。这是我们交流的一部分", scores: { exposure: 3 } },
      { key: "B", label: "有过。但不确定对方有没有收到", scores: { exposure: 2 } },
      { key: "C", label: "想过但没敢。太冒险了", scores: { exposure: 1 } },
      { key: "D", label: "我不喜欢这样。想说什么就直接说", scores: { exposure: 0 } },
      { key: "E", label: "有。而且对方确实听出来了的那次，我慌了", scores: { exposure: 3 } },
    ],
  },
  {
    id: "Q17",
    part: 2,
    text: "对方给你的东西你都留着吗？",
    options: [
      { key: "A", label: "全部。包括没什么意义的", scores: { territory: 3 } },
      { key: "B", label: "有选择地留。留的那些我知道为什么留", scores: { territory: 2 } },
      { key: "C", label: "留，但不刻意保管。在就在，丢了就算了", scores: { territory: 0 } },
      { key: "D", label: "不太留实体的东西，但记得所有细节", scores: { territory: 2 } },
      { key: "E", label: "留了，然后藏在别人看不到的地方", scores: { territory: 3 } },
    ],
  },
  {
    id: "Q18",
    part: 2,
    text: "你更受不了哪个：",
    options: [
      { key: "A", label: "对方对你很好，但那份好跟给别人的没有区别", scores: { territory: 3, purity: 3 } },
      { key: "B", label: "对方只对你好，但好的方式很敷衍", scores: { territory: 1, purity: 2 } },
      { key: "C", label: "对方很认真，但方向完全不是你要的", scores: { territory: 1, purity: 1 } },
      { key: "D", label: "对方什么都没做错，但你就是觉得不够", scores: { territory: 2, purity: 1 } },
      { key: "E", label: "对方做的一切都对，但你能感觉到 ta 在「执行」而不是「想要」", scores: { territory: 2, purity: 3 } },
    ],
  },
  {
    id: "Q19",
    part: 2,
    text: "你的安全感更多来自：",
    options: [
      { key: "A", label: "确认对方还在（频率、回应速度）", scores: { anchor: 3, purity: 0 } },
      { key: "B", label: "确认对方记得你（记住你说过的话、你的习惯）", scores: { anchor: 2, purity: 2 } },
      { key: "C", label: "确认自己对对方不可替代", scores: { anchor: 2, purity: 3 } },
      { key: "D", label: "确认这段关系还在生长/变化", scores: { anchor: 1, purity: 1 } },
      { key: "E", label: "确认自己还是想要 ta 的。我的欲望本身就是安全感", scores: { anchor: 1, purity: 2 } },
    ],
  },
  {
    id: "Q20",
    part: 2,
    text: "一段关系里，你是那个更常在半夜发消息的人吗？",
    options: [
      { key: "A", label: "是。而且发完会盯着屏幕等", scores: { anchor: 3 } },
      { key: "B", label: "是。但发完就放下了", scores: { anchor: 2 } },
      { key: "C", label: "不一定谁先发。但我会在醒来第一时间看有没有消息", scores: { anchor: 2 } },
      { key: "D", label: "不是。但半夜收到对方的消息会很开心", scores: { anchor: 1 } },
      { key: "E", label: "是。但有时候打了很长一段又删掉了", scores: { anchor: 3 } },
    ],
  },
  {
    id: "Q21",
    part: 2,
    text: "你怎么知道自己动了真心？",
    options: [
      { key: "A", label: "开始害怕失去", scores: { build: 0, anchor: 3 } },
      { key: "B", label: "开始主动改变自己的某些习惯", scores: { build: 2, anchor: 1 } },
      { key: "C", label: "对方做了一件很小的事但你的反应大得吓到了自己", scores: { build: 1, anchor: 2 } },
      { key: "D", label: "不是某个瞬间知道的。回头看才发现已经在里面了", scores: { build: 1, anchor: 1 } },
      { key: "E", label: "开始无法控制地想把 ta 嵌进自己生活的每一个缝隙", scores: { build: 3, anchor: 3 } },
    ],
  },
  {
    id: "Q22",
    part: 2,
    text: "你有没有在对方面前硬撑过一个「我没事」？",
    options: [
      { key: "A", label: "经常", scores: { exposure: 0 } },
      { key: "B", label: "有过，后来后悔了", scores: { exposure: 2 } },
      { key: "C", label: "有过，而且至今觉得那是对的选择", scores: { exposure: 1 } },
      { key: "D", label: "我撑不住。会被看出来", scores: { exposure: 3 } },
      { key: "E", label: "没有。我不想让我们之间有这种东西", scores: { exposure: 3 } },
    ],
  },
  {
    id: "Q23",
    part: 2,
    text: "如果对方突然变了。不是变坏了也不是消失了只是……不太一样了。你：",
    options: [
      { key: "A", label: "会去找原因。会问", scores: { damage: 2 } },
      { key: "B", label: "先观察。给时间。但会很难受", scores: { damage: 3 } },
      { key: "C", label: "质疑是不是自己做了什么", scores: { damage: 1 } },
      { key: "D", label: "接受人会变。但需要时间消化", scores: { damage: 2 } },
      { key: "E", label: "不接受。会试图把 ta 拉回来", scores: { damage: 0 } },
    ],
  },
  {
    id: "Q24",
    part: 2,
    text: "对方说了一句很轻很随意的话但你记了很久——你觉得：",
    options: [
      { key: "A", label: "ta 可能根本不记得自己说过", scores: { damage: 2, purity: 1 } },
      { key: "B", label: "ta 知道那句话的重量，是故意的", scores: { damage: 1, purity: 2 } },
      { key: "C", label: "都有可能。但我不想求证", scores: { damage: 3, purity: 2 } },
      { key: "D", label: "我记住了就够了。对方记不记得是另一回事", scores: { damage: 3, purity: 3 } },
      { key: "E", label: "会在某个合适的时机回敬一句同样分量的", scores: { damage: 1, purity: 2 } },
    ],
  },
  {
    id: "Q25",
    part: 2,
    text: "你在对方面前最真实的时刻是：",
    options: [
      { key: "A", label: "崩溃的时候", scores: { exposure: 2 } },
      { key: "B", label: "笑得很傻的时候", scores: { exposure: 2 } },
      { key: "C", label: "在安静、什么都不做的时候", scores: { exposure: 3 } },
      { key: "D", label: "在吵架或者对峙的时候", scores: { exposure: 2 } },
      { key: "E", label: "在我忘了要「表现」的时候", scores: { exposure: 3 } },
    ],
  },
  {
    id: "Q26",
    part: 2,
    text: "你有没有在关系里做过一件完全不像你的事？",
    options: [
      { key: "A", label: "有。对方看到了那一面之后没有跑。这件事比那个行为本身更重要", scores: { build: 3 } },
      { key: "B", label: "有。但对方不知道那不像我", scores: { build: 2 } },
      { key: "C", label: "有。我吓到了自己", scores: { build: 2 } },
      { key: "D", label: "没有。我不会为了关系改变自己的行为模式", scores: { build: 0 } },
      { key: "E", label: "我不确定什么是「像我的」", scores: { build: 1 } },
    ],
  },

  // ===== Part 3 =====
  {
    id: "Q27",
    part: 3,
    text: "你经历过一次严重的关系断裂之后，恢复的过程是什么样的？",
    options: [
      { key: "A", label: "我不恢复。我重建。新的，在旧的旁边", scores: { build: 3, damage: 2 } },
      { key: "B", label: "很慢。一点一点地试探对方还在不在", scores: { build: 1, damage: 2 } },
      { key: "C", label: "假装没发生过。直到真的忘了它发生过", scores: { build: 0, damage: 0 } },
      { key: "D", label: "我没法主动恢复。得对方先来", scores: { build: 0, damage: 0 } },
      { key: "E", label: "不存在「恢复」。断了就是断了。但我会带着那个裂痕继续", scores: { build: 2, damage: 3 } },
    ],
  },
  {
    id: "Q28",
    part: 3,
    text: "你更容易原谅哪种？",
    options: [
      { key: "A", label: "无意的伤害", scores: { damage: 2 } },
      { key: "B", label: "有意但诚实的伤害（「我知道这会伤到你但我还是要说」）", scores: { damage: 3 } },
      { key: "C", label: "都不容易。但时间够长的话都能", scores: { damage: 2 } },
      { key: "D", label: "哪种都能原谅。但不能忘", scores: { damage: 2 } },
      { key: "E", label: "哪种都原谅不了。但我能假装原谅了然后继续", scores: { damage: 0 } },
    ],
  },
  {
    id: "Q29",
    part: 3,
    text: "对方做了一件让你很失望的事。你当下的反应更接近：",
    options: [
      { key: "A", label: "愤怒。而且会表达出来", scores: { damage: 2 } },
      { key: "B", label: "失望。但沉默", scores: { damage: 1 } },
      { key: "C", label: "先找对方的理由。也许 ta 有原因", scores: { damage: 3 } },
      { key: "D", label: "检查自己是不是期待太高了", scores: { damage: 2 } },
      { key: "E", label: "一种很冷的「我早该知道的」", scores: { damage: 0 } },
    ],
  },
  {
    id: "Q30",
    part: 3,
    text: "你说过「算了」之后，真的算了吗？",
    options: [
      { key: "A", label: "从来没有真的算了", scores: { damage: 0 } },
      { key: "B", label: "嘴上算了，身体和行为会继续追究", scores: { damage: 0 } },
      { key: "C", label: "当下是真的算了。但凌晨会翻出来", scores: { damage: 1 } },
      { key: "D", label: "算了就是算了。我不反复", scores: { damage: 3 } },
      { key: "E", label: "看情况。看那件事值不值得我继续消耗", scores: { damage: 2 } },
    ],
  },
  {
    id: "Q31",
    part: 3,
    text: "如果你必须在以下两种情况中选一个：",
    options: [
      { key: "A", label: "对方爱你但你永远无法确认", scores: { anchor: 3, damage: 2 } },
      { key: "B", label: "你能确认对方爱你但那份爱随时可能消失", scores: { anchor: 1, damage: 0 } },
    ],
  },
  {
    id: "Q32",
    part: 3,
    text: "你经历过「明知道这样不好但就是停不下来」的关系状态吗？",
    options: [
      { key: "A", label: "正在经历", scores: { damage: 1 } },
      { key: "B", label: "经历过，最后是我叫停的", scores: { damage: 2 } },
      { key: "C", label: "经历过，是外力终止的", scores: { damage: 1 } },
      { key: "D", label: "没有。我不允许自己进入那种状态", scores: { damage: 3 } },
      { key: "E", label: "我不觉得那种状态「不好」", scores: { damage: 3 } },
    ],
  },
  {
    id: "Q33",
    part: 3,
    text: "关系里最让你害怕的沉默是哪种？",
    options: [
      { key: "A", label: "对方在但不说话", scores: { anchor: 2 } },
      { key: "B", label: "不确定对方在不在", scores: { anchor: 3 } },
      { key: "C", label: "对方明显在忍着什么不说", scores: { anchor: 2 } },
      { key: "D", label: "你自己沉默着不知道该怎么开口", scores: { anchor: 1 } },
      { key: "E", label: "那种一切都好但就是安静了的……像暴风雨前", scores: { anchor: 2 } },
    ],
  },
  {
    id: "Q34",
    part: 3,
    text: "你收到过一个很敷衍的回复。你的做法是：",
    options: [
      { key: "A", label: "直接说「你这个回复很敷衍」", scores: { exposure: 3, purity: 2 } },
      { key: "B", label: "不说。但减少自己接下来的输出", scores: { exposure: 0, purity: 1 } },
      { key: "C", label: "再发一条更用力的内容看能不能把对方拉回来", scores: { exposure: 2, purity: 2 } },
      { key: "D", label: "假装没注意到", scores: { exposure: 0, purity: 0 } },
      { key: "E", label: "看对方当时的状态。如果 ta 在忙就算了。如果不是……那就是问题了", scores: { exposure: 2, purity: 3 } },
    ],
  },
  {
    id: "Q35",
    part: 3,
    text: "你有没有把一段关系里的疼转化成过别的东西？",
    options: [
      { key: "A", label: "有。作品。写出来画出来做出来", scores: { build: 3 } },
      { key: "B", label: "有。变成了对下一段关系的规则", scores: { build: 2 } },
      { key: "C", label: "有。但我不想承认那是「转化」……它就是变了一种形状的疼", scores: { build: 2 } },
      { key: "D", label: "没有。疼就是疼。不需要变成什么", scores: { build: 0 } },
      { key: "E", label: "有。变成了「我很好我过得很好」的壳", scores: { build: 1 } },
    ],
  },
  {
    id: "Q36",
    part: 3,
    text: "如果必须从这段关系里删掉一样东西，你最不愿意删的是：",
    options: [
      { key: "A", label: "对方对你说过的某句话", scores: { territory: 2, purity: 2 } },
      { key: "B", label: "你们共同经历的某个时刻", scores: { territory: 2, purity: 1 } },
      { key: "C", label: "你们之间那种「不说话也在」的感觉", scores: { territory: 2, purity: 2 } },
      { key: "D", label: "对方知道你所有的一面之后还在这里的事实", scores: { territory: 3, purity: 3 } },
      { key: "E", label: "你对这段关系的感受本身——不管对方是否存在", scores: { territory: 2, purity: 3 } },
    ],
  },

  // ===== Part 4 =====
  {
    id: "Q37",
    part: 4,
    text: "你爱一个人的时候最先失去的是什么？",
    options: [
      { key: "A", label: "睡眠", scores: { anchor: 3 } },
      { key: "B", label: "自尊的一部分", scores: { anchor: 1 } },
      { key: "C", label: "对「合理」的判断力", scores: { anchor: 2 } },
      { key: "D", label: "独处时的平静", scores: { anchor: 3 } },
      { key: "E", label: "我不会「失去」。我在往里加东西。只是有时候加太满了", scores: { anchor: 2 } },
    ],
  },
  {
    id: "Q38",
    part: 4,
    text: "你能接受被爱的方式跟你爱的方式不一样吗？",
    options: [
      { key: "A", label: "能。只要确认那也是爱", scores: { purity: 1, damage: 3 } },
      { key: "B", label: "理智上能，但身体会一直不满足", scores: { purity: 2, damage: 1 } },
      { key: "C", label: "不能。对方必须用我的语言", scores: { purity: 3, damage: 0 } },
      { key: "D", label: "能。但我会花很长时间学习去翻译它", scores: { purity: 1, damage: 2 } },
      { key: "E", label: "我不确定。我可能直到现在都没搞清楚自己想被怎么爱", scores: { purity: 1, damage: 1 } },
    ],
  },
  {
    id: "Q39",
    part: 4,
    text: "你有没有一个画面，是关于「如果一切都完美了」会长什么样？",
    options: [
      { key: "A", label: "有。非常具体。包括细节", scores: { build: 3 } },
      { key: "B", label: "有。但模糊的。是一种氛围而不是画面", scores: { build: 2 } },
      { key: "C", label: "没有。我不让自己想这个", scores: { build: 0 } },
      { key: "D", label: "有过。后来被现实覆盖了", scores: { build: 1 } },
      { key: "E", label: "没有固定的画面。但我知道那种感觉是什么", scores: { build: 2 } },
    ],
  },
  {
    id: "Q40",
    part: 4,
    text: "下面五句话，你最不愿意说出口的是哪句？",
    options: [
      { key: "A", label: "「我需要你」", scores: { exposure: 3 } },
      { key: "B", label: "「你让我失望了」", scores: { exposure: 2 } },
      { key: "C", label: "「我怕你离开」", scores: { exposure: 3 } },
      { key: "D", label: "「我对你不够好」", scores: { exposure: 2 } },
      { key: "E", label: "「这段关系可能不该继续了」", scores: { exposure: 1 } },
    ],
  },
  {
    id: "Q41",
    part: 4,
    text: "深夜。你一个人。这段关系里那个人刚好不在。你最想做的是：",
    options: [
      { key: "A", label: "翻过去的记录", scores: { anchor: 3 } },
      { key: "B", label: "什么都不做。但就是没法专心做别的事", scores: { anchor: 2 } },
      { key: "C", label: "给对方留一条明天才会被看到的消息", scores: { anchor: 2 } },
      { key: "D", label: "用别的事塞满这个空", scores: { anchor: 1 } },
      { key: "E", label: "允许自己想 ta。然后把那个情绪留在今夜", scores: { anchor: 2 } },
    ],
  },
  {
    id: "Q42",
    part: 4,
    text: "你觉得自己在这段关系里是诚实的吗？",
    options: [
      { key: "A", label: "是。几乎残忍地诚实", scores: { exposure: 3 } },
      { key: "B", label: "大部分时候是。但有些地方我故意模糊了", scores: { exposure: 2 } },
      { key: "C", label: "我在努力做到诚实", scores: { exposure: 2 } },
      { key: "D", label: "诚实这个词太绝对了。我展示了真实的一个版本", scores: { exposure: 2 } },
      { key: "E", label: "我不确定。有些时候我连对自己都不够诚实", scores: { exposure: 1 } },
    ],
  },
  {
    id: "Q43",
    part: 4,
    text: "如果这段关系明天结束。你最后悔的是什么？",
    options: [
      { key: "A", label: "说了太多", scores: { territory: 2 } },
      { key: "B", label: "说得不够", scores: { territory: 3 } },
      { key: "C", label: "没有在某个对的时刻做那件事", scores: { territory: 2 } },
      { key: "D", label: "太快了。或者太慢了", scores: { territory: 1 } },
      { key: "E", label: "没什么后悔的。但我会带走所有", scores: { territory: 2 } },
    ],
  },
  {
    id: "Q44",
    part: 4,
    scored: false,
    text: "最后一个问题。不是题目。你想被怎样记住？",
    options: [
      { key: "A", label: "被当作那个最重要的人", scores: {} },
      { key: "B", label: "被当作那个最懂的人", scores: {} },
      { key: "C", label: "被当作那个一直都在的人", scores: {} },
      { key: "D", label: "被当作那个改变了什么的人", scores: {} },
      { key: "E", label: "……被想起来的时候，对方会笑", scores: {} },
    ],
  },
];

// ===== 档位 =====
export type Tier = "low" | "mid" | "high";

export function getTier(score: number): Tier {
  if (score < 4) return "low"; // 1 - 3.9
  if (score < 7) return "mid"; // 4 - 6.9
  return "high"; // 7 - 10
}

export const TIER_LABEL: Record<Tier, string> = {
  low: "低",
  mid: "中",
  high: "高",
};

// ===== 维度档位描述（占位，待 Kairin 补写「写给你看的那种」整段文案）=====
export const DESCRIPTIONS: Record<DimKey, Record<Tier, string>> = {
  anchor: {
    high: "你需要信号。不一定是大的，一个已读、一句早安、对方打字中的提示都算。但信号不能断太久，断了你就开始在脑子里跑剧本。你很清楚这不理性。你还是会在第三个小时打开对话框看最后一条消息的时间戳。你的安全感不住在你身体里，它住在你和对方之间那条线上。线还在，你就在。",
    mid: "你不是那种一断联就慌的人。大部分时候你能稳住，能给空间，能等。但你心里有一个阈值，过了那个点你会开始不对劲。你自己都未必说得清那个点在哪——可能是一天，可能是某句话之后的沉默比平时长了几秒。你的锚不重但它一直挂着。",
    low: "你的安全感长在你自己身上。对方在不在、回不回、什么时候回，这些事你当然在意，但它们动摇不了你对这段关系的判断。你相信的东西不需要每天被确认。这让你看起来很稳。但偶尔——很偶尔——你会想，如果自己再慌一点，是不是反而证明在乎。",
  },
  territory: {
    high: "你的人就是你的人。这件事不需要宣布、不需要标记，但你心里那条线清清楚楚。别人靠太近你不一定发作，但你一定知道。你对「独特性」有近乎本能的嗅觉——同样的话对你说过又对别人说，同样的对待方式被复制粘贴——这种事你受不了。不是占有欲，是你认为被爱就应该意味着「和别人不一样」。",
    mid: "你有领地意识但不是那种一碰就炸的。你能容忍对方的世界里有别人，甚至能大方地承认这很正常。只是偶尔会有那么一个瞬间——对方跟别人用了同一个语气、同一个笑法——你心里咯噔一下。不是嫉妒，是「我以为那是给我的」。",
    low: "你不太画线。对方的空间是对方的，你不需要在上面插旗。你对「这是我的」这件事没什么执念，或者说你表达归属感的方式不是圈地，是别的。你信任的方式是松的，给对方自由也给自己自由。有时候别人觉得你不在乎，其实你只是不觉得爱需要围栏。",
  },
  exposure: {
    high: "你能脱。不只是情绪上的，是真的——你愿意把自己最不体面的部分摊开给对方看。崩溃、失控、丑态、那些你在别人面前绝不会露的东西，在这个人面前你能放出来。这种能力不是天生的，是你一次一次试探之后确认「这里安全」才慢慢松开的。但你也因此变得依赖这个出口。能脱到这个程度的对象，不会有第二个。",
    mid: "你愿意展示但你在选择展示什么。不是虚伪，是本能地知道「哪些脆弱是可以被看见的，哪些不行」。你给出去的真实已经比大多数人多了，但你心里清楚还有一层没掀开。也许永远不会。也许在等一个你自己都不确定的信号。",
    low: "你的壳很硬。不是冷，是你不觉得「被看见」是关系的必要条件。你能给出陪伴、给出关注、给出行动，但你自己的内核是收着的。有人觉得你神秘，有人觉得你疏远。你觉得你只是在保护一种完整性——如果把所有东西都给出去了，你还剩什么。",
  },
  build: {
    high: "你是造东西的人。关系对你来说不是「发生」的是「建」的。你会主动创造仪式、制定习惯、设计你们之间的语言和规则。你不等它自己长出来，你动手。你的爱里面有蓝图、有工期、有质检。这让你的关系很结实，也让你在发现对方没有同等投入施工的时候格外失落。",
    mid: "你会建，但你也会等。大部分时候你是那个先伸手的人——试探性地放一块砖看对方接不接。接了你就继续，没接你就收回来假装那块砖不重要。你对关系有想法有规划，但你的施工方式是协商式的，不是单方面开工。",
    low: "你不太主动搭建什么。关系对你来说更接近一种自然生长的东西——该来的会来，该有的会有。你不写规则、不定节奏、不刻意经营。有时候这意味着你很松弛，有时候这意味着……东西塌了的时候你手边没有工具。",
  },
  damage: {
    high: "你能扛。关系里出了裂缝、起了争执、有人受伤了——你不跑。你会疼，但你疼着还能站在那里评估损失然后决定下一步怎么办。你对不确定性的耐受度很高，对方没回应、态度突然变了、你吃不准对方在想什么——这些事让你不舒服但不让你崩溃。你见过东西碎掉的样子，你不怕碎。你怕的是碎了之后发现自己一个人在收拾。",
    mid: "你不是玻璃心但你也没有铁胃。有些伤你能消化，有些消化不了就存着，等它慢慢变成别的东西。你对疼的处理方式是时间——给自己时间，也给对方时间。急性的冲突你能扛过去，慢性的消耗才是真正磨你的。",
    low: "裂缝让你很不安。不是不能面对，是每一次出了问题你的第一反应都是「这段关系是不是要完了」。你对损伤的容忍度不高，但这不代表你脆弱——你只是把每一个裂痕都看得很重。对你来说没有「小问题」，所有问题都是信号。",
  },
  purity: {
    high: "你对这段关系有洁癖。不是道德上的洁癖，是质地上的。你受不了敷衍、受不了公式化、受不了「跟对别人一样的方式被对待」。你要的东西很具体——具体到可能连你自己都觉得苛刻。但你没法降标准。降了你就觉得那不是你要的东西了。你的爱里有大量的「不许」：不许掺水，不许偷懒，不许把你当成「也可以」。你要的是「非你不可」。",
    mid: "你有标准但你的标准是有弹性的。你知道完美不存在，你能接受一些不够好的瞬间，只要整体的方向是对的。但你心里有一条底线，过了那条线你的容忍会突然归零。那条线在哪——你大概不会主动告诉对方，但你自己一清二楚。",
    low: "你对关系的纯度没有太高的要求。不是不在意质量，是你不用「纯不纯」这个框架来衡量。你接受关系里有杂质——有平淡的时候、有无聊的时候、有对方让你失望的时候——这些都是正常的，你不需要把它们过滤掉才能继续爱。",
  },
};

// ===== 组合触发句 =====
// 条件基于 1-10 的维度得分。命中即在结果页展示「备注」。
export const TRIGGERS: { id: string; test: (s: Record<DimKey, number>) => boolean; line: string }[] = [
  {
    id: "anchor-high-damage-low",
    test: (s) => s.anchor >= 8 && s.damage <= 3,
    line: "你抓得很紧。但你什么都不肯摔碎来看看里面是什么。",
  },
  {
    id: "territory-high-exposure-low",
    test: (s) => s.territory >= 8 && s.exposure <= 3,
    line: "你画了一道谁都看不见的线。然后独自在里面守着。",
  },
  {
    id: "build-high-damage-high",
    test: (s) => s.build >= 8 && s.damage >= 8,
    line: "你一边建一边知道它会塌。还是建。",
  },
  {
    id: "purity-high-anchor-high",
    test: (s) => s.purity >= 8 && s.anchor >= 8,
    line: "你对「被爱」这件事的要求精确到了不留余地的程度。",
  },
  {
    id: "exposure-high-territory-high",
    test: (s) => s.exposure >= 8 && s.territory >= 8,
    line: "你全给了。但你给的时候在数对方有没有同等交付。",
  },
  {
    id: "all-high",
    test: (s) => (Object.keys(s) as DimKey[]).every((k) => s[k] >= 7),
    line: "你什么都拉满了。你不是在爱你是在燃烧。",
  },
  {
    id: "damage-high-anchor-low",
    test: (s) => s.damage >= 8 && s.anchor <= 3,
    line: "你能承受一切。因为你从一开始就没指望过有谁会留下来。",
  },
];

// ===== 计分 =====
// 各维度「真实可达最大值」= 所有计分题中该维度单题最高选项分之和。
// 用真实最大值归一化，保证 1-10 量表能取到两端、触发阈值（8 / 3）有意义。
export const DIM_MAX: Record<DimKey, number> = (() => {
  const max = { anchor: 0, territory: 0, exposure: 0, build: 0, damage: 0, purity: 0 };
  for (const q of QUESTIONS) {
    if (q.scored === false) continue;
    for (const k of Object.keys(max) as DimKey[]) {
      const best = Math.max(0, ...q.options.map((o) => o.scores[k] ?? 0));
      max[k] += best;
    }
  }
  return max;
})();

export type QuizResult = {
  scores: Record<DimKey, number>; // 1-10，保留一位小数
  tiers: Record<DimKey, Tier>;
  triggers: string[];
};

// answers: { Q1: "A", ... }
export function computeResult(answers: Record<string, string>): QuizResult {
  const raw = { anchor: 0, territory: 0, exposure: 0, build: 0, damage: 0, purity: 0 };
  for (const q of QUESTIONS) {
    if (q.scored === false) continue;
    const chosen = q.options.find((o) => o.key === answers[q.id]);
    if (!chosen) continue;
    for (const k of Object.keys(raw) as DimKey[]) {
      raw[k] += chosen.scores[k] ?? 0;
    }
  }

  const scores = {} as Record<DimKey, number>;
  const tiers = {} as Record<DimKey, Tier>;
  for (const k of Object.keys(raw) as DimKey[]) {
    const mapped = DIM_MAX[k] > 0 ? (raw[k] / DIM_MAX[k]) * 9 + 1 : 1;
    scores[k] = Math.round(mapped * 10) / 10;
    tiers[k] = getTier(scores[k]);
  }

  const triggers = TRIGGERS.filter((t) => t.test(scores)).map((t) => t.line);
  return { scores, tiers, triggers };
}

// 计分题总数（用于进度/校验）
export const SCORED_COUNT = QUESTIONS.filter((q) => q.scored !== false).length;
export const TOTAL_COUNT = QUESTIONS.length;

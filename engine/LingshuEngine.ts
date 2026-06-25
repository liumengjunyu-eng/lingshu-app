// LingshuEngine.ts — MVP FREEZE 版本
// 5种人格 × 5个问题 × 20条镜像素材

export type PrimaryIssue = 'sleep' | 'anxiety' | 'direction' | 'relationship' | 'energy'
export type FollowUpChoice = 'A' | 'B' | 'C' | 'D'
export type RecoveryLevel = 'good' | 'light' | 'medium' | 'heavy'

export interface Scores {
  energy: number   // 1-10
  recovery: number // 1-10
  stress: number   // 1-10
}

export interface Persona {
  id: string
  name: string
  element: string
  description: string
}

export interface DiagnosisResult {
  persona: Persona
  scores: Scores
  recoveryLevel: RecoveryLevel
  mirror: string
  suggestions: string[]
  observation: {
    title: string
    items: string[]
  }
}

interface PathConfig {
  personaId: string
  mirror: string
  suggestions: string[]
  observationItems: string[]
}

// === 五种人格原型 ===

const PERSONAS: Record<string, Persona> = {
  executor: {
    id: 'executor',
    name: '执行者',
    element: '金',
    description: '目标清晰，行动力强，但容易忽略身体信号',
  },
  creator: {
    id: 'creator',
    name: '创作者',
    element: '水',
    description: '想象力丰富，情感充沛，但容易陷入内耗',
  },
  guardian: {
    id: 'guardian',
    name: '守护者',
    element: '土',
    description: '稳定可靠，照顾他人，但容易过度承担',
  },
  observer: {
    id: 'observer',
    name: '观察者',
    element: '木',
    description: '善于分析，理性思考，但容易停留在思考阶段',
  },
  explorer: {
    id: 'explorer',
    name: '探索者',
    element: '火',
    description: '充满热情，乐于尝试，但容易三分钟热度',
  },
}

// === 20条路径（5问题 × 4选择） ===

const PATHS: Record<string, Record<string, PathConfig>> = {
  // --- sleep ---
  sleep: {
    A: {
      personaId: 'observer',
      mirror: '你睡不着不是因为不够累，是因为脑子停不下来。你习惯在睡前反复回放白天的对话，推演"如果当时那样说就好了"。你的大脑把床当成了会议室——这间房间从不打烊。',
      suggestions: ['睡前 90 分钟关闭所有屏幕', '把"明天要做的事"写下来再上床', '尝试 4-7-8 呼吸法：吸气4秒，屏息7秒，呼气8秒'],
      observationItems: ['入睡时间超过 30 分钟', '躺下后思维活跃度升高', '对白天的对话有反刍倾向'],
    },
    B: {
      personaId: 'executor',
      mirror: '你太想把每一件事都做到完美了。白天没完成的 KPI、没发出去的邮件、没改好的方案，在深夜排着队来敲门。你不是失眠，是敬业过头的身体在抗议。',
      suggestions: ['划定"今天到此为止"的时间点', '接受"够好"而不是"完美"', '睡前做一组简单的拉伸释放身体紧张'],
      observationItems: ['对未完成事项焦虑', '睡前常复盘当日工作', '身体肌肉长期处于紧张状态'],
    },
    C: {
      personaId: 'creator',
      mirror: '你的情绪像没有开关的水龙头——白天还好，晚上就收不住。白天压下去的感受在深夜集体反弹，你的身体用睡不着告诉你：有些情绪你没来得及处理。',
      suggestions: ['睡前一小时写情绪日记', '听低频白噪音（雨声/风扇声）', '早上晒太阳 15 分钟调节生物钟'],
      observationItems: ['情绪波动影响睡眠质量', '深夜容易情绪低落', '睡眠周期不规律'],
    },
    D: {
      personaId: 'explorer',
      mirror: '你担心未来，担心那些还没发生的事。你的身体躺下了，但大脑还在预警状态——它在为"万一"做准备。问题是，它准备了一百个"万一"，但大部分不会发生。',
      suggestions: ['列出"今天已完成的事"而非"明天要做的事"', '设置"担心时间"：每天固定 10 分钟专门担心', '睡前做渐进式肌肉放松'],
      observationItems: ['对未来事件过度担忧', '难以停止"what if"思维', '睡眠中被焦虑唤醒'],
    },
  },
  // --- anxiety ---
  anxiety: {
    A: {
      personaId: 'observer',
      mirror: '你反复回想过去的错误，像用同一把刀子反复割同一个伤口。你以为"再想一遍就能想通"，但事实上——想通只发生在你停止反复想的那个瞬间。',
      suggestions: ['区分"复盘"和"反刍"：前者有结论，后者没有', '当发现自己又在回忆时，说一句"到此为止"', '把注意力转移到身体感觉上（脚踩地面的感觉）'],
      observationItems: ['过度关注过去的决策错误', '同一件事反复回忆超过 3 次', '容易陷入"如果当初"的想象'],
    },
    B: {
      personaId: 'guardian',
      mirror: '你总是在为最坏的情况做准备。在你看来，"做好准备"就等于"减少伤害"。但你的身体分不清"准备"和"危险"——它一直在战斗状态，从未真正放松。',
      suggestions: ['写下最坏的情况，再写出它的实际概率', '练习"让身体先放松，大脑会跟上"', '每天做一件"没有计划"的小事'],
      observationItems: ['对未来持灾难化预期', '身体长期处于紧张状态', '对不确定性的耐受力偏低'],
    },
    C: {
      personaId: 'explorer',
      mirror: '你的身体比你的大脑诚实得多。心跳加速、手心出汗、坐立不安——这些信号不是"你出问题了"，是你的交感神经在说"我准备好了"。问题是，你并不知道自己在准备什么。',
      suggestions: ['深呼吸：吸气4秒，屏息2秒，呼气6秒', '用冷水冲手腕 30 秒', '原地踏步 1 分钟释放多余能量'],
      observationItems: ['有明显的躯体化症状', '焦虑时伴随心悸或胸闷', '难以静坐或保持静止'],
    },
    D: {
      personaId: 'creator',
      mirror: '你太想逃离了。不是逃避问题，是逃避那种"问题永远解决不完"的窒息感。你害怕的不是具体的事，是那种"永远没有尽头"的疲惫。',
      suggestions: ['把大问题拆成小步骤，只做第一步', '设置"可逃离时间"：每天 30 分钟完全不想正事', '找一个信任的人说"我现在只需要你听，不需要建议"'],
      observationItems: ['面对问题时有逃避冲动', '任务堆积时容易完全停摆', '逃避后伴随更强的内疚感'],
    },
  },
  // --- direction ---
  direction: {
    A: {
      personaId: 'observer',
      mirror: '你想得太多了。不是"想得全面"，是"用想的代替做的"。你把每条路都推演了十遍，但每一条都有风险，于是你停在原地。你的大脑告诉你"再想想"，但事实是——你已经想够了。',
      suggestions: ['设一个决策截止时间', '用"最小可行行动"代替完美决定', '告诉自己"选了就选了，不回头看"'],
      observationItems: ['决策时间明显长于常人', '做决定后容易自我怀疑', '追求"最优解"而非"够好的解"'],
    },
    B: {
      personaId: 'guardian',
      mirror: '你太害怕选错了。你希望有一个人能告诉你"选这个，不会有问题"。但没有人能给你这个保证，所以你迟迟不能动。你不是缺方向，是缺允许自己犯错的那份勇气。',
      suggestions: ['选一个方向试 30 天，允许自己反悔', '写下"选错的成本"和"不选的成本"', '找一个你信任的人说"你觉得我该往哪走"'],
      observationItems: ['做重大决策时需要外部确认', '担心选择会关闭其他可能性', '过度评估风险'],
    },
    C: {
      personaId: 'explorer',
      mirror: '你靠直觉做决定，而且通常是对的。但问题是——你走得太快了。快到你有时候不清楚自己为什么出发，快到你没注意到沿途的风景。你的直觉在说"冲"，但你的身体在说"等一下"。',
      suggestions: ['做决定前问自己"这个选择我给多久时间"', '每月做一次回顾：上个月的决定带来了什么', '在"冲"之前留 24 小时的冷静期'],
      observationItems: ['靠直觉快速决策', '行动先于思考', '容易中途改变方向'],
    },
    D: {
      personaId: 'executor',
      mirror: '你把选择变成了分析题。你列出所有选项的优缺点、评分、权重——但最后发现，数据并不能消除不确定性。你太相信理性了，而有些决定，需要听听你的直觉。',
      suggestions: ['做完分析后问自己"我的心怎么说"', '给自己一天不看分析结果再决定', '接受"足够好的选择"优于"完美的选择"'],
      observationItems: ['过度依赖理性分析', '难以相信非量化因素', '对不确定性的容忍度低'],
    },
  },
  // --- relationship ---
  relationship: {
    A: {
      personaId: 'guardian',
      mirror: '你把所有人的需求放在自己前面。你太擅长照顾别人了——对方的情绪、期待、边界，你都想得很周全。但你忘了问自己：那我呢？',
      suggestions: ['每天做一件"只为自己"的事', '练习说"我需要想想再回复你"', '记录哪些关系是单方面消耗你的'],
      observationItems: ['在关系中习惯性让步', '难以表达自己的需求', '容易吸引"索取型"关系'],
    },
    B: {
      personaId: 'observer',
      mirror: '你选择不说，因为说出来可能会冲突，而冲突让你害怕。你告诉自己"算了，没必要"，但那些没说出口的话，都变成了身体里的结节和紧张。',
      suggestions: ['从小事开始练习表达不同意见', '用"我感觉"句式代替"你总是"句式', '在感觉被冒犯时先深呼吸，然后说出来'],
      observationItems: ['回避冲突和对抗性对话', '压抑情绪后身体不适', '在关系中缺乏真实表达'],
    },
    C: {
      personaId: 'explorer',
      mirror: '你很直接，甚至太直接了。你不喜欢拐弯抹角，觉得"有话直说"是最有效的方式。但并不是每个人都用你的方式沟通——有时候你以为的"直率"，别人感受到的是"锋利"。',
      suggestions: ['在表达前问自己"这是事实还是我的感受"', '用"我"开头代替"你"开头', '观察对方的反应，而不是只管自己说完'],
      observationItems: ['容易在沟通中显得强势', '较少关注对方的情绪反应', '自我表达大于倾听'],
    },
    D: {
      personaId: 'creator',
      mirror: '你很理性，但你用理性回避了感受。你以为沟通就是传递信息，但关系中最重要的是传递温度。你说了"对的"话，却没说"让人感到被理解"的话。',
      suggestions: ['练习在对话中先回应情绪再回应内容', '问"你现在感觉怎么样"而不是"你觉得呢"', '每天给亲密的人一次具体的肯定'],
      observationItems: ['沟通偏理性缺少情感表达', '对情绪信号不够敏感', '注重"解决问题"而非"共情"'],
    },
  },
  // --- energy ---
  energy: {
    A: {
      personaId: 'executor',
      mirror: '你太能撑了。不管身体给你多少信号——眼皮沉重、肩膀酸痛、脑子转不动——你都会对自己说"再坚持一下"。你的执行力很强，强到可以无视身体的求救信号。',
      suggestions: ['设置"强制休息"闹钟，每 90 分钟休息 10 分钟', '学会区分"不想做"和"不能做"', '每周安排一天完全不安排任何事'],
      observationItems: ['过度透支后仍继续工作', '忽视身体疲劳信号', '难以主动停下来休息'],
    },
    B: {
      personaId: 'observer',
      mirror: '你的身体和你的意志不同步。你心里想做很多事，但身体就是动不了。不是懒，是你的恢复系统在说"我先充会儿电，你再等等"。你越着急，恢复得越慢。',
      suggestions: ['接受"少即是多"——今天做 3 件事就足够了', '先做一件只需 5 分钟的事来启动', '减少决策消耗：固定每天的 routine'],
      observationItems: ['身心不同步感明显', '常感到"脑子想动身体不动"', '容易对自己有高期待'],
    },
    C: {
      personaId: 'explorer',
      mirror: '你很容易烦躁。不是你的脾气变差了，是你的能量账户余额不足。当电池只剩 10% 的时候，任何额外的消耗——有人找你说话、收到一条意外的消息——都会触发你的"省电模式"。',
      suggestions: ['识别你的"能量杀手时刻"并提前防御', '在烦躁时不决策、不回复、不承诺', '补充能量：吃一顿喜欢的、睡一觉、独处一小时'],
      observationItems: ['疲劳后容易对小事发火', '能量低时社交意愿明显下降', '需要较长的独处时间恢复'],
    },
    D: {
      personaId: 'creator',
      mirror: '你选择了"什么都不做"——但并不是真的在休息。你的大脑还在运转，你的内疚感还在加工。"我应该做点什么"的念头让你即使在躺平也无法真正放松。这不是休息，是躺着的消耗。',
      suggestions: ['给"躺平"一个正当理由：这是恢复策略', '躺平时做一些不需要动脑的感官活动（听音乐/摸猫）', '告诉自己：真正的休息不需要有产出'],
      observationItems: ['躺平时伴随内疚感', '难以区分"休息"和"逃避"', '身体虽在休息但精神仍在消耗'],
    },
  },
}

// === 恢复等级判定 ===

function determineRecoveryLevel(scores: Scores): RecoveryLevel {
  const avg = (scores.energy + scores.recovery) / 2
  if (avg >= 8) return 'good'
  if (avg >= 6) return 'light'
  if (avg >= 4) return 'medium'
  return 'heavy'
}

// === 评分计算 ===

function calculateScores(personaId: string, primaryIssue: PrimaryIssue, choice: FollowUpChoice): Scores {
  // 基础分：人格默认值
  const base: Record<string, Scores> = {
    executor:  { energy: 8, recovery: 4, stress: 7 },
    creator:   { energy: 5, recovery: 5, stress: 6 },
    guardian:  { energy: 6, recovery: 6, stress: 5 },
    observer:  { energy: 4, recovery: 3, stress: 8 },
    explorer:  { energy: 7, recovery: 5, stress: 6 },
  }

  // 问题修正
  const issueMod: Record<PrimaryIssue, Partial<Scores>> = {
    sleep:       { energy: -1, recovery: -2 },
    anxiety:     { energy: -2, stress: +2 },
    direction:   { energy: -1, recovery: -1 },
    relationship:{ recovery: -1, stress: +1 },
    energy:      { energy: -2, recovery: -2, stress: +1 },
  }

  // 行为修正（A/B/C/D）
  const choiceMod: Record<FollowUpChoice, Partial<Scores>> = {
    A: { stress: +1 },
    B: { stress: +1, recovery: -1 },
    C: { energy: -1, stress: +1 },
    D: { energy: -1, recovery: -1 },
  }

  const b = base[personaId]
  const im = issueMod[primaryIssue]
  const cm = choiceMod[choice]

  const energy = Math.max(1, Math.min(10, b.energy + (im.energy ?? 0) + (cm.energy ?? 0)))
  const recovery = Math.max(1, Math.min(10, b.recovery + (im.recovery ?? 0) + (cm.recovery ?? 0)))
  const stress = Math.max(1, Math.min(10, b.stress + (im.stress ?? 0) + (cm.stress ?? 0)))

  return { energy, recovery, stress }
}

// === 主诊断方法 ===

export function diagnose(params: {
  primaryIssue: PrimaryIssue
  followUpChoice: FollowUpChoice
}): DiagnosisResult {
  const { primaryIssue, followUpChoice } = params
  const path = PATHS[primaryIssue]?.[followUpChoice]

  if (!path) {
    throw new Error(`未找到路径: ${primaryIssue}-${followUpChoice}`)
  }

  const persona = PERSONAS[path.personaId]
  if (!persona) {
    throw new Error(`未找到人格: ${path.personaId}`)
  }

  const scores = calculateScores(path.personaId, primaryIssue, followUpChoice)
  const recoveryLevel = determineRecoveryLevel(scores)

  return {
    persona,
    scores,
    recoveryLevel,
    mirror: path.mirror,
    suggestions: path.suggestions,
    observation: {
      title: '需要关注的信号',
      items: path.observationItems,
    },
  }
}

// === 导出完整配置供调试 ===

export function getPersonas(): Record<string, Persona> {
  return { ...PERSONAS }
}

export function getPathCount(): number {
  let count = 0
  for (const issue of Object.keys(PATHS)) {
    count += Object.keys(PATHS[issue]).length
  }
  return count
}

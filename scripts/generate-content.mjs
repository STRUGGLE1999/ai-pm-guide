import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = process.cwd()
const docs = path.join(root, 'docs')

function readLegacyData() {
  const code = fs.readFileSync(path.join(root, 'data.js'), 'utf8')
  const context = { window: {} }
  vm.createContext(context)
  vm.runInContext(code, context)
  return context.window.siteData
}

function write(file, content) {
  const target = path.join(docs, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${content.trim()}\n`, 'utf8')
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const legacy = readLegacyData()

const conceptGroups = [
  {
    file: 'ai-basics',
    title: 'AI 基础知识图谱',
    description: '从大模型、Prompt、RAG、Agent 到多模态和 MCP，建立 AI 产品经理需要的最小技术常识。',
    items: [
      ['大模型', '理解通用语言/多模态能力底座、能力边界、上下文和幻觉风险。'],
      ['Prompt', '把提示词视为任务说明书，定义角色、输入、输出、约束和评价标准。'],
      ['RAG', '用检索增强生成解决知识更新、来源引用和企业问答可信度问题。'],
      ['Agent', '理解目标规划、工具调用、状态管理、人工确认和任务完成率。'],
      ['多模态', '把图片、音频、视频、PDF 和表格转化为可用业务信息。'],
      ['MCP', '理解模型与外部工具/数据源连接的标准化协议思路。'],
      ['Function Calling', '让模型稳定调用工具，输出结构化参数而不是只生成文本。'],
      ['Embedding', '把文本/图片映射为向量，用于相似度检索和推荐。'],
      ['向量数据库', '支撑语义检索、知识库和相似案例匹配。'],
      ['上下文窗口', '决定模型一次能处理多少材料，影响产品输入设计和成本。'],
      ['Token 成本', '把模型调用转化为单任务成本和商业可持续性判断。'],
      ['模型路由', '根据任务复杂度选择不同模型，平衡质量、速度和成本。']
    ]
  },
  {
    file: 'product-basics',
    title: '产品经理基本功',
    description: 'AI 产品仍然先是产品，需要需求、用户、流程、指标和协作能力。',
    items: [
      ['需求分析', '从用户任务出发，而不是从“接入大模型”出发。'],
      ['用户研究', '围绕最近一次真实任务追问输入、输出、判断标准和错误成本。'],
      ['竞品分析', '用任务链路比较产品，不只做功能表。'],
      ['PRD', '额外写清模型行为、输入输出、评估标准和异常兜底。'],
      ['指标体系', '覆盖使用、质量、效率、成本和风险五层指标。'],
      ['数据分析', '通过触发率、采纳率、重试率、编辑率定位问题。'],
      ['B 端流程', '关注权限、安全、集成、审计、交付和运营责任。'],
      ['ROI 测算', '把 AI 能力转化为降本、提效、增收或风险降低。'],
      ['灰度发布', '降低模型不稳定和流程误操作带来的上线风险。'],
      ['需求优先级', '优先选高频、耗时、数据可得、错误成本可控的场景。'],
      ['验收标准', '用样例集和可观察指标替代“生成得不错”。'],
      ['跨团队协作', '连接业务、研发、算法、法务、安全和运营。']
    ]
  },
  {
    file: 'ai-product-topics',
    title: 'AI 产品专题',
    description: '从典型产品形态理解 AI 产品的机会、边界和落地路径。',
    items: [
      ['AI 原生产品', '围绕目标表达、过程可控和结果可编辑重构体验。'],
      ['Copilot', '把 AI 放进人的工作流，降低操作成本而不是替代用户。'],
      ['AI 知识库', '连接资料治理、权限、检索、引用和反馈闭环。'],
      ['AI 搜索', '从关键词结果升级到答案、来源和后续行动。'],
      ['智能客服', '结合意图识别、知识命中、追问、转人工和工单摘要。'],
      ['内容生成工具', '围绕模板、素材、品牌语气、审核和版本管理设计。'],
      ['数据分析助手', '从自然语言查数到异常解释、归因和报告生成。'],
      ['销售 Agent', '补全线索、生成画像、建议话术并写入 CRM。'],
      ['会议纪要助手', '从录音转写到行动项、负责人和跟进提醒。'],
      ['合同审查助手', '识别条款风险、引用依据并支持人工复核。'],
      ['AI 工作流平台', '用节点、审批和日志把 Demo 变成可交付流程。'],
      ['企业 AI 中台', '沉淀模型、Prompt、知识、工具和评估能力。']
    ]
  },
  {
    file: 'model-evaluation',
    title: '模型评估与质量',
    description: 'AI 产品上线前后都需要持续评估，质量管理是 PM 的核心工作之一。',
    items: [
      ['评估集', '覆盖高频、困难、边界和风险样例。'],
      ['人工评分', '定义准确性、完整性、格式、引用和可执行性标准。'],
      ['线上反馈', '将用户采纳、编辑、重试和差评沉淀为优化线索。'],
      ['A/B 测试', '比较不同模型、Prompt、检索策略和交互流程。'],
      ['回归测试', '每次 Prompt 或模型变更后检查核心样例。'],
      ['幻觉识别', '关注无依据回答、错误引用和过度自信表达。'],
      ['引用质量', '检查检索片段是否支持最终答案。'],
      ['延迟体验', '评估首字时间、总耗时和等待反馈。'],
      ['稳定性', '批量任务中看输出结构、结果波动和失败率。'],
      ['成本监控', '按任务类型追踪 token、模型和重试成本。'],
      ['安全评估', '覆盖敏感内容、越权访问和提示词注入。'],
      ['质量看板', '让业务、产品和研发看到同一套质量信号。']
    ]
  },
  {
    file: 'safety-and-compliance',
    title: '安全、合规与权限',
    description: '越靠近真实业务，AI 产品越需要把安全、合规和责任边界前置。',
    items: [
      ['数据权限', '不同角色只能访问被授权的知识和工具。'],
      ['内容安全', '识别敏感、违法、歧视、暴力和不适当输出。'],
      ['提示词注入', '防止用户绕过规则、诱导泄露系统提示或越权调用工具。'],
      ['审计日志', '记录输入、检索、工具调用、输出和人工确认。'],
      ['人工确认', '高风险动作必须由人确认后执行。'],
      ['可回滚设计', '自动写入、发送、删除等动作需要撤销机制。'],
      ['隐私保护', '最小化收集、脱敏处理和数据留存策略。'],
      ['企业合规', '关注法务、安全、采购和 IT 审批流程。'],
      ['模型供应商风险', '评估可用性、数据处理方式和 SLA。'],
      ['红队测试', '用攻击样例提前发现安全薄弱点。'],
      ['免责声明', '在医疗、法律、金融等高风险场景明确辅助定位。'],
      ['责任边界', '明确 AI、用户、业务负责人和系统管理员各自负责什么。']
    ]
  }
]

const practiceCases = [
  ['ai-knowledge-base', 'AI 知识库', '让员工基于企业资料进行可信问答、摘要和知识复用。'],
  ['customer-service-bot', '智能客服 Bot', '把 FAQ、追问、转人工和工单摘要串成闭环。'],
  ['ai-search', 'AI 搜索', '把搜索升级为答案、引用来源和下一步推荐。'],
  ['content-generation', '内容生成工具', '用模板、素材、审核和版本管理提升内容生产效率。'],
  ['agent-workflow', 'Agent 工作流', '让 AI 规划步骤、调用工具并在人类确认下执行任务。'],
  ['smart-report', '智能报表助手', '从指标查询、异常识别到复盘报告生成。'],
  ['sales-agent', '销售线索处理 Agent', '补全线索、生成客户画像和跟进话术。'],
  ['meeting-notes', '会议纪要助手', '从转写到摘要、行动项和跟进提醒。'],
  ['contract-review', '合同审查助手', '识别条款风险、给出依据和修改建议。'],
  ['data-analyst-copilot', '数据分析 Copilot', '帮助业务同学自然语言查数和解释波动。'],
  ['resume-coach', 'AI 简历优化助手', '围绕岗位要求优化项目表达和 STAR 结构。'],
  ['research-agent', '行业研究 Agent', '自动搜集资料、归纳观点并输出研究简报。'],
  ['training-assistant', '企业培训助手', '把课程资料转成测验、学习路径和答疑助手。'],
  ['ops-copilot', '运营 Copilot', '支持活动文案、用户分群和复盘分析。'],
  ['product-feedback-mining', '用户反馈挖掘', '从评论、工单和访谈中提取高频问题和需求机会。']
]

const roadmaps = [
  ['seven-day', '7 天入门路线', ['理解大模型、Prompt、RAG、Agent。', '补齐需求分析、PRD、指标体系。', '完成一个 AI 知识库方案草稿。', '准备 10 道高频面试题。']],
  ['thirty-day', '30 天体系化路线', ['第 1 周建立 AI 基础概念。', '第 2 周补产品基本功。', '第 3 周完成两个实战案例。', '第 4 周整理作品集和面试答案。']],
  ['tech-to-pm', '技术背景转型路线', ['把技术项目翻译成用户价值。', '练习非技术化表达模型能力。', '补齐用户研究和业务指标。', '准备项目复盘故事。']],
  ['non-tech-to-ai', '非技术背景转型路线', ['先学最小 AI 技术常识。', '用熟悉业务场景做 AI 流程设计。', '重点练习 Prompt、PRD 和验收标准。', '用案例作品补足可信度。']]
]

const questionCategories = [
  ['AI 概念题', ['大模型和传统 NLP 产品有什么差异？', 'RAG 适合解决什么问题？', 'Agent 和普通聊天助手有什么区别？', '什么是 Embedding？', 'Function Calling 对产品有什么价值？', 'MCP 为什么值得关注？', '多模态 AI 有哪些产品机会？', '上下文窗口会影响哪些体验？', '模型幻觉如何影响产品设计？', '为什么不能只靠 Prompt 解决质量问题？', '开源模型和闭源模型怎么选？', '模型路由适合什么场景？', 'AI 工作流和 Agent 有什么区别？', '向量数据库在知识库中做什么？', '如何理解 AI 原生产品？', 'Copilot 产品的关键体验是什么？', 'AI 搜索和传统搜索有什么不同？', '企业 AI 中台要沉淀什么能力？', '为什么 AI 产品要关注 token 成本？', '什么是检索召回和重排序？']],
  ['产品设计题', ['设计一个企业 AI 知识库。', '设计一个智能客服 Bot。', '设计一个 AI 搜索产品。', '设计一个销售线索处理 Agent。', '设计一个内容生成工具。', '设计一个智能报表助手。', '设计一个会议纪要助手。', '设计一个合同审查助手。', '设计一个简历优化助手。', '设计一个面向运营的 Copilot。', '如何让新用户知道 AI 助手能做什么？', '如何设计 AI 输出的反馈机制？', '如何设计 AI 产品的失败状态？', '如何设计人工确认流程？', '如何设计引用来源展示？', '如何设计 Prompt 模板库？', '如何设计知识库后台？', '如何设计 AI 产品的权限体系？', '如何设计多轮对话上下文？', '如何设计结果可编辑体验？']],
  ['业务分析题', ['如何判断一个场景适不适合 AI？', '如何向老板解释 AI 功能价值？', '如何计算 AI 产品 ROI？', 'B 端 AI 产品落地难点是什么？', '为什么 Demo 到上线很难？', '如何选择 AI MVP 范围？', '如何做 AI 产品竞品分析？', '如何分析 Perplexity 的产品价值？', '如何分析 Notion AI 的工作流嵌入？', '如何分析 Cursor 的 Copilot 体验？', '如何判断 AI 功能是噱头还是真需求？', '如何处理业务方对 AI 准确率的期待？', '如何推进企业客户试点？', '如何设定 AI 产品路线图？', '如何在成本和体验之间取舍？', '如何选择先做 C 端还是 B 端？', '如何定义 AI 产品的北极星指标？', '如何处理数据治理不足？', '如何让一线员工愿意使用 AI？', '如何复盘 AI 功能上线失败？']],
  ['数据指标题', ['AI 产品应该看哪些指标？', '如何定义答案采纳率？', '如何衡量 RAG 问答质量？', '如何设计 AI 功能埋点？', '如何评估 Agent 任务完成率？', '如何追踪单任务成本？', '如何分析用户重试行为？', '如何判断 AI 输出是否被用户信任？', '如何做模型 A/B 测试？', '如何构建评估集？', '如何处理人工评分不一致？', '如何看知识库未命中问题？', '如何监控敏感输出？', '如何衡量客服 Bot 自助解决率？', '如何衡量内容生成工具提效？', '如何衡量智能报表准确性？', '如何评估会议纪要质量？', '如何监控延迟体验？', '如何判断模型升级是否有效？', '如何建立 AI 质量看板？']],
  ['项目复盘题', ['讲一个你做过的 AI 项目。', '项目中最大的风险是什么？', '你如何推动研发和算法协作？', '如果用户不信任结果怎么办？', '上线后效果不好如何排查？', '你如何写 AI 产品 PRD？', '项目里如何做权限设计？', '如何处理错误答案投诉？', '如何做人工兜底？', '如何证明项目有业务价值？']],
  ['转型动机题', ['为什么想做 AI 产品经理？', '技术背景转 PM 的优势和短板是什么？', '非技术背景如何证明能做 AI PM？', '你最近研究了哪些 AI 产品？', '你如何持续学习 AI？', '你怎么看 AI 产品经理未来？', '你和算法工程师如何分工？', '你如何解释自己不懂底层算法？', '你期待做哪类 AI 产品？', '你如何准备作品集？']]
]

const sources = [
  ['牛客网', 'AI 产品经理/大模型产品经理面经、产品经理面试讨论', 'https://www.nowcoder.com/'],
  ['力扣讨论区', '产品、AI 应用和技术产品相关面试讨论', 'https://leetcode.cn/discuss/'],
  ['小红书', 'AI 产品经理转型经验、面试复盘、学习路线分享', 'https://www.xiaohongshu.com/'],
  ['知乎', 'AI 产品经理岗位、能力模型和面试经验问答', 'https://www.zhihu.com/'],
  ['掘金', 'AI 应用产品、Agent、RAG、Prompt 工程实践文章', 'https://juejin.cn/'],
  ['人人都是产品经理', 'AI 产品案例、产品设计和行业观察', 'https://www.woshipm.com/'],
  ['OpenAI Docs', '模型、工具调用、结构化输出和安全实践', 'https://platform.openai.com/docs'],
  ['VitePress', '文档站搭建、搜索、部署', 'https://vitepress.dev/']
]

function page(title, body) {
  return `# ${title}

${body}
`
}

write('index.md', `---
layout: home

hero:
  name: AI PM Guide
  text: AI 产品经理学习笔记
  tagline: 面向 AI 产品经理小白和转型人群的系统学习网站，覆盖概念学习、产品实战、学习路线、面试准备与资源推荐。
  image:
    src: /logo.svg
    alt: AI PM Guide
  actions:
    - theme: brand
      text: 开始阅读
      link: /concepts/
    - theme: alt
      text: 学习路线
      link: /roadmaps/

features:
  - title: 概念学习
    details: 从大模型、Prompt、RAG、Agent 到 PRD、指标、ROI，建立 AI PM 知识体系。
    link: /concepts/
  - title: 产品实战
    details: 拆解 AI 知识库、客服 Bot、AI 搜索、Agent 工作流等真实产品方案。
    link: /practice/
  - title: 面试指南
    details: 100 道高频题、面经高频考点、简历项目包装和岗位方向拆解。
    link: /interview/
---

## 核心入口

- **AI 产品经理入门**：[7 天入门路线](/roadmaps/seven-day)：先建立大模型、Prompt、RAG、Agent 和 AI 产品形态的最小框架。
- **AI 产品基础**：[概念学习](/concepts/)：系统整理 PM 能用上的 AI 技术常识和产品方法。
- **AI 产品实战**：[实战案例](/practice/)：把 AI 能力落到真实业务流程、指标和风险控制里。
- **面试突击**：[面试指南](/interview/)：用题库、考点和回答框架准备 AI PM 面试。
- **资源推荐**：[资料库](/resources/)：公开课、工具、报告、Newsletter 和产品案例。

::: info 学习分享声明
本站只做原创学习整理，不设置付费课、社群、会员、训练营或商业引流。
:::`)

write('about.md', page('关于本站', `AI PM Guide 是一个面向 AI 产品经理小白和转型人群的学习网站。

## 不做什么

- 不搬运平台面经原文。
- 不做付费课、社群、会员或训练营引流。
- 不做登录、收藏、评论等后端功能。

## 内容原则

- 只整理公开资料中的题型、考点、趋势和来源链接。
- 所有面经内容改写为原创题库、能力模型和准备建议。
- 每篇内容尽量回答：是什么、PM 为什么要懂、产品里怎么用、面试怎么问。`))

write('concepts/index.md', page('概念学习', `${conceptGroups.map((g) => `- [${g.title}](/concepts/${g.file})：${g.description}`).join('\n')}`))

for (const group of conceptGroups) {
  write(`concepts/${group.file}.md`, page(group.title, `${group.description}

## 知识点清单

| 知识点 | PM 要掌握的重点 | 面试可能怎么问 |
| --- | --- | --- |
${group.items.map(([name, desc]) => `| ${name} | ${desc} | ${name} 对 AI 产品设计有什么影响？ |`).join('\n')}

## 学习方法

1. 先用一句话解释概念，避免陷入纯技术细节。
2. 找一个真实产品场景，说明它如何改变用户流程。
3. 写出风险、指标和验收标准。

## 练习任务

选择 3 个知识点，各写一个「用户场景 + 产品方案 + 指标」的小卡片。`))
}

write('practice/index.md', page('实战案例', `${practiceCases.map(([id, title, desc]) => `- [${title}](/practice/${id})：${desc}`).join('\n')}`))

for (const [id, title, desc] of practiceCases) {
  write(`practice/${id}.md`, page(title, `${desc}

## 背景

这个案例适合训练 AI 产品经理从业务场景出发，而不是从模型能力出发。

## 用户与痛点

- **目标用户**：业务人员、运营人员、客服/销售/管理者或内部知识工作者。
- **核心痛点**：信息分散、重复劳动、判断成本高、输出质量不稳定。
- **AI 机会**：用检索、生成、工具调用或工作流降低任务完成成本。

## 产品方案

1. 明确输入：用户提供什么材料、系统能读取哪些数据。
2. 明确处理：模型、检索、规则和人工确认分别负责什么。
3. 明确输出：答案、摘要、报告、建议、工单或结构化结果。
4. 明确兜底：失败提示、人工接管、重试和日志。

## 指标

- 使用：触发率、完成率、留存。
- 质量：采纳率、人工修改率、差评率。
- 效率：节省时间、自动处理比例。
- 风险：错误率、越权访问、敏感输出。

## 可写进简历

设计「${title}」方案，围绕用户任务拆解 AI 输入、处理、输出、评估和风险兜底，形成可落地的产品闭环。`))
}

write('roadmaps/index.md', page('学习路线', `${roadmaps.map(([id, title]) => `- [${title}](/roadmaps/${id})`).join('\n')}`))
for (const [id, title, steps] of roadmaps) {
  write(`roadmaps/${id}.md`, page(title, `## 适合谁

想系统学习 AI 产品经理能力的人。

## 阶段安排

${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## 阶段产出

- 一份 AI 产品学习地图。
- 一份项目方案或 PRD 草稿。
- 一组面试题回答框架。
- 一份可放进简历的项目表达。`))
}

write('interview/index.md', page('面试指南', `- [100 道高频题](/interview/questions)
- [近期面经高频考点](/interview/experience-summary)
- [简历项目包装](/interview/resume-projects)
- [岗位方向拆解](/interview/roles)`))

write('interview/questions.md', page('100 道 AI 产品经理高频题', `${questionCategories.map(([cat, qs]) => `## ${cat}

| 题目 | 考察点 | 回答框架 |
| --- | --- | --- |
${qs.map((q) => `| ${q} | ${cat.replace('题', '')} | 先定义问题，再结合场景、方案、指标和风险回答。 |`).join('\n')}`).join('\n\n')}`))

write('interview/experience-summary.md', page('近期面经高频考点归纳', `> 本页不搬运任何平台原帖，只整理公开面经中反复出现的题型和准备方向。

## 高频考点

1. **AI 基础概念**：RAG、Agent、Prompt、Embedding、Function Calling。
2. **产品设计题**：知识库、智能客服、AI 搜索、内容生成、Agent 工作流。
3. **项目复盘题**：如何定义指标、如何处理不准确、如何做权限和兜底。
4. **业务判断题**：如何判断 AI 场景价值、如何证明 ROI、如何推进 B 端落地。
5. **转型表达题**：技术/运营/传统产品如何证明自己能做 AI PM。

## 准备建议

- 每类题准备 1 个标准案例。
- 回答里一定包含「用户、场景、方案、指标、风险」。
- 不要背概念，要能解释它如何影响产品设计。

## 参考来源

见 [面经来源与整理规则](/sources/interview-sources)。`))

write('interview/resume-projects.md', page('简历项目包装', `## 推荐结构

使用「背景 - 用户 - 痛点 - 方案 - 指标 - 风险 - 个人贡献」讲 AI 项目。

## 示例表达

负责 AI 知识库助手产品方案设计，围绕企业内部资料检索和可信问答场景，设计文档解析、权限隔离、RAG 问答、引用溯源、用户反馈和后台运营机制，核心指标包括问题命中率、答案采纳率和未命中问题闭环率。

## 常见错误

- 只写“接入大模型”。
- 只展示页面，不讲业务结果。
- 只讲技术方案，不讲用户和指标。`))

write('interview/roles.md', page('岗位方向拆解', `| 岗位方向 | 常见业务 | 重点能力 |
| --- | --- | --- |
| AI 应用产品经理 | AI 助手、内容生成、搜索、办公自动化 | 场景判断、体验设计、指标体系 |
| 大模型产品经理 | 模型平台、API、评测、工具调用 | 技术理解、开发者体验、模型评估 |
| B 端 AI 产品经理 | 知识库、客服、销售、法务、人效 | 流程、权限、交付、ROI |
| Agent 产品经理 | 工作流、工具调用、自动执行 | 任务拆解、状态管理、风险控制 |
| 数据/算法产品经理 | 推荐、画像、风控、分析助手 | 数据口径、策略评估、实验设计 |`))

write('resources/index.md', page('资源推荐', `- [公开课与文档](/resources/courses-docs)
- [工具与产品案例](/resources/tools-products)
- [报告与 Newsletter](/resources/reports-newsletters)

## 原则

优先收录免费或有免费内容的资料；商业产品仅作为案例研究，不做引流。`))

write('resources/courses-docs.md', page('公开课与文档', `| 资源 | 类型 | 推荐理由 |
| --- | --- | --- |
| OpenAI Docs | 官方文档 | 理解模型、工具调用、结构化输出和安全实践。 |
| Anthropic Docs | 官方文档 | 学习提示词、安全和 Claude 产品能力。 |
| DeepLearning.AI | 公开课 | 系统学习生成式 AI 和应用开发基础。 |
| Prompting Guide | 学习资料 | 快速建立 Prompt 基础框架。 |
| VitePress Docs | 建站文档 | 维护本站的文档站能力。 |`))

write('resources/tools-products.md', page('工具与产品案例', `| 产品 | 观察重点 |
| --- | --- |
| ChatGPT | 通用 AI 助手的任务入口和生态。 |
| Claude | 长文本、项目和写作体验。 |
| Perplexity | AI 搜索、引用和追问体验。 |
| Notion AI | AI 嵌入文档工作流。 |
| Cursor | 开发者 Copilot 与 Agent 工作流。 |
| Zapier AI | 自动化和 AI 工作流结合。 |`))

write('resources/reports-newsletters.md', page('报告与 Newsletter', `| 资源 | 推荐理由 |
| --- | --- |
| a16z AI | 观察 AI 应用和商业化趋势。 |
| McKinsey AI Insights | 理解企业 AI 落地和行业影响。 |
| The Batch | 跟踪 AI 行业与研究动态。 |
| Lenny's Newsletter | 补充产品增长和 PM 方法论。 |
| 人人都是产品经理 | 观察中文产品案例和 AI 产品讨论。 |`))

write('sources/index.md', page('来源索引', `${sources.map(([name, desc, url]) => `- [${name}](${url})：${desc}`).join('\n')}`))

write('sources/interview-sources.md', page('面经来源与整理规则', `## 来源范围

${sources.slice(0, 6).map(([name, desc, url]) => `- [${name}](${url})：${desc}`).join('\n')}

## 整理规则

1. 不复制原帖正文。
2. 只提炼题型、考点、能力要求和准备建议。
3. 面试题统一改写为原创题干和回答框架。
4. 保留平台级来源链接，便于读者自行检索。
5. 对无法核验的个案经验，不作为事实结论。`))

console.log('Generated VitePress docs content.')

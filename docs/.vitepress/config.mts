import { defineConfig } from 'vitepress'

const titleMap: Record<string, string> = {
  'ai-tech': 'AI 技术基础总览',
  'product-basics': '产品经理基本功',
  'ai-product-topics': 'AI 产品专题',
  'model-evaluation': '模型评估与质量',
  'safety-and-compliance': '安全、合规与权限',
  'ai-knowledge-base': 'AI 知识库',
  'customer-service-bot': '智能客服 Bot',
  'ai-search': 'AI 搜索',
  'content-generation': '内容生成工具',
  'agent-workflow': 'Agent 工作流'
}

const concepts = [
  'product-basics',
  'ai-product-topics',
  'model-evaluation',
  'safety-and-compliance'
]

const aiTechGroups = [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: '基础导读', link: '/concepts/ai-tech/foundations/' },
      { text: 'Linux 常见基础知识', link: '/concepts/ai-tech/foundations/linux-basics' },
      { text: 'Python Numpy 入门', link: '/concepts/ai-tech/foundations/python-numpy' },
      { text: 'PyTorch 快速入门', link: '/concepts/ai-tech/frameworks/pytorch-quickstart' },
      { text: 'Git 基础知识', link: '/concepts/ai-tech/foundations/git-basics' },
      {
        text: 'Python',
        link: '/concepts/ai-tech/foundations/python-basics',
        collapsed: false,
        items: [
          { text: 'Python 速记表', link: '/concepts/ai-tech/foundations/python-memento' },
          { text: 'Python 速查表', link: '/concepts/ai-tech/foundations/python-cheatsheet' },
          { text: '初学者的 Python 备忘表', link: '/concepts/ai-tech/foundations/python-beginner-cheatsheet' }
        ]
      },
      { text: 'Python 爬虫教程：从入门到实战', link: '/concepts/ai-tech/foundations/python-crawler' },
      { text: 'Python 快速上手爬虫的 7 大技巧', link: '/concepts/ai-tech/foundations/python-crawler-tips' },
      { text: 'Python 爬虫之网页字符编码处理', link: '/concepts/ai-tech/foundations/python-crawler-encoding' },
      { text: 'Python 爬虫 | 任务调度之 Celery', link: '/concepts/ai-tech/foundations/python-crawler-celery' },
      { text: 'Python 爬虫实例', link: '/concepts/ai-tech/foundations/python-crawler-examples' }
    ]
  },
  {
    text: '机器学习',
    collapsed: true,
    items: [
      { text: '机器学习教程', link: '/concepts/ai-tech/ml/' },
      { text: '机器学习简介', link: '/concepts/ai-tech/ml/overview' },
      { text: 'Python 入门机器学习', link: '/concepts/ai-tech/ml/python-machine-learning' },
      { text: '机器学习进阶', link: '/concepts/ai-tech/ml/ml-advanced' },
      { text: '机器学习十大算法', link: '/concepts/ai-tech/ml/classic-algorithms' },
      { text: '概率和统计', link: '/concepts/ai-tech/ml/probability-statistics' },
      { text: '机器学习技巧和秘诀', link: '/concepts/ai-tech/ml/ml-tips-secrets' },
      { text: '监督学习', link: '/concepts/ai-tech/ml/supervised-learning' },
      { text: '无监督学习', link: '/concepts/ai-tech/ml/unsupervised-learning' },
      { text: '线性代数和微积分', link: '/concepts/ai-tech/ml/linear-algebra-calculus' }
    ]
  },
  {
    text: 'NLP 教程',
    collapsed: true,
    items: [
      { text: '第一章 基础概念', link: '/concepts/ai-tech/nlp/' },
      { text: '1.1 文本预处理', link: '/concepts/ai-tech/nlp/text-preprocessing' },
      { text: '1.2 文本表示方法', link: '/concepts/ai-tech/nlp/text-representation' },
      { text: '1.3 文本分类', link: '/concepts/ai-tech/nlp/text-classification' },
      { text: '1.4 语言学基础', link: '/concepts/ai-tech/nlp/linguistics-basics' },
      { text: '第二章 信息抽取与语义任务', link: '/concepts/ai-tech/nlp/information-extraction-semantics' },
      { text: '2.1 情感分析', link: '/concepts/ai-tech/nlp/sentiment-analysis' },
      { text: '2.2 命名实体识别（NER）', link: '/concepts/ai-tech/nlp/named-entity-recognition' },
      { text: '2.3 关系抽取', link: '/concepts/ai-tech/nlp/relation-extraction' },
      { text: '2.4 NLP 文本相似度计算', link: '/concepts/ai-tech/nlp/semantic-similarity' },
      { text: '第三章 深度 NLP 模型', link: '/concepts/ai-tech/nlp/deep-nlp-models' },
      { text: '3.1 循环神经网络（RNN）', link: '/concepts/ai-tech/nlp/rnn' },
      { text: '3.2 注意力机制', link: '/concepts/ai-tech/nlp/attention' },
      { text: '3.3 Transformer 架构', link: '/concepts/ai-tech/nlp/transformer' },
      { text: '3.4 序列到序列模型', link: '/concepts/ai-tech/nlp/seq2seq' }
    ]
  },
  {
    text: 'Deploy 知识库共建',
    collapsed: true,
    items: [
      { text: 'CH1 模型部署基础', link: '/concepts/ai-tech/deployment/model-deployment-basics' },
      { text: 'CH2 大模型架构详解', link: '/concepts/ai-tech/deployment/llm-architecture' },
      { text: 'CH3 大模型部署框架解析', link: '/concepts/ai-tech/deployment/deployment-frameworks' },
      { text: 'CH4 简单的 CUDA', link: '/concepts/ai-tech/deployment/cuda-basics' },
      { text: 'CH5 用 CUDA 和 Triton 写大模型', link: '/concepts/ai-tech/deployment/cuda-triton-llm' },
      { text: 'CH6 大模型量化', link: '/concepts/ai-tech/deployment/quantization' },
      { text: 'CH7 底层加速', link: '/concepts/ai-tech/deployment/inference-acceleration' },
      { text: 'CH8 系统层面加速', link: '/concepts/ai-tech/deployment/system-acceleration' }
    ]
  },
  {
    text: 'LLM101n-CN（共建中）',
    collapsed: true,
    items: [
      { text: 'ngram Readme 翻译', link: '/concepts/ai-tech/deep-learning/ngram-readme' },
      { text: 'ngram Python 核心代码', link: '/concepts/ai-tech/deep-learning/ngram-python-core' },
      { text: 'ngram C 核心代码解读', link: '/concepts/ai-tech/deep-learning/ngram-c-core' },
      { text: 'MLP Readme 翻译', link: '/concepts/ai-tech/deep-learning/mlp-readme' },
      { text: 'micrograd Readme 翻译', link: '/concepts/ai-tech/deep-learning/micrograd-readme' },
      { text: 'Micrograd Python 核心代码', link: '/concepts/ai-tech/deep-learning/micrograd-python-core' },
      { text: 'MLP Python 核心代码', link: '/concepts/ai-tech/deep-learning/mlp-python-core' },
      { text: 'Tensor 与自动微分', link: '/concepts/ai-tech/deep-learning/tensor-autograd' }
    ]
  },
  {
    text: 'PyTorch 教程',
    collapsed: true,
    items: [
      { text: 'PyTorch 基础', link: '/concepts/ai-tech/frameworks/pytorch-basics' },
      { text: 'PyTorch 张量（Tensor）', link: '/concepts/ai-tech/frameworks/pytorch-tensor' },
      { text: 'PyTorch 神经网络基础', link: '/concepts/ai-tech/frameworks/pytorch-neural-network' },
      { text: 'PyTorch 数据处理与加载', link: '/concepts/ai-tech/frameworks/pytorch-data-loading' },
      { text: 'PyTorch 线性回归', link: '/concepts/ai-tech/frameworks/pytorch-linear-regression' },
      { text: 'PyTorch 卷积神经网络', link: '/concepts/ai-tech/frameworks/pytorch-cnn' },
      { text: 'PyTorch 循环神经网络', link: '/concepts/ai-tech/frameworks/pytorch-rnn' },
      { text: 'PyTorch 数据转换', link: '/concepts/ai-tech/frameworks/pytorch-data-transforms' },
      { text: 'Transformer 模型', link: '/concepts/ai-tech/frameworks/transformer-model' },
      { text: 'PyTorch 构建 Transformer 模型', link: '/concepts/ai-tech/frameworks/pytorch-transformer' },
      { text: 'PyTorch 模型部署', link: '/concepts/ai-tech/frameworks/pytorch-model-deployment' }
    ]
  },
  {
    text: 'TensorFlow 教程',
    collapsed: true,
    items: [
      { text: 'TensorFlow 简介', link: '/concepts/ai-tech/frameworks/tensorflow-basics' },
      { text: 'TensorFlow 核心概念', link: '/concepts/ai-tech/frameworks/tensorflow-core-concepts' },
      { text: 'TensorFlow 环境搭建', link: '/concepts/ai-tech/frameworks/tensorflow-environment' },
      { text: 'TensorFlow 张量操作', link: '/concepts/ai-tech/frameworks/tensorflow-tensor-ops' },
      { text: 'TensorFlow 高级 API - Keras', link: '/concepts/ai-tech/frameworks/keras-api' },
      { text: 'Keras 第一个神经网络', link: '/concepts/ai-tech/frameworks/keras-first-network' },
      { text: 'Keras 常用层类型', link: '/concepts/ai-tech/frameworks/keras-common-layers' },
      { text: 'TensorFlow 数据处理与管道', link: '/concepts/ai-tech/frameworks/tensorflow-data-pipeline' },
      { text: 'TensorFlow tf.data API', link: '/concepts/ai-tech/frameworks/tensorflow-tfdata-api' },
      { text: 'TensorFlow 图像数据处理', link: '/concepts/ai-tech/frameworks/tensorflow-image-data' },
      { text: 'TensorFlow 文本数据处理', link: '/concepts/ai-tech/frameworks/tensorflow-text-data' },
      { text: 'TensorFlow 模型训练', link: '/concepts/ai-tech/frameworks/tensorflow-model-training' },
      { text: 'TensorFlow 模型评估与监控', link: '/concepts/ai-tech/frameworks/tensorflow-evaluation-monitoring' }
    ]
  },
  {
    text: '吴恩达 机器学习笔记',
    collapsed: true,
    items: [
      { text: '监督学习', link: '/concepts/ai-tech/ml/andrew-supervised-learning' },
      { text: '无监督学习', link: '/concepts/ai-tech/ml/andrew-unsupervised-learning' },
      { text: '推荐系统', link: '/concepts/ai-tech/ml/andrew-recommender-systems' },
      { text: '强化学习', link: '/concepts/ai-tech/ml/andrew-reinforcement-learning' },
      { text: '机器学习技巧和秘诀', link: '/concepts/ai-tech/ml/andrew-ml-tips-secrets' }
    ]
  },
  {
    text: '吴恩达 DeepLearning.AI 课程系列',
    collapsed: true,
    items: [
      { text: '大语言模型预训练', link: '/concepts/ai-tech/deep-learning/llm-pretraining' },
      { text: '大语言模型微调', link: '/concepts/ai-tech/deep-learning/llm-finetuning' },
      { text: '提示词工程', link: '/concepts/ai-tech/deep-learning/prompt-engineering' },
      { text: '神经网络和深度学习', link: '/concepts/ai-tech/deep-learning/neural-networks' },
      { text: '改善深层神经网络', link: '/concepts/ai-tech/deep-learning/improving-deep-neural-networks' },
      { text: '搭建机器学习项目', link: '/concepts/ai-tech/deep-learning/structuring-ml-projects' },
      { text: '卷积神经网络', link: '/concepts/ai-tech/deep-learning/convolutional-neural-networks-course' },
      { text: '循环序列模型', link: '/concepts/ai-tech/deep-learning/sequence-models-course' }
    ]
  },
  {
    text: '大模型应用工程',
    collapsed: true,
    items: [
      { text: '大语言模型基础', link: '/concepts/ai-tech/llm-rag-agent/llm-basics' },
      { text: 'RAG 与知识库', link: '/concepts/ai-tech/llm-rag-agent/rag-knowledge-base' },
      { text: '对话式 AI', link: '/concepts/ai-tech/llm-rag-agent/conversational-ai' },
      { text: '工具调用与工作流', link: '/concepts/ai-tech/llm-rag-agent/tool-calling-workflow' },
      { text: 'Agent、MCP 与多智能体', link: '/concepts/ai-tech/llm-rag-agent/agent-mcp' },
      { text: '多模态与上传图片', link: '/concepts/ai-tech/llm-rag-agent/multimodal-upload' },
      { text: '评测、监控与可观测性', link: '/concepts/ai-tech/eval-governance/evals-observability' },
      { text: 'AI 工程指标与监控看板', link: '/concepts/ai-tech/eval-governance/ai-engineering-metrics' },
      { text: '成本、性能与部署决策', link: '/concepts/ai-tech/eval-governance/cost-performance' },
      { text: '安全、隐私与治理', link: '/concepts/ai-tech/eval-governance/security-governance' }
    ]
  }
]

const practice = [
  'ai-knowledge-base',
  'customer-service-bot',
  'ai-search',
  'content-generation',
  'agent-workflow'
]

export default defineConfig({
  title: 'AI PM Guide',
  description: 'AI 产品经理学习笔记库：概念学习、产品实战、学习路线、面试准备与资源推荐。',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#2f6feb' }],
    ['meta', { property: 'og:title', content: 'AI PM Guide' }],
    ['meta', { property: 'og:description', content: '面向 AI 产品经理小白和转型人群的学习笔记库。' }]
  ],
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo.svg' },
    siteTitle: 'AI PM Guide',
    nav: [
      { text: '概念学习', link: '/concepts/' },
      { text: '实战案例', link: '/practice/' },
      { text: '面试指南', link: '/interview/' },
      { text: '学习路线', link: '/roadmaps/' },
      { text: '推荐阅读', link: '/resources/' },
      { text: '网站相关', link: '/about' }
    ],
    sidebar: {
      '/concepts/': [
        { text: '概念学习', link: '/concepts/' },
        {
          text: 'AI 技术基础',
          collapsed: false,
          items: [
            { text: titleMap['ai-tech'], link: '/concepts/ai-tech/' },
            ...aiTechGroups
          ]
        },
        {
          text: '产品与专题',
          collapsed: true,
          items: concepts.map((id) => ({ text: titleMap[id], link: `/concepts/${id}` }))
        }
      ],
      '/practice/': [
        { text: '实战案例', link: '/practice/' },
        { text: '案例拆解', items: practice.map((id) => ({ text: titleMap[id], link: `/practice/${id}` })) }
      ],
      '/roadmaps/': [
        { text: '学习路线', link: '/roadmaps/' },
        { text: '路线', items: [
          { text: '7 天入门路线', link: '/roadmaps/seven-day' },
          { text: '30 天体系化路线', link: '/roadmaps/thirty-day' },
          { text: '技术背景转型路线', link: '/roadmaps/tech-to-pm' },
          { text: '非技术背景转型路线', link: '/roadmaps/non-tech-to-ai' }
        ] }
      ],
      '/interview/': [
        { text: '面试指南', link: '/interview/' },
        { text: '题库与面经', items: [
          { text: '100 道高频题', link: '/interview/questions' },
          { text: '近期面经高频考点', link: '/interview/experience-summary' },
          { text: '简历项目包装', link: '/interview/resume-projects' },
          { text: '岗位方向拆解', link: '/interview/roles' }
        ] }
      ],
      '/resources/': [
        { text: '资源推荐', link: '/resources/' },
        { text: '资料', items: [
          { text: '公开课与文档', link: '/resources/courses-docs' },
          { text: '专业书籍', link: '/resources/professional-books' },
          { text: '工具与产品案例', link: '/resources/tools-products' },
          { text: '报告与 Newsletter', link: '/resources/reports-newsletters' }
        ] }
      ],
      '/sources/': [
        { text: '来源索引', link: '/sources/' },
        { text: '采集说明', items: [
          { text: '面经来源与整理规则', link: '/sources/interview-sources' }
        ] }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/STRUGGLE1999/ai-pm-guide' }
    ],
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    lastUpdated: {
      text: '最后更新'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    editLink: {
      pattern: 'https://github.com/STRUGGLE1999/ai-pm-guide/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    footer: {
      message: '学习分享型 AI 产品经理知识库，不做付费课、社群、会员或商业引流。',
      copyright: 'Copyright © 2026 AI PM Guide'
    }
  }
})

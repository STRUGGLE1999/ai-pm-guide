import { defineConfig } from 'vitepress'

const titleMap: Record<string, string> = {
  'ai-tech': 'AI 技术基础总览',
  'product-methodology': '产品经理核心方法论',
  'product-foundations': '产品基础知识',
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
  'product-foundations',
  'product-basics',
  'ai-product-topics',
  'model-evaluation',
  'safety-and-compliance'
]

const productMethodology = [
  { text: '课程总览', link: '/concepts/product-methodology/' },
  { text: '第一章 需求洞察与竞品分析', link: '/concepts/product-methodology/01-demand-and-competition' },
  { text: '第二章 行业分析与进入时机', link: '/concepts/product-methodology/02-industry-analysis' },
  { text: '第三章 产品拆解与项目管理', link: '/concepts/product-methodology/03-product-and-project' },
  { text: '第四章 数据埋点与指标体系', link: '/concepts/product-methodology/04-data-and-metrics' },
  { text: '第五章 商业模式与效率提升', link: '/concepts/product-methodology/05-business-model' },
  { text: '第六章 汇报沟通与情绪管理', link: '/concepts/product-methodology/06-communication' },
  { text: '第七章 产品高手的长期修养', link: '/concepts/product-methodology/07-professional-growth' }
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
        collapsed: false,
        items: [
          { text: 'Python 基础', link: '/concepts/ai-tech/foundations/python-basics' },
          { text: 'Python 速记表', link: '/concepts/ai-tech/foundations/python-memento' },
          { text: 'Python 速查表', link: '/concepts/ai-tech/foundations/python-cheatsheet' },
          { text: '初学者的 Python 备忘表', link: '/concepts/ai-tech/foundations/python-beginner-cheatsheet' }
        ]
      },
      {
        text: 'Python爬虫教程',
        collapsed: false,
        items: [
          { text: 'Python爬虫教程：从入门到实战', link: '/concepts/ai-tech/foundations/python-crawler' },
          { text: 'Python快速上手爬虫的7大技巧', link: '/concepts/ai-tech/foundations/python-crawler-tips' },
          { text: 'Python爬虫之网页字符编码处理', link: '/concepts/ai-tech/foundations/python-crawler-encoding' },
          { text: 'Python 爬虫 | 任务调度之 Celery', link: '/concepts/ai-tech/foundations/python-crawler-celery' },
          { text: 'Python爬虫实例', link: '/concepts/ai-tech/foundations/python-crawler-examples' }
        ]
      }
    ]
  },
  {
    text: '机器学习',
    collapsed: true,
    items: [
      { text: '机器学习教程', link: '/concepts/ai-tech/ml/' },
      {
        text: '🤖 机器学习简介',
        collapsed: false,
        items: [
          { text: '🤖 机器学习如何工作', link: '/concepts/ai-tech/ml/how-machine-learning-works' },
          { text: '🤖 机器学习基础概念', link: '/concepts/ai-tech/ml/basic-concepts' }
        ]
      },
      { text: 'Python 入门机器学习', link: '/concepts/ai-tech/ml/python-machine-learning' },
      { text: '机器学习进阶', link: '/concepts/ai-tech/ml/ml-advanced' },
      {
        text: '🤖 机器学习十大算法',
        collapsed: false,
        items: [
          { text: '🤖 K 近邻算法', link: '/concepts/ai-tech/ml/knn' },
          { text: '🤖 线性回归（Linear Regression）', link: '/concepts/ai-tech/ml/linear-regression' },
          { text: '🤖 逻辑回归（Logistic Regression）', link: '/concepts/ai-tech/ml/logistic-regression' },
          { text: '🤖 决策树（Decision Tree）', link: '/concepts/ai-tech/ml/decision-tree' },
          { text: '🤖 支持向量机', link: '/concepts/ai-tech/ml/support-vector-machine' },
          { text: '🤖 随机森林分类模型详解', link: '/concepts/ai-tech/ml/random-forest' },
          { text: '🤖 朴素贝叶斯', link: '/concepts/ai-tech/ml/naive-bayes' },
          { text: '🤖 K-means【机器学习】', link: '/concepts/ai-tech/ml/k-means' },
          { text: '🤖 主成分分析（PCA）', link: '/concepts/ai-tech/ml/pca' },
          { text: '🤖 XGBoost模型详解', link: '/concepts/ai-tech/ml/xgboost' }
        ]
      },
      {
        text: '机器学习实践与延伸',
        collapsed: false,
        items: [
          { text: '从训练到调优：可复用工作流', link: '/concepts/ai-tech/ml/workflow' },
          { text: '模型部署、预测与反馈循环', link: '/concepts/ai-tech/ml/deployment-feedback' },
          { text: '常见误区与排错清单', link: '/concepts/ai-tech/ml/pitfalls' },
          { text: '初学者实践路线', link: '/concepts/ai-tech/ml/beginner-roadmap' },
          { text: '结语与延伸学习', link: '/concepts/ai-tech/ml/conclusion-resources' }
        ]
      }
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
      { text: '第二章 NLP 常见任务', link: '/concepts/ai-tech/nlp/common-tasks' },
      { text: '2.1 情感分析', link: '/concepts/ai-tech/nlp/sentiment-analysis' },
      { text: '2.2 命名实体识别（NER）', link: '/concepts/ai-tech/nlp/named-entity-recognition' },
      { text: '2.3 关系抽取', link: '/concepts/ai-tech/nlp/relation-extraction' },
      { text: '2.4 NLP 文本相似度计算', link: '/concepts/ai-tech/nlp/semantic-similarity' },
      { text: '第三章 NLP 的神经网络基础', link: '/concepts/ai-tech/nlp/neural-network-basics' },
      { text: '3.1 循环神经网络（RNN）', link: '/concepts/ai-tech/nlp/rnn' },
      { text: '3.2 注意力机制', link: '/concepts/ai-tech/nlp/attention' },
      { text: '3.3 Transformer 架构', link: '/concepts/ai-tech/nlp/transformer' },
      { text: '3.4 序列到序列模型', link: '/concepts/ai-tech/nlp/seq2seq' },
      { text: '第四章 预训练模型与 Python NLP 生态', link: '/concepts/ai-tech/nlp/pretraining-python-ecosystem' },
      { text: '4.1 预训练模型', link: '/concepts/ai-tech/nlp/pretrained-models' },
      { text: '4.2 BERT 系列模型', link: '/concepts/ai-tech/nlp/bert-models' },
      { text: '4.3 生成式预训练模型', link: '/concepts/ai-tech/nlp/generative-pretrained-models' },
      { text: '4.4 多模态预训练模型', link: '/concepts/ai-tech/nlp/multimodal-pretrained-models' },
      { text: '4.5 Python NLP 生态', link: '/concepts/ai-tech/nlp/python-nlp-ecosystem' }
    ]
  },
  {
    text: 'CV 教程',
    collapsed: true,
    items: [
      { text: '计算机视觉教程总览', link: '/concepts/ai-tech/cv/' },
      { text: '第一章 计算机视觉全景与图像基础', link: '/concepts/ai-tech/cv/01-image-foundations' },
      { text: '第二章 OpenCV 与经典图像处理', link: '/concepts/ai-tech/cv/02-opencv-classic-processing' },
      { text: '第三章 机器学习、神经网络与 PyTorch 基础', link: '/concepts/ai-tech/cv/03-ml-neural-pytorch' },
      { text: '第四章 CNN 与图像分类', link: '/concepts/ai-tech/cv/04-cnn-classification' },
      { text: '第五章 目标检测', link: '/concepts/ai-tech/cv/05-object-detection' },
      { text: '第六章 图像分割', link: '/concepts/ai-tech/cv/06-image-segmentation' },
      { text: '第七章 关键点、姿态、OCR 与人脸分析', link: '/concepts/ai-tech/cv/07-keypoints-ocr-face' },
      { text: '第八章 视频理解与多目标跟踪', link: '/concepts/ai-tech/cv/08-video-tracking' },
      { text: '第九章 多视图几何、深度、三维视觉与 SLAM', link: '/concepts/ai-tech/cv/09-3d-vision-slam' },
      { text: '第十章 Vision Transformer、自监督学习与视觉基础模型', link: '/concepts/ai-tech/cv/10-vision-transformer-foundation-models' },
      { text: '第十一章 生成式视觉：VAE、GAN 与扩散模型', link: '/concepts/ai-tech/cv/11-generative-vision' },
      { text: '第十二章 数据集、标注、增强与数据治理', link: '/concepts/ai-tech/cv/12-data-governance' },
      { text: '第十三章 训练、评估、错误分析与模型优化', link: '/concepts/ai-tech/cv/13-training-evaluation-optimization' },
      { text: '第十四章 部署、加速、监控与生产工程', link: '/concepts/ai-tech/cv/14-deployment-production' },
      { text: '第十五章 三个端到端实践项目', link: '/concepts/ai-tech/cv/15-end-to-end-projects' },
      { text: '第十六章 行业落地、选型方法与学习路线', link: '/concepts/ai-tech/cv/16-industry-roadmap' },
      { text: '附录 A 常用公式与指标速查', link: '/concepts/ai-tech/cv/appendix-a-formulas-metrics' },
      { text: '附录 B 常见数据集与工具速查', link: '/concepts/ai-tech/cv/appendix-b-datasets-tools' },
      { text: '参考资料与经典论文', link: '/concepts/ai-tech/cv/references' }
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
          items: [
            {
              text: titleMap['product-methodology'],
              collapsed: false,
              items: productMethodology
            },
            ...concepts.map((id) => ({ text: titleMap[id], link: `/concepts/${id}` }))
          ]
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
  },
  markdown: {
    config(md) {
      const defaultFence =
        md.renderer.rules.fence ||
        ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const language = token.info.trim().split(/\s+/)[0]

        if (language === 'mermaid') {
          return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>`
        }

        return defaultFence(tokens, idx, options, env, self)
      }
    }
  }
})

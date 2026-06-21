import { defineConfig } from 'vitepress'

const titleMap: Record<string, string> = {
  'ai-basics': 'AI 基础知识图谱',
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
  'ai-basics',
  'product-basics',
  'ai-product-topics',
  'model-evaluation',
  'safety-and-compliance'
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
        { text: 'AI 基础', items: concepts.map((id) => ({ text: titleMap[id], link: `/concepts/${id}` })) }
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

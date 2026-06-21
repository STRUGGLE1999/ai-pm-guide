# AI PM Guide

面向 **AI 产品经理小白** 和 **想转型 AI 产品经理的人** 的系统学习网站。

- GitHub 仓库：[STRUGGLE1999/ai-pm-guide](https://github.com/STRUGGLE1999/ai-pm-guide)
- GitHub Pages：[https://struggle1999.github.io/ai-pm-guide/](https://struggle1999.github.io/ai-pm-guide/)
- Netlify：部署完成后补充正式地址

## 核心入口

- **概念学习**：大模型、Prompt、RAG、Agent、多模态、MCP、模型评估、安全合规，以及 PRD、指标、ROI 等产品基本功。
- **产品实战**：AI 知识库、智能客服、AI 搜索、内容生成、智能报表、销售 Agent、会议纪要、合同审查等案例。
- **学习路线**：7 天入门、30 天体系化、技术背景转型、非技术背景转型。
- **面试指南**：100 道 AI 产品经理高频题、近期面经高频考点、简历项目包装和岗位方向拆解。
- **资源推荐**：公开课、工具、产品案例、报告和 Newsletter。

## 内容原则

本站只做学习分享，不设置付费课、社群、会员、训练营或加微信引流。

面经和资料采用原创整理方式：

1. 搜索公开资料、岗位要求和面经讨论。
2. 只提炼题型、考点、能力模型和趋势。
3. 不搬运牛客、小红书、力扣、知乎等平台原帖全文。
4. 页面中保留来源入口，方便读者自行核验。

## 技术栈

- [VitePress](https://vitepress.dev/)：文档站框架
- Markdown：内容管理
- 本地全文搜索：VitePress default theme local search
- Netlify：静态站部署

## 本地开发

```bash
npm install
npm run content:generate
npm run docs:dev
```

本地预览：

```bash
npm run docs:preview
```

构建：

```bash
npm run docs:build
```

## Netlify 部署配置

`netlify.toml` 已配置：

```toml
[build]
  command = "npm run docs:build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "20"
```

## 文件结构

```text
.
├── docs/                    # VitePress 文档内容
│   ├── .vitepress/          # VitePress 配置和主题样式
│   ├── concepts/            # 概念学习
│   ├── practice/            # 产品实战
│   ├── roadmaps/            # 学习路线
│   ├── interview/           # 面试指南
│   ├── resources/           # 资源推荐
│   └── sources/             # 来源索引
├── scripts/generate-content.mjs
├── netlify.toml
├── package.json
└── README.md
```

## License

内容和代码目前默认保留作者权利。后续如需开源协议，可补充 MIT、Apache-2.0 或 CC BY-NC-SA。

# AI PM Guide

面向 **AI 产品经理小白** 和 **想转型 AI 产品经理的人** 的学习笔记库。

- 推荐在线阅读：部署后填写站点地址
- GitHub 仓库：[STRUGGLE1999/ai-pm-guide](https://github.com/STRUGGLE1999/ai-pm-guide)

<p align="center">
  <strong>AI 产品经理学习笔记</strong>
  <br />
  从概念学习、产品实战、学习路线到面试准备的一站式自学地图
</p>

## 核心入口

- **AI 产品经理入门**：[7 天入门路线](#/roadmaps/seven-day)：适合零基础用户先建立大模型、Prompt、RAG、Agent 和 AI 产品形态的最小框架。
- **概念学习**：系统整理大模型、Prompt、RAG、Agent、多模态、AI 工作流、PRD、指标体系等 PM 必备知识。
- **产品实战**：围绕知识库、客服 Bot、内容生成、智能报表、Agent 工作流和 AI 搜索拆解产品方案。
- **面试指南**：覆盖 AI 概念、产品设计题、业务分析题、数据指标题和转型表达。
- **学习路线**：包含 7 天入门、30 天体系化、技术背景转型、非技术背景转型四条路径。
- **资源推荐**：整理公开课、工具、报告、Newsletter 和 AI 产品案例库。

## 当前内容规模

- 21 个概念学习条目
- 6 个 AI 产品实战案例
- 4 条学习路线
- 24 道 AI 产品经理高频面试题
- 32 个资源推荐条目

## 项目定位

本站只做学习分享，不设置付费课、社群、会员、训练营或加微信引流。

内容目标是帮助你回答三个问题：

1. AI 产品经理到底要学什么？
2. 如何把 AI 能力落到真实产品场景？
3. 如何准备 AI 产品经理面试和作品集？

## 本地预览

这是一个纯静态网站，无需安装依赖。

```bash
python3 -m http.server 5173
```

然后访问：

```text
http://localhost:5173
```

## 文件结构

```text
.
├── index.html    # 页面入口和顶部导航
├── styles.css    # 白天/黑夜主题与页面样式
├── app.js        # 路由、页面渲染、主题切换
├── data.js       # 概念、实战、路线、面试题、资源数据
└── README.md     # GitHub 项目说明
```

## 后续计划

- 补充更多 AI 产品案例和面试题。
- 将内容从 `data.js` 拆成 Markdown/MDX。
- 升级为 VitePress、VuePress 或 Docusaurus 文档站。
- 配置 GitHub Pages，提供稳定在线阅读地址。

## License

内容和代码目前默认保留作者权利。后续如需开源协议，可补充 MIT、Apache-2.0 或 CC BY-NC-SA。

const data = window.siteData;
const app = document.querySelector("#app");
const navLinks = document.querySelectorAll("[data-nav-links] a");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("[data-nav-links]");
const themeToggle = document.querySelector("[data-theme-toggle]");

const allArticles = [
  ...data.conceptArticles.map((item) => ({ ...item, section: "概念学习", route: "concepts" })),
  ...data.practices.map((item) => ({ ...item, category: "实战案例", section: "实战", route: "practice" }))
];

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

initTheme();
window.addEventListener("hashchange", render);
render();

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  });
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute("aria-label", theme === "dark" ? "切换浅色模式" : "切换深色模式");
}

function render() {
  const route = parseRoute();
  setActiveNav(route);
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");

  if (route.name === "home") renderHome();
  if (route.name === "concepts") renderArticleList("概念学习", data.conceptArticles, "concepts");
  if (route.name === "practice") renderArticleList("实战", data.practices, "practice");
  if (route.name === "roadmaps") renderRoadmaps(route.id);
  if (route.name === "interview") renderInterview();
  if (route.name === "resources") renderResources();
  if (route.name === "article") renderArticle(route.id);
  if (route.name === "about") renderStaticPage("关于本站", aboutContent());
  if (route.name === "changelog") renderStaticPage("更新日志", changelogContent());
  if (route.name === "feedback") renderStaticPage("问题反馈", feedbackContent());

  app.focus({ preventScroll: true });
}

function parseRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [name = "home", id] = hash.split("/");
  if (!hash) return { name: "home" };
  return { name, id };
}

function setActiveNav(route) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href").replace("#/", "");
    link.classList.toggle("active", href === route.name);
  });
}

function renderHome() {
  app.innerHTML = `
    <section class="doc-hero">
      <div class="hero-logo" aria-hidden="true">
        <div class="logo-book">
          <span class="logo-chip">AI</span>
          <span class="logo-line blue"></span>
          <span class="logo-line"></span>
          <span class="logo-line blue short"></span>
        </div>
        <strong>AI PM</strong>
      </div>
      <div class="hero-copy">
        <h1>AI PM Guide</h1>
        <p>面向 AI 产品经理小白和转型人群的学习笔记库，覆盖概念学习、产品实战、学习路线、面试准备与资源推荐。</p>
        <div class="doc-actions">
          <a class="button primary" href="#/concepts">开始阅读</a>
          <a class="button soft" href="#/roadmaps">学习路线</a>
        </div>
      </div>
    </section>

    <section class="doc-section">
      <h2>核心入口</h2>
      <ul class="entry-list">
        <li><strong>AI 产品经理入门：</strong><a href="#/roadmaps/seven-day">7 天入门路线</a>：适合零基础用户先建立大模型、Prompt、RAG、Agent 和 AI 产品形态的最小框架。</li>
        <li><strong>AI 产品基础：</strong><a href="#/concepts">概念学习</a>：系统整理大模型、Prompt、RAG、Agent、多模态、AI 工作流、PRD、指标体系等 PM 必备知识。</li>
        <li><strong>AI 产品实战：</strong><a href="#/practice">实战案例</a>：围绕知识库、客服 Bot、内容生成、智能报表、Agent 工作流和 AI 搜索拆解产品方案。</li>
        <li><strong>面试突击：</strong><a href="#/interview">面试指南</a>：覆盖 AI 概念、产品设计题、业务分析题、数据指标题和转型表达。</li>
        <li><strong>学习路线：</strong><a href="#/roadmaps">路线合集</a>：包含 7 天入门、30 天体系化、技术背景转型、非技术背景转型四条路径。</li>
        <li><strong>延伸资料：</strong><a href="#/resources">资源推荐</a>：整理公开课、工具、报告、Newsletter 和 AI 产品案例库。</li>
      </ul>
    </section>

    <section class="doc-section">
      <h2>精选文章</h2>
      <ul class="entry-list">
        <li><strong>入门路径：</strong><a href="#/article/llm-basics">大模型是什么</a>、<a href="#/article/prompt-design">Prompt 设计</a>、<a href="#/article/rag">RAG</a>、<a href="#/article/agent">Agent</a>。不知道从哪里开始时，优先看这一组。</li>
        <li><strong>产品基本功：</strong><a href="#/article/requirements">需求分析</a>、<a href="#/article/user-research">用户研究</a>、<a href="#/article/prd">AI 产品 PRD</a>、<a href="#/article/metrics">指标体系</a>。适合补齐 PM 底层能力。</li>
        <li><strong>AI 产品专题：</strong><a href="#/article/ai-native">AI 原生产品</a>、<a href="#/article/copilot">Copilot</a>、<a href="#/article/knowledge-base-product">AI 知识库产品</a>、<a href="#/article/enterprise-ai">企业 AI 应用</a>。适合从能力走向产品判断。</li>
        <li><strong>实战项目：</strong><a href="#/article/kb-assistant">企业 AI 知识库助手</a>、<a href="#/article/support-bot">客服 Bot</a>、<a href="#/article/agent-workflow">销售线索处理 Agent</a>。适合作为作品集和面试项目素材。</li>
        <li><strong>面试准备：</strong><a href="#/interview">AI PM 高频面试题</a>：用考察点和回答框架整理 24 道高频问题。</li>
      </ul>
    </section>

    <section class="doc-section">
      <h2>关于本站</h2>
      <p>本站是一份学习分享型 AI 产品经理知识库，不做付费课、社群、会员、训练营或加微信引流。内容目标是帮助你知道 AI 产品经理要学什么、怎么练、怎么准备面试，以及如何把 AI 能力落到具体产品场景里。</p>
      <p>当前已收录 ${data.conceptArticles.length} 个概念条目、${data.practices.length} 个实战案例、${data.roadmaps.length} 条学习路线、${data.interviews.length} 道面试题和 ${data.resources.length} 个资源条目。</p>
    </section>
  `;
}

function renderArticleList(title, items, route) {
  const categories = ["全部", ...new Set(items.map((item) => item.category))];
  app.innerHTML = `
    <section class="page-title">
      <h1>${title}</h1>
      <p>${route === "concepts" ? "围绕 AI 产品经理能用上的知识组织，不写纯技术百科。" : "重点看 AI 能力如何落成产品流程、指标和简历项目。"}</p>
    </section>
    <section class="toolbar">
      <input class="search-input" type="search" placeholder="搜索标题、摘要或标签" data-search />
      <div class="filter-row" data-filter-row>
        ${categories.map((category, index) => `<button class="filter-button ${index === 0 ? "active" : ""}" data-category="${category}">${category}</button>`).join("")}
      </div>
    </section>
    <section class="grid" data-list></section>
  `;

  const list = app.querySelector("[data-list]");
  const search = app.querySelector("[data-search]");
  const buttons = app.querySelectorAll("[data-category]");
  let activeCategory = "全部";

  const updateList = () => {
    const keyword = search.value.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const inCategory = activeCategory === "全部" || item.category === activeCategory;
      const text = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return inCategory && text.includes(keyword);
    });
    list.innerHTML = filtered.length ? filtered.map(articleCard).join("") : emptyState("没有找到匹配内容。");
  };

  search.addEventListener("input", updateList);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      updateList();
    });
  });
  updateList();
}

function renderRoadmaps(activeId = "seven-day") {
  const active = data.roadmaps.find((item) => item.id === activeId) || data.roadmaps[0];
  app.innerHTML = `
    <section class="page-title">
      <h1>课程/学习路线</h1>
      <p>这里的“课程”指免费自学路径和公开资源导读，不做付费课程售卖。</p>
    </section>
    <section class="route-layout section">
      <aside class="side-panel">
        <h2>选择路线</h2>
        ${data.roadmaps.map((item) => `<a class="${item.id === active.id ? "active" : ""}" href="#/roadmaps/${item.id}">${item.title}</a>`).join("")}
      </aside>
      <article class="article">
        <h1>${active.title}</h1>
        <p class="meta"><span class="tag primary">${active.audience}</span></p>
        <h2>学习目标</h2>
        <p>${active.goal}</p>
        <h2>阶段安排</h2>
        <ol>${active.stages.map((stage) => `<li>${stage}</li>`).join("")}</ol>
        <h2>推荐文章顺序</h2>
        <div class="grid two">
          ${active.articles.map((id) => articleCard(data.conceptArticles.find((article) => article.id === id))).join("")}
        </div>
        <h2>练习任务</h2>
        <p>${active.practice}</p>
        <h2>阶段产出</h2>
        <p>${active.output}</p>
      </article>
    </section>
  `;
}

function renderInterview() {
  app.innerHTML = `
    <section class="page-title">
      <h1>面试</h1>
      <p>覆盖 AI 概念、产品设计、业务分析、数据指标、Agent/RAG 场景和转型表达。</p>
    </section>
    <section class="toolbar">
      <input class="search-input" type="search" placeholder="搜索题目、考察点或回答" data-search />
      <span class="pill">${data.interviews.length} 道高频题</span>
    </section>
    <section class="qa-list" data-list></section>
  `;

  const list = app.querySelector("[data-list]");
  const search = app.querySelector("[data-search]");
  const updateList = () => {
    const keyword = search.value.trim().toLowerCase();
    const filtered = data.interviews.filter((item) => item.join(" ").toLowerCase().includes(keyword));
    list.innerHTML = filtered.length ? filtered.map(interviewItem).join("") : emptyState("没有找到匹配面试题。");
  };
  search.addEventListener("input", updateList);
  updateList();
}

function renderResources() {
  const stages = ["全部", ...new Set(data.resources.map((item) => item[2]))];
  app.innerHTML = `
    <section class="page-title">
      <h1>资源推荐</h1>
      <p>包含书单/公开课/工具/报告/Newsletter/产品案例库，优先服务自学和案例研究。</p>
    </section>
    <section class="toolbar">
      <input class="search-input" type="search" placeholder="搜索资源名称、类型或推荐理由" data-search />
      <div class="filter-row">
        ${stages.map((stage, index) => `<button class="filter-button ${index === 0 ? "active" : ""}" data-stage="${stage}">${stage}</button>`).join("")}
      </div>
    </section>
    <section class="resource-grid" data-list></section>
  `;

  const list = app.querySelector("[data-list]");
  const search = app.querySelector("[data-search]");
  const buttons = app.querySelectorAll("[data-stage]");
  let activeStage = "全部";

  const updateList = () => {
    const keyword = search.value.trim().toLowerCase();
    const filtered = data.resources.filter((item) => {
      const inStage = activeStage === "全部" || item[2] === activeStage;
      return inStage && item.join(" ").toLowerCase().includes(keyword);
    });
    list.innerHTML = filtered.length ? filtered.map(resourceCard).join("") : emptyState("没有找到匹配资源。");
  };

  search.addEventListener("input", updateList);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeStage = button.dataset.stage;
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      updateList();
    });
  });
  updateList();
}

function renderArticle(id) {
  const article = allArticles.find((item) => item.id === id);
  if (!article) {
    renderStaticPage("没有找到文章", "这个链接对应的文章不存在，可以回到首页重新浏览。");
    return;
  }

  const html = markdownToHtml(article.content);
  const toc = extractToc(html);
  const related = allArticles
    .filter((item) => item.id !== article.id && item.tags.some((tag) => article.tags.includes(tag)))
    .slice(0, 3);
  const currentIndex = allArticles.findIndex((item) => item.id === article.id);
  const prev = allArticles[currentIndex - 1];
  const next = allArticles[currentIndex + 1];

  app.innerHTML = `
    <section class="article-layout">
      <aside class="side-panel">
        <h2>目录</h2>
        ${toc.map((item) => `<a href="#${item.id}">${item.text}</a>`).join("")}
      </aside>
      <article class="article">
        <p class="meta"><span class="tag primary">${article.section}</span><span>${article.category}</span><span>更新于 ${article.date}</span></p>
        <h1>${article.title}</h1>
        <p>${article.summary}</p>
        <p class="meta">${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</p>
        ${html}
        <h2>相关文章</h2>
        <div class="grid">
          ${related.length ? related.map(articleCard).join("") : emptyState("暂无相关文章。")}
        </div>
        <nav class="article-nav" aria-label="上一篇和下一篇">
          <div>${prev ? `<a class="button" href="#/article/${prev.id}">上一篇：${prev.title}</a>` : ""}</div>
          <div>${next ? `<a class="button" href="#/article/${next.id}">下一篇：${next.title}</a>` : ""}</div>
        </nav>
      </article>
    </section>
  `;
}

function renderStaticPage(title, content) {
  app.innerHTML = `
    <article class="article">
      <h1>${title}</h1>
      ${markdownToHtml(content)}
    </article>
  `;
}

function articleCard(item) {
  if (!item) return "";
  return `
    <a class="card card-link" href="#/article/${item.id}">
      <p class="meta"><span class="tag primary">${item.category}</span><span>${item.date}</span></p>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</p>
    </a>
  `;
}

function roadmapCard(item) {
  return `
    <a class="card card-link" href="#/roadmaps/${item.id}">
      <p class="meta"><span class="tag primary">${item.audience}</span></p>
      <h3>${item.title}</h3>
      <p>${item.goal}</p>
      <span class="button">查看路线</span>
    </a>
  `;
}

function interviewItem([question, point, answer], index) {
  return `
    <details class="qa-item" ${index < 3 ? "open" : ""}>
      <summary>${question}</summary>
      <div class="qa-body">
        <p><strong>考察点：</strong>${point}</p>
        <p><strong>回答框架：</strong>${answer}</p>
      </div>
    </details>
  `;
}

function resourceCard([name, type, stage, reason, url, free]) {
  return `
    <a class="card card-link" href="${url}" target="_blank" rel="noreferrer">
      <p class="meta"><span class="tag primary">${type}</span><span class="pill ${free ? "free" : "warn"}">${free ? "免费/有免费内容" : "部分付费"}</span></p>
      <h3>${name}</h3>
      <p>${reason}</p>
      <p class="meta"><span>${stage}</span></p>
    </a>
  `;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function markdownToHtml(markdown) {
  const lines = markdown.trim().split("\n");
  let html = "";
  let listOpen = false;
  let orderedOpen = false;

  const closeLists = () => {
    if (listOpen) {
      html += "</ul>";
      listOpen = false;
    }
    if (orderedOpen) {
      html += "</ol>";
      orderedOpen = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      closeLists();
      return;
    }
    if (trimmed.startsWith("## ")) {
      closeLists();
      const text = trimmed.slice(3);
      html += `<h2 id="${slugify(text)}">${text}</h2>`;
      return;
    }
    if (trimmed.startsWith("### ")) {
      closeLists();
      const text = trimmed.slice(4);
      html += `<h3 id="${slugify(text)}">${text}</h3>`;
      return;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      if (!orderedOpen) {
        closeLists();
        html += "<ol>";
        orderedOpen = true;
      }
      html += `<li>${trimmed.replace(/^\d+\.\s/, "")}</li>`;
      return;
    }
    if (trimmed.startsWith("- ")) {
      if (!listOpen) {
        closeLists();
        html += "<ul>";
        listOpen = true;
      }
      html += `<li>${trimmed.slice(2)}</li>`;
      return;
    }
    closeLists();
    html += `<p>${trimmed}</p>`;
  });

  closeLists();
  return html;
}

function extractToc(html) {
  const matches = [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  return matches.map((match) => ({ id: match[1], text: match[2] }));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, "");
}

function aboutContent() {
  return `
## 定位
这是一个面向 AI 产品经理小白和转型人群的学习分享网站，目标是把概念、实战、路线、面试和资源串成一条清楚的自学路径。

## 不做什么
- 不做付费课售卖。
- 不做社群、会员、训练营和加微信引流。
- 不把本站做成泛 AI 工具导航。

## 内容标准
每篇内容都尽量回答：这个概念是什么、PM 为什么要懂、在产品里怎么用、面试可能怎么问。
`;
}

function changelogContent() {
  return `
## 2026-06-21
- 完成静态网站 MVP。
- 增加首页、概念学习、实战、课程/路线、面试、资源推荐、关于、更新日志、反馈页。
- 初始化 20 个概念条目、6 个实战案例、4 条学习路线、24 道面试题、32 个资源条目。
`;
}

function feedbackContent() {
  return `
## 反馈方向
可以优先记录这些问题：
- 哪个概念解释不清楚？
- 哪条学习路线不适合你的背景？
- 哪个面试题缺少示例？
- 哪个资源已经过期或不适合新手？

## 后续可扩展
静态版可以先通过 GitHub Issues、表单服务或邮箱收集反馈，暂不引入登录、评论和用户系统。
`;
}

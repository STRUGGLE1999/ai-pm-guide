# Python爬虫实例

<figure class="article-figure">
  <img src="/concepts/ai-tech/crawler-handdrawn/05-crawler-project.png" alt="Python 爬虫综合项目结构" loading="lazy">
  <figcaption>综合项目把配置、请求、解析、校验、保存、日志和调度串成可重复运行的数据采集器。</figcaption>
</figure>

这一章将前面知识串成完整项目。你将完成一个“公开练习页面名言采集器”：它可以抓取多页数据、提取作者与标签、去重、保存 CSV/JSON/SQLite，并输出运行日志。

项目使用课程练习站点 `https://quotes.toscrape.com/`。它仅用于学习结构化页面采集，不要把它替换成未经确认的真实站点后直接高频运行。

## 1. 项目目标与验收标准

### 1.1 项目目标

抓取练习站点中的名言数据，保存以下字段：

| 字段 | 说明 |
|---|---|
| `quote` | 名言原文 |
| `author` | 作者 |
| `tags` | 标签列表 |
| `author_url` | 作者详情页 URL |
| `source_url` | 当前名言所在页面 URL |
| `crawled_at` | 抓取时间 |

### 1.2 验收标准

完成后应满足：

- 能抓取至少 3 页；
- 每页请求间隔不少于 1 秒；
- 程序可重复执行；
- CSV、JSON、SQLite 都能生成；
- 数据库中不会因重复执行产生重复 URL；
- 控制台和日志文件中能看到执行过程；
- 请求失败不会让整个程序直接崩溃。

---

## 2. 创建项目结构

在 `python_crawler_course` 目录下创建：

```text
python_crawler_course/
├── data/
├── logs/
├── quote_crawler.py
└── requirements.txt
```

确保依赖已安装：

```bash
pip install requests beautifulsoup4 lxml
```

---

## 3. 完整代码：`quote_crawler.py`

将下面所有代码复制到 `quote_crawler.py`。

```python
from __future__ import annotations

from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin
import csv
import json
import logging
import sqlite3
import time

import requests
from bs4 import BeautifulSoup


# =========================
# 1. 项目配置
# =========================
START_URL = "https://quotes.toscrape.com/"
MAX_PAGES = 3
SLEEP_SECONDS = 1
TIMEOUT = (5, 15)

DATA_DIR = Path("data")
LOG_DIR = Path("logs")
CSV_PATH = DATA_DIR / "quotes.csv"
JSON_PATH = DATA_DIR / "quotes.json"
DB_PATH = DATA_DIR / "quotes.db"
LOG_PATH = LOG_DIR / "crawler.log"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0; learning-project)"
}


# =========================
# 2. 日志配置
# =========================
def setup_logging() -> None:
    """同时将日志输出到控制台和文件。"""
    LOG_DIR.mkdir(exist_ok=True)

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(LOG_PATH, encoding="utf-8"),
        ],
    )


# =========================
# 3. 请求层
# =========================
def build_session() -> requests.Session:
    """创建复用连接的 Session。"""
    session = requests.Session()
    session.headers.update(HEADERS)
    return session


def fetch_html(session: requests.Session, url: str) -> str | None:
    """请求页面，成功时返回 HTML，失败时返回 None。"""
    try:
        logging.info("请求页面：%s", url)
        response = session.get(url, timeout=TIMEOUT)
        response.raise_for_status()
        return response.text

    except requests.Timeout:
        logging.warning("请求超时：%s", url)
    except requests.ConnectionError:
        logging.warning("连接失败：%s", url)
    except requests.HTTPError as error:
        logging.warning("HTTP 异常：%s | %s", url, error)
    except requests.RequestException as error:
        logging.warning("请求异常：%s | %s", url, error)

    return None


# =========================
# 4. 解析层
# =========================
def parse_quotes(html: str, page_url: str) -> list[dict]:
    """从一个列表页 HTML 中提取名言数据。"""
    soup = BeautifulSoup(html, "lxml")
    crawled_at = datetime.now().isoformat(timespec="seconds")
    items: list[dict] = []

    for quote_node in soup.select("div.quote"):
        text_node = quote_node.select_one("span.text")
        author_node = quote_node.select_one("small.author")
        author_link_node = quote_node.select_one("a[href*='/author/']")
        tag_nodes = quote_node.select("div.tags a.tag")

        # 页面结构变化或字段缺失时，跳过当前记录而不是让整个任务中断
        if not text_node or not author_node:
            logging.warning("发现字段不完整的记录，已跳过：%s", page_url)
            continue

        author_url = ""
        if author_link_node and author_link_node.get("href"):
            author_url = urljoin(page_url, author_link_node["href"])

        item = {
            "quote": text_node.get_text(strip=True),
            "author": author_node.get_text(strip=True),
            "tags": [tag.get_text(strip=True) for tag in tag_nodes],
            "author_url": author_url,
            "source_url": page_url,
            "crawled_at": crawled_at,
        }

        items.append(item)

    return items


def parse_next_url(html: str, page_url: str) -> str | None:
    """从当前页面找到下一页 URL；没有下一页时返回 None。"""
    soup = BeautifulSoup(html, "lxml")
    next_node = soup.select_one("li.next a")

    if not next_node:
        return None

    href = next_node.get("href")
    if not href:
        return None

    return urljoin(page_url, href)


# =========================
# 5. 数据校验与去重
# =========================
def is_valid_item(item: dict) -> bool:
    """检查必填字段。"""
    required_fields = ["quote", "author", "source_url"]
    return all(item.get(field) for field in required_fields)


def deduplicate_items(items: list[dict]) -> list[dict]:
    """按 quote + author + source_url 组合去重。"""
    unique_items: list[dict] = []
    seen_keys: set[tuple[str, str, str]] = set()

    for item in items:
        if not is_valid_item(item):
            logging.warning("发现不完整数据，已跳过：%s", item)
            continue

        key = (item["quote"], item["author"], item["source_url"])
        if key in seen_keys:
            continue

        seen_keys.add(key)
        unique_items.append(item)

    return unique_items


# =========================
# 6. 保存层：CSV / JSON / SQLite
# =========================
def save_to_csv(items: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)

    with open(CSV_PATH, "w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "quote",
                "author",
                "tags",
                "author_url",
                "source_url",
                "crawled_at",
            ],
        )
        writer.writeheader()

        for item in items:
            row = item.copy()
            row["tags"] = ",".join(row["tags"])
            writer.writerow(row)

    logging.info("CSV 已保存：%s", CSV_PATH)


def save_to_json(items: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)

    with open(JSON_PATH, "w", encoding="utf-8") as file:
        json.dump(items, file, ensure_ascii=False, indent=2)

    logging.info("JSON 已保存：%s", JSON_PATH)


def save_to_sqlite(items: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)

    connection = sqlite3.connect(DB_PATH)
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote TEXT NOT NULL,
            author TEXT NOT NULL,
            tags TEXT,
            author_url TEXT,
            source_url TEXT NOT NULL,
            crawled_at TEXT NOT NULL,
            UNIQUE(quote, author, source_url)
        )
        """
    )

    inserted_count = 0

    for item in items:
        cursor.execute(
            """
            INSERT OR IGNORE INTO quotes (
                quote,
                author,
                tags,
                author_url,
                source_url,
                crawled_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                item["quote"],
                item["author"],
                ",".join(item["tags"]),
                item["author_url"],
                item["source_url"],
                item["crawled_at"],
            ),
        )

        if cursor.rowcount == 1:
            inserted_count += 1

    connection.commit()
    connection.close()

    logging.info("SQLite 已保存：%s | 本次新增 %s 条", DB_PATH, inserted_count)


# =========================
# 7. 主流程
# =========================
def run() -> None:
    setup_logging()
    DATA_DIR.mkdir(exist_ok=True)

    session = build_session()
    current_url: str | None = START_URL
    current_page = 1
    all_items: list[dict] = []

    logging.info("爬虫开始运行，最多抓取 %s 页", MAX_PAGES)

    while current_url and current_page <= MAX_PAGES:
        html = fetch_html(session, current_url)

        if html is None:
            logging.warning("当前页抓取失败，任务结束：%s", current_url)
            break

        page_items = parse_quotes(html, current_url)
        all_items.extend(page_items)

        logging.info(
            "第 %s 页完成：本页 %s 条，累计 %s 条",
            current_page,
            len(page_items),
            len(all_items),
        )

        next_url = parse_next_url(html, current_url)
        current_url = next_url
        current_page += 1

        if current_url and current_page <= MAX_PAGES:
            logging.info("等待 %s 秒后继续", SLEEP_SECONDS)
            time.sleep(SLEEP_SECONDS)

    final_items = deduplicate_items(all_items)
    logging.info("去重和校验后共 %s 条数据", len(final_items))

    if not final_items:
        logging.warning("没有可保存的数据，程序结束")
        return

    save_to_csv(final_items)
    save_to_json(final_items)
    save_to_sqlite(final_items)

    logging.info("任务结束")


if __name__ == "__main__":
    run()
```

---

## 4. 运行项目

确保当前终端位于项目目录：

```bash
python quote_crawler.py
```

成功后，你应该看到类似输出：

```text
爬虫开始运行，最多抓取 3 页
请求页面：https://quotes.toscrape.com/
第 1 页完成：本页 10 条，累计 10 条
等待 1 秒后继续
...
CSV 已保存：data/quotes.csv
JSON 已保存：data/quotes.json
SQLite 已保存：data/quotes.db | 本次新增 30 条
任务结束
```

然后检查以下文件是否出现：

```text
data/quotes.csv
data/quotes.json
data/quotes.db
logs/crawler.log
```

---

## 5. 读懂完整代码的运行顺序

当你执行：

```bash
python quote_crawler.py
```

程序会按这个顺序工作：

```text
run()
  ↓
创建日志、数据目录和 Session
  ↓
请求第 1 页 HTML
  ↓
parse_quotes() 提取当前页记录
  ↓
parse_next_url() 找到下一页
  ↓
等待 1 秒
  ↓
重复直到最后一页或达到 MAX_PAGES
  ↓
deduplicate_items() 校验并去重
  ↓
保存 CSV、JSON、SQLite
  ↓
结束
```

如果以后你需要把它换成“采集已授权的新闻栏目”，通常只需要修改三部分：

1. `START_URL`：替换为你的授权入口地址；
2. `parse_quotes()`：替换为对应页面的字段选择器；
3. 数据表字段：替换为业务所需的标题、日期、正文、来源等。

而请求、等待、日志、去重、保存的整体骨架可以继续复用。

---

## 6. 项目升级练习 1：增加作者详情页

当前项目只抓取列表页。下一步可以扩展为：

```text
名言列表页
  ↓ 提取 author_url
作者详情页
  ↓ 提取出生日期、出生地点、简介
写入 authors 表
```

建议按以下步骤完成：

1. 先在浏览器中打开一位作者详情页；
2. 查看页面源代码，确定出生日期、地点和简介所在标签；
3. 新建 `parse_author_detail()` 函数；
4. 先只抓取一个作者 URL，打印结果；
5. 确认正确后，再批量抓取去重后的作者 URL；
6. 新建 SQLite 表 `authors`，把 `author_url` 设为唯一键。

通用函数结构：

```python

def parse_author_detail(html: str, author_url: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    return {
        "author_url": author_url,
        "name": "",
        "born_date": "",
        "born_location": "",
        "description": "",
    }
```

不要先批量跑。先确认一个详情页的选择器正确，再扩大范围。

---

## 7. 项目升级练习 2：改造成增量采集器

一次性爬虫和长期任务最大的区别是：长期任务必须知道“哪些数据已经采过”。

增量采集的核心逻辑：

```text
抓到一条新记录
  ↓
查询数据库中是否已有唯一标识
  ↓
没有：写入数据库
有：跳过
```

在这个项目中，可用的唯一组合是：

```text
quote + author + source_url
```

真实业务中，更推荐使用稳定的：

```text
文章 ID / 公告编号 / 详情页 URL / 官方唯一编码
```

不要只用标题去重，因为不同内容可能恰好有相同标题。

---

## 8. 项目升级练习 3：接入 APScheduler 或 Celery

### 8.1 用 APScheduler 每天运行一次

新建 `scheduled_quote_crawler.py`：

```python
from apscheduler.schedulers.blocking import BlockingScheduler

from quote_crawler import run

scheduler = BlockingScheduler(timezone="Asia/Shanghai")
scheduler.add_job(
    run,
    trigger="cron",
    hour=9,
    minute=0,
    id="daily_quote_crawler",
    replace_existing=True,
)

print("定时任务已启动，每天 09:00 执行。按 Ctrl+C 停止。")
scheduler.start()
```

运行：

```bash
python scheduled_quote_crawler.py
```

### 8.2 用 Celery 做后台任务

当 `quote_crawler.py` 已能稳定运行后，可以把 `run()` 封装成 Celery Task：

```python
from celery_app import app
from quote_crawler import run


@app.task
def run_quote_crawler_task():
    run()
    return "quote crawler finished"
```

然后通过：

```python
run_quote_crawler_task.delay()
```

把任务交给 Worker 后台执行。

---

## 9. 初学者最常见的 12 个报错与处理方式

| 报错或现象 | 可能原因 | 处理方式 |
|---|---|---|
| `ModuleNotFoundError: No module named 'requests'` | 依赖未安装，或虚拟环境没激活 | 激活 `.venv` 后执行 `pip install requests` |
| `python: command not found` | Python 命令名称不同 | 尝试 `python3` 或 `py` |
| `SSL certificate verify failed` | 本机证书或网络环境问题 | 不要直接关闭证书校验；先检查系统时间、网络与证书环境 |
| `ReadTimeout` | 网络慢或服务器响应慢 | 增大读取超时，记录 URL，有限重试 |
| `403 Forbidden` | 站点拒绝访问或需要授权 | 不要绕过；改用公开 API、授权方式或停止任务 |
| `404 Not Found` | URL 拼接错误或页面已不存在 | 打印完整 URL，检查 `urljoin()` 和分页链接 |
| `AttributeError: 'NoneType' ...` | `select_one()` 没找到元素 | 先打印 HTML 片段，检查选择器与页面结构 |
| 抓到空列表 | 数据并不在 HTML 中，或选择器错误 | 先查看源代码和 Network，再调整方案 |
| CSV 中文乱码 | 文件编码不适合表格软件 | 用 `encoding='utf-8-sig'` |
| JSON 中文是 `\uXXXX` | 未设置 `ensure_ascii=False` | 保存 JSON 时加 `ensure_ascii=False` |
| 重复执行后数据越来越多 | 没有唯一键或去重逻辑 | 用 URL/ID 建唯一键，使用 `INSERT OR IGNORE` |
| 程序看似卡住 | 请求未设超时，或正在等待网络 | 所有请求增加 `timeout`，并增加日志 |

---

## 10. 课程结业项目：你应该交付什么

当你完成本教程后，可以选择一个**公开、授权或自有**的数据源，完成一个同结构的项目。建议交付物包含：

```text
项目文件夹
├── crawler.py                 # 主程序
├── requirements.txt           # 依赖清单
├── README.md                  # 项目用途、字段、运行步骤、边界说明
├── data/                      # 输出样例，不放敏感数据
├── logs/                      # 运行日志样例
└── screenshots/               # 可选：终端运行与数据结果截图
```

README 至少写清楚：

1. 采集什么公开或授权数据；
2. 采集哪些字段；
3. 如何创建虚拟环境并安装依赖；
4. 如何运行；
5. 输出到哪里；
6. 如何去重；
7. 哪些规则和权限边界需要遵守。

### 结业验收清单

- [ ] 项目可以在新的虚拟环境中通过 `pip install -r requirements.txt` 安装；
- [ ] 执行一条命令即可运行；
- [ ] 代码有超时、状态校验、异常处理和日志；
- [ ] 数据可保存为至少一种结构化格式；
- [ ] 数据有去重策略；
- [ ] 运行两次不会无控制地重复写入；
- [ ] 文档写清楚运行步骤与数据使用边界；
- [ ] 能用自己的话解释请求、解析、分页、编码、保存、定时任务分别在做什么。

---

---

## 结语：从“会写脚本”到“能完成采集项目”

学习爬虫最容易走偏的地方，是把注意力全放在“如何拿到更多页面”。真正有价值的能力是：

```text
先确认数据来源与权限
再定位数据结构
写出稳定、可读、可恢复的采集程序
把结果保存成可用的数据
让任务按规则、按频率、可追踪地运行
```

请按本教程顺序练习，不要跳过“环境、单页、分页、保存、编码、异常、去重”这些基础环节。只要你能独立完成最后的综合实例，再面对新的公开或授权数据源时，就能按相同方法完成分析、开发与交付。

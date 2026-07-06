# Python爬虫教程：从入门到实战

<figure class="article-figure">
  <img src="/concepts/ai-tech/crawler-handdrawn/01-crawler-course.png" alt="Python 爬虫从请求到保存的学习路径" loading="lazy">
  <figcaption>先确认数据来源与权限，再按请求、解析、分页、保存、异常处理的顺序完成一个可运行爬虫。</figcaption>
</figure>

## 1. 先理解：爬虫到底在做什么

把爬虫想成一个按规则工作的“数据采集员”。它不会像人一样用鼠标点开网页，而是直接向服务器发出请求，拿到服务器返回的内容，再从内容里提取你需要的数据。

一个完整的爬虫流程可以概括为：

```text
明确采集目标与权限
        ↓
定位数据来源：公开 API / JSON 接口 / HTML 页面
        ↓
发送请求并检查响应是否成功
        ↓
解析字段并清洗数据
        ↓
处理分页、详情页、去重与异常
        ↓
保存到 CSV、JSON 或数据库
        ↓
按需定时执行、记录日志与检查结果
```

### 1.1 三种常见的数据来源

| 数据来源 | 你会看到什么 | 适合的方式 | 建议优先级 |
|---|---|---|---|
| 官方 API | 有开发文档、接口地址、参数说明，通常返回 JSON | `requests` 请求 API | 最高 |
| 公开 JSON 接口 | 浏览器 Network 中能看到 Fetch/XHR 请求，响应是 JSON | `requests` 请求 JSON | 高 |
| 静态 HTML 页面 | “查看网页源代码”时就能看到目标文本 | `requests` + Beautiful Soup | 中 |
| JavaScript 动态渲染页面 | 源代码没有数据，页面加载后才出现 | 先找公开接口；必要时使用浏览器自动化 | 最后考虑 |

**最重要的原则：先找 API，再找 JSON 接口，再解析 HTML。**

不要一看到网页就立刻写爬虫。先判断数据在哪，往往能节省一半以上的时间。

---

## 2. 环境准备：从零创建第一个爬虫项目

本课程统一以一个名为 `python_crawler_course` 的项目为例。所有命令都在“终端”中执行。

### 2.1 检查 Python 是否已安装

打开终端后，依次尝试下面的命令：

```bash
python --version
```

如果没有输出版本号，再尝试：

```bash
python3 --version
```

Windows 也可以尝试：

```bash
py --version
```

看到类似下面的内容，说明 Python 可用：

```text
Python 3.11.x
```

建议使用 Python 3.10 或更高版本。若命令提示“不是内部或外部命令”或“command not found”，说明 Python 没有正确安装或没有加入系统环境变量，需要先完成 Python 安装后再继续。

### 2.2 创建项目目录

在你准备放代码的位置执行：

```bash
mkdir python_crawler_course
cd python_crawler_course
```

执行后，你当前所在目录应当是：

```text
python_crawler_course/
```

### 2.3 创建虚拟环境

虚拟环境的作用是：让这个项目的依赖和其他 Python 项目隔离，避免“这个项目能运行、另一个项目突然报错”的问题。

macOS / Linux：

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Windows PowerShell：

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Windows 命令提示符（cmd）：

```bat
py -m venv .venv
.venv\Scripts\activate.bat
```

激活成功后，终端开头通常会出现：

```text
(.venv)
```

例如：

```text
(.venv) python_crawler_course %
```

> **常见问题：PowerShell 提示“无法加载脚本”**
>
> 这是 Windows 的执行策略限制。可以临时在当前 PowerShell 窗口运行：
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```
>
> 然后重新执行：
>
> ```powershell
> .\.venv\Scripts\Activate.ps1
> ```

### 2.4 安装本课程所需依赖

先升级 pip：

```bash
python -m pip install --upgrade pip
```

安装基础依赖：

```bash
pip install requests beautifulsoup4 lxml
```

本教程后续还会使用到定时任务和 Celery。现在可以一并安装，也可以学到对应章节时再安装：

```bash
pip install apscheduler "celery[redis]"
```

创建一个 `requirements.txt` 文件，写入：

```text
requests
beautifulsoup4
lxml
apscheduler
celery[redis]
```

以后在另一台电脑或新的虚拟环境中，只需要执行：

```bash
pip install -r requirements.txt
```

即可一次性安装项目所需依赖。

### 2.5 推荐项目目录

跟着课程练习时，项目目录可以先保持简单：

```text
python_crawler_course/
├── .venv/                  # 虚拟环境，不需要手动修改
├── data/                   # 爬取输出的数据
├── logs/                   # 运行日志
├── crawler.py               # 主爬虫文件
├── requirements.txt         # 依赖清单
└── README.md                # 项目说明，可后续补充
```

在终端执行：

```bash
mkdir data logs
```

### 2.6 用一行代码验证环境

创建文件 `check_env.py`：

```python
import requests
from bs4 import BeautifulSoup
import lxml

print("爬虫学习环境已准备完成")
```

运行：

```bash
python check_env.py
```

如果输出：

```text
爬虫学习环境已准备完成
```

说明基础环境已就绪。

---

## 3. 第一个请求：让 Python 访问一个网页

创建文件 `first_request.py`：

```python
import requests

url = "https://quotes.toscrape.com/"

response = requests.get(url, timeout=10)

print("状态码：", response.status_code)
print("响应类型：", response.headers.get("Content-Type"))
print("网页前 300 个字符：")
print(response.text[:300])
```

运行：

```bash
python first_request.py
```

### 3.1 你应该看懂的四个对象

| 代码 | 含义 |
|---|---|
| `url` | 要访问的地址 |
| `requests.get()` | 发送 GET 请求 |
| `response` | 服务器返回的响应对象 |
| `response.status_code` | 服务器返回的状态码 |

### 3.2 常见状态码

| 状态码 | 含义 | 初学者该怎么处理 |
|---|---|---|
| `200` | 请求成功 | 可以继续解析 |
| `301` / `302` | 页面跳转 | Requests 通常会自动跟随跳转；仍需确认最终地址是否正确 |
| `400` | 请求参数有问题 | 检查 URL、参数、请求方法 |
| `401` / `403` | 无权访问或被拒绝 | 不要尝试绕过限制；改用授权接口或停止采集 |
| `404` | 地址不存在 | 检查链接拼接、分页 URL、详情页地址 |
| `429` | 请求过于频繁 | 降低频率、增加等待、遵守站点限制 |
| `500` / `502` / `503` | 服务端临时异常 | 等待后有限次数重试 |

### 3.3 为什么一定要加 `timeout`

网络并不总是稳定。若不设置超时，程序可能在某个请求上长时间等待，看起来像“卡死”。

以后请养成习惯：

```python
requests.get(url, timeout=10)
```

对于连接和读取分别设置超时，可以写成：

```python
requests.get(url, timeout=(5, 15))
```

其中：

- `5`：连接服务器最多等 5 秒；
- `15`：连接成功后，等待服务器返回内容最多等 15 秒。

### 3.4 为什么要使用 `raise_for_status()`

仅仅“拿到了 response”不代表请求成功。比如访问 404 页面，也会有一个 response 对象。

推荐写法：

```python
import requests

url = "https://quotes.toscrape.com/"
response = requests.get(url, timeout=(5, 15))
response.raise_for_status()

print(response.text[:100])
```

当状态码不是成功状态时，`raise_for_status()` 会抛出异常，避免程序把错误页当成正常页面继续解析。

---

## 4. 从浏览器定位数据：决定你该怎么抓

开始写解析代码前，先在浏览器里观察页面。以 Chrome 或 Edge 为例：

### 4.1 第一步：查看页面源代码

打开网页后，右键选择“查看网页源代码”，或使用快捷键：

- Windows：`Ctrl + U`
- macOS：`Command + Option + U`

然后按 `Ctrl + F` 或 `Command + F` 搜索页面中一段你肉眼能看到的标题。

- **找得到**：目标内容大概率直接在 HTML 里，可以先用 `requests + Beautiful Soup`；
- **找不到**：数据可能通过 JavaScript 后加载，继续下一步。

### 4.2 第二步：打开开发者工具查看 Network

按 `F12` 打开开发者工具，进入 **Network** 面板：

1. 勾选或开启“Preserve log”（保留日志）；
2. 刷新页面；
3. 点击筛选项 **Fetch/XHR**；
4. 找名称像 `list`、`search`、`query`、`api`、`data` 的请求；
5. 点击请求，查看 **Response** 或 **Preview**。

如果响应中已经是结构化 JSON，例如：

```json
{
  "data": [
    {
      "title": "示例标题",
      "publish_time": "2026-06-26"
    }
  ]
}
```

那么就优先采集这个公开接口的 JSON，而不是解析复杂的 HTML。

### 4.3 第三步：确认请求参数

在 Network 中选中请求后，重点查看：

- Request URL：真实接口地址；
- Request Method：GET 还是 POST；
- Query String Parameters：URL 参数；
- Payload：POST 请求提交的数据；
- Request Headers：接口需要的公开请求头；
- Response：返回的数据结构。

> **课堂提醒**：这里的目标是理解公开、允许访问的数据接口如何工作，而不是复制受保护请求、绕过登录或规避访问限制。需要身份验证的数据，应使用网站提供的合法授权机制或官方 API。

---

## 5. 认识请求头、参数与 Session

### 5.1 请求头：让请求信息更完整

许多网站会根据请求头返回不同内容。学习项目中可以使用一个明确的、礼貌的 User-Agent：

```python
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0; learning-project)"
}
```

请求时传入：

```python
response = requests.get(url, headers=HEADERS, timeout=10)
```

常见请求头含义：

| 请求头 | 作用 |
|---|---|
| `User-Agent` | 标识客户端类型 |
| `Accept` | 告诉服务器希望接收哪些内容类型 |
| `Accept-Language` | 指定语言偏好 |
| `Referer` | 表示当前请求通常从哪个页面跳转而来 |
| `Cookie` | 保存会话状态；只应在你拥有合法授权时使用 |

### 5.2 URL 参数：`params`

不要手工把参数拼在 URL 字符串里。优先使用 `params`：

```python
import requests

url = "https://example.com/search"
params = {
    "keyword": "python",
    "page": 1,
}

response = requests.get(url, params=params, timeout=10)
print(response.url)
```

这样 Requests 会自动处理 URL 编码，结果通常类似：

```text
https://example.com/search?keyword=python&page=1
```

### 5.3 Session：让多个请求复用连接与状态

若一个项目会连续请求多个页面，建议使用 `requests.Session()`：

```python
import requests

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0)"
})

response = session.get("https://quotes.toscrape.com/", timeout=10)
response.raise_for_status()
```

Session 的两个主要好处：

1. 自动复用底层连接，连续请求效率更好；
2. 可以统一设置请求头、超时策略等公共配置。

---

## 6. 解析 HTML：用 Beautiful Soup 提取页面字段

### 6.1 先认识 HTML 的基本结构

下面是一段简化网页结构：

```html
<article class="news-card">
  <h2 class="title">
    <a href="/news/100">Python 爬虫入门</a>
  </h2>
  <time class="publish-time">2026-06-26</time>
</article>
```

你真正需要的通常不是整段 HTML，而是：

- 标题：`Python 爬虫入门`
- 链接：`/news/100`
- 发布时间：`2026-06-26`

Beautiful Soup 的作用就是把 HTML 转成可查询的对象。

### 6.2 第一次使用 `select()`

创建 `parse_demo.py`：

```python
from bs4 import BeautifulSoup

html = """
<article class="news-card">
  <h2 class="title"><a href="/news/100">Python 爬虫入门</a></h2>
  <time class="publish-time">2026-06-26</time>
</article>
"""

soup = BeautifulSoup(html, "lxml")

card = soup.select_one("article.news-card")
title_node = card.select_one("h2.title a")
time_node = card.select_one("time.publish-time")

print("标题：", title_node.get_text(strip=True))
print("链接：", title_node.get("href"))
print("时间：", time_node.get_text(strip=True))
```

运行：

```bash
python parse_demo.py
```

### 6.3 必学的 CSS Selector

| 选择器 | 作用 | 示例 |
|---|---|---|
| `p` | 选择所有 `p` 标签 | `soup.select("p")` |
| `.item` | 选择 `class="item"` 的元素 | `soup.select(".item")` |
| `#main` | 选择 `id="main"` 的元素 | `soup.select_one("#main")` |
| `article h2` | 选择 article 内部的 h2 | `soup.select("article h2")` |
| `a[href]` | 选择带 href 属性的 a 标签 | `soup.select("a[href]")` |
| `li.next a` | 选择 class 为 next 的 li 里的 a 标签 | `soup.select_one("li.next a")` |
| `[data-id]` | 选择包含 data-id 属性的元素 | `soup.select("[data-id]")` |

### 6.4 `select()` 与 `select_one()` 的区别

```python
soup.select("div.quote")
```

返回一个列表，适合“页面上有很多条记录”的场景。

```python
soup.select_one("h1")
```

返回第一个匹配元素，适合“页面上只需要一个标题、一个下一页按钮”的场景。

### 6.5 从真实练习页面提取名言数据

创建 `parse_quotes.py`：

```python
import requests
from bs4 import BeautifulSoup

url = "https://quotes.toscrape.com/"
headers = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0)"
}

response = requests.get(url, headers=headers, timeout=(5, 15))
response.raise_for_status()

soup = BeautifulSoup(response.text, "lxml")

for quote in soup.select("div.quote"):
    text_node = quote.select_one("span.text")
    author_node = quote.select_one("small.author")
    tag_nodes = quote.select("div.tags a.tag")

    text = text_node.get_text(strip=True)
    author = author_node.get_text(strip=True)
    tags = [tag.get_text(strip=True) for tag in tag_nodes]

    print("名言：", text)
    print("作者：", author)
    print("标签：", ", ".join(tags))
    print("-" * 50)
```

运行后，如果终端能打印出一条条名言、作者和标签，说明你已经完成了“请求 + 解析”的核心动作。

---

## 7. 相对链接、分页与详情页：让爬虫不只抓一页

### 7.1 为什么不能直接请求相对链接

页面中经常出现这样的链接：

```html
<a href="/author/Albert-Einstein/">about</a>
```

其中 `/author/Albert-Einstein/` 是相对路径，不能直接传给 `requests.get()`。

正确做法是使用 `urljoin()`：

```python
from urllib.parse import urljoin

base_url = "https://quotes.toscrape.com/"
relative_url = "/author/Albert-Einstein/"
full_url = urljoin(base_url, relative_url)

print(full_url)
```

输出：

```text
https://quotes.toscrape.com/author/Albert-Einstein/
```

### 7.2 找到“下一页”链接

在练习站点中，下一页常位于类似结构：

```html
<li class="next"><a href="/page/2/">Next</a></li>
```

提取方式：

```python
next_node = soup.select_one("li.next a")

if next_node:
    next_url = urljoin(current_url, next_node.get("href"))
    print("下一页：", next_url)
else:
    print("已经是最后一页")
```

### 7.3 分页循环的标准写法

不要一开始用无限循环。初学阶段建议先设置最大页数，防止选择器写错后无限请求。

```python
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

START_URL = "https://quotes.toscrape.com/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0)"
}

current_url = START_URL
page_number = 1
max_pages = 3

while current_url and page_number <= max_pages:
    print(f"正在抓取第 {page_number} 页：{current_url}")

    response = requests.get(current_url, headers=HEADERS, timeout=(5, 15))
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "lxml")

    for quote in soup.select("div.quote"):
        text = quote.select_one("span.text").get_text(strip=True)
        author = quote.select_one("small.author").get_text(strip=True)
        print(author, "-", text)

    next_node = soup.select_one("li.next a")
    current_url = urljoin(current_url, next_node["href"]) if next_node else None

    page_number += 1
    time.sleep(1)
```

这段代码包含了分页爬虫最重要的三个控制点：

- `current_url`：当前页面地址；
- `next_node`：下一页按钮；
- `max_pages`：安全上限。

### 7.4 列表页与详情页的两层采集

真实项目常见流程：

```text
列表页
  ↓ 提取详情页链接
详情页
  ↓ 提取正文、日期、作者、附件等字段
保存结构化数据
```

下面是一个两层采集的通用模板：

```python
from urllib.parse import urljoin


def parse_list_page(soup, list_url):
    """从列表页提取详情页 URL。"""
    detail_urls = []

    for node in soup.select("article a.detail-link"):
        href = node.get("href")
        if href:
            detail_urls.append(urljoin(list_url, href))

    return detail_urls


def parse_detail_page(soup):
    """从详情页提取一个结构化字典。"""
    title_node = soup.select_one("h1")
    content_node = soup.select_one("article .content")

    return {
        "title": title_node.get_text(strip=True) if title_node else "",
        "content": content_node.get_text(" ", strip=True) if content_node else "",
    }
```

先抓列表页，获得详情页 URL；再逐个访问详情页并解析。这种拆分比把所有逻辑塞在一个函数里更容易维护。

---

## 8. 保存数据：CSV、JSON 与 SQLite

### 8.1 先统一字段结构

无论保存成什么格式，都建议先把每条数据组织成字典：

```python
item = {
    "text": "示例内容",
    "author": "示例作者",
    "tags": ["python", "crawler"],
    "source_url": "https://example.com/page/1",
}
```

多条数据就是一个列表：

```python
items = [item]
```

这样后面切换 CSV、JSON 或数据库时，解析逻辑都不用重写。

### 8.2 保存为 CSV

CSV 适合用 Excel、Numbers 或表格软件快速查看。

```python
from pathlib import Path
import csv


def save_to_csv(items, output_path="data/quotes.csv"):
    if not items:
        print("没有数据可保存")
        return

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=["text", "author", "tags", "source_url"],
        )
        writer.writeheader()

        for item in items:
            row = item.copy()
            row["tags"] = ",".join(row["tags"])
            writer.writerow(row)

    print(f"CSV 已保存：{output_path}")
```

`utf-8-sig` 的作用是让很多表格软件更容易正确识别 UTF-8 中文内容。

### 8.3 保存为 JSON

JSON 能保留列表、字典等原始结构，适合后续程序继续使用。

```python
from pathlib import Path
import json


def save_to_json(items, output_path="data/quotes.json"):
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(items, file, ensure_ascii=False, indent=2)

    print(f"JSON 已保存：{output_path}")
```

### 8.4 保存到 SQLite

SQLite 是 Python 自带支持的轻量数据库。它不需要单独安装服务器，适合学习“去重、查询、增量保存”。

```python
from pathlib import Path
import sqlite3


def save_to_sqlite(items, db_path="data/crawler.db"):
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            author TEXT NOT NULL,
            tags TEXT,
            source_url TEXT NOT NULL UNIQUE
        )
        """
    )

    for item in items:
        cursor.execute(
            """
            INSERT OR IGNORE INTO quotes (text, author, tags, source_url)
            VALUES (?, ?, ?, ?)
            """,
            (
                item["text"],
                item["author"],
                ",".join(item["tags"]),
                item["source_url"],
            ),
        )

    connection.commit()
    connection.close()
    print(f"SQLite 已保存：{db_path}")
```

这里的 `UNIQUE` 和 `INSERT OR IGNORE` 可以防止同一个 `source_url` 被重复插入。

---

## 9. 异常处理、等待与重试：让程序不会轻易中断

### 9.1 最小可用的异常处理模板

```python
import requests


def fetch(url, headers):
    try:
        response = requests.get(url, headers=headers, timeout=(5, 15))
        response.raise_for_status()
        return response

    except requests.Timeout:
        print("请求超时：", url)
    except requests.ConnectionError:
        print("连接失败：", url)
    except requests.HTTPError as error:
        print("HTTP 状态异常：", error)
    except requests.RequestException as error:
        print("请求发生其他异常：", error)

    return None
```

使用时：

```python
response = fetch(url, HEADERS)
if response is None:
    # 当前页面失败，跳过或记录，不让整个程序直接崩掉
    pass
```

### 9.2 为何要等待

即便你采集的是公开页面，也不要把请求写成毫秒级连续发送。合理的等待可以降低服务器压力，也能让你的程序更稳定。

```python
import time

time.sleep(1)
```

初学练习时，每个页面之间等待 1 秒是一个容易理解的起点。真实业务应根据平台规则、数据量和授权范围设置频率。

### 9.3 有限重试，不要无限重试

对网络波动、超时、临时 5xx 错误，可以尝试有限次数重试；对 401、403、404 等明确问题，通常不应该反复请求。

```python
import time
import requests


def fetch_with_retry(url, headers, max_retries=3):
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(url, headers=headers, timeout=(5, 15))
            response.raise_for_status()
            return response

        except (requests.Timeout, requests.ConnectionError) as error:
            print(f"第 {attempt} 次请求失败：{error}")
            if attempt == max_retries:
                break
            time.sleep(attempt * 2)

    return None
```

这里每次失败后的等待依次是 2 秒、4 秒、6 秒。它比持续高速重试更稳妥。

---

## 10. 第一阶段小结与自检

完成本章后，请确认你已经能够：

- [ ] 创建并激活虚拟环境；
- [ ] 安装 `requests`、`beautifulsoup4`、`lxml`；
- [ ] 使用 `requests.get()` 访问一个公开页面；
- [ ] 通过 `status_code` 和 `raise_for_status()` 判断请求结果；
- [ ] 使用 `select()`、`select_one()` 提取字段；
- [ ] 用 `urljoin()` 拼接相对链接；
- [ ] 实现“抓取多页数据 + 每页等待”；
- [ ] 把结果保存为 CSV 或 JSON。

只要上面的 8 项都能独立完成，你已经具备了写静态网页爬虫的基础能力。

---

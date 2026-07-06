# Python快速上手爬虫的7大技巧

<figure class="article-figure">
  <img src="/concepts/ai-tech/crawler-handdrawn/02-crawler-tips.png" alt="Python 爬虫七大上手技巧" loading="lazy">
  <figcaption>每个新爬虫都先做目标、数据来源、请求可靠性、解析验证、拆分、去重和恢复性检查。</figcaption>
</figure>

这一章不是新的工具堆砌，而是把初学者最容易出错的地方，整理成 7 条可直接执行的工作习惯。每次开始一个新爬虫，都按这 7 条检查。

## 技巧 1：先写清楚“采什么”，再写代码

不要只写“爬一个网站”。目标要具体到字段、范围、输出格式和更新频率。

### 不清晰的目标

```text
把某网站的信息爬下来。
```

### 清晰的目标

```text
在已获授权的公开栏目中，采集近 30 天的文章标题、发布时间、原文链接和正文摘要；
每条数据以 URL 去重；保存为 SQLite；每天 09:00 增量执行一次。
```

开始代码前，先填写这一张“采集任务卡”：

| 项目 | 你需要填写的内容 |
|---|---|
| 数据来源 | 公开 API / 公开网页 / 已授权内部系统 |
| 采集字段 | 标题、日期、链接、正文、标签等 |
| 起止范围 | 前 3 页、近 30 天、指定栏目等 |
| 更新方式 | 一次性、每日、每小时 |
| 去重字段 | URL、文章 ID、内容哈希等 |
| 输出位置 | CSV、JSON、SQLite、业务数据库 |
| 失败策略 | 记录日志、跳过、有限重试 |

只有采集目标明确，代码才不会越写越乱。

---

## 技巧 2：先用浏览器定位数据，再选择工具

每个新站点先花 5 分钟做这件事：

1. 在页面上找到一段目标文字；
2. 查看网页源代码，搜索这段文字；
3. 若源码中有，优先解析 HTML；
4. 若源码中没有，打开 Network 的 Fetch/XHR，查找公开 JSON 响应；
5. 只有前两种都不适用时，才评估是否需要浏览器自动化。

### 判断结果与行动

| 观察结果 | 结论 | 下一步 |
|---|---|---|
| 源码能搜到标题和正文 | 静态 HTML | `requests + Beautiful Soup` |
| Fetch/XHR 响应中有 JSON 数据 | 公开接口 | `requests + response.json()` |
| 数据只在页面渲染后出现，且无公开接口 | 动态渲染 | 先确认规则，再评估 Playwright 等浏览器自动化 |
| 页面需要登录、验证码、授权令牌 | 受保护数据 | 停止“网页抓取思路”，改走合法授权接口 |

### JSON 接口最小模板

```python
import requests

url = "https://example.com/api/articles"
params = {"page": 1, "page_size": 20}

response = requests.get(url, params=params, timeout=10)
response.raise_for_status()

data = response.json()

for item in data.get("data", []):
    print(item.get("title"))
```

`response.json()` 只负责把响应内容转换为 Python 对象，并不表示请求一定成功，所以它前面仍然要有 `raise_for_status()`。

---

## 技巧 3：每个请求都要有“超时、校验、日志”

很多初学者把请求写成：

```python
html = requests.get(url).text
```

这段代码短，但不够可靠：没有超时、没有状态校验、失败时也不知道问题发生在哪里。

建议从第一天起使用统一请求函数：

```python
import logging
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0)"
}


def get_page(url):
    logging.info("请求页面：%s", url)

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=(5, 15),
    )
    response.raise_for_status()
    return response
```

每一次运行都会留下类似记录：

```text
2026-06-26 10:00:01 | INFO | 请求页面：https://example.com/page/1
```

当项目出问题时，你可以快速判断：是 URL 写错、请求失败、选择器为空，还是保存环节有问题。

---

## 技巧 4：先抓一条，再抓一页，最后抓全量

不要一开始就写“抓取 1000 页”。推荐按三步推进：

### 第一步：只验证一个字段

```python
first_quote = soup.select_one("div.quote span.text")
print(first_quote.get_text(strip=True))
```

先确认选择器真的能定位到目标。

### 第二步：抓取当前页面所有记录

```python
for quote in soup.select("div.quote"):
    print(quote.select_one("span.text").get_text(strip=True))
```

确认列表选择器正确，并检查每条记录是否缺字段。

### 第三步：再加入分页、详情页和保存

```text
一条字段正确
  ↓
一页记录正确
  ↓
三页分页正确
  ↓
全量抓取 + 保存 + 去重
```

这是最能减少调试成本的开发顺序。

---

## 技巧 5：把“解析逻辑”和“保存逻辑”分开

初学者最容易写出一个 300 行的 `main()` 函数：里面同时请求、解析、打印、保存、翻页、重试。短期可以运行，后面很难维护。

建议最少拆成四类函数：

```python
fetch_html(url)       # 请求
parse_page(html)      # 解析
save_items(items)     # 保存
run()                 # 调度流程
```

结构示例：

```python

def fetch_html(url):
    # 只负责请求
    pass


def parse_quotes(html, page_url):
    # 只负责从 HTML 得到字典列表
    pass


def save_to_json(items, path):
    # 只负责写文件
    pass


def run():
    # 负责组织流程
    html = fetch_html("https://quotes.toscrape.com/")
    items = parse_quotes(html, "https://quotes.toscrape.com/")
    save_to_json(items, "data/quotes.json")
```

这样某个环节出错时，你能很快定位问题，也方便后续把保存方式从 CSV 换成数据库。

---

## 技巧 6：从第一天开始做去重和数据校验

爬虫重复执行、页面翻页重复、内容更新，都可能让数据重复。不要等数据积累几万条后才考虑去重。

### 6.1 用集合做运行期去重

```python
seen_urls = set()

for item in items:
    if item["source_url"] in seen_urls:
        continue

    seen_urls.add(item["source_url"])
    print("保留：", item["source_url"])
```

### 6.2 保存前校验必填字段

```python

def is_valid_item(item):
    required_fields = ["title", "source_url"]

    for field in required_fields:
        if not item.get(field):
            return False

    return True
```

### 6.3 数据库中做最终去重

运行期集合只能防止“本次运行”重复。长期任务还应在数据库中设置唯一键：

```sql
source_url TEXT NOT NULL UNIQUE
```

再使用：

```sql
INSERT OR IGNORE
```

形成三层保护：

```text
页面内去重 → 本次运行去重 → 数据库长期去重
```

---

## 技巧 7：慢一点、稳一点、可恢复一点

一个成熟的采集程序，不是“速度最快”，而是“失败后能看懂、能恢复、不会反复制造重复数据”。

你至少要做到：

```text
每个请求有 timeout
每页请求之间有等待
网络问题有限重试
异常页面写入日志
数据保存有唯一键
任务重复执行不会重复写入
```

推荐的基础配置：

```python
CONFIG = {
    "timeout": (5, 15),
    "sleep_seconds": 1,
    "max_retries": 3,
    "max_pages": 10,
}
```

当你不知道参数该设多大时，宁可从“更慢、更少、更可控”的设置开始，确认稳定后再按规则逐步调整。

---

## 7 大技巧自检表

每次写新项目时，运行前检查：

- [ ] 我是否清楚采集字段、范围、输出和去重规则？
- [ ] 我是否已确认数据来自 API、JSON 还是 HTML？
- [ ] 每个请求是否有超时和状态校验？
- [ ] 我是否先验证了一条数据和一页数据？
- [ ] 请求、解析、保存是否已拆分为不同函数？
- [ ] 是否做了字段校验和去重？
- [ ] 是否设置了合理等待、有限重试和日志？

---

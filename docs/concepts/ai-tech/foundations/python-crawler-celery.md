# Python爬虫 | 任务调度之 Celery

<figure class="article-figure">
  <img src="/concepts/ai-tech/crawler-handdrawn/04-crawler-celery.png" alt="Celery 爬虫任务调度链路" loading="lazy">
  <figcaption>APScheduler 适合轻量定时，Celery 适合把任务投递、后台执行、重试和状态追踪拆开管理。</figcaption>
</figure>

前面写的爬虫通常是“运行一次，结束一次”。但真实项目经常需要：

- 每天固定时间抓取一次公开栏目；
- 任务执行较慢，不希望阻塞 Web 页面或主程序；
- 一次要处理很多 URL，希望交给多个 Worker；
- 网络临时失败后，希望任务自动有限重试；
- 需要查看任务是排队中、执行中、成功还是失败。

这就是任务调度和 Celery 要解决的问题。

## 1. 先选对工具：APScheduler 还是 Celery

| 场景 | 推荐工具 | 原因 |
|---|---|---|
| 单机、每天跑一个脚本 | APScheduler | 简单，代码少 |
| 定时执行少量任务 | APScheduler | 不需要消息队列 |
| 任务耗时长，需要后台执行 | Celery | 有独立 Worker |
| 多个任务排队、重试、扩容 | Celery + Redis | 任务队列机制更合适 |
| 多台机器分工执行 | Celery + Redis / RabbitMQ | 可分发任务给多个 Worker |

**学习顺序建议：先理解 APScheduler，再学习 Celery。**

---

## 2. 轻量定时任务：先用 APScheduler 跑通

### 2.1 安装

如果还没有安装：

```bash
pip install apscheduler
```

### 2.2 每分钟执行一次的测试任务

创建 `scheduler_demo.py`：

```python
from datetime import datetime
import time

from apscheduler.schedulers.background import BackgroundScheduler


def crawl_job():
    print("开始执行采集任务：", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    # 在这里调用你的爬虫函数，例如：run_crawler()


scheduler = BackgroundScheduler(timezone="Asia/Shanghai")
scheduler.add_job(
    crawl_job,
    trigger="interval",
    minutes=1,
    id="quote_crawler_job",
    replace_existing=True,
)

scheduler.start()
print("调度器已启动，每分钟执行一次。按 Ctrl+C 停止。")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    scheduler.shutdown()
    print("调度器已停止")
```

运行：

```bash
python scheduler_demo.py
```

每分钟看到一次打印，说明定时任务已经工作。

### 2.3 改为每天固定时间执行

例如每天上午 9:00 执行：

```python
scheduler.add_job(
    crawl_job,
    trigger="cron",
    hour=9,
    minute=0,
    id="daily_quote_crawler",
    replace_existing=True,
)
```

`interval` 适合“每隔多久执行一次”，`cron` 适合“每天几点、每周几执行”。

> 注意：APScheduler 跟随当前 Python 进程运行。关掉终端、停止程序或电脑休眠后，任务也会停止。它适合学习、个人脚本和轻量服务；需要更强的异步执行、重试和多 Worker 能力时，再使用 Celery。

---

## 3. Celery 的核心概念：先看懂再安装

Celery 不是“爬虫库”，而是一个任务队列系统。它把“什么时候要做什么”与“谁来执行”分开。

```text
你的程序
  ↓ 把任务消息放入队列
Broker（Redis）
  ↓ 把任务分发出去
Worker（Celery 工作进程）
  ↓ 实际执行爬虫函数
结果后端（可选，Redis）
  ↓ 保存任务状态和返回结果
```

### 3.1 四个必须记住的名词

| 名词 | 白话解释 |
|---|---|
| Task | 一件要做的工作，例如“抓取一个 URL” |
| Broker | 任务中转站，负责保存和投递任务消息；本教程使用 Redis |
| Worker | 真正执行任务的后台进程 |
| Beat | 定时器，按时间把任务投递到队列中 |

### 3.2 一个重要分工

```text
Beat 负责“到点发任务”
Worker 负责“拿到任务并执行”
Redis 负责“暂存和转发任务消息”
```

不要把 Beat 当成 Worker，也不要以为运行了 Beat 就代表任务已经执行。

---

## 4. 为 Celery 准备 Redis

本课程使用 Docker 运行 Redis，优点是不用在系统里手动配置 Redis 服务。

### 4.1 前置条件

1. 安装并启动 Docker Desktop；
2. 在终端运行：

```bash
docker --version
```

如果能看到 Docker 版本号，说明 Docker 可用。

### 4.2 启动 Redis 容器

执行：

```bash
docker run -d --name crawler-redis -p 6379:6379 redis:7-alpine
```

参数含义：

| 参数 | 含义 |
|---|---|
| `-d` | 后台运行容器 |
| `--name crawler-redis` | 给容器起名，后续方便管理 |
| `-p 6379:6379` | 把容器 Redis 端口映射到本机 6379 |
| `redis:7-alpine` | 使用 Redis 镜像 |

检查容器是否在运行：

```bash
docker ps
```

测试 Redis：

```bash
docker exec -it crawler-redis redis-cli ping
```

若输出：

```text
PONG
```

说明 Redis 已成功启动。

### 4.3 常用 Redis 容器命令

```bash
# 停止 Redis
docker stop crawler-redis

# 再次启动 Redis
docker start crawler-redis

# 查看 Redis 日志
docker logs crawler-redis

# 删除 Redis 容器（会删除容器本身）
docker rm -f crawler-redis
```

---

## 5. 创建第一个 Celery 爬虫任务

在项目根目录创建一个新文件夹：

```bash
mkdir celery_demo
cd celery_demo
```

确认虚拟环境仍处于激活状态，然后安装：

```bash
pip install "celery[redis]" requests
```

### 5.1 创建 Celery 应用：`celery_app.py`

```python
from celery import Celery

app = Celery(
    "crawler_tasks",
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/1",
    include=["tasks"],
)

app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Shanghai",
    enable_utc=False,
    task_track_started=True,
)
```

这里使用两个 Redis 数据库编号：

- `/0`：作为 Broker，保存待执行任务；
- `/1`：作为 Result Backend，保存任务状态和结果；
- `include=["tasks"]`：告诉 Celery 启动时加载 `tasks.py`，让 Worker 能识别你定义的任务。

### 5.2 创建任务文件：`tasks.py`

```python
from datetime import datetime
from pathlib import Path
import json

import requests

from celery_app import app

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonCrawlerCourse/1.0)"
}


@app.task(bind=True, max_retries=3)
def fetch_page_title(self, url):
    """抓取一个公开页面，并返回页面标题和状态。"""
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=(5, 15),
        )
        response.raise_for_status()

    except (requests.Timeout, requests.ConnectionError) as error:
        # 仅对网络临时异常重试，避免对明确的权限/地址问题反复请求
        countdown = 2 ** (self.request.retries + 1)
        raise self.retry(exc=error, countdown=countdown)

    result = {
        "url": url,
        "status_code": response.status_code,
        "content_type": response.headers.get("Content-Type"),
        "fetched_at": datetime.now().isoformat(timespec="seconds"),
        "content_preview": response.text[:100],
    }

    Path("data").mkdir(exist_ok=True)
    with open("data/celery_task_result.json", "w", encoding="utf-8") as file:
        json.dump(result, file, ensure_ascii=False, indent=2)

    return result
```

这个任务做了四件事：

1. 请求公开页面；
2. 发生临时网络问题时有限重试；
3. 把简要结果写入 JSON；
4. 返回一个字典作为任务结果。

### 5.3 启动 Worker

打开一个终端窗口，进入 `celery_demo` 目录，并确保虚拟环境已激活：

macOS / Linux：

```bash
celery -A celery_app worker --loglevel=INFO
```

在某些 Windows 环境下，建议优先在 WSL2 或 Docker/Linux 环境中运行 Celery Worker；课程练习也可以尝试下面的 Windows 命令：

```powershell
celery -A celery_app worker --loglevel=INFO --pool=solo
```

成功启动后，终端会显示 Worker 已连接到 Redis，并等待任务。

### 5.4 投递一个任务

再打开第二个终端窗口，同样进入 `celery_demo` 并激活虚拟环境。

创建 `send_task.py`：

```python
from tasks import fetch_page_title

result = fetch_page_title.delay("https://quotes.toscrape.com/")

print("任务已投递")
print("任务 ID：", result.id)
```

运行：

```bash
python send_task.py
```

回到 Worker 终端，你应该看到任务被接收并执行。然后查看：

```text
celery_demo/data/celery_task_result.json
```

如果文件存在，说明你的第一个“异步爬虫任务”已经跑通。

---

## 6. 查看任务状态与结果

修改 `send_task.py`：

```python
from celery.exceptions import TimeoutError

from tasks import fetch_page_title

result = fetch_page_title.delay("https://quotes.toscrape.com/")

print("任务 ID：", result.id)
print("当前状态：", result.status)

# 教学环境下可以等待结果；真实 Web 服务中不要直接长时间阻塞等待。
try:
    task_result = result.get(timeout=30)
    print("最终状态：", result.status)
    print("任务结果：", task_result)
except TimeoutError:
    print("30 秒内没有拿到结果，请检查 Worker 和 Redis 是否正常运行")
```

常见状态：

| 状态 | 含义 |
|---|---|
| `PENDING` | 任务还没被 Worker 接收，或结果尚不可见 |
| `STARTED` | Worker 已开始执行 |
| `SUCCESS` | 执行成功 |
| `FAILURE` | 执行失败 |
| `RETRY` | 任务正在等待下一次重试 |

---

## 7. 使用 Celery Beat 定时投递爬虫任务

### 7.1 在 `celery_app.py` 增加定时配置

将 `celery_app.py` 改为：

```python
from celery import Celery
from celery.schedules import crontab

app = Celery(
    "crawler_tasks",
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/1",
    include=["tasks"],
)

app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Shanghai",
    enable_utc=False,
    task_track_started=True,
    beat_schedule={
        "fetch-demo-page-every-day-at-0900": {
            "task": "tasks.fetch_page_title",
            "schedule": crontab(hour=9, minute=0),
            "args": ("https://quotes.toscrape.com/",),
        },
    },
)
```

为方便测试，你可以先改成每分钟执行一次：

```python
"schedule": crontab(minute="*"),
```

确认无误后，再改回每天固定时间。

### 7.2 启动 Beat

第三个终端窗口中执行：

```bash
celery -A celery_app beat --loglevel=INFO
```

此时三者分工为：

```text
终端 1：Redis 容器
终端 2：Celery Worker，实际执行任务
终端 3：Celery Beat，按时间投递任务
```

### 7.3 为什么只能启动一个 Beat

在同一份调度配置下，同时启动多个 Beat，可能会造成同一个定时任务被重复投递。单机学习环境中，只启动一个 Beat 即可。

---

## 8. Celery 爬虫任务的工程化要点

### 8.1 不要把大文件直接塞进任务参数

任务消息应该尽量小。推荐传：

```python
fetch_page_title.delay("https://example.com/page/1")
```

而不是传很长的 HTML、图片二进制内容或大批数据列表。

### 8.2 将任务设计成可重复执行

任务可能因为超时、进程重启、网络波动而重复执行。保存数据时要做好唯一键或幂等控制。

```text
同一 URL 重跑两次，数据库仍然只保留一条
```

这是一个合格采集任务的重要标准。

### 8.3 重试只针对临时问题

适合重试：

- 网络超时；
- 临时断连；
- 服务器临时 5xx 错误（需按规则谨慎处理）。

不适合盲目重试：

- 401、403 权限问题；
- 404 地址不存在；
- 页面结构已变化；
- 参数写错。

### 8.4 任务日志必须能回答三个问题

每个任务至少要能追踪：

```text
什么时候执行？
抓了哪个 URL？
成功、失败还是重试？
```

后续项目可进一步记录：总页数、成功条数、失败 URL、耗时、数据文件位置。

---

## 9. Celery 常见问题排查

| 现象 | 优先检查 |
|---|---|
| `Connection refused` | Redis 是否启动；`docker ps` 是否能看到 `crawler-redis` |
| Worker 启动但不接任务 | `broker` 地址是否一致；任务模块名是否正确；发送端和 Worker 是否同项目环境 |
| `Received unregistered task` | `task` 名称或导入路径不对；检查 `tasks.py` 是否被正确加载 |
| 任务一直是 `PENDING` | Worker 是否正在运行；结果后端地址是否配置；任务是否真的成功投递 |
| Beat 有日志但 Worker 没执行 | Worker 未启动，或 Beat/Worker 使用的 Broker 地址不同 |
| 任务重复执行 | 是否启动了多个 Beat；保存是否缺少唯一键或幂等逻辑 |
| Windows Worker 行为异常 | 优先改用 WSL2、Docker 或 Linux 环境；学习阶段可使用 `--pool=solo` 进行验证 |

---

## 10. 本章自检

- [ ] 我知道什么时候用 APScheduler，什么时候用 Celery；
- [ ] 我能解释 Task、Broker、Worker、Beat 的分工；
- [ ] 我已用 Docker 启动 Redis，并得到 `PONG`；
- [ ] 我能启动 Celery Worker；
- [ ] 我能通过 `.delay()` 投递一个任务；
- [ ] 我能让任务失败时进行有限重试；
- [ ] 我能启动 Beat 按固定时间投递任务；
- [ ] 我知道定时任务不应启动多个 Beat 造成重复投递。

---

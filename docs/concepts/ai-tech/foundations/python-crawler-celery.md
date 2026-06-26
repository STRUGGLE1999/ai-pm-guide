# Python 爬虫 | 任务调度之 Celery

当爬虫从一次性脚本变成持续采集任务，就需要任务调度。Celery 是 Python 生态常用的异步任务队列，可以把采集、解析、清洗、入库、重试拆成后台任务。

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="固定流程与开放任务对比">
  <figcaption>爬虫调度更像固定 Workflow：采集、解析、清洗、入库、告警，每一步都要稳定可控。</figcaption>
</figure>

## 为什么需要任务队列

一次性脚本适合验证，任务队列适合生产。AI 知识库或数据监控项目里，采集任务往往需要定时运行、失败重试、并发控制、结果入库和告警。

| 能力 | 工程价值 |
| --- | --- |
| 异步执行 | 用户不用等待长任务完成。 |
| 定时任务 | 按小时、天、周更新资料。 |
| 失败重试 | 网络波动时自动恢复。 |
| 并发控制 | 防止请求过快或资源打满。 |
| 任务日志 | 追踪哪批数据失败、缺失或重复。 |

## 典型技术链路

1. 定时发现新链接。
2. 抓取网页或文件。
3. 解析正文和元数据。
4. 清洗去重。
5. 写入数据库或对象存储。
6. 触发知识库切分和向量化。
7. 记录任务状态和异常。

<figure class="article-figure">
  <img src="/concepts/ai-tech/03-flowchart-rag-pipeline.png" alt="资料进入知识库链路">
  <figcaption>任务调度让公开资料或内部文档能持续进入知识库，而不是靠人工偶尔上传。</figcaption>
</figure>

## 示例代码

下面是一个最小网页抓取示例，包含请求、编码处理和标题提取：

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"
response = requests.get(url, timeout=10)
response.raise_for_status()
response.encoding = response.apparent_encoding

soup = BeautifulSoup(response.text, "html.parser")
title = soup.get_text(" ", strip=True)[:120]
print({"url": url, "preview": title})
```

真实项目还需要增加限速、重试、去重、robots 和版权合规检查。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

Python 爬虫 | 任务调度之 Celery 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 脚本参数、文件路径、环境变量、网络地址、账号权限。 |
| 处理 | 读取配置、检查依赖、执行命令或任务、写日志。 |
| 输出 | 文件、状态码、日志、任务结果、错误栈。 |
| 指标 | 运行耗时、失败率、重试次数、资源占用。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 路径 | 所有相对路径都依赖工作目录，生产脚本建议使用绝对路径或配置化路径。 |
| 权限 | 读、写、执行权限要分别确认，容器内用户和宿主机用户也可能不同。 |
| 依赖版本 | Python、系统库、CUDA、驱动、三方包版本要能复现。 |
| 日志级别 | 至少区分 info、warning、error，错误要保留堆栈。 |

## 可运行检查

```bash
pwd
whoami
python --version
python -m pip freeze | head
ls -lah
df -h
ps aux | head
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 可复现 | 换一台机器或换一个目录后能按文档跑通。 |
| 可定位 | 失败时能从日志看到输入、配置、错误栈和耗时。 |
| 可回滚 | 改配置或依赖后能恢复到上一个可用版本。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 环境不一致 | 本地、服务器、容器里的 Python、依赖、系统库不同。 | 记录版本并用锁文件或镜像固定。 |
| 路径错误 | 脚本依赖相对路径，换目录后读不到文件。 | 打印工作目录，关键路径配置化。 |
| 权限错误 | 运行账号没有读写执行权限。 | 分别检查文件权限、目录权限和容器用户。 |

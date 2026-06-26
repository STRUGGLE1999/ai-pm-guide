# Python 爬虫实例

学习爬虫最好从具体例子开始。从技术学习角度看，实例的重点不是代码技巧，而是理解一个数据采集需求从“想要资料”到“可进入系统链路”之间有哪些步骤。

<figure class="article-figure">
  <img src="/concepts/ai-tech/03-flowchart-rag-pipeline.png" alt="资料采集到知识库链路">
  <figcaption>爬虫实例最终要服务于资料整理、知识库建设、评测样本生成或运营分析。</figcaption>
</figure>

## 示例一：采集产品文档

目标：把公开产品文档整理进内部知识库。

需要关注：

- URL 列表从哪里来。
- 标题、正文、更新时间怎么提取。
- 多级目录如何保留层级。
- 重复页面如何去重。
- 文档更新后如何重新入库。

## 示例二：采集政策公告

目标：追踪政策更新，辅助生成解读和提醒。

需要关注：

- 来源是否权威。
- 发布时间是否可靠。
- 附件 PDF 是否能解析。
- 是否保留原文链接和快照。
- 摘要是否需要人工审核。

## 示例三：采集用户评论

目标：分析用户反馈主题和情绪。

需要关注：

- 平台规则和隐私边界。
- 评论是否有时间、产品版本、评分。
- 是否存在水军、刷评、重复评论。
- 情绪分析和主题聚类如何验证。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="数据采集质量闭环">
  <figcaption>每个爬虫实例都应该进入质量闭环：采集成功率、字段完整率、重复率、可用率和 Bad Case。</figcaption>
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

Python 爬虫实例 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

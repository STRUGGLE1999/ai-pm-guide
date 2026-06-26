# Python 爬虫之网页字符编码处理

字符编码问题看起来很小，但会直接影响知识库质量。网页抓下来后如果中文乱码、标点错乱、特殊符号丢失，后续分词、检索、摘要和问答都会被污染。

<figure class="article-figure">
  <img src="/concepts/ai-tech/03-flowchart-rag-pipeline.png" alt="RAG 数据处理链路">
  <figcaption>编码处理属于知识库入库前的清洗环节，影响后续切分、向量化和检索质量。</figcaption>
</figure>

## 为什么会乱码

常见原因包括：

- 网页声明的编码和实际编码不一致。
- 服务端返回头没有写清楚 charset。
- 页面混合了 UTF-8、GBK、Big5 等历史编码。
- 压缩、转码、复制粘贴过程中破坏了字符。
- 抓取 PDF、Word、HTML 时使用了错误解析器。

## 需要知道的影响

乱码不是“显示不好看”这么简单。对于 AI 系统，它会带来这些问题：

| 影响 | 后果 |
| --- | --- |
| 关键词丢失 | 检索召回变差。 |
| 字段错乱 | 抽取结果不稳定。 |
| 文档切分异常 | Chunk 语义断裂。 |
| 训练样本污染 | 模型学到噪声。 |
| 引用不可读 | 用户无法信任答案来源。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="数据质量闭环">
  <figcaption>编码错误要作为数据质量问题进入监控，而不是等用户发现答案乱码后再修。</figcaption>
</figure>

## 处理建议

技术上通常会检查 HTTP Header、HTML meta 标签、解析库自动识别结果，并在必要时手动指定编码。技术上更重要的是建立数据质量检查：抽样看原文、正文、标题、段落、特殊符号是否正常。

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

Python 爬虫之网页字符编码处理 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

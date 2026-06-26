# 第三章 深度 NLP 模型

深度 NLP 模型关注文本和序列如何被神经网络处理。从 RNN 到 Attention，再到 Transformer，核心问题都是：模型如何理解上下文、顺序和长距离关系。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="深度 NLP 模型链路">
  <figcaption>深度 NLP 模型最终会影响上下文窗口、推理成本、生成质量和输出可控性。</figcaption>
</figure>

## 本章能力地图

| 模型 / 机制 | 解决什么 | 工程影响 |
| --- | --- | --- |
| RNN | 按顺序处理文本和时间序列。 | 理解状态和上下文。 |
| Attention | 动态关注重要片段。 | 影响长文本理解和证据定位。 |
| Transformer | 并行处理上下文关系。 | 支撑大语言模型和多模态模型。 |
| Seq2Seq | 输入序列生成输出序列。 | 翻译、摘要、抽取、生成。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="深度 NLP 质量闭环">
  <figcaption>模型结构再强，也要回到评测、Bad Case 和线上反馈来证明价值。</figcaption>
</figure>

## 示例代码

下面用 Python 做一个最小文本预处理和词频统计：

```python
import re
from collections import Counter

text = "RAG uses retrieval, reranking, and generation. Retrieval quality matters."
tokens = re.findall(r"[a-zA-Z]+", text.lower())
counts = Counter(tokens)

print(tokens)
print(counts.most_common(5))
```

传统 NLP 和大模型应用都离不开文本清洗、切分、表示和评估。先用简单代码看清输入，再接复杂模型。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

第三章 深度 NLP 模型 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 原始文本、文档段落、OCR 结果、聊天记录、HTML 或日志。 |
| 处理 | 清洗、分句、切分、Tokenization、表示、分类/抽取/匹配。 |
| 输出 | 类别、实体、关系、摘要、相似度、检索片段或生成文本。 |
| 指标 | 精确率、召回率、F1、引用命中率、人工一致性。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 切分粒度 | 过短会丢上下文，过长会引入噪声并增加成本。 |
| 保留结构 | 标题、表格、列表、页码和说话人经常是重要语义。 |
| 实体边界 | 要定义清楚什么算实体，别名、缩写、编号都要处理。 |
| 脱敏规则 | 脱敏不能破坏关键字段，否则会影响抽取和匹配。 |

## 可运行检查

```python
import re

text = "张三在 2026-06-25 提交了合同，金额为 12000 元。"
dates = re.findall(r"\d{4}-\d{2}-\d{2}", text)
amounts = re.findall(r"\d+(?:\.\d+)?\s*元", text)
print({"dates": dates, "amounts": amounts})
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 样本抽查 | 每次改清洗或切分规则后抽查原文、片段和输出。 |
| 长文本表现 | 单独评估长文档、表格、附件和 OCR 噪声。 |
| 证据链 | 抽取或生成结果要能追溯到原文位置。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 切分破坏语义 | 长文档被切断，答案证据分散。 | 抽查原文和 chunk，调整重叠窗口。 |
| 实体边界不一致 | 标注人对组织、区域、产品型号口径不同。 | 先写实体定义和反例。 |
| 清洗过度 | 标题、表格、编号被删除。 | 保留结构化元素并在解析后抽样检查。 |

# 3.1 循环神经网络（RNN）

RNN 是一种按顺序处理数据的神经网络，适合早期文本、语音、时间序列任务。它会把前面的信息传到后面，帮助模型理解序列。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="大语言模型调用链路">
  <figcaption>NLP 能力最终会进入输入、上下文、模型、输出和后处理链路。</figcaption>
</figure>

## RNN 解决什么

普通神经网络很难直接处理“顺序”。RNN 让模型在读一句话时保留前文状态，例如读到“我昨天买的手机，今天它坏了”，模型需要知道“它”指手机。

## 局限

RNN 在长文本上容易遗忘前面的信息，训练也不容易并行。LSTM、GRU 改善了这个问题，但仍然难以支撑今天大模型的长上下文需求。

## 为什么仍需了解

RNN 帮你理解“序列建模”这件事：语音、文本、用户行为、时间序列都不是孤立点。即使今天主流架构是 Transformer，很多业务数据仍然需要考虑顺序和上下文。

## 工程实践要点

NLP 不是一个单独功能名，而是一组文本处理能力。技术方案里需要把“理解文本”拆清楚：是分类、抽取、匹配、检索、摘要、改写、翻译，还是多轮对话。不同任务的数据、指标和风险完全不同。

| 任务 | 输入输出 | 关键验收 |
| --- | --- | --- |
| 分类 | 文本 -> 类别。 | Precision、Recall、类别边界。 |
| 抽取 | 文本 -> 字段。 | 字段准确率、缺失率、证据位置。 |
| 相似度 | 文本 -> 相似候选。 | 召回率、TopK 命中、误匹配。 |
| 生成 | 文本/资料 -> 新文本。 | 事实一致性、格式、引用和安全。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/03-flowchart-rag-pipeline.png" alt="RAG 检索增强链路">
  <figcaption>文本理解、相似度和抽取能力经常会成为知识库问答的基础组件。</figcaption>
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

3.1 循环神经网络（RNN） 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | Tensor、Dataset、DataLoader、模型配置和训练参数。 |
| 处理 | 前向计算、loss 计算、反向传播、优化器更新、验证。 |
| 输出 | 模型权重、训练日志、指标曲线、导出模型。 |
| 指标 | loss、验证集指标、训练耗时、显存占用、吞吐。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| shape | 张量形状必须匹配模型输入，图片通道顺序和 batch 维度最容易错。 |
| dtype | float32、float16、int64 会影响计算和 loss。 |
| device | CPU/GPU 混用会直接报错，数据和模型要在同一设备。 |
| batch size | 影响训练稳定性、速度和显存。 |

## 可运行检查

```python
import torch

x = torch.randn(8, 3, 224, 224)
print("shape", x.shape)
print("dtype", x.dtype)
print("device", x.device)
print("min/max", float(x.min()), float(x.max()))
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 小样本过拟合 | 先确认模型能在很小数据上过拟合，排除链路错误。 |
| 训练曲线 | 同时看训练集和验证集曲线，判断欠拟合或过拟合。 |
| 导出一致性 | 导出模型前后用同一输入比较输出。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 训练不收敛 | 学习率、数据标准化、loss 或标签类型不匹配。 | 先让模型在小样本上过拟合。 |
| 设备不一致 | 模型在 GPU，输入还在 CPU。 | 打印 tensor.device，统一 `.to(device)`。 |
| 导出后结果不同 | 训练预处理和推理预处理不一致。 | 保存预处理配置，并用同一输入对比输出。 |

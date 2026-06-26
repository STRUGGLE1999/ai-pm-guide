# 3.3 Transformer 架构

Transformer 是当前大语言模型的核心架构。它通过注意力机制并行处理上下文，让模型更擅长处理长文本、复杂关系和生成任务。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="Transformer 在大模型调用链路中的位置">
  <figcaption>用户看到的是一句回答，底层是 Token、位置、注意力和多层 Transformer 共同计算的结果。</figcaption>
</figure>

## 三个关键词

| 概念 | 通俗理解 |
| --- | --- |
| Token | 模型处理文本的基本单位。 |
| Attention | 判断上下文里哪些信息更重要。 |
| Position | 告诉模型 Token 的顺序位置。 |

## Encoder、Decoder

Encoder 更偏理解，适合分类、抽取、匹配。Decoder 更偏生成，适合聊天、写作、代码。Encoder-Decoder 则适合翻译、摘要、改写等输入到输出的转换任务。

## 读者要懂的结论

Transformer 强，但不是没有边界。上下文很长会更贵；资料混乱会让模型答偏；生成模型擅长表达，但事实正确仍要靠检索、工具和评测兜底。

所以大模型系统需要把模型能力、上下文工程、RAG、工具调用和安全治理组合起来看。

## 为什么 Transformer 改变了 NLP

在 RNN 时代，模型按顺序读文本，长距离信息容易衰减，也不利于大规模并行训练。Transformer 通过注意力机制，让模型可以更直接地建模上下文中任意两个位置之间的关系，同时更适合在大数据和大算力上训练。

这带来两个系统层面的变化：

1. 模型可以处理更复杂的语言任务，不再只做单一分类或抽取。
2. 同一个基础模型可以通过 Prompt、RAG、工具调用适配很多应用场景。

## 但它仍然不是万能的

Transformer 强在模式学习和上下文建模，但它不会自动知道你的企业权限、最新政策、实时库存和客户数据。凡是涉及事实、权限、实时数据和高风险动作的功能，都需要接入外部系统，并通过评测和治理约束输出。

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

3.3 Transformer 架构 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

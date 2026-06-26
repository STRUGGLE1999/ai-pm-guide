# ngram Python 核心代码

ngram Python 核心代码通常会包含文本读取、分词或字符切分、统计上下文频次、根据概率采样生成。它适合用来理解语言模型的最小闭环。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="ngram 生成链路">
  <figcaption>ngram 代码把“输入上下文 -> 查询统计 -> 生成下一个单位”的链路写得非常直观。</figcaption>
</figure>

## 代码里要看懂什么

| 代码部分 | 技术含义 |
| --- | --- |
| 读取语料 | 模型从什么数据学习语言模式。 |
| 构建词表 | 能识别哪些字符或词。 |
| 统计频次 | 上下文后面常出现什么。 |
| 概率采样 | 为什么每次生成可能不同。 |
| 生成循环 | 输出是一步一步产生的。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="模型代码与技术判断">
  <figcaption>读核心代码的目的不是写模型，而是理解数据、上下文、生成和评测之间的关系。</figcaption>
</figure>

## 示例代码

下面用 PyTorch 写一个最小的前向计算，展示 Tensor、线性层和输出 shape：

```python
import torch
from torch import nn

model = nn.Sequential(
    nn.Linear(4, 8),
    nn.ReLU(),
    nn.Linear(8, 3),
)

x = torch.randn(5, 4)
y = model(x)

print("input shape:", x.shape)
print("output shape:", y.shape)
```

深度学习文档里经常先确认 shape。输入维度、batch size 和输出维度不匹配，是训练和推理最常见的问题之一。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

ngram Python 核心代码 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 向量、矩阵、序列、图像张量或嵌入表示。 |
| 处理 | 线性变换、非线性激活、归一化、注意力、卷积或循环结构。 |
| 输出 | logits、概率、embedding、生成 token 或预测值。 |
| 指标 | loss、梯度范数、验证指标、显存、推理延迟。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 参数量 | 参数越多不一定越好，会增加训练和推理成本。 |
| 学习率 | 过大会震荡，过小会收敛慢。 |
| 激活函数 | 影响非线性表达能力和梯度传播。 |
| 序列长度 | 直接影响注意力计算量和显存。 |

## 可运行检查

```python
import torch
from torch import nn

layer = nn.Linear(4, 2)
x = torch.randn(3, 4)
y = layer(x)
loss = y.pow(2).mean()
loss.backward()
print("output", y.shape)
print("grad", layer.weight.grad.shape)
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 梯度检查 | 查看梯度是否为 None、是否爆炸或接近 0。 |
| loss 曲线 | 观察训练是否下降、是否震荡、是否过拟合。 |
| 推理开销 | 记录输入长度、batch、显存和单次耗时。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 梯度消失或爆炸 | 网络太深、初始化或学习率不合适。 | 打印梯度范数，观察 loss 曲线。 |
| 只看 loss 不看样本 | loss 降低但输出仍不符合任务。 | 固定几条样本做可视化或文本对比。 |
| 上下文长度失控 | 序列越长显存和计算越高。 | 记录输入长度分布和显存峰值。 |

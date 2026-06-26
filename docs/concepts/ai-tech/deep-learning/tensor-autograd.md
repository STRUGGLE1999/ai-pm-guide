# Tensor 与自动微分

Tensor 可以理解成多维数组。图片、音频、文本向量、模型参数都可以表示成 Tensor。自动微分则负责计算梯度，让模型能训练。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="模型调用链路">
  <figcaption>从模型内部原理到线上体验，中间还隔着上下文、参数、输出约束和服务链路。</figcaption>
</figure>

## Tensor 形状很重要

| 数据 | 常见形状直觉 |
| --- | --- |
| 单条文本 Embedding | 向量。 |
| 一批文本 Embedding | 批大小 × 向量维度。 |
| 图片 | 高 × 宽 × 通道。 |
| 视频 | 帧 × 高 × 宽 × 通道。 |

形状错了，模型服务可能直接失败。批量大小、序列长度、图片尺寸也会影响显存和速度。

## 技术要点

1. 输入是否需要统一尺寸或长度？
2. 批处理大小如何影响延迟？
3. 训练和线上推理的预处理是否一致？
4. 数据转换是否会丢失重要结构？

Tensor 是算法工程师的日常语言，读者懂它的直觉，就更容易理解训练和推理的成本。

## 工程实践要点

深度学习原理不要求读者推导公式，但要能理解模型能力和成本为什么会变化。模型不是“越大越好”，也不是“训练一次就结束”。数据、目标函数、模型结构、推理方式都会影响最终线上体验。

| 关注点 | 技术含义 |
| --- | --- |
| 参数量 | 影响能力、显存、延迟和成本。 |
| 上下文长度 | 影响长文档、多轮对话和 Token 成本。 |
| 训练目标 | 决定模型到底在优化什么。 |
| 推理策略 | 影响输出稳定性、多样性和速度。 |
| 微调方式 | 影响定制化能力、数据要求和维护成本。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 质量闭环">
  <figcaption>模型训练、微调和上线都需要评测、反馈和回归测试持续校准。</figcaption>
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

Tensor 与自动微分 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

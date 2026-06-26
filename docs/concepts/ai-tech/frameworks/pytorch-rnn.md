# PyTorch 循环神经网络

PyTorch 循环神经网络用于理解序列数据：文本、语音、时间序列、用户行为路径都不是孤立点，而是有前后顺序。RNN、LSTM、GRU 曾经是序列建模的重要工具。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="序列模型调用链路">
  <figcaption>序列模型提醒我们：上下文、顺序和状态会影响模型输出，不是每个输入都能孤立处理。</figcaption>
</figure>

## 为什么还要了解 RNN

今天大模型主要依赖 Transformer，但 RNN 仍然能帮助你理解“状态”和“序列”这件事。用户行为预测、语音识别、时间序列预警、多轮对话，都需要考虑前文或历史状态。

| 场景 | 序列含义 |
| --- | --- |
| 文本 | 前后词语影响语义。 |
| 语音 | 声音帧按时间排列。 |
| 用户行为 | 浏览、点击、购买有先后关系。 |
| 设备数据 | 指标随时间变化。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="序列任务质量闭环">
  <figcaption>序列任务上线后要持续观察真实输入长度、异常序列和模型退化。</figcaption>
</figure>

## 示例代码

下面用 PyTorch 写一个最小训练循环：

```python
import torch
from torch import nn

X = torch.randn(32, 4)
y = torch.randint(0, 3, (32,))

model = nn.Linear(4, 3)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for step in range(20):
    logits = model(X)
    loss = loss_fn(logits, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

print("loss:", float(loss))
```

训练循环的固定顺序是前向计算、计算损失、清空梯度、反向传播、更新参数。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

PyTorch 循环神经网络 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

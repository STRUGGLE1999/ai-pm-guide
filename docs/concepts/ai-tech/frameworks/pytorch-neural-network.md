# PyTorch 神经网络基础

PyTorch 通过 `torch.nn` 组织神经网络层。线性层、卷积层、循环层、Transformer 层都可以组合成模型。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 质量闭环">
  <figcaption>训练框架只是工具，真正影响工程质量的是数据、评测、部署和反馈闭环。</figcaption>
</figure>

## 常见网络层

| 层类型 | 适合任务 |
| --- | --- |
| Linear | 结构化特征、分类、回归。 |
| Conv | 图像、局部特征。 |
| RNN / LSTM | 序列和时间数据。 |
| Transformer | 文本、多模态、长上下文。 |

## 技术要点

模型结构越复杂，训练和推理成本通常越高。需求讨论中需要把“效果提升”与“成本、延迟、可解释性”一起看。

如果只是固定分类任务，不一定要复杂架构；如果是多模态理解或复杂生成，模型能力要求会更高。

## 工程实践要点

框架本身不是工程价值，但框架会影响实验效率、模型交付和线上维护。读者需要关注的不是“用了 PyTorch 还是 TensorFlow”，而是实验结果能否复现、模型能否稳定导出、训练和线上处理是否一致。

| 环节 | 需要确认 |
| --- | --- |
| 数据加载 | 训练、验证、测试是否隔离，是否贴近真实输入。 |
| 模型训练 | 指标、参数、数据版本是否记录。 |
| 模型保存 | 是否能导出给推理服务使用。 |
| 推理服务 | 延迟、吞吐、资源占用是否达标。 |
| 监控回流 | Bad Case 是否能回到数据和评测集。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="大语言模型调用链路">
  <figcaption>框架实验要走向服务调用，必须关注模型文件、接口、参数和线上监控。</figcaption>
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

PyTorch 神经网络基础 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

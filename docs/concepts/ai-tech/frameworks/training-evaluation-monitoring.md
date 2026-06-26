# 训练、评估与监控

训练框架只是工具，真正的 AI 系统闭环是训练、评估、上线、监控和回流。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 质量闭环">
  <figcaption>训练框架只是工具，真正影响工程质量的是数据、评测、部署和反馈闭环。</figcaption>
</figure>

## 基本流程

1. 准备数据和标签。
2. 划分训练集、验证集、测试集。
3. 训练模型。
4. 用离线指标评估。
5. 灰度上线。
6. 监控线上质量、延迟、成本和错误。
7. 收集 Bad Case 回流。

## 技术要点

- 评测集是否代表真实用户。
- 指标是否匹配业务风险。
- 上线后是否有日志和看板。
- 版本变化是否可追踪。
- 出问题能否回滚。

训练不是结束，真实用户环境才是 AI 系统的长期考试。

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

训练、评估与监控 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

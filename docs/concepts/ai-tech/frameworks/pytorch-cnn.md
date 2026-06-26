# PyTorch 卷积神经网络

PyTorch 卷积神经网络常用于图像分类、缺陷检测、OCR 前处理、医学影像、商品识别等视觉任务。CNN 的核心是从局部区域提取边缘、纹理、形状，再逐层组合成更复杂的视觉特征。

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="AI 视觉任务地图">
  <figcaption>视觉模型要放进完整系统链路里看：图片输入、质量控制、模型识别、人工复核和业务动作。</figcaption>
</figure>

## 技术要点

视觉任务最容易被样例图误导。标准样例很清楚，真实用户上传的图片可能模糊、遮挡、反光、倾斜、压缩、带水印或被裁切。

| 问题 | 工程影响 |
| --- | --- |
| 图片质量差 | 模型识别不稳定。 |
| 类别定义不清 | 标注和评测混乱。 |
| 样本场景单一 | 上线后泛化差。 |
| 漏检和误检代价不同 | 指标选择不同。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="视觉模型质量闭环">
  <figcaption>视觉任务需需要把真实图片 Bad Case 回流到数据集、标注规则和评测集。</figcaption>
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

PyTorch 卷积神经网络 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

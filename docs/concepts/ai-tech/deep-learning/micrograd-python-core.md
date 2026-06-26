# Micrograd Python 核心代码

Micrograd Python 核心代码展示了自动微分的最小实现：每个数值节点记录自己的计算来源，最终通过反向传播计算梯度。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="自动微分计算图">
  <figcaption>自动微分把一次模型计算拆成计算图，方便从误差反推每个参数该如何调整。</figcaption>
</figure>

## 代码里最值得看什么

| 代码点 | 技术理解 |
| --- | --- |
| Value 类 | 模型计算的最小节点。 |
| 运算重载 | 加法、乘法等操作会记录关系。 |
| backward | 触发反向传播。 |
| grad | 表示参数对误差的贡献。 |
| 拓扑排序 | 确保按正确顺序反传。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="自动微分质量闭环">
  <figcaption>自动微分只是训练机制，最终仍要看模型是否在真实评测中变好。</figcaption>
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

Micrograd Python 核心代码 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

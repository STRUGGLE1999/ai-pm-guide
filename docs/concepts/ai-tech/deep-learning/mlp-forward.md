# MLP 与前向传播

MLP 是多层感知机，可以理解成最基础的全连接神经网络。前向传播是输入从第一层一路计算到输出的过程。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="模型调用链路">
  <figcaption>从模型内部原理到线上体验，中间还隔着上下文、参数、输出约束和服务链路。</figcaption>
</figure>

## 为什么要懂 MLP

MLP 虽然简单，但它解释了很多深度学习基本概念：权重、偏置、激活函数、损失、优化、过拟合。理解 MLP 后，再看 CNN、RNN、Transformer 会更容易。

## 技术视角

在很多结构化数据任务中，MLP 仍然可用。例如用户特征、商品特征、行为特征经过向量化后，可以进入 MLP 做分类或预测。它不一定像大模型那样显眼，但可能更便宜、更稳定。

## 常见问题

- 输入特征质量差，模型学不到有效规律。
- 训练集表现好，测试集表现差。
- 模型输出概率，但业务需要明确阈值。
- 指标变好，但解释性变差。

对读者来说，MLP 是理解“模型如何从数字到判断”的入口。

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

MLP 与前向传播 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

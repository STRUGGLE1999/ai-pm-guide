# 卷积神经网络

卷积神经网络课程关注图像模型如何识别局部特征，并逐层组合成更复杂的视觉理解能力。它是理解图像分类、检测、分割和视觉审核的重要基础。

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="CNN 与视觉产品">
  <figcaption>CNN 能力要放到视觉系统链路中看：图片采集、标注、训练、识别、复核和反馈。</figcaption>
</figure>

## 技术视角

视觉模型的难点通常不在“能不能识别标准样例”，而在真实输入：角度、光照、遮挡、模糊、压缩、截图、反光、水印都会影响结果。

| 任务 | 关注 |
| --- | --- |
| 分类 | 类别边界和样本覆盖。 |
| 检测 | 漏检、误检和框的位置。 |
| 分割 | 边界精度和人工修正。 |
| OCR | 字符准确率和版面结构。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="视觉模型质量闭环">
  <figcaption>视觉模型必须持续回流真实图片 Bad Case，更新样本和评测集。</figcaption>
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

卷积神经网络 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

# TensorFlow 模型训练

TensorFlow 模型训练是把数据、模型结构、损失函数和优化器组合起来，通过反复迭代让模型学会任务规律。读者要关注训练是否可信，而不是只关心分数高不高。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="TensorFlow 训练质量闭环">
  <figcaption>训练结果只有进入评测、上线、监控和反馈闭环，才有工程价值。</figcaption>
</figure>

## 训练要看什么

| 项目 | 需要确认 |
| --- | --- |
| 数据集 | 来源、规模、标签、覆盖场景。 |
| 切分 | 训练、验证、测试是否隔离。 |
| 指标 | 是否匹配业务风险。 |
| 过拟合 | 训练好、验证差是否出现。 |
| 记录 | 参数、数据版本、模型版本是否可追踪。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="模型训练在 AI 系统中的位置">
  <figcaption>模型训练是能力建设的一环，必须服务于明确技术任务和验收标准。</figcaption>
</figure>

## 示例代码

下面用 Keras 定义一个最小分类网络：

```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(4,)),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(3, activation="softmax"),
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

model.summary()
```

这段代码包含输入形状、网络层、损失函数、优化器和指标，是理解 TensorFlow/Keras 训练流程的最小骨架。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

TensorFlow 模型训练 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

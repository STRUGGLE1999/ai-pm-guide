# TensorFlow 数据处理与管道

TensorFlow 数据处理与管道负责把原始样本稳定、高效地送进模型。数据管道质量会影响训练速度、指标可信度和线上一致性。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="数据管道质量闭环">
  <figcaption>数据管道连接样本、训练、评测和上线，是模型质量的入口。</figcaption>
</figure>

## 数据管道做什么

- 读取文件或数据源。
- 解析字段和标签。
- 清洗、转换、增强。
- 打乱、批处理、缓存。
- 切分训练、验证、测试数据。

<figure class="article-figure">
  <img src="/concepts/ai-tech/03-flowchart-rag-pipeline.png" alt="数据进入模型链路">
  <figcaption>无论是模型训练还是知识库建设，数据进入系统前都要经过清洗、转换和质量检查。</figcaption>
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

TensorFlow 数据处理与管道 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

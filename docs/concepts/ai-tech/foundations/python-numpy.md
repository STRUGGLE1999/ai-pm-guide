# Python 与 NumPy 入门

Python 是 AI 项目最常见的胶水语言。数据清洗、模型训练、推理脚本、评测工具、Notebook 实验，大量都会用 Python。NumPy 则是理解数组、矩阵、张量计算的入口。

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="Python 在 AI 系统链路中的位置">
  <figcaption>Python 常出现在数据处理、模型实验、评测脚本、服务封装这些环节。</figcaption>
</figure>

## Python 在 AI 项目里做什么

| 用途 | 例子 | 需要关注 |
| --- | --- | --- |
| 数据处理 | 清洗 CSV、解析 JSON、处理日志。 | 数据字段是否稳定，清洗规则是否可复现。 |
| 模型实验 | 跑训练脚本、加载模型、计算指标。 | 实验结果是否有版本和记录。 |
| 服务封装 | 写 API、批处理任务、工具脚本。 | 是否有超时、重试、日志和权限控制。 |
| 自动化评测 | 批量调用模型并评分。 | 评测集是否固定，指标是否可信。 |

## NumPy 为什么重要

NumPy 的核心是多维数组。文本、图片、语音、用户特征、Embedding，最后都可以变成一组数字。理解数组形状，能帮你听懂很多研发讨论：

- 图片常见形状是 `高 × 宽 × 通道`。
- 文本 Embedding 是一维向量。
- 批量输入会多一个 batch 维度。
- 模型输入形状错了，服务可能直接报错。

## 先用代码理解这些问题

1. 数据是列表、表格、图片、文本还是向量？
2. 批处理一次处理多少条？
3. 输入是否需要归一化、填充或截断？
4. 评测脚本是否能重复运行？
5. 线上和离线处理逻辑是否一致？

很多 AI 质量问题来自“训练时的数据处理”和“上线时的数据处理”不一致。用 NumPy 先把数据形状、字段类型、缺失值和归一化结果打印出来，是排查这类问题的第一步。

## 一个真实例子：字段抽取评测

假设要做“合同关键字段抽取”，可以用 Python 脚本批量调用模型，然后用标准答案计算字段准确率。这里至少有几层逻辑：

1. 读取合同样本和标准答案。
2. 调用 OCR 或文档解析。
3. 调用模型抽取字段。
4. 对比模型输出和标准答案。
5. 统计每个字段的准确率、缺失率、格式错误率。

可以先从运行脚本开始，理解评测脚本是否覆盖了关键字段。比如合同金额准确率高，不代表付款条件、违约责任、有效期也准确。

## NumPy 和 Tensor 的关系

NumPy 的数组更常出现在数据处理和传统机器学习里；Tensor 则更常出现在 PyTorch、TensorFlow 训练和推理里。它们都在处理多维数字，只是运行环境和自动求导能力不同。

你可以把它们理解成 AI 系统里的“数字容器”。文字、图片、语音、用户行为，最终都会变成某种数字表示，再进入模型。

## 工程实践要点

工程基础的目标是定位“问题发生在哪一层”。同样是功能不可用，可能是文件路径错、环境变量缺失、依赖版本冲突、权限不足、网络不通，也可能才是模型能力不够。

做方案时可以把工程问题拆成四类：

| 类别 | 典型问题 | 需要确认 |
| --- | --- | --- |
| 环境 | Python、CUDA、依赖、系统版本不一致。 | 是否有可复现安装步骤和环境清单。 |
| 数据 | 文件格式、编码、路径、字段缺失。 | 样本来源、字段定义、异常数据处理。 |
| 权限 | 读不到文件、调不了接口、访问不了知识库。 | 账号、角色、数据范围和审计要求。 |
| 运行 | 日志报错、任务超时、资源不足。 | 是否有日志、监控、重试和回滚。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 质量闭环">
  <figcaption>工程问题最终要回到可复现、可监控、可回流的质量闭环。</figcaption>
</figure>

## 示例代码

下面的代码演示 Python 和 NumPy 如何把原始列表转换成二维数组，并计算每列均值：

```python
import numpy as np

features = np.array([
    [120, 3, 0.82],
    [95, 2, 0.71],
    [143, 5, 0.91],
])

print("shape:", features.shape)
print("mean:", features.mean(axis=0))
```

数组的 shape 是很多模型输入错误的源头。进入训练或推理前，先打印 shape 是一个很实用的习惯。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

NumPy 的重点不是“会不会写 Python”，而是能否看懂数组在 AI 系统里的形状、类型和数值范围。模型报错时，很多问题都不是模型本身，而是输入数组的维度、dtype、缺失值或归一化方式不一致。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | Python list、CSV 列、图像像素、Embedding、批量特征矩阵。 |
| 处理 | 转成 ndarray、检查 shape、处理缺失值、归一化、拼接或切片。 |
| 输出 | 新的数组、统计量、模型输入张量、评测指标。 |
| 指标 | shape 是否符合预期、dtype 是否正确、数值范围是否稳定、是否存在 NaN。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| shape | 表示数组每个维度的长度，例如 `(batch, features)` 或 `(height, width, channels)`。 |
| dtype | 表示数值类型，例如 `float32`、`int64`。训练和推理常要求固定 dtype。 |
| axis | 决定按哪个维度聚合，`axis=0` 常表示按列统计，`axis=1` 常表示按行统计。 |
| broadcasting | NumPy 会自动扩展某些维度参与计算，方便但也可能掩盖 shape 错误。 |
| NaN / inf | 缺失值或无穷大会让均值、归一化、模型输入直接异常。 |

## 可运行检查

```python
import numpy as np

features = np.array([
    [120, 3, 0.82],
    [95, 2, 0.71],
    [143, 5, np.nan],
], dtype=np.float32)

print("shape:", features.shape)
print("dtype:", features.dtype)
print("has_nan:", np.isnan(features).any())

# 按列计算均值，忽略 NaN
col_mean = np.nanmean(features, axis=0)
print("column_mean:", col_mean)

# 用列均值填补缺失值
filled = np.where(np.isnan(features), col_mean, features)
print(filled)
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| shape 可解释 | 能说清每个维度代表样本、特征、通道还是序列长度。 |
| dtype 可控制 | 知道什么时候需要 float32、int64，以及 dtype 不匹配会怎样报错。 |
| 预处理可复现 | 训练和推理使用同一套缺失值、归一化、截断规则。 |
| 异常可定位 | 看到 NaN、shape mismatch、broadcasting 错误时知道先打印哪些信息。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| shape mismatch | 模型期望 `(batch, features)`，实际传入一维数组或多了通道维。 | 打印 `array.shape`，在进入模型前统一 reshape。 |
| dtype 不匹配 | 模型或 loss 需要 float32 / int64，输入却是 object 或 float64。 | 打印 `array.dtype`，在预处理阶段显式 astype。 |
| NaN 传播 | 缺失值进入均值、归一化或模型后让输出变成 NaN。 | 用 `np.isnan(x).any()` 检查，并记录填补策略。 |

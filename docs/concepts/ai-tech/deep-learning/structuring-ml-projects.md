# 搭建机器学习项目

搭建机器学习项目的重点，是把业务目标、数据、模型、评测、上线和反馈组织成可推进的工程项目。从技术学习角度看，这比单个算法更重要。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="机器学习项目闭环">
  <figcaption>一个完整机器学习项目必须包含数据、评测、上线、监控和反馈，而不只是训练模型。</figcaption>
</figure>

## 项目结构

| 阶段 | 要负责推动 |
| --- | --- |
| 问题定义 | 任务、用户、场景、不可接受错误。 |
| 数据准备 | 来源、标签、质量、隐私、覆盖。 |
| 模型实验 | 基线、指标、版本、错误分析。 |
| 上线设计 | 接口、灰度、兜底、人工复核。 |
| 运营迭代 | 监控、Bad Case、反馈回流。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="机器学习项目流程">
  <figcaption>机器学习项目通常更像可管理的 Workflow：每一步都要有输入、输出和验收标准。</figcaption>
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

搭建机器学习项目 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 样本表、特征列、标签列、训练/验证/测试切分。 |
| 处理 | 特征清洗、模型训练、阈值选择、错误分析。 |
| 输出 | 类别、分数、排序、预测值或异常标记。 |
| 指标 | Accuracy、Precision、Recall、F1、AUC、MAE、RMSE 等。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 数据切分 | 测试集不能参与调参，时间序列还要按时间切。 |
| 标签定义 | 标签口径决定上限，口径不稳定时模型会学到噪声。 |
| 阈值 | 分类模型输出分数后通常还要选阈值，阈值影响误报和漏报。 |
| 基线模型 | 先用简单模型建立 baseline，后续优化才有参照。 |

## 可运行检查

```python
from sklearn.metrics import confusion_matrix, classification_report

y_true = [1, 0, 1, 1, 0]
y_pred = [1, 0, 0, 1, 1]
print(confusion_matrix(y_true, y_pred))
print(classification_report(y_true, y_pred))
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 样本覆盖 | 训练集覆盖主流场景、边界场景和高风险场景。 |
| 错误分桶 | 误判样本按数据问题、标签问题、模型问题、流程问题归类。 |
| 线上漂移 | 上线后持续比较输入分布和离线训练分布。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 标签泄漏 | 训练特征中混入了答案或未来信息。 | 检查特征生成时间和标签时间。 |
| 类别不平衡 | 少数类被平均指标掩盖。 | 查看每个类别的 precision / recall。 |
| 评测集太干净 | 线上噪声、边界样本没有覆盖。 | 把真实 Bad Case 加入回归集。 |

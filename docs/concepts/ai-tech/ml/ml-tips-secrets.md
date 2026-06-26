# 机器学习技巧和秘诀

机器学习项目里，很多关键收益来自朴素但有效的技巧：清理数据、定义好标签、建立基线、检查错误样本、控制数据泄漏、设计反馈闭环。它们听起来不炫，但比盲目换模型更常见、更有效。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="机器学习技巧质量闭环">
  <figcaption>机器学习技巧大多围绕质量闭环展开：让数据更干净、评测更可信、反馈更快回流。</figcaption>
</figure>

## 先做基线

不要一开始就追复杂模型。先用规则、简单模型或现有模型建立基线，明确“现在最低可用水平是多少”。没有基线，就不知道复杂方案到底带来了多少收益。

## 错误样本比平均指标更有价值

平均指标只能告诉你整体表现，错误样本能告诉你产品该怎么改。把 Bad Case 分成几类：数据缺失、标签错误、规则冲突、表达歧义、模型能力不足、线上流程问题。

## 标签定义要先于模型

如果团队对“高风险”“有效线索”“负面情绪”本身没有一致定义，模型训练只会放大混乱。标签说明最好包含正例、反例、边界案例和冲突处理规则。

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="技术读者学习地图">
  <figcaption>技术读者最重要的技巧，是把业务目标翻译成清晰的数据、标签、指标和迭代机制。</figcaption>
</figure>

## 常用技巧清单

1. 先抽样看真实数据，不要只听需求描述。
2. 先做简单基线，再谈复杂模型。
3. 高风险类别单独看 Precision 和 Recall。
4. 检查训练集和测试集是否泄漏。
5. 建立 Bad Case 分类表。
6. 记录每次模型、数据和 Prompt 版本。
7. 上线后持续监控分布变化和用户反馈。

## 示例代码

下面用 scikit-learn 训练一个最小分类模型，并输出验证集准确率：

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
```

这个例子展示了监督学习的基本结构：数据集、切分、训练、预测和指标。真实项目需要把样本、标签、指标和错误分析补完整。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

机器学习技巧和秘诀 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

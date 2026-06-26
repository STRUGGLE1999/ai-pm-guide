# Python 入门机器学习

Python 入门机器学习的重点不是把算法库背下来，而是理解机器学习项目的最小路径：准备数据、拆分数据集、训练模型、评估结果、分析错误、上线监控。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="机器学习质量闭环">
  <figcaption>Python 机器学习实验要落到质量闭环：数据、训练、评估、上线、反馈，而不是只跑出一个分数。</figcaption>
</figure>

## 最小实验流程

一个入门机器学习实验通常包含：

1. 读取数据：CSV、Excel、数据库或 API。
2. 清洗数据：处理空值、异常值、重复值。
3. 构造特征：把业务字段变成模型可用的数字。
4. 划分数据集：训练集、验证集、测试集。
5. 训练模型：先用简单模型建立基线。
6. 评估结果：看指标，也看错误样本。
7. 记录实验：数据版本、参数、指标、结论。

## 技术要点

| 输出 | 技术含义 |
| --- | --- |
| Accuracy | 整体判断对了多少，但类别不均衡时容易误导。 |
| Precision | 预测为正的样本里，有多少是真的。适合控制误伤。 |
| Recall | 真实正样本里，有多少被找出来。适合控制漏判。 |
| Confusion Matrix | 哪些类别容易互相混淆。 |
| Feature Importance | 哪些特征对模型影响大。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="技术读者学习地图">
  <figcaption>Python 入门机器学习的价值，是帮助读者把业务问题翻译成数据、特征、标签和指标。</figcaption>
</figure>

## 常见误区

- 一上来就选复杂模型，没先做简单基线。
- 训练集和测试集混在一起，指标虚高。
- 只看总体准确率，不看高风险类别。
- 没有记录数据版本，实验无法复现。
- 忘记线上数据分布可能和训练数据不同。

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

Python 入门机器学习 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

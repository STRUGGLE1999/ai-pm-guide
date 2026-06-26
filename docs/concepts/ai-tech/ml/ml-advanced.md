# 机器学习进阶

机器学习进阶不是继续背更多算法，而是开始关注泛化能力、特征工程、数据泄漏、类别不平衡、模型解释、线上漂移和实验管理。这些问题决定模型能不能从离线实验走到真实业务。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="机器学习上线质量闭环">
  <figcaption>进阶机器学习关注的不只是训练分数，而是模型上线后的稳定性、可解释性和持续改进。</figcaption>
</figure>

## 进阶要理解的 6 个问题

| 问题 | 含义 | 工程影响 |
| --- | --- | --- |
| 过拟合 | 训练集很好，真实数据变差。 | Demo 好看，上线翻车。 |
| 数据泄漏 | 模型看到了线上不可能知道的信息。 | 离线指标虚高。 |
| 类别不平衡 | 少数类样本太少。 | 风险、投诉、欺诈等少数类被漏掉。 |
| 特征漂移 | 线上数据分布变化。 | 模型效果逐渐下降。 |
| 可解释性 | 为什么给出这个判断。 | 风控、审核、医疗、金融更需要。 |
| 实验追踪 | 数据、参数、指标是否可复现。 | 团队无法判断哪次改动有效。 |

## 从技术视角看模型迭代

模型迭代不能只说“提升了 3 个点”。你要追问：提升的是哪个指标？在哪些样本上提升？有没有牺牲其他类别？线上成本和延迟有没有变化？是否影响已有用户流程？

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="模型服务链路">
  <figcaption>模型进入服务链路后，输入、特征、模型版本、后处理和日志都会影响最终结果。</figcaption>
</figure>

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

机器学习进阶 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

# 强化学习

强化学习关注智能体在环境中采取行动，并根据奖励学习策略。吴恩达课程里的强化学习适合帮助读者理解长期收益、策略优化和反馈设计。

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="强化学习与 Agent">
  <figcaption>强化学习强调动作、反馈和策略，和 Agent 产品里的多步决策有天然关联。</figcaption>
</figure>

## 技术视角

强化学习适合连续决策问题：推荐策略、广告竞价、资源调度、机器人控制、对话策略等。难点是奖励函数是否真的代表业务目标。

| 概念 | 技术含义 |
| --- | --- |
| State | 当前环境和上下文。 |
| Action | 系统可以采取的动作。 |
| Reward | 动作后的反馈。 |
| Policy | 在什么状态下选择什么动作。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="强化学习反馈闭环">
  <figcaption>强化学习的关键是反馈闭环，但真实业务必须控制试错风险。</figcaption>
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

强化学习 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

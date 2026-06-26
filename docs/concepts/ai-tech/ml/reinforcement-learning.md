# 强化学习

强化学习让智能体在环境中不断尝试动作，通过奖励和惩罚学习策略。它常用于游戏、机器人、广告竞价、推荐策略、资源调度，也影响了大语言模型对齐里的 RLHF 思路。

从技术学习角度看，强化学习不一定是日常最常用技术，但它能帮助你理解“策略优化”和“长期收益”这类问题。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="机器学习质量闭环">
  <figcaption>机器学习系统不是训练完就结束，而是数据、评测、上线、反馈、迭代的闭环。</figcaption>
</figure>

## 基本概念

| 概念 | 含义 |
| --- | --- |
| Agent | 做决策的主体。 |
| Environment | Agent 所处的环境。 |
| State | 当前状态。 |
| Action | 可采取的动作。 |
| Reward | 动作带来的反馈。 |
| Policy | 在什么状态下选择什么动作的策略。 |

比如推荐系统里，推荐引擎可以看成 Agent；用户当前画像和场景是 State；推荐某个内容是 Action；点击、购买、停留、投诉是 Reward。

## 它和监督学习有什么区别

监督学习依赖“标准答案”，强化学习依赖“行为之后的反馈”。监督学习更像老师告诉模型每道题答案，强化学习更像模型自己试，试完根据结果调整策略。

这也带来一个难点：短期奖励和长期收益可能冲突。一个内容很容易带来点击，但长期可能让用户疲劳；一个推荐短期转化低，但能帮助用户探索新品。

## 技术上适合什么问题

- 决策会连续发生，而不是一次性判断。
- 动作会影响后续环境。
- 目标不只是眼前点击，还包括长期收益。
- 可以安全试错，或者能在模拟环境中训练。

如果业务不能承受试错，或者反馈很慢、很稀疏，强化学习落地会很难。

## RLHF 和大模型

RLHF 是“基于人类反馈的强化学习”，常用于让大语言模型更符合人类偏好。人类不是给每个 Token 标准答案，而是比较多个回答哪个更好，再训练奖励模型，引导模型输出更符合偏好的结果。

需要理解的是：这类对齐方法依赖高质量偏好数据。偏好标准不清楚，模型就会学到不稳定甚至错误的方向。

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="技术读者学习地图">
  <figcaption>机器学习概念要服务于技术判断：任务、数据、指标、成本和风险。</figcaption>
</figure>

## 工程实践要点

机器学习页面不要只停留在概念解释，要能回到技术决策。每个模型相关需求都可以追问三件事：第一，模型要预测或判断什么；第二，标准答案或反馈从哪里来；第三，错误会造成什么业务后果。

| 问题定义 | 技术映射 | 验收重点 |
| --- | --- | --- |
| 用户意图是什么？ | 分类、文本分类。 | 类别定义、混淆矩阵、低置信度兜底。 |
| 哪些内容更值得推荐？ | 排序、推荐、召回。 | 曝光日志、点击/转化、多样性和负反馈。 |
| 下个月会发生什么？ | 回归、时间序列。 | 误差范围、峰值表现、异常事件处理。 |
| 有没有异常风险？ | 异常检测。 | 漏报、误报、人工复核和报警阈值。 |

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

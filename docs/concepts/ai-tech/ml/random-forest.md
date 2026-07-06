# 随机森林分类模型详解

随机森林属于**集成学习**：不是依赖一棵树，而是让多棵树共同投票或平均，从而提升稳定性和泛化能力。

## 1. Bagging（Bootstrap Aggregating）

Bagging 的核心是“并行训练多个模型，再做平均或投票”。

```mermaid
flowchart LR
D[训练数据] --> A[有放回抽样 1]
D --> B[有放回抽样 2]
D --> C[有放回抽样 3]
A --> T1[树 1]
B --> T2[树 2]
C --> T3[树 3]
T1 --> V[投票 / 平均]
T2 --> V
T3 --> V
V --> R[最终结果]
```

随机森林在 Bagging 的基础上，还会在每次分裂时随机抽取一部分特征候选，降低树与树之间的相似性。

## 2. Boosting

Boosting 的核心是“串行纠错”：后一个模型更关注前一个模型犯错的样本。

```mermaid
flowchart LR
A[弱模型 1] --> B[关注错误样本]
B --> C[弱模型 2]
C --> D[继续关注剩余错误]
D --> E[弱模型 3]
E --> F[加权组合]
```

常见 Boosting 模型：AdaBoost、Gradient Boosting、XGBoost、LightGBM、CatBoost。

## 3. Stacking（Stacked Generalization）

Stacking 的思路是：先训练多个不同类型的基础模型，再训练一个“二级模型”学习如何组合它们的输出。

```mermaid
flowchart LR
X[输入特征] --> A[模型 A]
X --> B[模型 B]
X --> C[模型 C]
A --> M[二级模型 Meta Model]
B --> M
C --> M
M --> Y[最终预测]
```

## 随机森林的优缺点

| 优点 | 缺点 |
|---|---|
| 通常比单棵树稳定，不易过拟合 | 模型体积和预测成本高于单棵树 |
| 能处理非线性与特征交互 | 可解释性弱于单棵树 |
| 对异常值和特征缩放不太敏感 | 高维稀疏文本数据通常不是首选 |
| 可输出特征重要性 | 重要性不等于因果关系 |

## 实例演示：随机森林、Bagging、AdaBoost、Stacking

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestClassifier,
    BaggingClassifier,
    AdaBoostClassifier,
    StackingClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score

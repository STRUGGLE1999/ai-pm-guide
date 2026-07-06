# XGBoost模型详解

XGBoost 是一种高效的梯度提升树实现，常用于结构化表格数据的分类、回归和排序任务。

## 1. 算法原理可视化解读

XGBoost 不是一次训练一棵完美的树，而是按顺序训练许多棵较浅的树：后一棵树重点拟合前面模型还没拟合好的部分。

```mermaid
flowchart LR
A[初始预测] --> B[树 1：学习主要规律]
B --> C[残差 / 错误]
C --> D[树 2：修正剩余错误]
D --> E[残差 / 错误]
E --> F[树 3：继续修正]
F --> G[多棵树加权求和]
```

最终预测可以概念化为：

$$
\hat{y}=f_1(x)+f_2(x)+\cdots+f_T(x)
$$

其中每个 $f_t$ 是一棵树。

## 1) 监督学习中的一些重要概念

### (1) 监督学习核心要素

| 要素 | 在 XGBoost 中的含义 |
|---|---|
| 特征 X | 用户、订单、商品、设备等输入字段 |
| 标签 y | 要预测的真实结果 |
| 预测值 ŷ | 当前所有树的总输出 |
| 损失函数 | 衡量预测与真实标签的差异 |
| 树模型 | 每次新增的一棵“纠错树” |
| 超参数 | 树深、学习率、采样比例、正则化等 |

### (2) 监督学习进阶知识

XGBoost 之所以常在表格数据上表现好，常见原因包括：

- 能自动学习非线性关系和特征交互。
- 每一轮都在修正已有模型的错误。
- 支持行采样、列采样，降低过拟合。
- 有正则化项约束树复杂度。
- 支持并行化和高效的工程实现。

### (3) 目标函数及偏差方差权衡

XGBoost 的目标函数可概括为：

$$
Objective=Training\ Loss+Regularization
$$

- **Training Loss**：希望预测尽量准确。
- **Regularization**：希望模型不要过于复杂，避免只记住训练数据。

偏差—方差直觉：

| 情况 | 模型表现 | 典型现象 |
|---|---|---|
| 高偏差 | 模型太简单 | 训练集和测试集都差，欠拟合 |
| 高方差 | 模型太复杂 | 训练集很好，测试集变差，过拟合 |
| 合理平衡 | 泛化较好 | 训练与测试差距适中 |

## 常用 XGBoost 参数如何理解？

| 参数 | 作用 | 调大 / 调小的直觉 |
|---|---|---|
| `n_estimators` | 树的数量 | 更多树可拟合更复杂规律，但训练更慢 |
| `max_depth` | 单棵树最大深度 | 越大越复杂，也越易过拟合 |
| `learning_rate` | 每棵树的贡献步长 | 越小越稳，通常需要更多树 |
| `subsample` | 每棵树使用的样本比例 | 小于 1 可增加随机性、缓解过拟合 |
| `colsample_bytree` | 每棵树使用的特征比例 | 小于 1 可降低树之间相关性 |
| `min_child_weight` | 子节点继续分裂的最低样本权重要求 | 越大越保守 |
| `reg_lambda` | L2 正则化强度 | 越大越保守 |
| `reg_alpha` | L1 正则化强度 | 可推动部分权重趋近于 0 |

## XGBoost 二分类实例

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from xgboost import XGBClassifier

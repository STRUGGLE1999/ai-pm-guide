# 决策树（Decision Tree）

## 决策树的基本概念

一棵树由以下部分构成：

| 名称 | 含义 |
|---|---|
| 根节点 | 第一次切分数据的位置 |
| 内部节点 | 中间判断条件 |
| 叶节点 | 最终预测结果 |
| 分裂 | 按某个特征和阈值把样本分成两部分 |

## 决策树的工作原理

模型不断寻找一个问题，使分裂后的子集“更纯”。例如：

```text
最近登录天数 <= 15？
├── 是：大多数未流失
└── 否：投诉次数 > 0？
    ├── 是：大多数流失
    └── 否：继续判断月消费金额
```

## 决策树的构建标准

分类树常使用：

- **Gini 不纯度**：节点中的类别混杂程度。
- **信息熵 / 信息增益**：分裂后不确定性减少了多少。

如果一个节点内全是同一类别，纯度高；如果各类别混在一起，纯度低。

## 决策树的优缺点

### 优点

- 可解释性强，能直接展示规则。
- 不需要标准化。
- 能处理非线性与特征交互。
- 可处理分类与回归。

### 缺点

- 单棵树容易过拟合。
- 对训练数据的小变化可能敏感。
- 深树通常泛化能力较差。

## 使用 Python 实现决策树

### 1. 安装必要的库

```bash
python -m pip install scikit-learn matplotlib
```

### 2. 导入库并加载数据集

```python
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.25, random_state=42, stratify=iris.target
)
```

### 3. 训练决策树模型

```python

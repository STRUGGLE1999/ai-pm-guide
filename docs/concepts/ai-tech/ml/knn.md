# K 近邻算法

## KNN 的基本原理

KNN（K-Nearest Neighbors）非常直观：**一个新样本更可能与它周围最相似的 K 个样本属于同一类。**

例如，你要判断一个新用户是否会购买会员：

1. 找到历史上与他“最近”的 K 个用户。
2. 看这 K 个用户中多数是否购买了会员。
3. 多数购买，则预测新用户也会购买。

KNN 分类常使用欧氏距离：

$$
d(x,z)=\sqrt{\sum_{j=1}^{p}(x_j-z_j)^2}
$$

## KNN 的特点

- **懒惰学习**：训练阶段几乎只是保存数据；预测时才计算距离。
- **非参数模型**：不假设数据服从某种固定分布。
- **对尺度敏感**：通常必须标准化。
- **预测成本高**：数据很多时，每次预测都要找邻居。

## KNN 算法的优缺点

| 优点 | 缺点 |
|---|---|
| 原理简单，适合入门 | 数据量大时预测慢 |
| 可以处理非线性边界 | 对特征尺度和噪声敏感 |
| 可用于分类与回归 | 高维空间中“距离”会变得不可靠 |
| 无需显式训练复杂参数 | K 值和距离度量会影响结果 |

## KNN 算法的实现步骤

### 1. 导入必要的库

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error
```

### 2. 加载数据集

```python
iris = load_iris()
X = iris.data[:, :2]  # 为方便可视化，只取前两个特征
y = iris.target
```

### 3. 数据预处理

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

knn_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("knn", KNeighborsClassifier(n_neighbors=5))
])
```

### 4. 训练 KNN 模型

```python
knn_pipeline.fit(X_train, y_train)
```

### 5. 预测与评估

```python
y_pred = knn_pipeline.predict(X_test)
print("KNN 准确率：", accuracy_score(y_test, y_pred))
```

### 6. 可视化 KNN 分类结果

```python

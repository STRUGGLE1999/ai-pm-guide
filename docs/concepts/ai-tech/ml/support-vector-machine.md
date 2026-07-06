# 支持向量机

## SVM 的核心直觉

对于二分类问题，可能有很多条线都能把两类点分开。SVM 不只是寻找“能分开”的线，而是寻找让两类样本离边界都尽量远的线。

```text
类别 A  ● ● ●      |      ○ ○ ○  类别 B
                   ↑
              最大间隔边界
```

距离边界最近的样本叫**支持向量**，它们决定了边界的位置。

## 核函数是什么？

当数据在原始空间中无法用直线分开时，核函数可以让模型在一个更高维的特征空间中寻找线性边界。常见核函数：

| 核函数 | 适用直觉 |
|---|---|
| linear | 数据近似线性可分，速度快 |
| rbf | 常用默认选择，能拟合复杂非线性边界 |
| poly | 多项式关系明显时可尝试 |

## 使用 Python 实现 SVM

### 1. 安装必要的库

```bash
python -m pip install scikit-learn matplotlib
```

### 2. 导入库

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import classification_report
```

### 3. 加载数据集

```python
X, y = make_blobs(
    n_samples=300,
    centers=2,
    cluster_std=2.2,
    random_state=42
)
```

### 4. 划分训练集和测试集

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
```

### 5. 训练 SVM 模型

```python
svm_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("svm", SVC(kernel="rbf", C=1.0, gamma="scale"))
])

svm_pipeline.fit(X_train, y_train)
```

超参数直觉：

- `C` 越大：越严厉惩罚训练错误，边界可能更复杂、更易过拟合。
- `gamma` 越大：单个样本影响范围更小，边界可能更曲折。

### 6. 预测与评估

```python
y_pred = svm_pipeline.predict(X_test)
print(classification_report(y_test, y_pred))
```

### 7. 可视化结果

```python
scaler = svm_pipeline.named_steps["scaler"]
model = svm_pipeline.named_steps["svm"]
X_train_scaled = scaler.transform(X_train)

x_min, x_max = X_train_scaled[:, 0].min() - 1, X_train_scaled[:, 0].max() + 1
y_min, y_max = X_train_scaled[:, 1].min() - 1, X_train_scaled[:, 1].max() + 1
xx, yy = np.meshgrid(
    np.linspace(x_min, x_max, 300),
    np.linspace(y_min, y_max, 300)
)
Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

plt.contourf(xx, yy, Z, alpha=0.25, cmap="coolwarm")
plt.scatter(X_train_scaled[:, 0], X_train_scaled[:, 1], c=y_train, edgecolor="k", cmap="coolwarm")
plt.title("RBF SVM 决策边界")
plt.show()
```

---

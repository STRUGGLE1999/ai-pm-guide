# 线性回归（Linear Regression）

## 如何求解线性回归？

线性回归想找到一条（或一个超平面）使预测值与真实值的误差尽量小。

## 1、最小二乘法

最小二乘法的目标是最小化残差平方和：

$$
J(w)=\sum_{i=1}^{n}(y_i-\hat{y}_i)^2
$$

为什么要平方？

- 让正负误差不会抵消。
- 大误差会被更重地惩罚。
- 便于数学求解。

### 矩阵形式

令 $X$ 为特征矩阵，$y$ 为标签向量，则线性回归可写为：

$$
\hat{y}=Xw
$$

在满足可逆等条件时，最小二乘法的解析解为：

$$
w=(X^TX)^{-1}X^Ty
$$

### 求解方法

现实中不一定真的手工计算逆矩阵。数值库通常采用更稳定的方法（如 QR 分解、SVD）完成求解。对大规模数据或复杂模型，常用梯度下降。

## 2、梯度下降法

### 参数更新规则

$$
w\leftarrow w-\eta\frac{\partial J}{\partial w}
$$

### 梯度下降法的步骤

1. 随机初始化参数 $w,b$。
2. 根据当前参数算预测值。
3. 计算损失和梯度。
4. 按学习率更新参数。
5. 重复多次，直到损失基本不再下降。

## 使用 Python 实现线性回归

### 1、导入必要的库

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
```

### 2、生成模拟数据

```python
rng = np.random.RandomState(42)
X = 2 * rng.rand(200, 1)
y = 4 + 3 * X[:, 0] + rng.randn(200) * 0.5

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

这里真实规律大致是：

$$
y=4+3x+噪声
$$

### 3、使用 Scikit-learn 进行线性回归

```python
model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("截距 b：", model.intercept_)
print("系数 w：", model.coef_)
print("MAE：", mean_absolute_error(y_test, y_pred))
print("RMSE：", mean_squared_error(y_test, y_pred) ** 0.5)
print("R²：", r2_score(y_test, y_pred))
```

可视化拟合直线：

```python
plt.scatter(X_test, y_test, label="真实值")
plt.scatter(X_test, y_pred, label="预测值")
plt.xlabel("X")
plt.ylabel("y")
plt.title("线性回归预测结果")
plt.legend()
plt.show()
```

### 4、手动实现梯度下降法

```python
import numpy as np

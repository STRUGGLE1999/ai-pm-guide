# 逻辑回归（Logistic Regression）

## 逻辑回归模型

逻辑回归先计算线性组合：

$$
z=w^Tx+b
$$

再通过 Sigmoid 函数输出概率：

$$
p(y=1|x)=\frac{1}{1+e^{-z}}
$$

最后根据阈值转成类别：

```text
若 p >= 0.5：预测为正类
若 p < 0.5：预测为负类
```

但在不平衡场景中，阈值不一定是 0.5。例如欺诈拦截可能宁愿多审核一些，也要减少漏检，可将阈值调低。

## 损失函数

逻辑回归常用二元交叉熵损失：

$$
Loss=-[y\log(p)+(1-y)\log(1-p)]
$$

直觉上：

- 真实是 1，模型却给很低概率，会受到很大惩罚。
- 真实是 0，模型却给很高概率，也会受到很大惩罚。

## 梯度下降法求解

逻辑回归通常通过优化算法找到使交叉熵损失最小的参数。`scikit-learn` 会自动选择相应求解器执行优化；初学阶段重点理解：模型并不是“直接知道答案”，而是在大量样本上逐步调整参数，使概率预测更合理。

## 使用 Python 实现逻辑回归

### 1、导入必要的库

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, ConfusionMatrixDisplay
```

### 2、加载数据集

为了便于画出二维决策边界，只取两个特征，并把三分类任务改为“是否为 setosa”的二分类任务。

```python
iris = load_iris()
X = iris.data[:, :2]
y = (iris.target == 0).astype(int)  # setosa=1，其余=0
```

### 3、训练逻辑回归模型

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

logit_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000))
])

logit_pipeline.fit(X_train, y_train)
```

### 4、模型评估

```python
y_pred = logit_pipeline.predict(X_test)
y_prob = logit_pipeline.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print("前 5 个预测为正类的概率：", y_prob[:5])

ConfusionMatrixDisplay.from_predictions(y_test, y_pred)
plt.title("逻辑回归混淆矩阵")
plt.show()
```

### 5、可视化决策边界

```python
# 使用流水线中的标准化器与模型，在标准化空间绘制边界
scaler = logit_pipeline.named_steps["scaler"]
model = logit_pipeline.named_steps["model"]
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
plt.xlabel("标准化后的特征 1")
plt.ylabel("标准化后的特征 2")
plt.title("逻辑回归决策边界")
plt.show()
```

## 总结

逻辑回归是非常重要的基线模型：速度快、可解释、能输出概率。在很多二分类问题上，它应当是你最先尝试的模型之一。

---

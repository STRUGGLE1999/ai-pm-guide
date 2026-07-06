# Python 入门机器学习

## 安装 Python 和必要的库

### 1. 创建项目目录与虚拟环境

建议每个项目使用独立虚拟环境，避免不同项目的库版本互相干扰。

```bash
# 新建项目目录
mkdir ml-beginner
cd ml-beginner

# 创建虚拟环境
python -m venv .venv
```

激活虚拟环境：

```bash
# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1

# Windows CMD
.venv\Scripts\activate.bat
```

安装常用库：

```bash
python -m pip install --upgrade pip
python -m pip install numpy pandas matplotlib scikit-learn jupyter joblib xgboost fastapi uvicorn
```

验证安装：

```bash
python -c "import sklearn, numpy, pandas; print('scikit-learn:', sklearn.__version__)"
```

### 2. 常用库分别做什么？

| 库 | 主要用途 |
|---|---|
| NumPy | 数值计算、数组 |
| pandas | 表格数据读取与清洗 |
| matplotlib | 数据可视化 |
| scikit-learn | 传统机器学习算法、预处理、评估、模型选择 |
| joblib | 保存与加载模型 |
| XGBoost | 梯度提升树模型 |
| Jupyter | 交互式运行代码与笔记 |

---

## 一个简单的机器学习例子：使用 Scikit-learn 做分类

目标：使用鸢尾花数据集，根据花萼和花瓣的长度、宽度，预测鸢尾花类别。

### 步骤 1：导入库

```python
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, ConfusionMatrixDisplay
```

### 步骤 2：加载数据

```python
iris = load_iris()
X = iris.data          # 特征矩阵：150 行 × 4 列
y = iris.target        # 标签：0、1、2 三个类别

print("特征名称：", iris.feature_names)
print("类别名称：", iris.target_names)
print("X 的形状：", X.shape)
print("前 3 行特征：\n", X[:3])
print("前 3 个标签：", y[:3])
```

你会看到：

- 一共有 150 条样本。
- 每条样本有 4 个数值特征。
- 标签有 3 类：setosa、versicolor、virginica。

### 步骤 3：数据集划分

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,      # 留 20% 做测试
    random_state=42,    # 固定随机种子，保证每次结果一致
    stratify=y          # 保证训练集和测试集的类别比例接近
)

print("训练集：", X_train.shape)
print("测试集：", X_test.shape)
```

为什么使用 `stratify=y`？因为多分类数据可能类别不均衡。分层抽样能避免某一类别在测试集中太少甚至消失。

### 步骤 4：特征缩放（标准化）

不要直接在完整数据上执行：

```python
# 错误示例：不要这样写
# X_scaled = StandardScaler().fit_transform(X)
```

上面会让测试集参与均值和标准差的计算，造成数据泄漏。正确做法是把标准化和模型打包进 `Pipeline`。

```python
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", KNeighborsClassifier(n_neighbors=5))
])
```

### 步骤 5：选择模型并训练

```python
pipeline.fit(X_train, y_train)
```

`fit()` 的含义是：在训练数据上学习预处理参数和模型规则。

### 步骤 6：评估模型

```python
y_pred = pipeline.predict(X_test)

print("准确率：", accuracy_score(y_test, y_pred))
print("\n分类报告：\n")
print(classification_report(y_test, y_pred, target_names=iris.target_names))
```

分类报告中常见字段：

- `precision`：预测为某一类的样本中，多少是真的。
- `recall`：真实属于某一类的样本中，多少被找出来。
- `f1-score`：精确率和召回率的平衡。
- `support`：该类别在测试集中的真实样本数。

### 步骤 7：可视化结果（可选）

```python
ConfusionMatrixDisplay.from_predictions(
    y_test,
    y_pred,
    display_labels=iris.target_names,
    cmap="Blues"
)
plt.title("Iris 分类混淆矩阵")
plt.show()
```

> **你已经完成了一个完整的机器学习最小闭环**：加载数据 → 切分数据 → 预处理 → 训练 → 预测 → 评估 → 可视化。

---

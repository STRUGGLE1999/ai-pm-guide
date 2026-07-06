# 主成分分析（PCA）

## PCA 要解决什么问题？

假设你有 100 个高度相关的特征。它们可能包含大量重复信息，例如“近 7 天点击次数”“近 14 天点击次数”“近 30 天点击次数”之间往往高度相关。

PCA 会找到若干新的综合方向：

- 第 1 主成分：解释数据变化最多的方向。
- 第 2 主成分：在与第 1 主成分正交的前提下，解释剩余变化最多的方向。
- 依此类推。

## PCA 的直觉图示

```text
原始二维点云：沿斜方向分布很长

      ·
    ·
  ·
 ·
·

第一主成分：沿着“点云最分散”的斜方向
第二主成分：与第一主成分垂直，解释剩余变化
```

## PCA 的使用注意事项

- PCA 对特征尺度敏感，通常先标准化。
- PCA 不知道标签，因此保留的最大方差方向不一定是最有利于分类的方向。
- 主成分是原特征的线性组合，可解释性会降低。

## PCA 实例：将高维葡萄酒数据降到 2 维

```python
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

wine = load_wine()
X = wine.data
y = wine.target

X_scaled = StandardScaler().fit_transform(X)

pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X_scaled)

print("两个主成分解释的方差比例：", pca.explained_variance_ratio_)
print("累计解释方差：", pca.explained_variance_ratio_.sum())

plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap="viridis", alpha=0.8)
plt.xlabel("主成分 1")
plt.ylabel("主成分 2")
plt.title("PCA：葡萄酒数据二维可视化")
plt.colorbar(label="类别")
plt.show()
```

若你要保留 95% 的总方差，可这样选择主成分数：

```python
pca_95 = PCA(n_components=0.95, random_state=42)
X_reduced = pca_95.fit_transform(X_scaled)
print("保留 95% 方差后剩余维度：", X_reduced.shape[1])
```

---

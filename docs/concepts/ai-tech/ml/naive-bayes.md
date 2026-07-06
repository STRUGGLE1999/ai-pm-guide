# 朴素贝叶斯

## 1. 简介

朴素贝叶斯是一组基于贝叶斯公式的分类算法。它的“朴素”来自一个简化假设：**在类别已知的条件下，特征之间相互独立。**

这个假设在现实中经常并不完全成立，但算法速度快、对高维稀疏数据友好，因此在文本分类、垃圾邮件过滤等场景仍非常实用。

## 2. 数学基础

### 2.1 相对独立

严格说，朴素贝叶斯假设的是**条件独立**：在已知类别 $y$ 时，各个特征 $x_i$ 相互独立。

$$
P(x_1,x_2,\ldots,x_n|y)\approx\prod_{i=1}^{n}P(x_i|y)
$$

例如，判断一封邮件是否垃圾邮件时，假设在“垃圾邮件”这一类别已知的前提下，词语“免费”和“中奖”的出现可以分别估计。

### 2.2 条件概率

条件概率表示“在 A 已发生的情况下，B 发生的概率”：

$$
P(B|A)=\frac{P(A\cap B)}{P(A)}
$$

例子：已知某人下雨天出门，问他带伞的概率。

### 2.3 全概率公式（从原因到结果）

若一个结果 $B$ 可能由多个互斥原因 $A_1,A_2,\ldots,A_n$ 导致：

$$
P(B)=\sum_iP(B|A_i)P(A_i)
$$

### 2.4 贝叶斯公式（从结果到原因）

贝叶斯公式用于“看到结果后，反推原因的概率”：

$$
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
$$

## 3. 算法原理

### 3.1 朴素贝叶斯公式推导

对于分类任务，模型希望找到后验概率最大的类别：

$$
\hat{y}=\arg\max_yP(y|x_1,\ldots,x_n)
$$

根据贝叶斯公式：

$$
P(y|x)=\frac{P(x|y)P(y)}{P(x)}
$$

因为对于不同类别，$P(x)$ 相同，所以只需比较：

$$
\hat{y}=\arg\max_yP(y)\prod_{i=1}^{n}P(x_i|y)
$$

实际计算时通常取对数，把乘法变加法，避免很小概率连乘导致数值下溢：

$$
\log P(y|x)\propto\log P(y)+\sum_i\log P(x_i|y)
$$

## 4. 案例：根据天气情况预测是否出行

假设历史数据表明：

| 天气 | 温度 | 湿度 | 是否出行 |
|---|---|---|---|
| 晴 | 高 | 低 | 是 |
| 阴 | 中 | 中 | 是 |
| 雨 | 低 | 高 | 否 |

当新的一天是“晴、高温、低湿度”时，朴素贝叶斯会分别估计这些特征在“出行”和“不出行”条件下出现的概率，然后比较两类总概率，选择更大的那一类。

## 5. 朴素贝叶斯种类

### 5.1 高斯朴素贝叶斯（Gaussian NB）

适合连续数值特征，并假设每个特征在每个类别下近似服从高斯分布。例如身高、体重、花瓣长度。

### 5.2 多项式朴素贝叶斯（Multinomial NB）

适合计数类特征，例如一篇文章中某个词出现了几次。常用于词频、TF-IDF 文本分类。

### 5.3 伯努利朴素贝叶斯（Bernoulli NB）

适合二值特征，例如某个词“是否出现”。

## 6. 代码实现

## 6.1 鸢尾花分类（高斯朴素贝叶斯）

### 6.1.1 导入模块

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import classification_report, accuracy_score
```

### 6.1.2 数据集导入

```python
iris = load_iris()
X = iris.data
y = iris.target
```

### 6.1.3 将数据集切分为训练集和测试集

```python
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
```

### 6.1.4 构建朴素贝叶斯分类器

```python
model = GaussianNB()
model.fit(X_train, y_train)
```

### 6.1.5 测试分类模型

```python
y_pred = model.predict(X_test)

print("准确率：", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred, target_names=iris.target_names))
```

## 6.2 社区评论是否为侮辱类词语（伯努利朴素贝叶斯）

下面不用 `scikit-learn`，手工实现一个最简词袋 + 伯努利朴素贝叶斯流程，目的是理解每一步发生了什么。

### 6.2.1 导入 NumPy

```python
import numpy as np
```

### 6.2.2 创建实验数据集

```python
def load_dataset():
    documents = [
        ["my", "dog", "has", "flea", "problems", "help", "please"],
        ["maybe", "not", "take", "him", "to", "dog", "park", "stupid"],
        ["my", "dalmation", "is", "so", "cute", "I", "love", "him"],
        ["stop", "posting", "stupid", "worthless", "garbage"],
        ["mr", "licks", "ate", "my", "steak", "how", "to", "stop", "him"],
        ["quit", "buying", "worthless", "dog", "food", "stupid"],
    ]
    # 1 代表侮辱性，0 代表正常
    labels = [0, 1, 0, 1, 0, 1]
    return documents, labels
```

### 6.2.3 创建词汇表

```python
def create_vocab_list(dataset):
    vocab_set = set()
    for document in dataset:
        vocab_set |= set(document)
    return sorted(vocab_set)
```

### 6.2.4 获得训练集向量

伯努利模型只关心一个词是否出现，因此用 0/1 表示。

```python
def set_of_words_to_vec(vocab_list, input_words):
    vec = [0] * len(vocab_list)
    for word in input_words:
        if word in vocab_list:
            vec[vocab_list.index(word)] = 1
        else:
            print(f"提示：词 '{word}' 不在训练词表中")
    return vec
```

### 6.2.5 生成训练集向量列表

```python
posts, labels = load_dataset()
vocab_list = create_vocab_list(posts)

train_matrix = [set_of_words_to_vec(vocab_list, post) for post in posts]
print("词表长度：", len(vocab_list))
print("第一条评论向量：", train_matrix[0])
```

### 6.2.6 朴素贝叶斯分类器训练函数

这里使用拉普拉斯平滑：初始计数设为 1，而不是 0，避免某个词从未出现导致概率为 0。

```python
def train_nb(train_matrix, train_labels):
    train_matrix = np.array(train_matrix)
    train_labels = np.array(train_labels)

    num_docs = train_matrix.shape[0]
    num_words = train_matrix.shape[1]

    # 侮辱类出现的先验概率 P(class=1)
    p_class1 = train_labels.mean()

    # 拉普拉斯平滑：每个词初始出现次数为 1
    p0_num = np.ones(num_words)
    p1_num = np.ones(num_words)

    # 分母初始为 2，因为二值特征有“出现/不出现”的平滑处理直觉
    p0_denom = 2.0
    p1_denom = 2.0

    for i in range(num_docs):
        if train_labels[i] == 1:
            p1_num += train_matrix[i]
            p1_denom += train_matrix[i].sum()
        else:
            p0_num += train_matrix[i]
            p0_denom += train_matrix[i].sum()

    # 取 log，避免概率连乘过小
    p1_vec = np.log(p1_num / p1_denom)
    p0_vec = np.log(p0_num / p0_denom)

    return p0_vec, p1_vec, p_class1
```

### 6.2.7 朴素贝叶斯分类器函数

```python
def classify_nb(vec_to_classify, p0_vec, p1_vec, p_class1):
    vec_to_classify = np.array(vec_to_classify)

    log_p1 = vec_to_classify @ p1_vec + np.log(p_class1)
    log_p0 = vec_to_classify @ p0_vec + np.log(1.0 - p_class1)

    return 1 if log_p1 > log_p0 else 0
```

### 6.2.8 朴素贝叶斯测试函数

```python
def testing_nb():
    posts, labels = load_dataset()
    vocab_list = create_vocab_list(posts)
    train_matrix = [set_of_words_to_vec(vocab_list, post) for post in posts]

    p0_vec, p1_vec, p_class1 = train_nb(train_matrix, labels)

    tests = [
        ["love", "my", "dalmation"],
        ["stupid", "garbage"],
        ["dog", "food", "please"],
    ]

    for test_words in tests:
        test_vec = set_of_words_to_vec(vocab_list, test_words)
        result = classify_nb(test_vec, p0_vec, p1_vec, p_class1)
        print(f"{test_words} -> {'侮辱性' if result == 1 else '正常'}")
```

### 6.2.9 测试用例

```python
testing_nb()
```

## 6.3 多项式朴素贝叶斯

下面用 `CountVectorizer` 将文本转成词频矩阵，再用 `MultinomialNB` 分类。

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

texts = [
    "free prize claim now",
    "project meeting at 10 am",
    "limited offer free coupon",
    "please review the product document",
    "you won a prize click here",
    "team meeting agenda attached",
]
labels = [1, 0, 1, 0, 1, 0]  # 1=垃圾邮件，0=正常邮件

text_model = Pipeline([
    ("vectorizer", CountVectorizer()),
    ("nb", MultinomialNB())
])

text_model.fit(texts, labels)
print(text_model.predict(["free coupon for you"]))
print(text_model.predict_proba(["free coupon for you"]))
```

---

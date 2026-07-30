# 1.2 文本表示方法

### 1.2.1 为什么文本必须表示成数字？

模型不能直接计算“喜欢”“差评”这些字符串，它需要数值输入：

```text
“续航很好” → [0.12, -0.44, 0.91, ...]
```

文本表示决定模型“看到语言的方式”。

```mermaid
flowchart LR
    A[One-hot<br/>离散编码] --> B[Bag of Words / TF-IDF<br/>统计特征]
    B --> C[Word2Vec / GloVe<br/>静态词向量]
    C --> D[BERT<br/>上下文词向量]
    D --> E[Sentence Embedding / CLIP<br/>句向量与多模态向量]
```

### 1.2.2 One-hot 与词袋模型（Bag of Words）

假设词表为 `['我', '喜欢', '机器学习', '讨厌']`，则“喜欢”的 one-hot 向量为：

```text
[0, 1, 0, 0]
```

它简单，但有三个问题：词表大时非常稀疏；“喜欢”和“热爱”毫无相似性；不含语序。

词袋模型只统计词频，因此下面两句话会得到相同表示：

```text
A：我 喜欢 自然 语言 处理
B：自然 语言 处理 喜欢 我
```

### 1.2.3 N-gram：给传统模型补一点顺序

对“我不喜欢这部电影”：

```text
1-gram：我 / 不 / 喜欢 / 这部 / 电影
2-gram：我不 / 不喜欢 / 喜欢这部 / 这部电影
```

`不喜欢` 作为二元短语，可以显著帮助传统模型处理否定。中文短文本任务中，字/词 N-gram + 线性模型仍是很重要的强基线。

### 1.2.4 TF-IDF：词频不够，还要考虑“稀有度”

TF-IDF 认为一个词在当前文档出现得多可能重要，但若它在几乎每篇文档都出现，则区分能力较低。

$$
\mathrm{TF\text{-}IDF}(t,d)=\mathrm{TF}(t,d)\times\log\frac{N}{\mathrm{DF}(t)+1}
$$

- $t$：词；$d$：文档；$N$：文档总数；$\mathrm{DF}(t)$：包含词 $t$ 的文档数。  
- 直观理解：`退款` 可能是区分“售后问题”的重要词；`的` 在所有文本都常见，价值较低。

### 1.2.5 静态词向量与上下文词向量

Word2Vec/GloVe 会为每个词学习一个稠密向量，使“北京”和“上海”“喜欢”和“热爱”往往更接近。但一个词只能有一个向量：

```text
“我吃了苹果”      → 苹果=水果
“苹果发布了新品”  → 苹果=公司
```

BERT 的上下文向量会根据句子改变“苹果”的表示，因此更擅长多义词、指代和复杂上下文。

### 1.2.6 TF-IDF 实战

```python
from sklearn.feature_extraction.text import TfidfVectorizer

documents = [
    "手机 续航 很好 拍照 清晰",
    "手机 价格 太贵 但是 屏幕 不错",
    "耳机 音质 很好 佩戴 舒适"
]

vectorizer = TfidfVectorizer(
    tokenizer=str.split,
    token_pattern=None,
    ngram_range=(1, 2)
)
X = vectorizer.fit_transform(documents)

print("特征数：", len(vectorizer.get_feature_names_out()))
print("部分特征：", vectorizer.get_feature_names_out()[:12])
print("矩阵形状：", X.shape)
```

### 1.2.7 选表示方法的决策表

| 目标 | 推荐起点 | 为什么 |
|---|---|---|
| 快速验证分类想法 | TF-IDF + 逻辑回归 | 快、可解释、成本低 |
| 短文本意图分类 | 字/词 N-gram + 线性模型 | 对局部短语和拼写变化有效 |
| 语义检索 | 句向量 Embedding | 可匹配同义表达 |
| NER、高精度分类 | BERT 类模型 | 能编码上下文 |
| 翻译、摘要、对话 | GPT / T5 / BART | 适合输出序列 |
| 图文检索、图文理解 | 多模态模型 | 跨文本与图像建模 |

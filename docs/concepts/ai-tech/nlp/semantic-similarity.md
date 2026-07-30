# 2.4 NLP 文本相似度计算

### 2.4.1 相似度能解决什么？

| 场景 | 问题 |
|---|---|
| FAQ 检索 | “怎么退款？”和“退款流程是什么？”是否相近？ |
| 重复工单 | 两个用户是不是在描述同一问题？ |
| 语义搜索 | “续航差”能否找到“电池不耐用”？ |
| 内容推荐 | 用户看过的内容与候选内容是否接近？ |
| 聚类 | 哪些评论可以归成同一主题？ |

### 2.4.2 三层相似度方法

| 层次 | 方法 | 能理解什么 | 局限 |
|---|---|---|---|
| 字面相似 | 编辑距离、Jaccard、关键词重合 | 字符、词是否相同 | 同义词无能为力 |
| 统计相似 | TF-IDF + 余弦 | 关键词权重 | 语义与上下文弱 |
| 语义相似 | Sentence Embedding / Cross-Encoder | 同义、改写、隐含表达 | 需要评估与算力 |

### 2.4.3 余弦相似度

$$
\cos(a,b)=\frac{a\cdot b}{\|a\|\|b\|}
$$

直觉：比较两个向量的方向是否一致。接近 1 表示更相似，接近 0 表示关联弱。实际阈值不能凭感觉设定，需要在你的验证集上寻找 Precision/Recall 可接受的平衡点。

### 2.4.4 TF-IDF + 余弦相似度示例

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

sentences = [
    "如何申请退款", "退款流程是什么",
    "手机电池不耐用", "续航时间太短怎么办"
]

# 字符 n-gram 不依赖中文分词，适合入门演示
vectorizer = TfidfVectorizer(analyzer="char", ngram_range=(2, 4))
X = vectorizer.fit_transform(sentences)
sim = cosine_similarity(X)

for i, text in enumerate(sentences):
    print(f"\n{text}")
    for j, score in enumerate(sim[i]):
        if i != j:
            print(f"  与「{sentences[j]}」的相似度：{score:.3f}")
```

### 2.4.5 句向量：让整句话成为语义 Embedding

```bash
pip install -U sentence-transformers
```

```python
from sentence_transformers import SentenceTransformer, util

# 首次运行会下载模型；生产环境应固定并缓存模型版本
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

queries = ["如何申请退款", "手机电池不耐用"]
candidates = [
    "退款流程是什么", "我要退货，应该怎么操作",
    "续航时间太短怎么办", "屏幕颜色不够鲜艳"
]

q_emb = model.encode(queries, convert_to_tensor=True, normalize_embeddings=True)
c_emb = model.encode(candidates, convert_to_tensor=True, normalize_embeddings=True)
scores = util.cos_sim(q_emb, c_emb)

for i, query in enumerate(queries):
    print(f"\n查询：{query}")
    for idx in scores[i].argsort(descending=True):
        print(candidates[int(idx)], "->", round(float(scores[i][idx]), 3))
```

### 2.4.6 Bi-Encoder 与 Cross-Encoder

```mermaid
flowchart LR
    A[用户问题] --> B[Bi-Encoder：快速召回 Top-K]
    B --> C[候选文档]
    C --> D[Cross-Encoder：问题与文档一起精排]
    D --> E[最终排序]
```

| 模型 | 特点 | 常见位置 |
|---|---|---|
| Bi-Encoder | 文档可预先编码，搜索快 | 大规模召回 |
| Cross-Encoder | 逐对深度比较，精度高但慢 | Top-K 重排序 |

### 2.4.7 相似度项目的常见误区

- 相似度高不等于“问题答案正确”；
- 用通用模型却不在本业务语料上验证；
- 不设置拒答或转人工阈值；
- 忽略同名不同义、否定表达与时效性；
- 只看平均相似度，不看 Top-K 是否召回正确结果。

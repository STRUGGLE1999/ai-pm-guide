# 4.2 BERT 系列模型

### 4.2.1 BERT 的核心思想

BERT（Bidirectional Encoder Representations from Transformers）是双向 Transformer Encoder。它在计算一个词表示时可利用左右两侧的上下文。

```text
“他去银行办理业务”
```

理解“银行”时，左侧“去”和右侧“办理业务”都能提供线索。BERT 因此适合文本分类、NER、句对匹配、抽取式问答等理解型任务。

### 4.2.2 两个经典预训练任务

#### Masked Language Modeling（MLM）

随机遮住部分 token，让模型预测它：

```text
“自然语言处理很[MASK]。”
→ 预测：有趣 / 重要 / 复杂
```

#### Next Sentence Prediction（NSP）

判断两句话是否可能在原文中相邻。后续一些模型调整或取消了 NSP，但它能帮助理解原始 BERT 的训练设计。

### 4.2.3 BERT 如何服务不同任务？

| 任务 | 常用做法 |
|---|---|
| 单文本分类 | 取 `[CLS]` 表示接分类头 |
| 句对分类 | `[CLS] 句子A [SEP] 句子B [SEP]` |
| NER | 为每个 token 接分类头 |
| 抽取式问答 | 预测答案起点和终点 |
| 语义匹配 | Cross-Encoder 分类或转句向量模型 |

### 4.2.4 常见 BERT 家族

| 模型 | 关键特点 | 应记住什么 |
|---|---|---|
| BERT | 双向 Encoder、MLM/NSP | 理解型预训练代表 |
| RoBERTa | 优化训练数据与训练策略 | 配置与数据规模很关键 |
| ALBERT | 参数共享、词嵌入分解 | 通过结构节省参数 |
| DistilBERT | 知识蒸馏 | 更轻、更快 |
| DeBERTa | 改进位置与内容建模 | 理解任务表现突出 |
| MacBERT | 面向中文的预训练优化 | 中文理解任务常见 |
| ERNIE 等 | 融入知识增强等思想 | 中文生态中常见 |

### 4.2.5 微调文本分类的代码骨架

```bash
pip install -U transformers datasets evaluate accelerate torch
```

```python
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import TrainingArguments, Trainer

model_name = "google-bert/bert-base-chinese"

dataset = Dataset.from_dict({
    "text": ["这款产品非常好用", "质量很差，不会再买", "客服态度很好", "物流太慢了"],
    "label": [1, 0, 1, 0]
}).train_test_split(test_size=0.5, seed=42)

tokenizer = AutoTokenizer.from_pretrained(model_name)

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, padding="max_length", max_length=64)

tokenized = dataset.map(tokenize, batched=True)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

args = TrainingArguments(
    output_dir="./bert_sentiment_demo",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=1,
    eval_strategy="epoch",
    save_strategy="no",
    logging_steps=1
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
    processing_class=tokenizer
)
trainer.train()
```

示例数据极小，只用于理解训练流程。真实项目必须准备独立训练/验证/测试集，并在 `requirements.txt` 中固定 `transformers` 版本；不同版本 API 参数名称可能存在差异。

### 4.2.6 BERT 实战中最容易忽略的细节

- `max_length` 截断可能丢掉后文关键信息；
- 类别不均衡应观察每类 F1，而非只看总准确率；
- 同一用户、同一模板的改写文本不要跨训练集和测试集；
- 通用中文模型可能不懂法律、医疗、企业内部术语；
- 要保存 tokenizer、label 映射、模型版本和预处理规则，避免线上训练不一致。

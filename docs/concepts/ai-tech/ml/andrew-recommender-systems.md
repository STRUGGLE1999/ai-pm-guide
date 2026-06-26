# 推荐系统

吴恩达课程里的推荐系统，能帮助读者理解“把什么推荐给谁”背后的数据和目标函数。推荐不是简单列表排序，而是召回、排序、重排和反馈闭环。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="推荐系统质量闭环">
  <figcaption>推荐系统需要持续观察曝光、点击、转化、负反馈和多样性。</figcaption>
</figure>

## 技术视角

推荐系统常用于内容分发、电商、知识推荐、线索推荐和客服答案推荐。它要同时平衡用户价值、商业价值、生态价值和安全约束。

| 环节 | 作用 |
| --- | --- |
| 召回 | 从海量候选中找一批可能相关的对象。 |
| 排序 | 按目标分数排列候选。 |
| 重排 | 加入多样性、去重、规则、安全策略。 |
| 反馈 | 收集点击、转化、不感兴趣、投诉等信号。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="推荐系统技术判断">
  <figcaption>推荐目标写错，模型越强越可能放大错误优化方向。</figcaption>
</figure>

## 示例代码

下面用 scikit-learn 训练一个最小分类模型，并输出验证集准确率：

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
```

这个例子展示了监督学习的基本结构：数据集、切分、训练、预测和指标。真实项目需要把样本、标签、指标和错误分析补完整。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

推荐系统 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 模型文件、tokenizer、配置、请求参数、运行硬件。 |
| 处理 | 预处理、推理、后处理、缓存、限流、监控。 |
| 输出 | 接口响应、状态码、日志、指标、告警。 |
| 指标 | TTFT、总延迟、QPS、P95/P99、显存占用、错误率。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 并发 | 并发过高会排队，延迟上升。 |
| batch | 合批能提高吞吐，但可能增加单个请求等待时间。 |
| 量化 | 降低显存和成本，但可能损失精度。 |
| 超时 | 所有外部调用都要设置超时和降级。 |

## 可运行检查

```python
import time

start = time.perf_counter()
# result = model.generate(inputs)
time.sleep(0.05)
latency_ms = (time.perf_counter() - start) * 1000
print({"latency_ms": round(latency_ms, 2)})
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 延迟分解 | 分别统计预处理、检索、推理、后处理耗时。 |
| 资源曲线 | 观察 CPU、内存、GPU、显存随并发变化。 |
| 回滚验证 | 保留旧版本模型和配置，演练故障回退。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 延迟只看平均值 | P95/P99 很差会被平均值掩盖。 | 压测时同时记录平均、P95、P99。 |
| 无超时和降级 | 外部依赖卡住导致请求堆积。 | 每个外部调用设置 timeout 和 fallback。 |
| 版本不可回滚 | 模型、配置、索引和 Prompt 没绑定版本。 | 建立发布清单和回滚脚本。 |

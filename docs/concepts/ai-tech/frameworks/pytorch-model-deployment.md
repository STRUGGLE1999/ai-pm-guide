# PyTorch 模型部署

PyTorch 模型部署是把训练好的模型变成可被业务系统调用的服务。训练阶段关注指标，部署阶段关注接口、延迟、吞吐、资源、监控、灰度和回滚。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="模型部署调用链路">
  <figcaption>模型部署需要把模型文件接入调用链路：输入处理、推理服务、后处理、日志和监控。</figcaption>
</figure>

## 部署要解决什么

| 问题 | 工程影响 |
| --- | --- |
| 模型格式 | 能否稳定加载和迁移。 |
| 输入预处理 | 线上输入和训练是否一致。 |
| 推理延迟 | 用户等待是否可接受。 |
| 并发吞吐 | 高峰期是否排队或失败。 |
| 版本管理 | 能否灰度、回滚、对比。 |
| 监控日志 | 出错后能否定位原因。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="模型部署质量闭环">
  <figcaption>部署后的质量闭环要覆盖线上输入、模型版本、输出结果、用户反馈和 Bad Case。</figcaption>
</figure>

## 示例代码

下面用 PyTorch 写一个最小训练循环：

```python
import torch
from torch import nn

X = torch.randn(32, 4)
y = torch.randint(0, 3, (32,))

model = nn.Linear(4, 3)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for step in range(20):
    logits = model(X)
    loss = loss_fn(logits, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

print("loss:", float(loss))
```

训练循环的固定顺序是前向计算、计算损失、清空梯度、反向传播、更新参数。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

PyTorch 模型部署 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

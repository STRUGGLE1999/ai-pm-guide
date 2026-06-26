# 模型部署与加速导读

部署与加速决定 AI 功能能否进入真实业务。模型能回答只是第一步，生产环境还要看并发、延迟、成本、显存、日志、降级和回滚。

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="Workflow 与 Agent 对比">
  <figcaption>部署策略要区分固定流程和开放任务，不同链路的性能瓶颈不同。</figcaption>
</figure>

## 建议顺序

1. [CH1 模型部署基础](/concepts/ai-tech/deployment/model-deployment-basics)
2. [CH2 大模型架构详解](/concepts/ai-tech/deployment/llm-architecture)
3. [CH3 大模型部署框架解析](/concepts/ai-tech/deployment/deployment-frameworks)
4. [CH4 简单的 CUDA](/concepts/ai-tech/deployment/cuda-basics)
5. [CH5 CUDA、Triton 与大模型](/concepts/ai-tech/deployment/cuda-triton-llm)
6. [CH6 大模型量化](/concepts/ai-tech/deployment/quantization)
7. [CH7 底层加速](/concepts/ai-tech/deployment/inference-acceleration)
8. [CH8 系统层面加速](/concepts/ai-tech/deployment/system-acceleration)

学完这一组，你应该能判断慢在哪里、贵在哪里、稳定性风险在哪里。

## 工程实践要点

部署与加速决定 AI 能力能否被真实用户持续使用。Demo 阶段只要能跑，生产阶段要看并发、延迟、成本、稳定性、安全和回滚。读者需要把“模型效果”扩展为“完整链路体验”。

| 指标 | 含义 | 工程影响 |
| --- | --- | --- |
| TTFT | 首个 Token 出现时间。 | 影响聊天等待感。 |
| 总延迟 | 完整任务完成时间。 | 影响用户是否愿意继续用。 |
| 吞吐 | 单位时间处理多少请求。 | 影响高峰期稳定性。 |
| 成本 | 单次任务消耗多少钱。 | 影响商业模式是否成立。 |
| 成功率 | 请求是否稳定完成。 | 影响信任和 SLA。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="大语言模型调用链路">
  <figcaption>上线体验取决于模型、检索、工具、网关、缓存和前端等待的完整链路。</figcaption>
</figure>

## 示例配置

下面是一个最小模型服务接口示例，用 FastAPI 暴露推理入口：

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictRequest(BaseModel):
    text: str

@app.post("/predict")
def predict(req: PredictRequest):
    return {
        "label": "example",
        "score": 0.98,
        "input_length": len(req.text),
    }
```

真实部署需要补充模型加载、批处理、超时、日志、鉴权、限流、健康检查和版本管理。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

模型部署与加速导读 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

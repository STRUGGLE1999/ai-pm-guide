# CH5 CUDA、Triton 与大模型

Triton 可以用来写高性能 GPU 算子，也常出现在大模型推理优化讨论中。不必一开始就写 Triton，但要理解它属于底层性能优化。

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="Workflow 与 Agent 对比">
  <figcaption>部署策略要区分固定流程和开放任务，不同链路的性能瓶颈不同。</figcaption>
</figure>

## 它解决什么

大模型推理时，很多时间花在矩阵计算、注意力、缓存读写上。底层优化可以减少显存浪费、提升吞吐、降低延迟。

## 技术判断

只有当业务量、成本或延迟已经成为瓶颈时，底层优化才值得投入。早期 MVP 通常先优化上下文、模型路由、缓存和流程。

## 要问研发

1. 当前瓶颈是模型计算、检索、工具接口还是网络？
2. 优化后能降低多少延迟或成本？
3. 是否会影响模型输出质量？
4. 是否增加维护复杂度？

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

CH5 CUDA、Triton 与大模型 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 用户问题、系统提示词、历史对话、检索片段、工具 schema。 |
| 处理 | 上下文组装、模型调用、工具调用、输出解析、权限校验。 |
| 输出 | 自然语言、JSON、引用、工具结果、拒答信息。 |
| 指标 | 准确率、引用命中率、格式成功率、工具成功率、成本、延迟。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| temperature | 越高越发散，越低越稳定。 |
| max_tokens | 限制输出长度，也影响成本和截断风险。 |
| top_p | 控制采样范围，通常和 temperature 配合。 |
| schema | 结构化输出必须有 schema 和校验。 |

## 可运行检查

```python
import json

raw = '{"answer":"可以办理", "confidence":0.82}'
data = json.loads(raw)
assert "answer" in data
assert 0 <= data["confidence"] <= 1
print(data)
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 格式稳定性 | 结构化输出能否被程序稳定解析。 |
| 证据一致性 | 回答是否能追溯到检索片段或工具结果。 |
| 权限安全 | 不同用户只能检索和调用授权范围内的资源。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 回答没有证据 | 模型自由发挥，没绑定检索片段。 | 强制引用来源并校验引用存在。 |
| 工具参数不合法 | 模型输出 JSON 不符合接口要求。 | 用 schema 校验，失败时让模型重试或拒绝执行。 |
| 权限穿透 | 检索阶段没有按用户权限过滤。 | 把用户身份加入检索条件并记录审计日志。 |

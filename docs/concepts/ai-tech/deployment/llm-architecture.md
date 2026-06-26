# CH2 大模型架构详解

大模型架构决定模型如何处理上下文、生成输出和消耗算力。无需先推公式，但要理解架构会影响能力、成本和延迟。

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="Workflow 与 Agent 对比">
  <figcaption>部署策略要区分固定流程和开放任务，不同链路的性能瓶颈不同。</figcaption>
</figure>

## 关键层次

| 层次 | 技术含义 |
| --- | --- |
| Tokenizer | 决定文本如何拆分，影响成本和截断。 |
| Embedding | 把 Token 变成向量表示。 |
| Transformer Blocks | 处理上下文关系。 |
| Attention | 决定关注哪些信息。 |
| Output Head | 预测下一个 Token。 |

## 工程影响

长上下文、多轮对话、复杂推理都会增加计算量。模型架构越大，不一定所有任务都更划算。产品选型要看任务难度、响应要求、成本预算和可控性。

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

CH2 大模型架构详解 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

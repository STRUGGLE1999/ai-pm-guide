# AI 工程指标与监控看板

AI 系统看板要同时看质量、体验、成本、安全和业务价值。只看调用量，会误判产品是否真的有效。

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 质量闭环">
  <figcaption>评测、监控、Bad Case 回流，是 AI 系统长期可靠的核心机制。</figcaption>
</figure>

## 指标结构

| 指标层 | 例子 |
| --- | --- |
| 业务指标 | 节省时长、转化率、满意度、人工接管减少。 |
| 质量指标 | 正确率、引用准确率、幻觉率、拒答质量。 |
| 体验指标 | TTFT、总延迟、成功率、重试率。 |
| 成本指标 | Token 成本、模型路由占比、缓存命中率。 |
| 安全指标 | 越权拦截、敏感输出、人工确认率。 |

## 看板不要只做展示

每个指标都要对应动作。延迟高要能定位是模型、检索还是工具慢；成本高要知道是长上下文、重试还是大模型路由；质量差要能进入 Bad Case 修复流程。

指标的价值是指导决策，不是让页面看起来专业。

## 工程实践要点

评测和治理不是上线后的补丁，而是 AI 功能能否进入业务流程的前提。没有评测集，团队只能凭感觉争论；没有日志，Bad Case 无法复盘；没有权限和安全设计，模型能力越强风险越大。

| 层级 | 要解决的问题 |
| --- | --- |
| 离线评测 | 改模型、Prompt、知识库后有没有变好或变差。 |
| 在线监控 | 真实用户环境里的质量、延迟、成本和失败。 |
| 人工抽检 | 高风险、边界和主观判断是否可靠。 |
| 治理机制 | 权限、隐私、安全、审计、回滚是否闭环。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/04-comparison-workflow-agent.png" alt="Workflow 与 Agent 对比">
  <figcaption>治理要区分固定流程和开放 Agent 任务，分别设置权限、日志和人工确认。</figcaption>
</figure>

## 示例代码

下面用一个小评测集计算预测准确率：

```python
cases = [
    {"expected": "refund", "actual": "refund"},
    {"expected": "complaint", "actual": "refund"},
    {"expected": "sales", "actual": "sales"},
]

correct = sum(case["expected"] == case["actual"] for case in cases)
accuracy = correct / len(cases)
print({"accuracy": accuracy, "total": len(cases)})
```

工程化评测通常还要记录模型版本、Prompt 版本、知识库版本、失败原因和样本来源。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

AI 工程指标与监控看板 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 固定评测集、线上日志、Bad Case、人工标注和运行指标。 |
| 处理 | 自动评分、人工复核、分桶统计、版本对比。 |
| 输出 | 质量报告、回归结果、告警、修复任务。 |
| 指标 | 准确率、召回率、幻觉率、拒答质量、延迟、成本、安全事件数。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 样本版本 | 评测集变化会影响分数，必须记录版本。 |
| 评分规则 | 自动评分要明确字段、容忍度和失败条件。 |
| 分桶 | 整体分数之外要按场景、风险、来源拆分。 |
| 阈值 | 不同风险等级要设置不同上线阈值。 |

## 可运行检查

```python
cases = [
    {"scene":"faq", "ok": True, "latency": 820},
    {"scene":"faq", "ok": False, "latency": 1200},
    {"scene":"tool", "ok": True, "latency": 2400},
]
accuracy = sum(c["ok"] for c in cases) / len(cases)
p95_like = sorted(c["latency"] for c in cases)[-1]
print({"accuracy": accuracy, "max_latency": p95_like})
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 回归稳定 | 改动前后在同一评测集上比较。 |
| 失败可解释 | 每个失败样本都能归因到数据、检索、模型、工具或权限。 |
| 线上一致 | 离线指标和线上抽检不能长期背离。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 样本集太小 | 少量样本导致分数波动大。 | 增加典型、边界、高风险和线上失败样本。 |
| 指标单一 | 只看准确率，忽略成本、延迟和安全。 | 建立质量、体验、成本、安全四类指标。 |
| 修复不可验证 | 改动后没有同一批样本复跑。 | 每次修改都跑固定回归集。 |

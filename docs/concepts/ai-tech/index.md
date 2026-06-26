# AI 技术基础

AI 技术基础不要求你先学会推公式，更重要的是能看懂一个 AI 功能从输入到输出到底经过了什么：数据怎么来，模型怎么处理，知识库和工具怎么接入，结果怎么评估，出了问题怎么定位。

<figure class="article-figure">
  <img src="/concepts/ai-tech/01-infographic-ai-pm-map.png" alt="AI 技术基础学习地图">
  <figcaption>AI 技术基础的学习路径：先懂能力边界，再懂应用链路，最后懂评测、成本和安全。</figcaption>
</figure>

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 系统质量闭环">
  <figcaption>AI 技术基础最终要落到质量闭环：数据、模型、评测、上线、监控和反馈持续迭代。</figcaption>
</figure>

<div class="concept-card-grid">
  <div class="concept-card"><span class="concept-icon">ML</span><strong>模型与数据</strong><p>理解分类、抽取、生成、预测、排序这些任务，以及训练集、测试集、标注、漂移、泄漏这些基础词。</p></div>
  <div class="concept-card"><span class="concept-icon">LLM</span><strong>大模型调用</strong><p>看懂 Token、上下文窗口、系统提示词、结构化输出、函数调用和多轮对话状态。</p></div>
  <div class="concept-card"><span class="concept-icon">RAG</span><strong>知识库问答</strong><p>知道文档上传后为什么要切分、向量化、检索、重排、引用和权限过滤。</p></div>
  <div class="concept-card"><span class="concept-icon">OPS</span><strong>上线与治理</strong><p>关注评测集、日志追踪、成本、延迟、权限、安全、人工确认和 Bad Case 回流。</p></div>
</div>

## 新的子目录学习路径

这部分已经按截图里的知识库结构拆成更细的子目录。你可以按“先能看懂工程环境，再能理解模型，再能推动上线”的顺序读。

| 子目录 | 先读页面 | 学完要能回答 |
| --- | --- | --- |
| [基础](/concepts/ai-tech/foundations/linux-basics) | Linux、Python/NumPy、PyTorch 快速入门、Git、Python 爬虫。 | AI 项目里的文件、脚本、日志、环境和数据采集卡在哪里？ |
| [机器学习](/concepts/ai-tech/ml/overview) | 机器学习教程、机器学习简介、监督/无监督、十大算法、概率统计、线代微积分。 | 这个需求是否适合机器学习？指标和数据是否够验收？ |
| [NLP 教程](/concepts/ai-tech/nlp/text-preprocessing) | 文本预处理、表示、分类、NER、关系抽取、相似度、RNN、Attention、Transformer。 | 文本能力到底是在分类、抽取、匹配、生成，还是检索？ |
| [Deploy 知识库共建](/concepts/ai-tech/deployment/model-deployment-basics) | CH1 到 CH8：部署基础、大模型架构、CUDA、Triton、量化、底层和系统加速。 | 上线后为什么会慢、贵、不稳定，怎么定位？ |
| [LLM101n-CN（共建中）](/concepts/ai-tech/deep-learning/mlp-forward) | ngram、MLP、micrograd、Tensor、自动微分。 | 大模型背后的最小模型和训练直觉是什么？ |
| [PyTorch 教程](/concepts/ai-tech/frameworks/pytorch-basics) | PyTorch 基础、Tensor、神经网络、数据加载、CNN、RNN、Transformer、模型部署。 | 算法实验到生产服务之间还缺哪些工程环节？ |
| [TensorFlow 教程](/concepts/ai-tech/frameworks/tensorflow-basics) | TensorFlow 简介、核心概念、Keras、数据管道、训练、评估与监控。 | 训练框架如何承接数据、模型和上线监控？ |
| [吴恩达 机器学习笔记](/concepts/ai-tech/ml/supervised-learning) | 监督学习、无监督学习、推荐系统、强化学习、机器学习技巧。 | 如何把课程知识翻译成 AI 系统任务和指标？ |
| [吴恩达 DeepLearning.AI 课程系列](/concepts/ai-tech/deep-learning/neural-networks) | 预训练、微调、提示词工程、神经网络、CNN、序列模型。 | 模型训练、微调和推理背后的关键限制是什么？ |
| [大模型应用工程](/concepts/ai-tech/llm-rag-agent/llm-basics) | LLM、RAG、对话式 AI、工具调用、Agent、多模态上传、评测、成本、安全。 | AI 功能如何连接知识、工具、权限、数据和用户操作？ |

## 这套内容怎么学

如果你是刚开始学习 AI 技术，不建议按“算法深度”来学，而是按“能不能解释链路、运行代码和定位问题”来学。

| 阶段 | 先学什么 | 达成标准 |
| --- | --- | --- |
| P0：能读懂链路 | AI/ML 基础、数据与指标、LLM、Prompt、RAG、工具调用、评测、安全。 | 能说清输入、输出、依赖数据、模型调用、验收指标和错误边界。 |
| P1：能跑通实验 | 多模态、Agent、MCP、数据工程、观测、成本、部署。 | 能运行基础示例，理解接口、知识库、模型路由、日志、权限和上线策略。 |
| P2：能定位问题 | 微调、对齐、推理优化、漂移、MLOps、复杂评测、多智能体。 | 能根据日志、样本和指标判断该优化数据、Prompt、检索、工具链路还是模型训练。 |

## 30 个核心概念卡片

| 概念组 | 必懂词 | 技术上要能回答的问题 |
| --- | --- | --- |
| AI 能力 | AI、ML、DL、GenAI、LLM、Agent | 这个需求到底是生成、判断、检索还是执行？ |
| 数据基础 | 样本、特征、标签、标注、训练集、验证集、测试集 | 有没有足够可靠的数据和标准答案？ |
| 模型质量 | 过拟合、欠拟合、泛化、Accuracy、Precision、Recall、F1、AUC | 指标是否匹配业务风险？ |
| 语言模型 | Token、Context Window、Transformer、Attention、结构化输出 | 上下文能放多少，输出能否稳定解析？ |
| 模型优化 | SFT、RLHF、DPO、LoRA、蒸馏、量化 | 是否真的需要微调，还是先改数据和流程？ |
| 检索增强 | Embedding、向量库、Chunk、Metadata、Rerank、Citation | 回答是否有依据，错了能否定位到资料？ |
| 执行能力 | Function Calling、Tool Calling、Workflow、ReAct、Planning、Memory、MCP | AI 能调用什么，谁授权，失败怎么回滚？ |
| 工程治理 | Evals、Tracing、日志、TTFT、Latency、Token 成本、模型网关 | 上线后能否持续看质量、成本和稳定性？ |
| 安全可信 | Guardrails、Prompt Injection、脱敏、最小权限、审计 | 是否能防越权、泄露、误执行和不可追溯？ |

## 学习重点

- 概念不要孤立背，要放进“输入数据 -> 模型处理 -> 工具/知识库 -> 输出结果 -> 人工确认 -> 监控反馈”的链路里看。
- 不要一上来追最深的算法公式，先问它解决什么问题、依赖什么数据、失败会怎样、怎么验证。
- 如果一个概念能解释 Demo 为什么好看、上线为什么困难，它就值得重点学。
- 看到“处理上传图片、文档、语音、表格”时，要追问它是识别、理解、抽取、生成，还是只是把文件转成文本后再问答。
- 看到“Agent 自动执行”时，要追问它有哪些工具、谁给权限、失败怎么回滚、日志能不能追溯。

## 高频问题

- 为什么企业知识问答通常需要 RAG，而不是只写 Prompt？
- 为什么 Accuracy 很高，业务仍然可能不能上线？
- Workflow 和 Agent 的边界在哪里？
- 模型能调用工具，为什么后端仍然必须做权限校验？
- AI 系统上线后，为什么必须持续收集 Bad Case？
- 模型输出不稳定时，应优先优化 Prompt、上下文、知识库、工具，还是模型本身？
- “上传图片/文档/语音”分别意味着哪些识别、抽取和评测问题？
- 为什么模型部署方式会影响线上体验、合规和商业成本？

## 示例代码

下面是一个最小 LLM 调用伪代码，展示输入、上下文、模型调用和输出校验的结构：

```python
def answer(question, context):
    prompt = f"""基于资料回答问题。
资料：{context}
问题：{question}
"""
    result = call_model(prompt)
    if not result.strip():
        return {"status": "empty", "answer": None}
    return {"status": "ok", "answer": result}
```

真实系统需要把检索、权限、引用、结构化输出、日志和错误处理补齐。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

AI 技术基础 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

| 层次 | 具体内容 |
| --- | --- |
| 输入 | 脚本参数、文件路径、环境变量、网络地址、账号权限。 |
| 处理 | 读取配置、检查依赖、执行命令或任务、写日志。 |
| 输出 | 文件、状态码、日志、任务结果、错误栈。 |
| 指标 | 运行耗时、失败率、重试次数、资源占用。 |

## 关键参数和边界

| 参数/边界 | 说明 |
| --- | --- |
| 路径 | 所有相对路径都依赖工作目录，生产脚本建议使用绝对路径或配置化路径。 |
| 权限 | 读、写、执行权限要分别确认，容器内用户和宿主机用户也可能不同。 |
| 依赖版本 | Python、系统库、CUDA、驱动、三方包版本要能复现。 |
| 日志级别 | 至少区分 info、warning、error，错误要保留堆栈。 |

## 可运行检查

```bash
pwd
whoami
python --version
python -m pip freeze | head
ls -lah
df -h
ps aux | head
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 可复现 | 换一台机器或换一个目录后能按文档跑通。 |
| 可定位 | 失败时能从日志看到输入、配置、错误栈和耗时。 |
| 可回滚 | 改配置或依赖后能恢复到上一个可用版本。 |

## 常见误区和排查

| 问题 | 为什么会发生 | 怎么排查 |
| --- | --- | --- |
| 环境不一致 | 本地、服务器、容器里的 Python、依赖、系统库不同。 | 记录版本并用锁文件或镜像固定。 |
| 路径错误 | 脚本依赖相对路径，换目录后读不到文件。 | 打印工作目录，关键路径配置化。 |
| 权限错误 | 运行账号没有读写执行权限。 | 分别检查文件权限、目录权限和容器用户。 |

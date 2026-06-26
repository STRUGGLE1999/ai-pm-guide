# 循环序列模型

循环序列模型课程关注 RNN、LSTM、GRU 这类按顺序处理数据的模型。虽然今天大模型主要基于 Transformer，但序列建模思想仍然很重要。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="序列模型链路">
  <figcaption>序列模型强调上下文和顺序，适用于文本、语音、用户行为和时间序列。</figcaption>
</figure>

## 技术视角

很多 AI 系统都不是处理单点输入，而是处理一段历史：对话上下文、用户行为路径、设备指标变化、交易序列、语音帧。顺序会影响含义。

| 场景 | 序列含义 |
| --- | --- |
| 多轮对话 | 前文决定“这个”“刚才那个”指什么。 |
| 用户行为 | 点击、浏览、购买顺序影响推荐。 |
| 语音识别 | 声音帧按时间组成语义。 |
| 风险监控 | 指标变化趋势比单点更重要。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="序列模型质量闭环">
  <figcaption>序列任务评测要覆盖长上下文、异常序列和真实线上输入。</figcaption>
</figure>

## 示例代码

下面用 PyTorch 写一个最小的前向计算，展示 Tensor、线性层和输出 shape：

```python
import torch
from torch import nn

model = nn.Sequential(
    nn.Linear(4, 8),
    nn.ReLU(),
    nn.Linear(8, 3),
)

x = torch.randn(5, 4)
y = model(x)

print("input shape:", x.shape)
print("output shape:", y.shape)
```

深度学习文档里经常先确认 shape。输入维度、batch size 和输出维度不匹配，是训练和推理最常见的问题之一。
<!-- ai-tech-real-v1 -->

## 技术细节拆解

循环序列模型 可以拆成输入、处理、输出和指标四层。这样读的时候不会停留在概念名，而是能看到它在系统里接收什么、改变什么、产出什么。

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

# 第十三章 训练、评估、错误分析与模型优化

## 13.1 可复现训练

```python
import os
import random
import numpy as np
import torch

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

set_seed(42)
```

完全确定性可能降低性能且不同硬件仍有差异。真正可复现还需记录：

- 代码 commit；
- Python/框架/CUDA/驱动版本；
- 数据集版本；
- 预训练权重哈希；
- 随机种子；
- 所有超参数；
- 硬件与训练日志。

## 13.2 训练监控

至少记录：

- train/val loss；
- 主指标与每类指标；
- 学习率；
- 梯度范数；
- GPU/CPU/内存/显存利用率；
- 数据加载时间与 step 时间；
- 最好/最后检查点；
- 预测可视化样本。

Loss 下降但指标不升，可能是损失与业务指标不一致、类别不均衡、阈值或后处理问题。

## 13.3 学习率排错

| 现象 | 可能原因 |
|---|---|
| loss 变 NaN | 学习率过大、数值溢出、坏标签 |
| loss 几乎不变 | 学习率太小、层被冻结、标签错 |
| train 波动大 | batch 太小、学习率大、脏样本 |
| 前期好后期差 | 过拟合、调度不合适 |

先尝试小规模数据“能否过拟合”：若模型连 20～100 个样本都拟合不了，优先检查代码、标签、损失和数据流。

## 13.4 混合精度与梯度累积

```python
scaler = torch.amp.GradScaler("cuda")

for images, labels in loader:
    optimizer.zero_grad(set_to_none=True)
    with torch.autocast(device_type="cuda", dtype=torch.float16):
        logits = model(images.cuda())
        loss = criterion(logits, labels.cuda())
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

AMP 可降低显存并提速，但少数算子可能数值不稳。梯度累积：

```python
loss = loss / accumulation_steps
loss.backward()
if (step + 1) % accumulation_steps == 0:
    optimizer.step()
    optimizer.zero_grad(set_to_none=True)
```

使用学习率调度器时要明确它是每 step 还是每 epoch 更新。

## 13.5 多 GPU 训练

DataParallel 简单但效率与扩展性较差；DistributedDataParallel（DDP）更常用。分布式训练注意：

- 使用 `DistributedSampler`；
- 每个 epoch 调 `sampler.set_epoch(epoch)`；
- 只由 rank 0 保存/打印；
- 全局 batch size = 单卡 batch × GPU 数 × 累积步数；
- batch 变化后学习率不一定可机械线性缩放；
- 指标需跨进程聚合。

## 13.6 过拟合优化顺序

建议顺序：

1. 确认没有数据泄漏；
2. 检查训练/验证分布；
3. 可视化错例与标签；
4. 增加真实多样性；
5. 合理增强；
6. 迁移学习/冻结策略；
7. 权重衰减、Dropout、早停；
8. 调小模型；
9. 最后再堆复杂正则。

## 13.7 阈值不是固定 0.5

以二分类为例：

- 漏检代价高：降低阈值提高 Recall；
- 误报代价高：提高阈值改善 Precision；
- 设置拒识区间：低置信度转人工；
- 不同类别可使用不同阈值；
- 阈值必须在验证集设定，在测试集仅评估。

期望业务成本可写为：

$$
\mathrm{Cost}(t)=
C_{FP}\cdot FP(t)+C_{FN}\cdot FN(t)
$$

选择使业务成本可接受的阈值，而不是机械选 0.5。

## 13.8 概率校准

一个校准良好的模型在所有“置信度约 0.8”的样本中，应约有 80% 正确。方法包括 Temperature Scaling、Platt Scaling、Isotonic Regression。

校准集不能与最终测试集混用。分布变化后校准也会失效。

## 13.9 错误分析模板

对每条错误记录：

| 字段 | 示例 |
|---|---|
| 样本 ID | cam03_20260730_00125 |
| 真值/预测 | bird → drone |
| 置信度 | 0.87 |
| 错误类型 | 类间相似 |
| 场景 | 逆光、小目标 |
| 数据问题 | 框略偏 |
| 根因假设 | 训练中逆光鸟不足 |
| 处理建议 | 补真实样本、专门切片评估 |

将错例聚类为：

- 数据/标注错误；
- 成像质量；
- 场景未覆盖；
- 模型能力；
- 阈值/后处理；
- 系统接口或坐标映射；
- 业务定义本身不可观察。

先修占比高且可修的根因。

## 13.10 切片评估

总体指标必须按以下维度拆分：

- 类别；
- 目标尺寸；
- 光照/天气；
- 设备/摄像头；
- 场景/地点；
- 遮挡/截断；
- 图像质量；
- 人群属性（若合法且必要，用于公平性审计）；
- 已知类/未知类；
- 时间段。

平均指标可能掩盖关键场景为 0 的情况。

## 13.11 模型可解释性

常见工具：

- Grad-CAM：查看分类关注区域；
- 特征图可视化；
- Attention map；
- 遮挡敏感性；
- 原型/最近邻检索；
- SHAP（视觉成本较高）；
- 反事实测试：改变背景、颜色、遮挡。

热力图只是模型敏感区域的近似解释，不是因果证明。

## 13.12 鲁棒性与域偏移

| 偏移 | 例子 |
|---|---|
| Covariate shift | 新相机、夜间、压缩 |
| Label shift | 类别比例改变 |
| Concept drift | 业务定义变化 |
| Open-set | 出现未知类别 |

应对：

- 真实场景覆盖；
- 域增强/域适应；
- 测试时增强；
- OOD 检测与拒识；
- 新数据回流；
- 灰度发布和版本对比；
- 保留旧场景回归集，防止灾难性遗忘。

## 13.13 对抗样本与安全

视觉模型可能被微小扰动、贴纸、屏幕重放或特制纹理攻击。安全关键系统不能只依赖单一视觉模型，应组合：

- 输入质量/物理一致性；
- 多帧、多视角、多传感器；
- 异常检测；
- 权限与速率限制；
- 人工复核；
- 红队测试和安全日志。

---

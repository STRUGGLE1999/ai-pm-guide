# 第三章 机器学习、神经网络与 PyTorch 基础

## 3.1 从任务到监督信号

监督学习使用输入 $x$ 和标签 $y$ 学习函数：

$$
\hat{y}=f_\theta(x)
$$

通过最小化损失更新参数：

$$
\theta^*=\arg\min_\theta \frac{1}{N}\sum_{i=1}^{N}
\mathcal{L}(f_\theta(x_i),y_i)
$$

| 任务 | 标签 | 常见损失 |
|---|---|---|
| 单标签分类 | 类别 ID | Cross Entropy |
| 多标签分类 | 多个 0/1 | BCEWithLogits |
| 边界框回归 | 坐标 | L1、Smooth L1、IoU 类 |
| 语义分割 | 像素类别图 | CE、Dice、Focal |
| 关键点 | 热力图/坐标 | MSE、坐标回归损失 |
| 对比学习 | 正负样本关系 | InfoNCE |

## 3.2 训练集、验证集与测试集

- 训练集：更新参数；
- 验证集：调超参数、选模型、设阈值；
- 测试集：最后一次客观评估，不参与调参。

### 3.2.1 视觉数据泄漏尤其隐蔽

错误切分：

- 同一视频相邻帧随机进入训练和测试；
- 同一患者不同切片跨集合；
- 同一产品连拍图跨集合；
- 原图在训练集，增强图在测试集；
- 测试场景与训练场景实际来自同一天同一机位。

正确做法是按“数据来源主体”分组切分，例如按视频、患者、设备、地点或采集日期。

## 3.3 感知机、全连接网络与激活函数

一个神经元：

$$
z=w^Tx+b,\quad a=\phi(z)
$$

多层网络通过非线性激活表达复杂决策边界。

| 激活 | 公式/特点 | 备注 |
|---|---|---|
| ReLU | $\max(0,x)$ | 简单高效，CNN 常用 |
| LeakyReLU | 负区间保留小斜率 | 减少“死 ReLU” |
| GELU | 平滑门控 | Transformer 常用 |
| Sigmoid | 输出 0～1 | 二分类概率/门控，深层易饱和 |
| Softmax | 多类归一化 | 单标签多分类输出 |

## 3.4 前向传播、损失与反向传播

训练一次迭代的核心：

```mermaid
flowchart LR
    A[输入批次] --> B[前向计算]
    B --> C[预测与损失]
    C --> D[自动求梯度]
    D --> E[优化器更新参数]
    E --> F[清空梯度]
```

梯度下降：

$$
\theta_{t+1}=\theta_t-\eta\nabla_\theta\mathcal{L}
$$

其中 $\eta$ 为学习率。太大可能发散，太小学不动。

## 3.5 优化器与学习率

| 优化器 | 特点 | 常见建议 |
|---|---|---|
| SGD + Momentum | 泛化常好，需仔细调参 | 经典 CNN |
| Adam | 自适应学习率，易上手 | 原型、部分生成模型 |
| AdamW | 正确解耦权重衰减 | Transformer 常用 |

学习率策略常见：Step、Cosine、OneCycle、Warmup。Warmup 可避免训练初期大梯度破坏预训练表示。

## 3.6 Batch、Epoch 与 Iteration

- Batch：一次前向/反向处理的样本数；
- Iteration/Step：一次参数更新；
- Epoch：完整看过一次训练集；
- 若训练集 10,000 张，batch size 100，则一个 epoch 约 100 steps。

Batch 不是越大越好：更大更稳、更吃显存，也可能改变泛化；梯度累积可模拟大 batch。

## 3.7 PyTorch 张量与自动求导

安装：

```bash
# CPU 通用安装；GPU/CUDA 请按 PyTorch 官网选择匹配命令
pip install torch torchvision
```

```python
import torch

device = (
    "cuda" if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available()
    else "cpu"
)
print("device:", device)

x = torch.randn(4, 3, 224, 224, device=device)
print(x.shape, x.dtype)

w = torch.tensor(2.0, requires_grad=True)
loss = (w - 5) ** 2
loss.backward()
print("gradient:", w.grad.item())  # 2 * (2 - 5) = -6
```

## 3.8 Dataset、DataLoader 与训练循环

```python
from pathlib import Path
from PIL import Image
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision.transforms import v2

class ImageFolderTable(Dataset):
    def __init__(self, records, train=True):
        self.records = records  # [(path, label), ...]
        self.transform = (
            v2.Compose([
                v2.RandomResizedCrop((224, 224), scale=(0.7, 1.0)),
                v2.RandomHorizontalFlip(),
                v2.ToImage(),
                v2.ToDtype(torch.float32, scale=True),
                v2.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]
                )
            ])
            if train else
            v2.Compose([
                v2.Resize((224, 224)),
                v2.ToImage(),
                v2.ToDtype(torch.float32, scale=True),
                v2.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]
                )
            ])
        )

    def __len__(self):
        return len(self.records)

    def __getitem__(self, index):
        path, label = self.records[index]
        image = Image.open(path).convert("RGB")
        return self.transform(image), torch.tensor(label, dtype=torch.long)

# loader = DataLoader(dataset, batch_size=32, shuffle=True,
#                     num_workers=4, pin_memory=True)
```

当前 Torchvision 官方建议优先使用 `transforms.v2`；它能同步变换图像、边界框、掩码、视频和关键点，降低检测/分割中“图变了但标签没变”的风险。

## 3.9 一个最小训练循环

```python
import torch
from torch import nn

def train_one_epoch(model, loader, optimizer, device):
    model.train()
    total_loss = 0.0

    for images, labels in loader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)

        optimizer.zero_grad(set_to_none=True)
        logits = model(images)
        loss = nn.functional.cross_entropy(logits, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * images.size(0)

    return total_loss / len(loader.dataset)

@torch.inference_mode()
def evaluate(model, loader, device):
    model.eval()
    correct = 0
    total = 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        pred = model(images).argmax(dim=1)
        correct += (pred == labels).sum().item()
        total += labels.numel()
    return correct / max(total, 1)
```

### 3.9.1 `train()`、`eval()` 与 `inference_mode()` 的区别

- `model.train()`：Dropout 启用，BatchNorm 更新统计量；
- `model.eval()`：切到推理行为，但仍可能记录梯度；
- `torch.inference_mode()`：关闭梯度记录，推理更省内存；
- 忘记 `eval()` 会让同一张图多次预测不一致。

## 3.10 欠拟合与过拟合

| 现象 | 训练集 | 验证集 | 可能原因 |
|---|---|---|---|
| 欠拟合 | 差 | 差 | 模型弱、训练不足、特征不够 |
| 正常 | 好 | 接近训练集 | 泛化较好 |
| 过拟合 | 很好 | 明显差 | 数据少、模型大、泄漏/偏差 |

常见应对：

- 欠拟合：增加模型能力、训练轮数、改损失或分辨率；
- 过拟合：更多真实数据、合理增强、权重衰减、Dropout、早停、迁移学习；
- 两者都不要只凭 loss 判断，要看每类和业务切片的错误。

---

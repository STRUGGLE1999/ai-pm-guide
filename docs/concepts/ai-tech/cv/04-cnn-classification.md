# 第四章 CNN 与图像分类

<figure class="article-figure">
  <img src="/concepts/ai-tech/cv/03-framework-core-vision-tasks.png" alt="分类、检测、分割和姿态的视觉任务地图" loading="lazy">
  <figcaption>同一张图可以对应完全不同的监督信号与输出形式，视觉任务应由最终输出定义。</figcaption>
</figure>

## 4.1 图像分类解决什么问题？

图像分类将整张图映射到类别。

| 类型 | 标签形式 | 例子 | 输出层 |
|---|---|---|---|
| 二分类 | 0/1 | 正常/缺陷 | 1 个 logit + Sigmoid，或 2 类 Softmax |
| 多分类 | N 选 1 | 猫/狗/鸟 | N 类 Softmax |
| 多标签 | 每类独立 0/1 | 图中同时有车、人、树 | N 个 Sigmoid |
| 层级分类 | 树状标签 | 动物→犬科→哈士奇 | 多头或层级损失 |
| 细粒度分类 | 类间差别小 | 鸟种、车型、零件型号 | 高分辨率与局部特征 |

如果一张图同时出现多个目标，而你需要分别知道它们的位置，就不应只做整图分类。

## 4.2 为什么全连接网络不适合直接处理大图？

将 `224×224×3` 展平后有 150,528 个输入。接一个 1,000 维全连接层就约有 1.5 亿参数，而且忽略“相邻像素更相关”的空间结构。

CNN 的三项关键归纳偏置：

1. **局部连接**：先看小邻域；
2. **权重共享**：同一个卷积核在全图寻找相同模式；
3. **层级特征**：浅层学边缘，中层学纹理/部件，深层学语义。

## 4.3 卷积层的输入输出

二维卷积权重形状：

```text
[out_channels, in_channels, kernel_h, kernel_w]
```

参数量（含偏置）：

$$
C_{out}\times(C_{in}\times K_h\times K_w+1)
$$

```python
import torch
from torch import nn

conv = nn.Conv2d(
    in_channels=3,
    out_channels=32,
    kernel_size=3,
    stride=1,
    padding=1
)
x = torch.randn(8, 3, 224, 224)
y = conv(x)
print(y.shape)  # [8, 32, 224, 224]
```

每个输出通道可以看成一种学习到的特征响应图。

## 4.4 感受野、下采样与多尺度

感受野是一个特征位置能“看到”的原图范围。连续卷积、池化或步长卷积会扩大感受野。

- 小感受野：边缘、纹理；
- 大感受野：完整物体、场景关系；
- 下采样节省计算，但会损失小目标和精细边界；
- 检测与分割常使用多尺度特征融合。

池化：

```python
max_pool = nn.MaxPool2d(kernel_size=2, stride=2)
avg_pool = nn.AdaptiveAvgPool2d((1, 1))
```

全局平均池化把每个通道汇总成一个值，比巨大全连接层参数少。

## 4.5 BatchNorm、Dropout 与残差连接

### Batch Normalization

对一个批次中的特征做标准化并学习缩放/偏移。它能稳定训练，但：

- 小 batch 时统计量不稳；
- 训练和推理行为不同；
- 微调时是否冻结 BN 需要实验。

### Dropout

训练时随机将部分激活置零，减少特征共适应；卷积骨干中并非总是必需。

### 残差连接

$$
y=F(x)+x
$$

模型只需学习残差 $F(x)$，让深层网络更易优化。ResNet 是现代视觉骨干的重要起点。

## 4.6 经典 CNN 架构演进

| 模型 | 年代 | 核心贡献 | 今天为什么还要知道 |
|---|---:|---|---|
| LeNet-5 | 1998 | 卷积 + 池化 + 分类 | CNN 入门结构 |
| AlexNet | 2012 | GPU、ReLU、Dropout、大规模训练 | 深度学习视觉转折点 |
| VGG | 2014 | 堆叠 3×3 卷积 | 结构规整，参数量大 |
| GoogLeNet/Inception | 2014 | 多分支多尺度、1×1 降维 | 多尺度思想 |
| ResNet | 2015 | 残差连接 | 深层骨干基础 |
| DenseNet | 2016 | 密集连接、特征复用 | 强梯度与复用 |
| MobileNet | 2017 起 | 深度可分离卷积 | 移动/边缘端 |
| EfficientNet | 2019 | 深度、宽度、分辨率复合缩放 | 精度效率平衡 |
| ConvNeXt | 2022 | 用现代训练设计重塑 CNN | CNN 与 ViT 思想融合 |

### 4.6.1 深度可分离卷积为什么省计算？

标准卷积同时做空间和通道混合。深度可分离卷积分两步：

1. Depthwise：每个通道独立做空间卷积；
2. Pointwise：用 1×1 卷积混合通道。

在移动端模型中可大幅减少参数和乘加计算。

## 4.7 交叉熵与标签平滑

单标签多分类交叉熵：

$$
\mathcal{L}_{CE}=-\log p_y
$$

标签平滑把绝对 one-hot 变得稍微柔和，降低过度自信：

```python
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
```

多标签任务应使用：

```python
criterion = nn.BCEWithLogitsLoss()
```

不要先对输出做 Sigmoid 再传入 `BCEWithLogitsLoss`，它内部已包含数值稳定版本的 Sigmoid。

## 4.8 分类指标

| 指标 | 回答的问题 |
|---|---|
| Top-1 Accuracy | 第一预测是否正确 |
| Top-k Accuracy | 正确类别是否在前 k 个 |
| Precision | 预测为某类的样本中多少正确 |
| Recall/Sensitivity | 真实某类中找到了多少 |
| Specificity | 真实负类中排除了多少 |
| F1 | Precision 与 Recall 的调和平均 |
| ROC-AUC | 不同阈值下排序能力 |
| PR-AUC | 正类稀少时更关注正类质量 |
| ECE | 概率置信度是否校准 |

混淆矩阵能回答“模型把哪一类错成了哪一类”，比单一准确率更能指导数据改进。

## 4.9 数据增强

```python
from torchvision.transforms import v2
import torch

train_transform = v2.Compose([
    v2.RandomResizedCrop((224, 224), scale=(0.7, 1.0)),
    v2.RandomHorizontalFlip(p=0.5),
    v2.ColorJitter(
        brightness=0.2, contrast=0.2,
        saturation=0.2, hue=0.05
    ),
    v2.ToImage(),
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])
```

增强必须保持标签语义：

- 数字 `6` 水平/垂直翻转可能变错；
- 医学影像左右侧可能有临床含义；
- 交通标志颜色不能随意改变；
- 旋转框、关键点、掩码必须与图像同步变换。

MixUp 把两张图与标签线性混合；CutMix 将一块区域粘贴到另一图并按面积混合标签。它们能改善泛化，但可解释性和标签处理更复杂。

## 4.10 迁移学习

迁移学习利用大数据预训练模型作为起点。

```mermaid
flowchart LR
    A[通用大数据预训练] --> B[预训练骨干]
    B --> C[替换任务分类头]
    C --> D[先冻结骨干训练头]
    D --> E[小学习率解冻微调]
    E --> F[业务模型]
```

```python
from torchvision.models import resnet18, ResNet18_Weights
from torch import nn

weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)
model.fc = nn.Linear(model.fc.in_features, 4)
```

训练预处理最好直接从权重获取：

```python
inference_transform = weights.transforms()
```

### 4.10.1 冻结还是全部微调？

| 条件 | 推荐 |
|---|---|
| 数据极少、领域接近自然图像 | 冻结骨干，先训头 |
| 数据中等 | 先训头，再小学习率解冻 |
| 领域差异大（X 光、红外、遥感） | 更充分微调或领域预训练 |
| 算力充足、数据很多 | 全量微调，并与从头训练比较 |

## 4.11 分类项目的高频失败原因

- 背景捷径：模型学到“草地=牛”，而不是牛；
- 水印泄漏：正类图片来自一个网站，负类来自另一个；
- 拍摄设备泄漏：某个类别总由特定相机拍摄；
- 类别不均衡，却只看 Accuracy；
- 把检测问题硬做成整图分类；
- 训练裁剪掉目标，推理却保留全图；
- 使用预训练模型但预处理不匹配；
- 只保存 `model.pt`，没有保存类别映射和阈值。

---

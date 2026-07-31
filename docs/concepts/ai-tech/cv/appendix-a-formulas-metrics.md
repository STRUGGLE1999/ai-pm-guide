# 附录 A 常用公式与指标速查

## A.1 分类

$$
\mathrm{Precision}=\frac{TP}{TP+FP}
$$

$$
\mathrm{Recall}=\frac{TP}{TP+FN}
$$

$$
\mathrm{Specificity}=\frac{TN}{TN+FP}
$$

$$
F1=2\frac{\mathrm{Precision}\cdot\mathrm{Recall}}
{\mathrm{Precision}+\mathrm{Recall}}
$$

## A.2 检测与分割

$$
\mathrm{IoU}=\frac{TP}{TP+FP+FN}
$$

$$
\mathrm{Dice}=\frac{2TP}{2TP+FP+FN}
$$

Dice 与 IoU 的关系：

$$
\mathrm{Dice}=\frac{2\mathrm{IoU}}{1+\mathrm{IoU}}
$$

## A.3 图像质量

均方误差：

$$
\mathrm{MSE}=\frac{1}{N}\sum_i(x_i-\hat{x}_i)^2
$$

PSNR：

$$
\mathrm{PSNR}=10\log_{10}\frac{MAX_I^2}{\mathrm{MSE}}
$$

PSNR 高通常表示像素更接近，但不保证人眼感知更好。

## A.4 模型计算量

- Parameters：模型参数数量，影响大小与内存；
- FLOPs/MACs：理论计算量；
- Latency：特定硬件上的真实延迟；
- Throughput：单位时间处理量；
- FLOPs 少不保证延迟低，内存访问和算子支持同样重要。

## A.5 检测错误分类

| 错误 | 定义 |
|---|---|
| Classification error | 框对但类别错 |
| Localization error | 类别对但 IoU 不够 |
| Duplicate | 同一真值出现多个预测 |
| Background FP | 背景被误检 |
| Missed GT | 真值没有任何匹配预测 |

---

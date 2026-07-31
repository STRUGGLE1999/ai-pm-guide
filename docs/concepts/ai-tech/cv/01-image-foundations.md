# 第一章 计算机视觉全景与图像基础

## 1.1 图像在计算机里是什么？

数字图像本质上是一个数值数组。灰度图通常是二维矩阵，彩色图通常是三维张量。

```text
灰度图：[H, W]
彩色图（OpenCV/NumPy 常见）：[H, W, C]
深度学习张量（PyTorch 常见）：[C, H, W]
一批图像：[N, C, H, W]
```

- `H`：高度（行数）；
- `W`：宽度（列数）；
- `C`：通道数；
- `N`：批次大小。

一张 `1920×1080` 的 RGB 8 位图像，未压缩数据约为：

$$
1920\times1080\times3\times1\ \text{byte}\approx 5.93\ \text{MiB}
$$

JPEG 文件可能只有几百 KB，是因为它做了有损压缩；“文件大小”与“解码后的内存大小”不是一回事。

### 1.1.1 像素、分辨率与空间位置

像素（Pixel）是栅格图像的最小采样单元。常用坐标约定：

```text
原点 (0, 0) 在左上角
x 向右增加，对应列
y 向下增加，对应行
图像访问通常写 image[y, x]
```

这是新手最常犯的错误之一：数学坐标常写 $(x,y)$，NumPy 索引却是 `[row, column] = [y, x]`。

### 1.1.2 位深与动态范围

| 类型 | 每通道范围 | 常见用途 |
|---|---:|---|
| `uint8` | 0～255 | JPEG、PNG、普通显示 |
| `uint16` | 0～65535 | 医学、工业、深度相机 |
| `float32` | 常归一化到 0～1 | 模型训练和计算 |
| HDR/RAW | 更宽动态范围 | 摄影、遥感、科学成像 |

位深越高，可表达的亮度层级越细，但存储和计算成本更大。将 16 位医学图像直接转成 8 位，可能永久丢失诊断信息。

## 1.2 颜色空间

颜色空间是表示颜色的坐标系统。

| 颜色空间 | 含义 | 典型用途 |
|---|---|---|
| RGB | 红、绿、蓝 | 显示与深度学习 |
| BGR | 蓝、绿、红 | OpenCV 默认彩色顺序 |
| Gray | 单通道亮度 | 边缘、阈值、传统算法 |
| HSV | 色相、饱和度、明度 | 按颜色分割，较易分离亮度 |
| Lab | 亮度 + 两个颜色轴 | 色差、颜色校正 |
| YCbCr/YUV | 亮度 + 色度 | 视频编码、JPEG |

```python
import cv2

bgr = cv2.imread("image.jpg")
if bgr is None:
    raise FileNotFoundError("image.jpg")

rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)

print("BGR:", bgr.shape, bgr.dtype)
print("Gray:", gray.shape, gray.dtype)
```

> OpenCV 默认 BGR，Pillow、Matplotlib 和多数深度学习模型默认 RGB。若颜色发蓝或发红，先检查通道顺序。

## 1.3 图像读取、显示与保存

安装基础环境：

```bash
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
# .venv\Scripts\Activate.ps1

python -m pip install -U pip
pip install numpy matplotlib pillow opencv-python jupyter
```

```python
from pathlib import Path
import cv2
import matplotlib.pyplot as plt

image_path = Path("data/example.jpg")
bgr = cv2.imread(str(image_path))
if bgr is None:
    raise FileNotFoundError(f"无法读取：{image_path.resolve()}")

rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
print({
    "shape": rgb.shape,
    "dtype": str(rgb.dtype),
    "min": int(rgb.min()),
    "max": int(rgb.max())
})

plt.imshow(rgb)
plt.axis("off")
plt.show()

cv2.imwrite("outputs/copy.jpg", bgr)
```

### 1.3.1 为什么保存后的图可能变了？

- JPEG 是有损压缩，多次保存会累积失真；
- PNG 通常无损，但文件较大；
- 图像可能包含 EXIF 旋转信息，读取库处理方式不同；
- ICC 色彩配置、Gamma 和显示器都会影响观感；
- 浮点图若未缩放到正确范围，保存时可能全黑或全白。

## 1.4 图像归一化与标准化

归一化常把 `uint8` 的 0～255 转为 0～1：

$$
x'=\frac{x}{255}
$$

标准化进一步按通道处理：

$$
\hat{x}_c=\frac{x_c-\mu_c}{\sigma_c}
$$

```python
import numpy as np

rgb_float = rgb.astype(np.float32) / 255.0
mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
normalized = (rgb_float - mean) / std
```

这里的均值和标准差是 ImageNet 预训练模型常用值，不是全世界图像的固定真理。使用预训练权重时，应使用该权重配套的预处理。

## 1.5 成像模型：现实世界如何变成图像？

相机不是“把世界原样复制下来”，而是光经过镜头、光圈、快门和传感器后形成采样。

### 1.5.1 针孔相机模型

三维点 $P=(X,Y,Z)$ 投影到归一化图像平面：

$$
x=\frac{X}{Z},\quad y=\frac{Y}{Z}
$$

加入相机内参后：

$$
s
\begin{bmatrix}
u\\v\\1
\end{bmatrix}
=
\underbrace{
\begin{bmatrix}
f_x&0&c_x\\
0&f_y&c_y\\
0&0&1
\end{bmatrix}}_{K}
\begin{bmatrix}
R&t
\end{bmatrix}
\begin{bmatrix}
X\\Y\\Z\\1
\end{bmatrix}
$$

| 参数 | 含义 |
|---|---|
| $f_x,f_y$ | 水平、垂直方向焦距（像素单位） |
| $c_x,c_y$ | 主点，通常接近图像中心 |
| $R,t$ | 世界坐标到相机坐标的旋转和平移 |
| $K$ | 相机内参矩阵 |

### 1.5.2 镜头畸变

- 径向畸变：直线向外或向内弯曲，常见桶形/枕形；
- 切向畸变：镜头与传感器不完全平行造成偏斜；
- 鱼眼镜头：视场大，需要专门模型。

相机标定就是利用棋盘格等已知几何结构估计内参与畸变参数。测距、三维重建、AR 和机器人项目不能忽略它。

## 1.6 图像、视频、深度图与点云的区别

| 数据 | 常见形状 | 每个元素表达什么 |
|---|---|---|
| RGB 图像 | `H×W×3` | 颜色 |
| 视频 | `T×H×W×3` | 时间序列颜色 |
| 深度图 | `H×W` | 相机到表面的距离 |
| 法线图 | `H×W×3` | 表面方向 |
| 点云 | `N×3` 或 `N×(3+k)` | 三维坐标及颜色/强度 |
| 多光谱图像 | `H×W×C` | 多个波段反射 |

深度图中的 0、NaN 或最大值常代表“无有效测量”，不能直接当真实距离。

## 1.7 第一章实践：检查任意图像的数据质量

```python
from pathlib import Path
import cv2
import numpy as np

def inspect_image(path: str) -> dict:
    image = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if image is None:
        return {"path": path, "valid": False, "reason": "decode_failed"}

    result = {
        "path": path,
        "valid": True,
        "shape": tuple(image.shape),
        "dtype": str(image.dtype),
        "min": float(np.min(image)),
        "max": float(np.max(image)),
        "mean": float(np.mean(image)),
        "std": float(np.std(image)),
        "all_black": bool(np.max(image) == 0),
        "all_white_uint8": bool(image.dtype == np.uint8 and np.min(image) == 255),
    }
    return result

for p in Path("data/images").glob("*"):
    if p.is_file():
        print(inspect_image(str(p)))
```

真实项目还应检查：重复图、极端宽高比、模糊、曝光、损坏文件、错误后缀、异常通道、标签缺失与隐私信息。

---

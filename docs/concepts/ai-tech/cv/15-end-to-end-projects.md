# 第十五章 三个端到端实践项目

## 15.1 项目一：迁移学习图像分类器

### 15.1.1 目标

使用自己的文件夹数据训练一个多分类模型，并输出评估报告和推理结果。

目录：

```text
classification_project/
├── data/
│   ├── train/
│   │   ├── class_a/
│   │   └── class_b/
│   ├── val/
│   └── test/
├── outputs/
├── train.py
├── predict.py
└── requirements.txt
```

### 15.1.2 完整训练脚本

```python
# train.py
from copy import deepcopy
from pathlib import Path
import json
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.models import resnet18, ResNet18_Weights
from torchvision.transforms import v2

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = ROOT / "outputs"
OUT.mkdir(exist_ok=True)

device = (
    "cuda" if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available()
    else "cpu"
)

weights = ResNet18_Weights.DEFAULT
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]

train_tf = v2.Compose([
    v2.RandomResizedCrop((224, 224), scale=(0.7, 1.0)),
    v2.RandomHorizontalFlip(),
    v2.ColorJitter(0.2, 0.2, 0.2, 0.05),
    v2.ToImage(),
    v2.ToDtype(torch.float32, scale=True),
    v2.Normalize(mean, std)
])
eval_tf = weights.transforms()

train_ds = datasets.ImageFolder(DATA / "train", transform=train_tf)
val_ds = datasets.ImageFolder(DATA / "val", transform=eval_tf)
assert train_ds.class_to_idx == val_ds.class_to_idx

train_loader = DataLoader(
    train_ds, batch_size=32, shuffle=True,
    num_workers=4, pin_memory=device == "cuda"
)
val_loader = DataLoader(
    val_ds, batch_size=64, shuffle=False,
    num_workers=4, pin_memory=device == "cuda"
)

model = resnet18(weights=weights)
model.fc = nn.Linear(model.fc.in_features, len(train_ds.classes))
model.to(device)

criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

best_acc = -1.0
best_state = None

for epoch in range(10):
    model.train()
    train_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad(set_to_none=True)
        logits = model(images)
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()
        train_loss += loss.item() * images.size(0)

    model.eval()
    correct = total = 0
    with torch.inference_mode():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            pred = model(images).argmax(dim=1)
            correct += (pred == labels).sum().item()
            total += labels.numel()

    val_acc = correct / max(total, 1)
    scheduler.step()
    print(
        f"epoch={epoch+1:02d} "
        f"loss={train_loss/len(train_ds):.4f} "
        f"val_acc={val_acc:.4f}"
    )

    if val_acc > best_acc:
        best_acc = val_acc
        best_state = deepcopy(model.state_dict())

torch.save({
    "model_state": best_state,
    "class_to_idx": train_ds.class_to_idx,
    "architecture": "resnet18",
    "input_size": [224, 224],
    "mean": mean,
    "std": std,
    "best_val_acc": best_acc
}, OUT / "best.pt")

(OUT / "classes.json").write_text(
    json.dumps(train_ds.class_to_idx, ensure_ascii=False, indent=2),
    encoding="utf-8"
)
```

### 15.1.3 实践验收

- 独立 test 集每类 Precision/Recall/F1；
- 混淆矩阵；
- 20 条高置信度错例；
- 按亮度、设备、场景切片；
- 单图端到端延迟；
- 保存类别映射与预处理。

## 15.2 项目二：自定义目标检测

### 15.2.1 闭环步骤

1. 定义类别和标注规范；
2. 收集含目标、空背景和困难负样本；
3. 按视频/场景切分；
4. 转 YOLO 或 COCO 格式；
5. 自动校验标签；
6. 训练轻量预训练模型；
7. 查看每类 PR 曲线与 AP；
8. 分析误报/漏报/框偏差；
9. 在真实视频上调业务阈值；
10. 加跟踪与事件规则；
11. 导出并做一致性测试。

### 15.2.2 不要只看训练命令

一个可交付检测 Demo 至少包括：

```text
输入视频
→ 解码
→ 检测
→ 坐标映射
→ 跟踪
→ 区域/跨线/持续时间规则
→ 告警去重
→ 截图与证据片段
→ 人工确认
```

例如“无人机入侵”不是看到一帧框就报警，可定义：

```text
条件：
1. 类别=drone；
2. confidence≥类别阈值；
3. 连续出现≥K 帧或持续≥T 秒；
4. 轨迹进入警戒区；
5. 与已知白名单目标不匹配。
```

### 15.2.3 检测实验表

| 实验 | 只改一个变量 | 观察 |
|---|---|---|
| Baseline | 预训练小模型，640 | 每类 AP、延迟 |
| 输入尺寸 | 640→960 | 小目标 AP 与延迟 |
| 切片 | 开/关 | 小目标 Recall、重复框 |
| 增强 | 增加压缩/模糊 | 夜间/低清切片 |
| 模型大小 | n→s/m | 精度-成本 |
| 阈值 | 每类阈值 | 业务误报/漏报 |

## 15.3 项目三：OpenCV 文档扫描与 OCR 前处理

目标：拍摄纸张后自动找四边形、透视矫正、增强并保存。

```python
from pathlib import Path
import cv2
import numpy as np

def order_points(points):
    pts = np.asarray(points, dtype=np.float32)
    ordered = np.zeros((4, 2), dtype=np.float32)
    sums = pts.sum(axis=1)
    diffs = np.diff(pts, axis=1).reshape(-1)
    ordered[0] = pts[np.argmin(sums)]   # top-left
    ordered[2] = pts[np.argmax(sums)]   # bottom-right
    ordered[1] = pts[np.argmin(diffs)]  # top-right
    ordered[3] = pts[np.argmax(diffs)]  # bottom-left
    return ordered

def four_point_transform(image, points):
    tl, tr, br, bl = order_points(points)
    width = int(max(np.linalg.norm(br - bl), np.linalg.norm(tr - tl)))
    height = int(max(np.linalg.norm(tr - br), np.linalg.norm(tl - bl)))
    dst = np.array([
        [0, 0], [width - 1, 0],
        [width - 1, height - 1], [0, height - 1]
    ], dtype=np.float32)
    matrix = cv2.getPerspectiveTransform(
        np.array([tl, tr, br, bl], dtype=np.float32), dst
    )
    return cv2.warpPerspective(image, matrix, (width, height))

image = cv2.imread("document.jpg")
if image is None:
    raise FileNotFoundError("document.jpg")

ratio = image.shape[0] / 800.0
small = cv2.resize(
    image, (int(image.shape[1] / ratio), 800)
)
gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(blur, 60, 160)

contours, _ = cv2.findContours(
    edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
)
contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]

page = None
for contour in contours:
    perimeter = cv2.arcLength(contour, True)
    polygon = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
    if len(polygon) == 4:
        page = polygon.reshape(4, 2) * ratio
        break

if page is None:
    raise RuntimeError("未找到纸张四角，请改善背景或手动指定")

warped = four_point_transform(image, page)
warped_gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
enhanced = cv2.adaptiveThreshold(
    warped_gray, 255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY,
    31, 12
)

Path("outputs").mkdir(exist_ok=True)
cv2.imwrite("outputs/scanned.png", enhanced)
```

### 15.3.1 继续扩展

- 检测失败时让用户拖动四角；
- 自动方向判断；
- 去阴影与去摩尔纹；
- 接 OCR；
- 版面和表格识别；
- 结构化字段校验；
- 保存原图、矫正图和识别结果以便审计。

## 15.4 项目完成的定义

“代码能跑”只是开始。完整项目应有：

- 清晰问题与验收指标；
- 数据与标注规范；
- 可复现训练；
- 独立测试集；
- Baseline 与改进对比；
- 错误分析；
- 推理接口或 Demo；
- 性能测试；
- 风险、限制与人工兜底；
- 监控和数据回流设计。

---

# 附录 B 常见数据集与工具速查

## B.1 常见数据集

| 领域 | 数据集 | 主要任务 |
|---|---|---|
| 分类 | MNIST、CIFAR-10/100、ImageNet | 分类 |
| 通用检测/分割 | PASCAL VOC、COCO、Open Images | 检测/分割 |
| 城市场景 | Cityscapes、BDD100K、KITTI | 分割/检测/驾驶 |
| 自动驾驶 3D | KITTI、nuScenes、Waymo Open | 3D 检测/跟踪 |
| 人体姿态 | COCO Keypoints、MPII | 关键点 |
| 跟踪 | MOTChallenge、DanceTrack | 多目标跟踪 |
| 视频动作 | UCF101、Kinetics、Something-Something | 动作识别 |
| 深度 | NYU Depth V2、KITTI Depth | 深度估计 |
| 三维 | ShapeNet、ScanNet、ModelNet | 点云/重建 |
| 人脸 | LFW 等 | 验证（注意许可与偏差） |
| 遥感 | DOTA、xView、SpaceNet | OBB/检测/分割 |
| 文档 | ICDAR 系列、DocLayNet | OCR/版面 |

使用任何数据集前核对许可证、用途限制、版本、划分和标签定义。

## B.2 工具生态

| 工具 | 用途 |
|---|---|
| NumPy | 数组与数值计算 |
| Pillow | 图像读写与简单处理 |
| OpenCV | 经典视觉、视频、几何 |
| Matplotlib | 可视化 |
| scikit-image | 科学图像处理 |
| PyTorch | 深度学习 |
| Torchvision | 数据、变换、预训练视觉模型 |
| timm | 丰富的分类骨干与训练配方 |
| Albumentations | 高性能图像增强 |
| Ultralytics | YOLO 检测/分割/姿态等 |
| Detectron2 / MMDetection / MMSegmentation | 检测分割研究与工程 |
| Hugging Face Transformers | ViT、DETR、视觉基础模型 |
| Segment Anything | 提示式分割 |
| Open3D | 点云与三维 |
| FiftyOne | 数据集可视化与错误分析 |
| CVAT / Label Studio | 标注 |
| MLflow / W&B / TensorBoard | 实验跟踪 |
| ONNX / ONNX Runtime | 跨框架导出与推理 |
| TensorRT | NVIDIA 推理优化 |
| FastAPI | 模型服务 |

## B.3 推荐项目目录

```text
cv-project/
├── configs/
├── data/
│   ├── raw/                  # 原始数据，只读
│   ├── annotations/
│   ├── splits/               # 固定样本清单
│   └── processed/
├── docs/
│   ├── label_guideline.md
│   └── model_card.md
├── notebooks/                # 只做探索
├── src/
│   ├── dataset.py
│   ├── transforms.py
│   ├── model.py
│   ├── train.py
│   ├── evaluate.py
│   ├── predict.py
│   └── export.py
├── tests/
├── outputs/
├── requirements.txt
└── README.md
```

---

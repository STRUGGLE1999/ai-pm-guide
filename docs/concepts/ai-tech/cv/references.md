# 参考资料与经典论文

以下优先列官方文档、原始论文和官方代码。链接与 API 会变化，正式复现需记录访问日期与版本。

## 官方文档与实践

1. [OpenCV-Python Tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)  
2. [OpenCV Image Processing Tutorials](https://docs.opencv.org/4.x/d2/d96/tutorial_py_table_of_contents_imgproc.html)  
3. [PyTorch Tutorials](https://docs.pytorch.org/tutorials/)  
4. [PyTorch Computer Vision Transfer Learning](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)  
5. [Torchvision Transforms v2](https://docs.pytorch.org/vision/stable/transforms.html)  
6. [Torchvision Datasets](https://docs.pytorch.org/vision/stable/datasets.html)  
7. [Torchvision Models and Pretrained Weights](https://docs.pytorch.org/vision/stable/models.html)  
8. [Torchvision Object Detection Finetuning Tutorial](https://docs.pytorch.org/tutorials/intermediate/torchvision_tutorial.html)  
9. [Hugging Face Image Classification](https://huggingface.co/docs/transformers/tasks/image_classification)  
10. [Hugging Face Object Detection](https://huggingface.co/docs/transformers/tasks/object_detection)  
11. [Hugging Face Image Segmentation](https://huggingface.co/docs/transformers/tasks/semantic_segmentation)  
12. [Ultralytics Tasks Documentation](https://docs.ultralytics.com/tasks/)  
13. [Segment Anything 2 Official Repository](https://github.com/facebookresearch/sam2)  
14. [DINOv3 Official Repository](https://github.com/facebookresearch/dinov3)  
15. [ONNX Runtime Documentation](https://onnxruntime.ai/docs/)  
16. [ONNX Runtime Quantization](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html)  

## 深度学习与识别

17. [ImageNet Classification with Deep Convolutional Neural Networks（AlexNet）](https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)  
18. [Very Deep Convolutional Networks for Large-Scale Image Recognition（VGG）](https://arxiv.org/abs/1409.1556)  
19. [Going Deeper with Convolutions（GoogLeNet）](https://arxiv.org/abs/1409.4842)  
20. [Deep Residual Learning for Image Recognition（ResNet）](https://arxiv.org/abs/1512.03385)  
21. [MobileNets](https://arxiv.org/abs/1704.04861)  
22. [EfficientNet](https://arxiv.org/abs/1905.11946)  
23. [A ConvNet for the 2020s（ConvNeXt）](https://arxiv.org/abs/2201.03545)  

## 检测与分割

24. [Faster R-CNN](https://arxiv.org/abs/1506.01497)  
25. [You Only Look Once](https://arxiv.org/abs/1506.02640)  
26. [Feature Pyramid Networks](https://arxiv.org/abs/1612.03144)  
27. [Focal Loss for Dense Object Detection（RetinaNet）](https://arxiv.org/abs/1708.02002)  
28. [End-to-End Object Detection with Transformers（DETR）](https://arxiv.org/abs/2005.12872)  
29. [Fully Convolutional Networks for Semantic Segmentation](https://arxiv.org/abs/1411.4038)  
30. [U-Net](https://arxiv.org/abs/1505.04597)  
31. [DeepLabv3+](https://arxiv.org/abs/1802.02611)  
32. [Mask R-CNN](https://arxiv.org/abs/1703.06870)  
33. [Masked-attention Mask Transformer（Mask2Former）](https://arxiv.org/abs/2112.01527)  
34. [Segment Anything](https://arxiv.org/abs/2304.02643)  

## Transformer、自监督与多模态

35. [Attention Is All You Need](https://arxiv.org/abs/1706.03762)  
36. [An Image is Worth 16×16 Words（ViT）](https://arxiv.org/abs/2010.11929)  
37. [Swin Transformer](https://arxiv.org/abs/2103.14030)  
38. [A Simple Framework for Contrastive Learning（SimCLR）](https://arxiv.org/abs/2002.05709)  
39. [Momentum Contrast（MoCo）](https://arxiv.org/abs/1911.05722)  
40. [Emerging Properties in Self-Supervised Vision Transformers（DINO）](https://arxiv.org/abs/2104.14294)  
41. [Masked Autoencoders Are Scalable Vision Learners（MAE）](https://arxiv.org/abs/2111.06377)  
42. [Learning Transferable Visual Models From Natural Language Supervision（CLIP）](https://arxiv.org/abs/2103.00020)  

## 视频、三维与生成

43. [RAFT: Recurrent All-Pairs Field Transforms for Optical Flow](https://arxiv.org/abs/2003.12039)  
44. [Simple Online and Realtime Tracking（SORT）](https://arxiv.org/abs/1602.00763)  
45. [ByteTrack](https://arxiv.org/abs/2110.06864)  
46. [PointNet](https://arxiv.org/abs/1612.00593)  
47. [NeRF](https://arxiv.org/abs/2003.08934)  
48. [3D Gaussian Splatting](https://arxiv.org/abs/2308.04079)  
49. [Auto-Encoding Variational Bayes（VAE）](https://arxiv.org/abs/1312.6114)  
50. [Generative Adversarial Nets（GAN）](https://arxiv.org/abs/1406.2661)  
51. [Denoising Diffusion Probabilistic Models（DDPM）](https://arxiv.org/abs/2006.11239)  
52. [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)  

> **学习建议**：不要试图一次背下所有模型。先完成“OpenCV 小项目 → 分类 → 检测 → 分割 → 视频/三维或多模态方向选修 → 部署”的主线；每学一个模型，都回到输入、输出、标签、损失、指标、成本和失败场景。

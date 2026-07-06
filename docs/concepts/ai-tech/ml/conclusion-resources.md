# 结语：学机器学习，关键不是记住所有算法

对初学者来说，最重要的能力不是背出十种模型的公式，而是能完整回答下面这些问题：

1. 这个业务问题到底需要预测、分类、排序还是分群？
2. 标签是什么，标签是否可靠？
3. 哪些数据在预测时真实可获得？
4. 训练、验证、测试是怎么切分的，有没有泄漏？
5. 业务真正关心什么指标，漏判和误判各自代价多大？
6. 模型上线后如何被调用、监控、反馈和更新？

掌握这套思维后，你不仅能运行代码，更能判断一个机器学习方案是否真正可用。

---

# 官方资料与延伸学习

以下资料适合在完成本文代码后继续查阅：

- [Python 虚拟环境官方文档](https://docs.python.org/3/library/venv.html)
- [scikit-learn：Getting Started](https://scikit-learn.org/stable/getting_started.html)
- [scikit-learn：模型选择与交叉验证](https://scikit-learn.org/stable/modules/cross_validation.html)
- [scikit-learn：Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html)
- [scikit-learn：预处理](https://scikit-learn.org/stable/modules/preprocessing.html)
- [scikit-learn：监督学习与无监督学习用户指南](https://scikit-learn.org/stable/user_guide.html)
- [scikit-learn：选择合适估计器的流程图](https://scikit-learn.org/stable/machine_learning_map.html)
- [XGBoost 官方文档](https://xgboost.readthedocs.io/)

> **版本提示**：不同库版本的个别参数名称可能变化。运行代码时，优先以本地安装版本对应的官方文档为准；当报错时，先查看报错信息和函数签名，而不是盲目复制旧教程代码。

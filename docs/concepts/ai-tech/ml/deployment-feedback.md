# 模型部署、预测与反馈循环

## 1. 保存模型

```python
import joblib

joblib.dump(best_model, "churn_model.joblib")
```

加载模型：

```python
model = joblib.load("churn_model.joblib")
```

## 2. 本地批量预测

```python
import pandas as pd
import joblib

model = joblib.load("churn_model.joblib")
new_users = pd.read_csv("new_users.csv")

# 必须与训练时的特征列一致
feature_columns = [
    "days_since_last_login",
    "usage_count_30d",
    "is_member",
    "complaint_count"
]

new_users["churn_probability"] = model.predict_proba(new_users[feature_columns])[:, 1]
new_users["churn_prediction"] = model.predict(new_users[feature_columns])

new_users.to_csv("prediction_result.csv", index=False)
```

## 3. 用 FastAPI 封装为简单预测接口

项目结构示例：

```text
ml-service/
├── app.py
├── churn_model.joblib
└── requirements.txt
```

`app.py`：

```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="用户流失预测服务")
model = joblib.load("churn_model.joblib")

class UserFeatures(BaseModel):
    days_since_last_login: float
    usage_count_30d: float
    is_member: int
    complaint_count: float

@app.post("/predict")
def predict(features: UserFeatures):
    df = pd.DataFrame([features.model_dump()])
    probability = float(model.predict_proba(df)[0, 1])
    prediction = int(model.predict(df)[0])

    return {
        "prediction": prediction,
        "churn_probability": round(probability, 4)
    }
```

启动服务：

```bash
uvicorn app:app --reload
```

然后访问自动生成的接口文档：

```text
http://127.0.0.1:8000/docs
```

## 4. 部署后的监控清单

| 监控项 | 为什么重要 | 示例 |
|---|---|---|
| 服务延迟 | 影响用户体验 | P95 延迟是否低于目标 |
| 输入质量 | 避免字段缺失或异常 | 登录天数突然全为 0 |
| 预测分布 | 识别数据漂移 | 风险概率突然全部偏高 |
| 真实效果 | 验证模型是否仍有效 | 一个月后计算真实召回率 |
| 公平性与偏差 | 避免对特定群体不合理影响 | 不同群体误判率差异 |
| 人工复核结果 | 建立反馈数据 | 审核员推翻模型的原因 |

---

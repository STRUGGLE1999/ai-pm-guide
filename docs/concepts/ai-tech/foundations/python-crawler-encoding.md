# Python爬虫之网页字符编码处理

<figure class="article-figure">
  <img src="/concepts/ai-tech/crawler-handdrawn/03-crawler-encoding.png" alt="网页字符编码处理流程" loading="lazy">
  <figcaption>乱码排查要从原始字节、响应头、meta 声明到保存编码逐层确认，避免污染后续数据。</figcaption>
</figure>

中文乱码是爬虫初学者最常见的问题之一。你需要真正理解：网页传输时拿到的是**字节**，显示为中文、英文或其他字符，是后续按照某种规则“解码”的结果。

## 1. 先分清 bytes 与 str

Python 中最容易混淆的两个类型：

| 类型 | 含义 | 典型场景 |
|---|---|---|
| `bytes` | 原始字节数据 | 网络响应、图片、音频、文件内容 |
| `str` | Python 文本字符串 | 你看到的中文、英文、标题、正文 |

示例：

```python
text = "你好，Python 爬虫"
raw_bytes = text.encode("utf-8")

print(type(text))       # <class 'str'>
print(type(raw_bytes))  # <class 'bytes'>

restored_text = raw_bytes.decode("utf-8")
print(restored_text)
```

其中：

```text
str  --encode-->  bytes
bytes --decode--> str
```

如果用错规则，例如把 GBK 字节按 UTF-8 解码，就可能出现乱码或报错。

---

## 2. Requests 中的 `content`、`text` 与 `encoding`

```python
import requests

response = requests.get("https://example.com", timeout=10)

print(type(response.content))
print(type(response.text))
print(response.encoding)
print(response.apparent_encoding)
```

### 2.1 `response.content`

`response.content` 是原始字节，适合：

- 自己控制解码；
- 下载图片、PDF、Excel 等二进制文件；
- 调试乱码问题；
- 保存原始响应。

### 2.2 `response.text`

`response.text` 是 Requests 根据编码规则解码后得到的字符串，适合直接交给 Beautiful Soup 解析。

### 2.3 `response.encoding`

这是 Requests 当前准备使用的编码。它通常会参考 HTTP 响应头中的 `Content-Type`。

### 2.4 `response.apparent_encoding`

这是 Requests 基于内容推测出的编码。它可以帮助排查问题，但只是推测，不能在任何网站上都保证正确。

---

## 3. 乱码排查的标准流程

当你看到：

```text
æä»¬æ­£å¨å­¦ä¹ Python
```

或：

```text
������Python
```

不要立刻到处改编码。按下面顺序排查。

### 第一步：打印响应头和当前编码

```python
print(response.headers.get("Content-Type"))
print("response.encoding =", response.encoding)
print("apparent_encoding =", response.apparent_encoding)
```

你可能看到：

```text
text/html; charset=utf-8
response.encoding = utf-8
apparent_encoding = utf-8
```

若三者一致，通常可以直接使用 `response.text`。

### 第二步：查看网页 `<meta charset>`

网页 HTML 头部常见：

```html
<meta charset="UTF-8">
```

或：

```html
<meta http-equiv="Content-Type" content="text/html; charset=gbk">
```

可以在浏览器源代码中搜索：

```text
charset
```

### 第三步：明确后再指定编码

若你确认网页实际使用 UTF-8：

```python
response.encoding = "utf-8"
html = response.text
```

若你确认网页使用 GBK：

```python
response.encoding = "gb18030"
html = response.text
```

`gb18030` 对中文网页历史编码兼容性较好，但仍应以站点实际声明或实际内容为准。

### 第四步：从原始字节主动解码

```python
html = response.content.decode("utf-8", errors="replace")
```

`errors="replace"` 会把无法解码的字节替换为 `�`。它适合调试，不建议把大量替换字符的数据直接作为正式结果保存。

---

## 4. 一个可直接运行的编码诊断脚本

创建 `encoding_check.py`：

```python
import requests

url = "https://quotes.toscrape.com/"
response = requests.get(url, timeout=(5, 15))
response.raise_for_status()

print("=" * 60)
print("Content-Type:", response.headers.get("Content-Type"))
print("response.encoding:", response.encoding)
print("response.apparent_encoding:", response.apparent_encoding)
print("content 类型:", type(response.content))
print("text 类型:", type(response.text))
print("=" * 60)

print("按当前 response.text 解码后的前 200 个字符：")
print(response.text[:200])

print("=" * 60)
print("按 utf-8 从原始字节解码后的前 200 个字符：")
print(response.content.decode("utf-8", errors="replace")[:200])
```

运行：

```bash
python encoding_check.py
```

以后遇到乱码，先运行类似脚本再决定如何修正，而不是凭感觉修改编码。

---

## 5. 从 HTML 中识别 meta charset 的实战方法

有时 HTTP 响应头没写编码，或者写得不可靠。可以从 HTML 前几 KB 中查找 meta 标签。

```python
import re
import requests


def find_meta_charset(content: bytes):
    """从 HTML 头部字节中粗略查找 charset 声明。"""
    head = content[:4096].decode("ascii", errors="ignore")

    patterns = [
        r'<meta\s+charset=["\']?([\w-]+)',
        r'charset=["\']?([\w-]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, head, flags=re.IGNORECASE)
        if match:
            return match.group(1).lower()

    return None


url = "https://example.com"
response = requests.get(url, timeout=10)
response.raise_for_status()

meta_charset = find_meta_charset(response.content)
print("meta 声明编码：", meta_charset)

if meta_charset:
    html = response.content.decode(meta_charset, errors="replace")
else:
    html = response.text

print(html[:200])
```

这段代码的意义不是“自动解决所有编码问题”，而是帮助你建立正确排查顺序：**响应头 → meta 标签 → 原始字节 → 明确解码**。

---

## 6. 保存文件时的编码：为什么 Excel 打开 CSV 会乱码

网页显示正常，不代表 CSV 在表格软件里一定正常。数据保存也需要明确编码。

### 6.1 推荐：CSV 使用 `utf-8-sig`

```python
with open("data/result.csv", "w", encoding="utf-8-sig", newline="") as file:
    file.write("标题,内容\n")
    file.write("示例,中文可以正常显示\n")
```

`utf-8-sig` 会在 UTF-8 文件开头写入 BOM，很多桌面表格软件据此更容易正确识别中文。

### 6.2 JSON 使用 `utf-8` + `ensure_ascii=False`

```python
import json

result = {"title": "Python 爬虫", "summary": "处理中文编码"}

with open("data/result.json", "w", encoding="utf-8") as file:
    json.dump(result, file, ensure_ascii=False, indent=2)
```

如果不设置 `ensure_ascii=False`，中文可能会被保存成 `\u4e2d\u6587` 这样的转义形式，虽然程序仍能读取，但人工查看不够直观。

---

## 7. 编码问题常见现象与处理

| 现象 | 常见原因 | 建议处理 |
|---|---|---|
| 网页显示乱码，但浏览器正常 | Requests 使用的编码不对 | 查响应头和 meta，明确设置 `response.encoding` |
| `UnicodeDecodeError` | 解码规则与实际字节不匹配 | 从 `response.content` 开始，确认实际编码 |
| CSV 在编辑器正常、Excel 乱码 | 表格软件未按 UTF-8 识别 | 用 `utf-8-sig` 保存 |
| JSON 中中文变成 `\uXXXX` | `ensure_ascii=True` 默认行为 | 写入时设置 `ensure_ascii=False` |
| 只少量字符变成 `�` | 内容可能包含异常字节或混合编码 | 不要直接忽略；先定位来源和原始字节 |

---

## 8. 本章自检

- [ ] 我能解释 `bytes` 和 `str` 的区别；
- [ ] 我知道 `response.content` 与 `response.text` 的区别；
- [ ] 我会打印 `Content-Type`、`response.encoding`、`response.apparent_encoding`；
- [ ] 我知道编码问题应先确认再指定，而不是盲目替换；
- [ ] 我会用 `utf-8-sig` 保存 CSV；
- [ ] 我会用 `ensure_ascii=False` 保存 JSON。

---

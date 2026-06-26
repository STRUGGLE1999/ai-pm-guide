# Linux 常见基础知识

Linux 是服务器、容器、训练任务、数据处理脚本和模型部署环境里最常见的操作系统。学习 Linux 不是为了背命令，而是为了能看懂一个服务到底运行在哪里、读写哪些文件、用哪个账号启动、日志写到哪里、端口有没有打开、资源是不是已经耗尽。

<figure class="article-figure">
  <img src="/concepts/ai-tech/02-flowchart-llm-call-chain.png" alt="AI 服务运行链路">
  <figcaption>Linux 基础帮助你看懂 AI 服务从文件、配置、进程到接口的运行链路。</figcaption>
</figure>

## Linux 简介

Linux 可以理解成一套负责管理硬件和软件资源的系统。应用程序不会直接控制磁盘、内存、CPU、网络和显卡，而是通过操作系统提供的能力来读取文件、创建进程、监听端口、分配资源。

| 组成 | 作用 | 常见例子 |
| --- | --- | --- |
| 内核 | 管理 CPU、内存、磁盘、网络、进程。 | Linux kernel |
| Shell | 用户和系统交互的命令行入口。 | bash、zsh |
| 文件系统 | 组织文件、目录、权限和挂载点。 | `/home`、`/var`、`/etc` |
| 系统服务 | 后台长期运行的程序。 | sshd、nginx、docker |
| 包管理器 | 安装、升级、删除软件包。 | apt、yum、dnf |

## Linux 版本介绍

日常看到的 Ubuntu、Debian、Rocky Linux、AlmaLinux、RHEL 都是 Linux 发行版。发行版会把内核、基础命令、包管理器、安装工具和默认配置组合起来，形成一个可以直接使用的系统。

| 发行版 | 特点 | 常见场景 |
| --- | --- | --- |
| Ubuntu LTS | 文档多，生态活跃，上手快。 | 开发机、云服务器、AI 开源项目部署。 |
| Debian | 稳定、轻量、社区维护时间长。 | 服务器基础环境、容器镜像。 |
| RHEL | 企业支持、认证体系完整。 | 金融、政企、传统企业生产环境。 |
| Rocky Linux / AlmaLinux | RHEL 兼容生态，社区维护。 | 需要 RHEL 兼容但不购买商业订阅的场景。 |

CentOS Linux 7 已结束维护，CentOS Linux 8 也已停止维护。新环境不建议继续把 CentOS 当作默认选择，除非公司已有固定环境和维护方案。

## 安装包及包管理工具

Linux 上安装软件通常不去网页下载安装包，而是用包管理器从软件源安装。包管理器会处理依赖关系、版本、升级和卸载。

| 系统 | 包管理器 | 常用命令 | 说明 |
| --- | --- | --- | --- |
| Ubuntu / Debian | apt | `apt update`、`apt install` | 更新索引、安装软件。 |
| RHEL / Rocky / AlmaLinux | dnf / yum | `dnf install`、`yum install` | 企业服务器常见。 |
| Python 项目 | pip | `python -m pip install` | 安装 Python 依赖。 |
| Node 项目 | npm / pnpm | `npm install`、`pnpm install` | 安装前端依赖。 |

```bash
# Ubuntu / Debian 查看并安装常用工具
sudo apt update
sudo apt install git curl vim htop

# Python 项目安装依赖
python -m pip install -r requirements.txt
```

## 实验环境

学习 Linux 建议准备一个不会影响生产系统的环境。可以选本地虚拟机、云服务器、Docker 容器，或者 Windows 上的 WSL。

| 环境 | 优点 | 注意点 |
| --- | --- | --- |
| WSL | Windows 上启动快，适合练命令。 | 和真实服务器仍有差异。 |
| 云服务器 | 接近线上环境。 | 注意安全组、端口和费用。 |
| Docker 容器 | 干净、可重复、删除方便。 | 容器权限和宿主机权限可能不同。 |
| 虚拟机 | 独立完整。 | 占用本机资源更多。 |

```bash
# 用 Docker 快速启动一个 Ubuntu 实验环境
docker run -it --rm ubuntu:22.04 bash

# 容器内查看系统版本
cat /etc/os-release
```

## SSH 相关知识点

SSH 是远程登录服务器最常用的方式。你在本地输入命令，实际是在远程服务器上执行。

| 概念 | 说明 | 示例 |
| --- | --- | --- |
| 用户名 | 登录到服务器使用的账号。 | `root`、`ubuntu` |
| 主机地址 | 服务器 IP 或域名。 | `10.0.0.12` |
| 端口 | SSH 默认端口是 22。 | `-p 22` |
| 密钥 | 用私钥登录，比密码更适合长期使用。 | `~/.ssh/id_rsa` |

```bash
# 使用默认 22 端口登录
ssh ubuntu@10.0.0.12

# 指定端口和私钥登录
ssh -p 2222 -i ~/.ssh/project.pem ubuntu@10.0.0.12

# 把本地文件上传到服务器
scp ./config.yaml ubuntu@10.0.0.12:/home/ubuntu/app/config.yaml
```

如果 SSH 连不上，优先检查：服务器是否开机、IP 是否正确、端口是否开放、用户名是否正确、密钥权限是否过宽。

## 文件操作

Linux 里很多问题都先回到文件：文件在哪里、能不能读、能不能写、路径是否正确、目录是否存在。

### 文件与文件夹基本操作

| 命令 | 作用 | 常用示例 |
| --- | --- | --- |
| `pwd` | 显示当前目录。 | `pwd` |
| `cd` | 切换目录。 | `cd /var/log` |
| `ls` | 查看目录内容。 | `ls -lah` |
| `mkdir` | 创建目录。 | `mkdir -p data/raw` |
| `touch` | 创建空文件或更新时间。 | `touch app.log` |
| `cp` | 复制文件或目录。 | `cp -r source target` |
| `mv` | 移动或重命名。 | `mv old.txt new.txt` |
| `rm` | 删除文件或目录。 | `rm file.txt` |

```bash
# 查看当前目录和文件
pwd
ls -lah

# 创建多级目录
mkdir -p data/raw data/processed logs

# 复制目录并保留目录结构
cp -r data/raw backup/raw
```

`rm -rf` 会递归删除目录，生产环境里必须非常谨慎。删除前先用 `pwd` 和 `ls` 确认位置。

### 文件内容查看

| 命令 | 作用 | 适合场景 |
| --- | --- | --- |
| `cat` | 一次性输出文件内容。 | 小文件、配置文件。 |
| `less` | 分页查看大文件。 | 日志、长文本。 |
| `head` | 查看文件开头。 | 快速看 CSV 表头或日志开头。 |
| `tail` | 查看文件末尾。 | 最新日志。 |
| `tail -f` | 持续跟随文件变化。 | 实时排查服务日志。 |
| `grep` | 搜索文本。 | 查错误、查关键字。 |

```bash
# 查看配置
cat config.yaml

# 实时查看最新日志
tail -f logs/app.log

# 从日志里查错误
grep -n "ERROR" logs/app.log
```

### 软链接与硬链接

链接可以让一个路径指向另一个文件或目录。日常更常用的是软链接。

| 类型 | 命令 | 特点 |
| --- | --- | --- |
| 软链接 | `ln -s source link_name` | 类似快捷方式，源文件删除后链接会失效。 |
| 硬链接 | `ln source link_name` | 指向同一份文件内容，不能跨文件系统。 |

```bash
# 把当前模型版本链接成 latest
ln -s /models/chatglm-2026-06 /models/latest

# 查看链接指向
ls -lah /models/latest
```

软链接常用于模型版本切换、静态资源目录、配置目录映射。

## 文本编辑

服务器上改配置时经常需要编辑文本。最常见的是 `vim` 和 `nano`。

| 工具 | 特点 | 适合人群 |
| --- | --- | --- |
| `nano` | 简单直观，底部有快捷键提示。 | 初学者快速改配置。 |
| `vim` | 功能强，几乎所有服务器都有。 | 长期使用命令行的人。 |

```bash
# 用 nano 编辑配置
nano config.yaml

# 用 vim 编辑配置
vim config.yaml
```

Vim 常用操作：

| 操作 | 按键 |
| --- | --- |
| 进入编辑 | `i` |
| 退出编辑 | `Esc` |
| 保存并退出 | `:wq` |
| 不保存退出 | `:q!` |
| 搜索 | `/keyword` |

## 权限管理

权限问题是 Linux 上最常见的问题之一。一个文件能不能被读取、写入、执行，取决于用户、用户组和权限位。

```bash
ls -lah
```

输出里类似 `-rwxr-xr--` 的部分就是权限：

| 位置 | 含义 |
| --- | --- |
| 第 1 位 | 文件类型，`-` 是普通文件，`d` 是目录，`l` 是链接。 |
| 第 2-4 位 | 所有者权限。 |
| 第 5-7 位 | 所属组权限。 |
| 第 8-10 位 | 其他用户权限。 |

| 权限 | 含义 | 对文件 | 对目录 |
| --- | --- | --- | --- |
| `r` | read | 读取内容。 | 列出目录内容。 |
| `w` | write | 修改内容。 | 新建、删除、重命名目录内文件。 |
| `x` | execute | 执行脚本或程序。 | 进入目录。 |

```bash
# 给脚本增加执行权限
chmod +x run.sh

# 修改文件归属
sudo chown ubuntu:ubuntu app.log

# 查看当前用户
whoami
```

不要为了省事直接 `chmod 777`。它会让所有用户都能读写执行，容易留下安全风险。

## 其他常用命令

### 系统操作

| 命令 | 作用 | 示例 |
| --- | --- | --- |
| `uname -a` | 查看内核信息。 | `uname -a` |
| `cat /etc/os-release` | 查看发行版信息。 | `cat /etc/os-release` |
| `df -h` | 查看磁盘空间。 | `df -h` |
| `du -sh` | 查看目录占用。 | `du -sh ./logs` |
| `free -h` | 查看内存使用。 | `free -h` |
| `top` / `htop` | 查看系统负载和进程。 | `top` |

```bash
# 快速检查机器基本状态
cat /etc/os-release
df -h
free -h
top
```

### 进程与端口

| 命令 | 作用 | 示例 |
| --- | --- | --- |
| `ps aux` | 查看进程列表。 | `ps aux | grep python` |
| `kill` | 结束进程。 | `kill 12345` |
| `lsof -i` | 查看端口占用。 | `lsof -i :8000` |
| `curl` | 请求接口或网页。 | `curl http://127.0.0.1:8000/health` |

```bash
# 查看 Python 服务是否在运行
ps aux | grep python

# 查看 8000 端口是否被占用
lsof -i :8000

# 检查服务健康接口
curl http://127.0.0.1:8000/health
```

### 压缩和传输

| 命令 | 作用 | 示例 |
| --- | --- | --- |
| `tar` | 打包或解压目录。 | `tar -czf logs.tar.gz logs/` |
| `zip` / `unzip` | 压缩或解压 zip 文件。 | `unzip data.zip` |
| `scp` | 本地和服务器之间复制文件。 | `scp file.txt user@host:/tmp/` |
| `rsync` | 增量同步文件。 | `rsync -av data/ user@host:/data/` |

```bash
# 打包日志目录
tar -czf logs.tar.gz logs/

# 解压 tar.gz 文件
tar -xzf logs.tar.gz

# 增量同步目录
rsync -av ./data/ ubuntu@10.0.0.12:/home/ubuntu/data/
```

## AI 项目里最常见的排查场景

| 现象 | 可能原因 | 优先检查 |
| --- | --- | --- |
| 服务启动失败 | 依赖缺失、路径错误、权限不足、端口占用。 | `tail -f logs/app.log`、`lsof -i :端口`、`ls -lah` |
| 模型文件找不到 | 路径配置错、文件未同步、软链接失效。 | `pwd`、`ls -lah /models`、`ls -lah /models/latest` |
| 上传文件失败 | 目录不存在、无写权限、磁盘满。 | `mkdir -p uploads`、`df -h`、`ls -ld uploads` |
| 接口打不开 | 服务未启动、端口未监听、网络策略拦截。 | `ps aux`、`lsof -i :端口`、`curl` |
| 日志不更新 | 服务没跑、日志路径错、账号无写权限。 | `ps aux`、`tail -f`、`ls -lah logs` |
| 运行很慢 | CPU、内存、磁盘 IO 或 GPU 资源不足。 | `top`、`free -h`、`df -h` |

## 一个完整的排查示例

假设模型接口 `http://127.0.0.1:8000/health` 打不开，可以按下面顺序查：

```bash
# 1. 确认自己在哪台机器、哪个目录
pwd
whoami

# 2. 查看项目文件和日志目录是否存在
ls -lah
ls -lah logs

# 3. 看服务进程是否存在
ps aux | grep python

# 4. 看端口是否被监听或占用
lsof -i :8000

# 5. 查看最新错误日志
tail -n 100 logs/app.log

# 6. 直接请求健康检查接口
curl http://127.0.0.1:8000/health
```

这套顺序的目的不是“炫命令”，而是先判断问题属于文件、权限、进程、端口、日志还是接口返回。

## 运行文档模板

部署或交接 AI 服务时，可以把关键信息写成这样的运行文档：

```markdown
## 部署与运行环境

- 系统版本：
- Python / Node / CUDA 版本：
- 项目目录：
- 启动命令：
- 运行账号：
- 服务端口：
- 健康检查地址：
- 模型文件路径：
- 上传文件目录：
- 日志目录：
- 环境变量文件：
- 依赖安装方式：
- 回滚方式：
```

## 怎么判断学懂了

| 判断点 | 具体标准 |
| --- | --- |
| 能找文件 | 能说清楚模型、配置、日志、上传文件分别在哪。 |
| 能看权限 | 能判断文件是否可读、目录是否可写、脚本是否可执行。 |
| 能看服务 | 能查进程、端口、健康检查接口。 |
| 能看日志 | 能用日志定位错误发生的位置和原因。 |
| 能复现环境 | 能记录系统版本、依赖版本和启动命令。 |

<figure class="article-figure">
  <img src="/concepts/ai-tech/05-flowchart-ai-quality-loop.png" alt="AI 质量闭环">
  <figcaption>工程问题最终要回到可复现、可监控、可回流的质量闭环。</figcaption>
</figure>

# AI 智课 · 人工智能通识学习平台

覆盖小学 / 初中 / 高中全学段的 AI 通识课程平台，支持动画讲解、AI 对话助教、在线测验、学习进度追踪。PWA 渐进式 Web 应用，可安装到手机桌面、离线使用。

## ✨ 功能

- **三学段课程**：338 个知识点（小学 124 / 初中 84 / 高中 130），912 道题目
- **AI 对话助教**：接入通义千问大模型，按学段调整回答风格
- **在线测验**：单选 / 多选 / 判断 / 填空，自动判分 + 解析
- **学习进度**：登录后自动记录答题成绩，取历史最高分
- **语音合成**：Edge-TTS 朗读知识点内容
- **PWA**：可安装到手机桌面，离线缓存核心资源
- **动画引擎**：自研 700KB+ 动画库，知识点可视化讲解

## 🛠 技术栈

| 层 | 技术 | 说明 |
| --- | --- | --- |
| 后端 | Python + FastAPI | RESTful API，8 个路由模块 |
| 数据库 | SQLite | 用户、会话、进度、聊天记录 |
| 前端 | HTML / CSS / 原生 JS | 多页面架构，无框架依赖 |
| AI | 通义千问 (OpenAI 兼容协议) | LLM 对话 |
| 语音 | Edge-TTS | 文字转语音 |
| PWA | Service Worker + Manifest | 离线缓存 + 可安装 |

## 📁 项目结构

```
ai-tutor/
├── backend/                  # 后端
│   ├── main.py               # FastAPI 入口（中间件 + 路由注册）
│   ├── db.py                 # SQLite 数据层（建表 + CRUD）
│   ├── store.py              # 知识点数据加载
│   ├── deps.py               # 依赖注入（Token 鉴权）
│   ├── routers/              # 业务路由
│   │   ├── catalog.py        # 课程目录 + 知识点详情
│   │   ├── quiz.py           # 取题 + 判分
│   │   ├── chat.py           # AI 对话（通义千问）
│   │   ├── progress.py       # 学习进度
│   │   ├── auth.py           # 登录注册
│   │   ├── stats.py          # 统计数据
│   │   ├── animations.py     # 动画数据
│   │   └── tts.py            # 语音合成
│   └── data/
│       ├── kb.json           # 知识点数据源（338 个知识点 + 912 道题）
│       └── progress.json     # 运行时生成
├── frontend/                 # 前端页面
│   ├── index.html            # 登录注册
│   ├── home.html             # 首页（选学段）
│   ├── course.html           # 课程学习页
│   ├── quiz.html             # 答题测验页
│   ├── records.html          # 学习记录页
│   ├── review.html           # 复习页
│   ├── profile.html          # 个人中心
│   └── assets/
│       ├── app.css           # 全局样式
│       ├── app.js            # 全局脚本
│       ├── course-main.js    # 课程页核心逻辑
│       ├── home-main.js      # 首页逻辑
│       ├── animation-studio.js  # 动画引擎
│       ├── course-data.js     # 课程前端数据
│       └── coding-exercises.js  # 编程练习
├── icons/                    # PWA 图标（72px ~ 512px）
├── assets/
│   └── videos/               # 教学视频
├── scripts/
│   └── import_xlsx.py        # Excel 导入 kb.json 脚本
├── manifest.json             # PWA 配置
├── sw.js                     # Service Worker
└── 接口文档.md                # API 文档
```

## 🚀 快速开始

### 环境要求

- Python 3.10+
- pip

### 安装与运行

```bash
cd backend
pip install -r requirements.txt

# 可选：配置通义千问密钥（不配也能跑，AI 对话返回提示）
# Windows
set DASHSCOPE_API_KEY=你的密钥
# Mac/Linux
# export DASHSCOPE_API_KEY=你的密钥

uvicorn main:app --reload --port 8000
```

打开 http://127.0.0.1:8000 即可访问。

API 文档：http://127.0.0.1:8000/docs （FastAPI 自动生成）

## 📡 API 概览

| 方法 | 路径 | 说明 | 需登录 |
| --- | --- | --- | --- |
| GET | `/api/health` | 健康检查 | ❌ |
| GET | `/api/catalog?grade=小学` | 课程目录 | ❌ |
| GET | `/api/points/{id}` | 知识点详情 | ❌ |
| GET | `/api/points/{id}/quiz` | 取题（不含答案） | ❌ |
| POST | `/api/quiz/grade` | 提交答案 + 判分 | ✅ |
| POST | `/api/chat` | AI 对话 | ✅ |
| GET | `/api/progress` | 查看进度 | ✅ |
| POST | `/api/progress` | 更新进度 | ✅ |

详细接口说明见 [接口文档.md](接口文档.md)。

## 📊 数据源

知识点和题目存储在 `backend/data/kb.json` 中，结构：

```json
{
  "meta": { "total": 338, "grades": {"小学": 124, "初中": 84, "高中": 130} },
  "knowledge_points": [
    {
      "id": 1,
      "grade": "小学",
      "chapter": "第一单元 初识人工智能",
      "section": "认识人工智能",
      "title": "知识点1：人工智能的定义",
      "content": "讲解正文",
      "keywords": ["人工智能", "AI定义"],
      "video": "kp01.mp4",
      "quiz": [
        {"type": "choice", "stem": "题干", "options": ["A. ...", "B. ..."], "answer": "B", "explanation": "解析"}
      ]
    }
  ]
}
```

题目类型：`choice`（单选）/ `multi`（多选）/ `judge`（判断）/ `calc`（填空）。

## 🔒 安全特性

- 密码 salt + hash 存储，不明文保存
- Token 认证 + Session 过期机制
- API Key 从环境变量读取，不硬编码
- CORS 中间件配置
- 请求日志 + 错误日志
- 每日自动数据库备份

## 📱 PWA 支持

- 可安装到手机桌面（全尺寸图标 72px ~ 512px）
- Service Worker 离线缓存核心资源
- 静态资源缓存 1 小时，HTML 实时更新

## 📄 License

MIT

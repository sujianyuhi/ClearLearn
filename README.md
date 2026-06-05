# ClearLearn — 综合学习智能体

<p align="center">
  <img src="public/favicon.svg" alt="ClearLearn Logo" width="80" height="80">
</p>

<p align="center">
  <b>一站式智能学习平台 · AI 赋能 · 多学科聚合</b>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white" alt="Vite"></a>
  <a href="#"><img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS"></a>
  <a href="#"><img src="https://img.shields.io/badge/AI-DeepSeek-1E3A5F" alt="DeepSeek"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#docker-部署">Docker 部署</a> •
  <a href="#项目结构">项目结构</a>
</p>

---

## 简介

**ClearLearn** 是一款面向学生、考证人群与终身学习者的智能学习 Web 应用。它将语文、数学、英语、历史、化学等多学科资源聚合于一处，并为每个学习板块配备基于 **DeepSeek** 大模型的独立 AI 对话助手，实现「学练结合、即问即答」的沉浸式学习体验。

- 12+ 独立学习板块，覆盖多学科知识
- 每个板块配备独立 AI 助手，上下文感知当前学习内容
- 现代学术杂志风格 UI，深墨蓝 + 琥珀金配色，温暖专注
- 流式 AI 响应、打字机效果、对话历史持久化

---

## 功能特性

### 六大学习领域

| 领域 | 板块 | 功能描述 |
|:---|:---|:---|
| **语文学习** | 随机谚语 | 品味中华传统智慧，随机展示经典谚语 |
| | 成语字典 | 支持搜索任意成语，查看释义、出处与用法 |
| | 随机成语 | 探寻中华成语之美，每日随机推荐 |
| | 古诗文大全 | 收录经典诗词，赏析千年文学之美 |
| **数学学习** | 小学数学挑战 | 每日一题，锻炼逻辑思维 |
| **英语学习** | 每日英语 | 每日随机单词，展示音标、释义、例句与同义词 |
| | 单词详解 | 搜索任意英语单词，获取深度解析与常用短语 |
| **历史学习** | 历史上的今天 | 时间轴形式展示当天发生的重要历史事件 |
| | 三国人物志 | 煮酒论英雄，探寻三国风云人物 |
| **化学学习** | 元素周期表 | 探索化学元素的奥秘与特性 |
| | 方程式配平 | 智能配平化学方程式 |
| **实用工具** | 聚合翻译 | 支持 13 种语言互译 |
| | 驾考练习 | 科目一/四模拟题，支持作答、判定与解析 |

### AI 对话助手

每个学习板块右下角均配备独立的 AI 对话助手：

- **上下文感知** — AI 自动读取当前板块的学习内容，基于页面数据提供精准解答
- **DeepSeek 驱动** — 集成 DeepSeek 大模型，支持 SSE 流式响应与打字机效果输出
- **对话隔离** — 各板块对话历史独立存储于 `localStorage`，互不干扰
- **快捷提问** — 内置常用问题快捷入口，一键深入讲解
- **历史回顾** — 支持查看过往问答、清空对话记录

### 系统特性

- 左侧分类导航栏 + 右侧内容区，板块切换流畅自然
- 完全响应式布局，适配桌面端、平板与移动端
- 加载骨架屏、错误重试、语音朗读等细节体验
- 页面切换淡入淡出、卡片错开出现等精致动效

---

## 在线预览

```bash
npm run dev
# 浏览器访问 http://localhost:5173
```

---

## 技术栈

- **前端框架**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite 8](https://vitejs.dev/)
- **样式方案**: [TailwindCSS 4](https://tailwindcss.com/)
- **路由**: [React Router DOM](https://reactrouter.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **字体**: Noto Serif SC（标题）、系统无衬线字体（正文）
- **AI 后端**: [DeepSeek API](https://platform.deepseek.com/)（前端直连，流式 SSE）

---

## 快速开始

### 环境要求

- Node.js >= 20
- npm >= 9

### 1. 克隆仓库

```bash
git clone git@github.com:sujianyuhi/ClearLearn.git
cd ClearLearn
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例文件并填入你的 DeepSeek API 密钥：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
VITE_DEEPSEEK_API_KEY=sk-your-real-api-key
```

> 获取密钥：[DeepSeek 开放平台](https://platform.deepseek.com/)

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:5173`

### 5. 生产构建

```bash
npm run build
```

构建产物输出至 `dist/` 目录。

---

## Docker 部署

项目已内置 Dockerfile 与 docker-compose.yml，可一键容器化部署：

```bash
# 使用 docker-compose 启动（推荐）
docker-compose up -d --build

# 或手动构建运行
docker build -t clearlearn .
docker run -d -p 6777:80 --name clearlearn clearlearn
```

访问 `http://localhost:6777`

---

## 环境变量配置

| 变量名 | 必填 | 默认值 | 说明 |
|:---|:---:|:---|:---|
| `VITE_DEEPSEEK_API_KEY` | ✅ | — | DeepSeek API 密钥 |
| `VITE_DEEPSEEK_API_URL` | ❌ | `https://api.deepseek.com/chat/completions` | API 请求地址 |
| `VITE_DEEPSEEK_MODEL` | ❌ | `deepseek-chat` | 模型名称 |

> `.env` 文件已加入 `.gitignore`，不会提交到 GitHub。

---

## 项目结构

```
ClearLearn/
├── public/                       # 静态资源
├── src/
│   ├── assets/                   # 图片资源
│   ├── components/               # 公共组件
│   │   ├── Sidebar.tsx           # 左侧分类导航栏
│   │   ├── ChatPanel.tsx         # AI 对话面板
│   │   ├── MarkdownRenderer.tsx  # Markdown 消息渲染
│   │   └── LoadingCard.tsx       # 加载骨架屏
│   ├── context/                  # React Context 状态管理
│   │   ├── ChatProvider.tsx      # 对话状态 Provider
│   │   └── chatContext.ts        # 对话上下文
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useApi.ts             # API 请求封装
│   │   ├── useChat.ts            # AI 对话逻辑
│   │   └── useLocalStorage.ts    # 本地存储 Hook
│   ├── pages/                    # 学习板块页面
│   │   ├── DailyEnglish.tsx      # 每日英语
│   │   ├── WordDetail.tsx        # 单词详解
│   │   ├── DrivingTest.tsx       # 驾考练习
│   │   ├── TodayInHistory.tsx    # 历史上的今天
│   │   ├── SanguoHeroes.tsx      # 三国人物志
│   │   ├── Translator.tsx        # 聚合翻译
│   │   ├── Proverbs.tsx          # 随机谚语
│   │   ├── Idioms.tsx            # 随机成语
│   │   ├── IdiomDictionary.tsx   # 成语字典
│   │   ├── Poetry.tsx            # 古诗文大全
│   │   ├── MathQuiz.tsx          # 小学数学挑战
│   │   ├── ChemicalElement.tsx   # 元素周期表
│   │   └── EquationBalancer.tsx  # 方程式配平
│   ├── types/                    # TypeScript 类型定义
│   ├── utils/                    # 工具函数
│   ├── App.tsx                   # 根组件（路由配置）
│   ├── main.tsx                  # 应用入口
│   └── index.css                 # 全局样式
├── .trae/documents/              # PRD 与技术架构文档
├── .env                          # 环境变量（本地私有，不提交）
├── .env.example                  # 环境变量示例
├── Dockerfile                    # Docker 构建文件
├── docker-compose.yml            # Docker Compose 配置
├── nginx.conf                    # Nginx 配置
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## AI 对话工作原理

1. 用户打开任意板块，浏览当前学习内容
2. 点击右下角悬浮按钮，展开 AI 对话面板
3. 输入问题，系统自动组装当前板块的上下文数据作为 System Prompt
4. 发送至 DeepSeek API，流式返回 AI 回答
5. 对话记录按板块隔离保存在 `localStorage` 中，键名为 `clearlearn_chat_history`

---

## 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

---

<p align="center">
  Made with by <a href="https://github.com/sujianyuhi">sujianyuhi</a>
</p>

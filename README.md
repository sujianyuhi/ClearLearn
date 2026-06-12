<div align="center">

<img src="public/favicon.svg" alt="ClearLearn Logo" width="100" height="100">

# ClearLearn

**一站式智能学习平台 · AI 赋能 · 多学科聚合**

<p>
  <a href="#"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white" alt="Vite"></a>
  <a href="#"><img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS"></a>
  <a href="#"><img src="https://img.shields.io/badge/AI-DeepSeek-1E3A5F" alt="DeepSeek"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
</p>

<p>
  <a href="#-功能特性">功能特性</a> ·
  <a href="#-技术栈">技术栈</a> ·
  <a href="#-快速开始">快速开始</a> ·
  <a href="#-docker-部署">Docker 部署</a> ·
  <a href="#-项目结构">项目结构</a> ·
  <a href="#-faq">常见问题</a>
</p>

</div>

---

## 简介

**ClearLearn** 是一款面向学生、考证人群与终身学习者的现代化智能学习 Web 应用。我们将语文、数学、英语、历史、化学等多学科免费资源整合于一处，并为**每个学习板块配备独立的 AI 对话助手**（基于 DeepSeek 大模型），真正实现「学练结合、即问即答」的沉浸式学习体验。

> 无论是背单词、查成语、做数学题，还是探索化学元素、了解历史事件，ClearLearn 都能为你提供即时、精准、有深度的学习支持。

### 核心亮点

- **12+ 独立学习板块**，覆盖多学科核心知识场景
- **上下文感知 AI 助手**，自动读取当前页面内容，提供精准答疑
- **现代学术杂志风 UI**，深墨蓝 + 琥珀金 + 暖象牙白，温暖专注有质感
- **流式 AI 响应**，SSE 实时打字机效果，对话历史按板块隔离持久化
- **零后端依赖**，前端直连 API，Docker 一键部署，轻量可移植

---

## 功能特性

### 六大学习领域

| 领域 | 板块 | 功能描述 |
|:---|:---|:---|
| **语文学习** | 随机谚语 | 品味中华传统智慧，随机展示经典谚语及寓意 |
| | 成语字典 | 支持搜索任意成语，查看释义、出处与用法 |
| | 随机成语 | 探寻中华成语之美，每日随机推荐，含拼音与例句 |
| | 古诗文大全 | 收录经典诗词，赏析千年文学之美 |
| **数学学习** | 小学数学挑战 | 每日一题，锻炼逻辑思维，支持查看答案与解析 |
| **英语学习** | 每日英语 | 每日随机单词，展示英美音标、释义、例句、同义词与相关词汇，支持语音朗读 |
| | 单词详解 | 搜索任意英语单词，获取深度解析与常用短语 |
| **历史学习** | 历史上的今天 | 时间轴形式展示当天发生的重要历史事件 |
| | 三国人物志 | 煮酒论英雄，随机探寻三国风云人物的生平与故事 |
| **化学学习** | 元素周期表 | 按名称/符号/原子序数查询元素，展示物理化学性质、发现历史、用途与生物环境信息 |
| | 方程式配平 | 输入化学方程式，智能配平并展示系数 |
| **实用工具** | 聚合翻译 | 支持 13 种语言互译，满足多语言学习需求 |
| | 驾考练习 | 科目一/四模拟题库，支持选择、判定与答案解析 |

### AI 对话助手

每个学习板块右下角均配备独立的 AI 对话助手，这是 ClearLearn 的核心差异化能力：

- **上下文感知** —— AI 自动读取当前板块的 API 数据，将学习内容作为 System Prompt 的一部分，提供精准解答
- **DeepSeek 驱动** —— 集成 DeepSeek 大模型，支持 SSE 流式响应与打字机效果输出
- **对话隔离** —— 各板块对话历史独立存储于 `localStorage`，互不干扰
- **快捷提问** —— 根据当前内容自动生成 4 条推荐问题，一键深入讲解
- **功能完备** —— 支持复制消息、重试失败请求、停止生成、清空对话、查看历史记录

### 系统与交互

- **左侧分类导航栏** + 右侧内容区，板块切换流畅自然
- **完全响应式布局**，桌面端固定侧边栏、移动端汉堡菜单 + AI 面板全屏浮层
- **精致动效**：页面切换淡入淡出、卡片 `stagger-children` 错开出现、按钮悬停上浮、导航栏呼吸光晕
- **细节体验**：加载骨架屏、错误重试、语音朗读、天气小组件（高德地图 IP 定位）

---

## 技术栈

### 前端核心

| 技术 | 版本 | 说明 |
|:---|:---|:---|
| [React](https://react.dev/) | 19.2 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | 类型安全 |
| [Vite](https://vitejs.dev/) | 8.0 | 构建工具与开发服务器 |
| [TailwindCSS](https://tailwindcss.com/) | 4.3 | 原子化 CSS |
| [React Router DOM](https://reactrouter.com/) | 7.16 | 客户端路由 |
| [Lucide React](https://lucide.dev/) | 1.17 | 图标库 |

### 状态管理与数据流

- **React Context + `useSyncExternalStore`**：AI 对话状态的跨组件共享与实时流式内容同步
- **`useLocalStorage` Hook**：对话历史按板块隔离持久化
- **`useApi` Hook**：通用异步请求封装，支持 `loading`、`error`、`refetch` 状态

### AI 集成

- **前端直连 DeepSeek API**：`fetch` 发送 `POST` 请求至 `https://api.deepseek.com/chat/completions`
- **SSE 流式响应**：逐字打字机效果输出，读取 `response.body.getReader()` 实时解析
- **动态 System Prompt**：根据当前板块和页面数据自动生成角色化提示词（如「英语学习助手」、「三国历史专家」、「化学教育专家」）

### 数据来源

项目本身无后端数据库，数据全部来自第三方开放 API（主要为 `v2.xxapi.cn` 和 `cn.apihz.cn`），涵盖英语单词、驾考题库、历史事件、三国人物、谚语成语、古诗词、数学题目、化学元素与方程式、聚合翻译等。

### 部署与基础设施

- **Docker**：多阶段构建（`node:22-alpine` 构建 → `nginx:alpine` 托管静态产物）
- **Nginx**：生产环境静态资源托管与 SPA 路由回退
- **端口映射**：`6777:80`

---

## 快速开始

### 环境要求

- **Node.js** >= 20
- **npm** >= 9

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

复制示例文件并填入你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 必填：DeepSeek API 密钥
VITE_DEEPSEEK_API_KEY=sk-your-real-api-key

# 可选：DeepSeek API 地址（默认官方地址）
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/chat/completions

# 可选：模型名称（默认 deepseek-chat）
VITE_DEEPSEEK_MODEL=deepseek-chat

# 可选：高德地图 Web Key，用于侧边栏天气组件
VITE_AMAP_KEY=your-amap-key
```

> **获取 DeepSeek API 密钥**：[DeepSeek 开放平台](https://platform.deepseek.com/)  
> **获取高德地图 Key**：[高德开放平台](https://lbs.amap.com/)（不配置则天气组件优雅降级）

> `.env` 文件已加入 `.gitignore`，不会提交到版本控制。

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

### 可用脚本

```bash
npm run dev      # 启动开发服务器（端口 5173）
npm run build    # 类型检查 + 生产构建
npm run lint     # ESLint 代码检查
npm run preview  # 预览生产构建
```

---

## Docker 部署

项目已内置完整的 Docker 支持，可一键容器化部署：

### 使用 Docker Compose（推荐）

```bash
docker-compose up -d --build
```

访问 `http://localhost:6777`

### 手动构建运行

```bash
# 构建镜像
docker build -t clearlearn .

# 运行容器
docker run -d -p 6777:80 --name clearlearn clearlearn
```

### 带环境变量的部署

```bash
docker run -d -p 6777:80 \
  -e VITE_DEEPSEEK_API_KEY=sk-your-key \
  -e VITE_AMAP_KEY=your-amap-key \
  --name clearlearn clearlearn
```

---

## 环境变量配置

| 变量名 | 必填 | 默认值 | 说明 |
|:---|:---:|:---|:---|
| `VITE_DEEPSEEK_API_KEY` | ✅ | — | DeepSeek API 密钥，用于 AI 对话功能 |
| `VITE_DEEPSEEK_API_URL` | ❌ | `https://api.deepseek.com/chat/completions` | DeepSeek API 请求地址 |
| `VITE_DEEPSEEK_MODEL` | ❌ | `deepseek-chat` | 使用的模型名称 |
| `VITE_AMAP_KEY` | ❌ | — | 高德地图 Web Key，用于侧边栏天气查询 |

---

## 项目结构

```
ClearLearn/
├── public/                       # 静态资源（favicon、icons）
├── src/
│   ├── assets/                   # 图片资源
│   ├── components/               # 公共组件
│   │   ├── Sidebar.tsx           # 左侧分类导航栏
│   │   ├── ChatPanel.tsx         # AI 对话面板（悬浮/侧滑）
│   │   ├── MarkdownRenderer.tsx  # Markdown 消息渲染
│   │   ├── LoadingCard.tsx       # 加载骨架屏
│   │   ├── UI.tsx                # 页面级 UI 原子组件
│   │   └── WeatherWidget.tsx     # 天气小组件
│   ├── context/                  # React Context 状态管理
│   │   ├── ChatProvider.tsx      # 对话状态全局 Provider
│   │   └── chatContext.ts        # 对话上下文定义
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useApi.ts             # 通用 API 请求封装
│   │   ├── useChat.ts            # AI 对话逻辑 Hook
│   │   └── useLocalStorage.ts    # localStorage 持久化 Hook
│   ├── pages/                    # 学习板块页面（12+）
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
│   │   └── helpers.ts            # 内容解析、System Prompt 生成、快捷问题生成
│   ├── App.tsx                   # 根组件（路由配置）
│   ├── main.tsx                  # 应用入口
│   └── index.css                 # 全局样式（Tailwind + 自定义主题/动画）
├── .trae/documents/              # 项目文档（PRD、技术架构）
│   ├── PRD.md
│   └── Technical-Architecture.md
├── .env                          # 环境变量（本地私有，不提交）
├── .env.example                  # 环境变量示例
├── Dockerfile                    # Docker 构建文件（多阶段构建）
├── docker-compose.yml            # Docker Compose 配置
├── nginx.conf                    # Nginx 配置（SPA 路由回退）
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── postcss.config.js
```

---

## AI 对话工作原理

1. **浏览内容**：用户打开任意学习板块，浏览当前页面展示的学习内容
2. **唤起助手**：点击右下角悬浮 AI 按钮，展开侧滑对话面板
3. **组装上下文**：系统根据当前板块类型和页面数据，自动生成角色化的 System Prompt（如「你是一位专业的化学教育专家，当前页面展示的元素是...」）
4. **流式对话**：用户输入问题，前端通过 `fetch` 发送请求至 DeepSeek API，读取 SSE 流并实时渲染打字机效果
5. **持久化存储**：对话记录按板块隔离保存在 `localStorage` 中，键名为 `clearlearn_chat_history_v2`，下次打开自动恢复

---

## 开发指南

### 代码规范

项目使用 ESLint 进行代码检查，配置位于 `eslint.config.js`：

```bash
npm run lint
```

### 添加新的学习板块

1. 在 `src/pages/` 下创建新的页面组件（如 `NewSubject.tsx`）
2. 在 `src/App.tsx` 中添加对应的路由配置
3. 在 `src/components/Sidebar.tsx` 中添加导航入口
4. 在 `src/utils/helpers.ts` 中为该板块添加 System Prompt 和快捷问题生成逻辑
5. （可选）在 `src/types/index.ts` 中补充相关类型定义

### 自定义主题

项目使用 TailwindCSS 4，主题色和自定义动画定义在 `src/index.css` 中：

- **主色**：深墨蓝 `#1e3a5f`
- **强调色**：琥珀金 `#d4a574`
- **背景色**：暖象牙白 `#faf8f5`

---

## FAQ

**Q: 为什么 AI 对话没有响应？**

A: 请检查 `.env` 文件中是否正确配置了 `VITE_DEEPSEEK_API_KEY`。未配置时应用会显示友好提示，引导你设置密钥。

**Q: 天气组件显示空白？**

A: 天气组件需要配置 `VITE_AMAP_KEY`。未配置时会优雅降级，不影响其他功能。

**Q: 支持哪些浏览器？**

A: 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。IE 不支持。

**Q: 数据存储在哪里？**

A: 学习数据来自第三方开放 API，实时获取；对话历史存储在浏览器 `localStorage` 中，不会上传至任何服务器。

**Q: 如何清空所有对话历史？**

A: 在每个板块的 AI 对话面板中，点击「清空对话」按钮即可清除该板块的历史记录。

---

## 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

---

<div align="center">

Made with by [sujianyuhi](https://github.com/sujianyuhi)

如果这个项目对你有帮助，欢迎 ⭐ Star 支持！

</div>

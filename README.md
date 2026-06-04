# ClearLearn — 综合学习智能体

一款集成多领域学习资源与 AI 智能答疑的 Web 应用，聚合英语词汇、驾考理论、历史知识四大板块，每个板块配备独立的 DeepSeek AI 对话助手，为用户提供一站式智能学习体验。

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?logo=tailwindcss)
![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-1E3A5F)

---

## 目录

- [功能特性](#功能特性)
- [在线预览](#在线预览)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [环境变量配置](#环境变量配置)
- [项目结构](#项目结构)
- [API 接口](#api-接口)
- [AI 对话功能](#ai-对话功能)
- [开发计划](#开发计划)
- [许可证](#许可证)

---

## 功能特性

### 四大学习板块

| 板块 | 功能描述 | 数据来源 |
|---|---|---|
| **每日英语** | 每日随机英语单词，展示音标、释义、例句、相关词汇与同义词 | xxapi.cn 随机单词接口 |
| **单词详解** | 支持搜索任意英语单词，获取详细释义、常用短语、例句、同义词与相关词汇 | xxapi.cn 单词查询接口 |
| **驾考练习** | 科目一/四随机题目，支持选项作答、答案判定与题目解析 | xxapi.cn 驾考题库接口 |
| **历史上的今天** | 以时间轴形式展示当天发生的重要历史事件 | xxapi.cn 历史事件接口 |

### AI 对话助手（每个板块独立）

- **上下文感知**：AI 自动理解当前板块展示的内容，基于页面数据提供精准解答
- **DeepSeek 驱动**：集成 DeepSeek 大模型，支持流式响应，打字机效果输出
- **对话历史**：按板块隔离存储，支持查看历史问答、清空对话
- **快速提问**：内置常用问题快捷入口，一键深入讲解

### 系统特性

- 现代学术杂志风格 UI，深墨蓝 + 琥珀金配色
- 左侧导航栏 + 右侧内容区，板块切换流畅
- 完全响应式布局，适配桌面端与移动端
- 加载骨架屏、错误重试、语音朗读等细节体验

---

## 在线预览

```bash
npm run dev
# 打开 http://localhost:5173
```

---

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：TailwindCSS 3
- **路由**：React Router DOM 6
- **图标**：Lucide React
- **字体**：Noto Serif SC（标题）、LXGW WenKai（正文）
- **AI 后端**：DeepSeek API（前端直连，流式 SSE）

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制示例文件并填入真实密钥：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
VITE_DEEPSEEK_API_KEY=sk-your-real-api-key
```

> 获取密钥：[DeepSeek 开放平台](https://platform.deepseek.com/)

### 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

构建产物输出至 `dist/` 目录。

---

## 环境变量配置

| 变量名 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `VITE_DEEPSEEK_API_KEY` | 是 | — | DeepSeek API 密钥 |
| `VITE_DEEPSEEK_API_URL` | 否 | `https://api.deepseek.com/chat/completions` | API 请求地址 |
| `VITE_DEEPSEEK_MODEL` | 否 | `deepseek-chat` | 模型名称 |

> `.env` 文件已加入 `.gitignore`，不会提交到 GitHub。

---

## 项目结构

```
ClearLearn/
├── .trae/documents/          # PRD 与技术架构文档
├── public/                   # 静态资源
├── src/
│   ├── components/           # 公共组件
│   │   ├── Sidebar.tsx       # 左侧导航栏
│   │   ├── ChatPanel.tsx     # AI 对话面板
│   │   └── LoadingCard.tsx   # 加载骨架屏
│   ├── pages/                # 功能板块页面
│   │   ├── DailyEnglish.tsx  # 每日英语
│   │   ├── WordDetail.tsx    # 单词详解
│   │   ├── DrivingTest.tsx   # 驾考练习
│   │   └── TodayInHistory.tsx # 历史上的今天
│   ├── context/
│   │   └── ChatContext.tsx   # AI 对话状态管理
│   ├── hooks/
│   │   ├── useApi.ts         # API 请求封装
│   │   └── useLocalStorage.ts # 本地存储 Hook
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── utils/
│   │   └── helpers.ts        # 工具函数
│   ├── App.tsx               # 根组件（路由配置）
│   └── main.tsx              # 应用入口
├── .env                      # 环境变量（本地私有）
├── .env.example              # 环境变量示例
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## API 接口

### 学习数据接口（前端直接调用）

| 接口 | 用途 | 响应格式 |
|---|---|---|
| `GET https://v2.xxapi.cn/api/randomenglishwords` | 随机英语单词 | 单词详情对象 |
| `GET https://v2.xxapi.cn/api/englishwords?word={word}` | 单词详解 | 单词详情对象 |
| `GET https://v2.xxapi.cn/api/jiakao?subject=1` | 驾考题目 | 题目对象 |
| `GET https://v2.xxapi.cn/api/history` | 历史事件 | 字符串数组 |

### AI 对话接口（前端直连 DeepSeek）

| 接口 | 方法 | 说明 |
|---|---|---|
| `POST /chat/completions` | SSE 流式 | DeepSeek Chat API，支持上下文对话 |

---

## AI 对话功能

### 工作原理

1. 用户打开任意板块，浏览当前学习内容
2. 点击右下角悬浮按钮，展开 AI 对话面板
3. 输入问题，系统自动组装当前板块的上下文数据作为 System Prompt
4. 发送至 DeepSeek API，流式返回 AI 回答
5. 对话记录按板块隔离保存在 `localStorage` 中

### 各板块 System Prompt 示例

- **每日英语**：「你是一个英语学习助手。当前展示的单词信息如下：... 请基于这个单词为用户提供详细讲解...」
- **单词详解**：「你是一个英语学习助手。当前用户查询的单词信息如下：... 请基于这个单词为用户提供深度解析...」
- **驾考练习**：「你是一个驾考理论教练。当前驾考题目信息如下：... 请为用户解释这道题的考点、交规原理...」
- **历史上的今天**：「你是一个历史学者。今天历史上的重要事件如下：... 请为用户深入解读这些历史事件的背景...」

---

## 开发计划

- [x] 四大学习板块基础功能
- [x] 独立 AI 对话助手（DeepSeek 集成）
- [x] 对话历史记录与流式响应
- [x] 响应式布局与移动端适配
- [ ] 后端代理服务（解决 API 跨域与密钥安全）
- [ ] 用户登录与云端同步对话历史
- [ ] 学习进度统计与打卡功能
- [ ] 深色模式支持

---

## 许可证

MIT License

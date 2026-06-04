import type { ParsedContent, DailyWordData, WordDetailData, DrivingQuestionData, HistoryEventData } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${formatTime(timestamp)}`;
}

// ==================== 智能内容解析器 ====================

export function parseContent(section: string, data: unknown): ParsedContent {
  switch (section) {
    case 'daily-english':
      return parseDailyEnglish(data as DailyWordData | null);
    case 'word-detail':
      return parseWordDetail(data as WordDetailData | null);
    case 'driving-test':
      return parseDrivingTest(data as DrivingQuestionData | null);
    case 'today-history':
      return parseTodayHistory(data as HistoryEventData[] | null);
    default:
      return parseGeneric(data);
  }
}

function parseDailyEnglish(data: DailyWordData | null): ParsedContent {
  if (!data || !data.word) {
    return { title: '每日英语', summary: '暂无单词数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints: string[] = [];
  if (data.usphone) keyPoints.push(`美式发音: /${data.usphone}/`);
  if (data.ukphone) keyPoints.push(`英式发音: /${data.ukphone}/`);
  if (data.translations && data.translations.length > 0) {
    keyPoints.push(`释义: ${data.translations.map(t => `[${t.pos}] ${t.tran_cn}`).join('; ')}`);
  }
  if (data.phrases && data.phrases.length > 0) {
    keyPoints.push(`常用短语: ${data.phrases.slice(0, 3).map(p => p.p_content).join(', ')}`);
  }
  if (data.synonyms && data.synonyms.length > 0) {
    keyPoints.push(`同义词: ${data.synonyms.flatMap(s => s.Hwds.map(h => h.word)).slice(0, 5).join(', ')}`);
  }

  return {
    title: `单词: ${data.word}`,
    summary: `当前学习的单词是 "${data.word}"，${data.translations?.[0]?.tran_cn || '暂无释义'}`,
    keyPoints,
    details: {
      word: data.word,
      translations: data.translations || [],
      phrases: data.phrases || [],
      sentences: data.sentences || [],
      synonyms: data.synonyms || [],
      relWords: data.relWords || [],
    },
    rawData: data,
  };
}

function parseWordDetail(data: WordDetailData | null): ParsedContent {
  if (!data || !data.word) {
    return { title: '单词详解', summary: '暂无单词数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints: string[] = [];
  if (data.usphone) keyPoints.push(`美式发音: /${data.usphone}/`);
  if (data.ukphone) keyPoints.push(`英式发音: /${data.ukphone}/`);
  if (data.translations && data.translations.length > 0) {
    keyPoints.push(`释义: ${data.translations.map(t => `[${t.pos}] ${t.tran_cn}`).join('; ')}`);
  }
  if (data.phrases && data.phrases.length > 0) {
    keyPoints.push(`常用短语: ${data.phrases.slice(0, 3).map(p => p.p_content).join(', ')}`);
  }
  if (data.sentences && data.sentences.length > 0) {
    keyPoints.push(`例句: ${data.sentences[0].s_content}`);
  }

  return {
    title: `单词详解: ${data.word}`,
    summary: `查询的单词是 "${data.word}"，${data.translations?.[0]?.tran_cn || '暂无释义'}`,
    keyPoints,
    details: {
      word: data.word,
      translations: data.translations || [],
      phrases: data.phrases || [],
      sentences: data.sentences || [],
      synonyms: data.synonyms || [],
      relWords: data.relWords || [],
    },
    rawData: data,
  };
}

function parseDrivingTest(data: DrivingQuestionData | null): ParsedContent {
  if (!data || !data.question) {
    return { title: '驾考练习', summary: '暂无题目数据', keyPoints: [], details: {}, rawData: data };
  }

  const options: string[] = [];
  if (data.option1) options.push(`A. ${data.option1}`);
  if (data.option2) options.push(`B. ${data.option2}`);
  if (data.option3) options.push(`C. ${data.option3}`);
  if (data.option4) options.push(`D. ${data.option4}`);

  const keyPoints = [
    `题目类型: ${data.type || '科目一'}`,
    `正确答案: ${data.answer}`,
    ...options,
  ];
  if (data.explain) keyPoints.push(`解析: ${data.explain}`);
  if (data.chapter) keyPoints.push(`章节: ${data.chapter}`);

  return {
    title: `驾考题: ${data.question.substring(0, 30)}...`,
    summary: `当前题目: ${data.question}`,
    keyPoints,
    details: {
      question: data.question,
      options,
      answer: data.answer,
      explain: data.explain,
      chapter: data.chapter,
      type: data.type,
    },
    rawData: data,
  };
}

function parseTodayHistory(data: HistoryEventData[] | null): ParsedContent {
  if (!data || data.length === 0) {
    return { title: '历史上的今天', summary: '暂无历史事件数据', keyPoints: [], details: {}, rawData: data };
  }

  const events = data.map((eventStr) => {
    const match = eventStr.match(/^(\d{4}年\d{2}月\d{2}日)\s+(.+)$/);
    if (match) {
      return { date: match[1], title: match[2] };
    }
    return { date: '', title: eventStr };
  });

  const keyPoints = events.slice(0, 5).map(e => `${e.date}: ${e.title}`);

  return {
    title: '历史上的今天',
    summary: `今天共有 ${data.length} 个历史事件，最早可追溯到${events[events.length - 1]?.date || '未知日期'}`,
    keyPoints,
    details: { events },
    rawData: data,
  };
}

function parseGeneric(data: unknown): ParsedContent {
  const dataStr = data ? JSON.stringify(data).substring(0, 200) : '暂无数据';
  return {
    title: '学习内容',
    summary: dataStr,
    keyPoints: [],
    details: { raw: data },
    rawData: data,
  };
}

// ==================== System Prompt 生成 ====================

export function getSystemPrompt(section: string, currentData: unknown): string {
  const parsed = parseContent(section, currentData);

  const basePrompt = `你是一位专业的学习助手，名为 "ClearLearn AI"。你的回答应当：
- 内容准确、条理清晰、深入浅出
- 优先基于当前页面提供的学习内容进行讲解
- 使用 Markdown 格式输出，适当使用标题、列表、加粗等排版
- 语言风格亲切自然，像一位耐心的老师
- 如内容涉及英文，请同时给出中文解释`;

  const contextPrompt = `\n\n【当前学习内容】\n标题: ${parsed.title}\n概要: ${parsed.summary}`;

  const keyPointsPrompt = parsed.keyPoints.length > 0
    ? `\n\n关键信息:\n${parsed.keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join('\n')}`
    : '';

  const sectionSpecificPrompts: Record<string, string> = {
    'daily-english': `\n\n【角色定位】你是英语学习助手。请基于当前单词提供：
1. 词源与构词法分析
2. 同义词/反义词辨析
3. 常见搭配与用法
4. 记忆技巧
5. 如果用户提问其他英语学习相关问题，也请耐心解答。`,

    'word-detail': `\n\n【角色定位】你是英语词汇专家。请基于当前查询的单词提供：
1. 深度词源解析
2. 用法辨析与常见错误
3. 词汇拓展（派生词、同根词等）
4. 实用例句创作
5. 如果用户希望了解更多，请主动引导深入探讨。`,

    'driving-test': `\n\n【角色定位】你是驾考理论教练。请基于当前题目提供：
1. 考点分析与交规原理
2. 易错点提醒
3. 相关交通规则知识拓展
4. 记忆口诀或技巧
5. 如果用户答错，请分析错误原因并帮助理解。`,

    'today-history': `\n\n【角色定位】你是历史学者。请基于今天的历史事件提供：
1. 事件背景与起因
2. 历史影响与意义
3. 相关历史人物介绍
4. 历史脉络与前后关联
5. 适当引用史料或名言增加趣味性。`,
  };

  return basePrompt + contextPrompt + keyPointsPrompt + (sectionSpecificPrompts[section] || '');
}

// ==================== 动态快捷问题生成 ====================

export function getQuickQuestions(section: string, data: unknown): string[] {
  const parsed = parseContent(section, data);
  const defaults = ['详细讲解一下这个内容', '有什么相关的拓展知识？'];

  switch (section) {
    case 'daily-english':
    case 'word-detail': {
      const word = (parsed.details.word as string) || '这个单词';
      return [
        `"${word}" 的词源是什么？`,
        `如何记忆 "${word}" ？`,
        `"${word}" 有哪些常见搭配？`,
        `请用 "${word}" 造几个句子`,
      ];
    }
    case 'driving-test': {
      return [
        `这道题的考点是什么？`,
        `为什么正确答案是 ${(parsed.details.answer as string) || '这个选项'}？`,
        `这类题目有什么解题技巧？`,
        `相关的交通规则有哪些？`,
      ];
    }
    case 'today-history': {
      const events = (parsed.details.events as Array<{ date: string; title: string }>) || [];
      const firstEvent = events[0];
      if (firstEvent) {
        return [
          `${firstEvent.date} 发生了什么重要事件？`,
          `这些历史事件对今天有什么影响？`,
          `还有哪些相关的历史人物？`,
          `这个时期的世界格局是怎样的？`,
        ];
      }
      return defaults;
    }
    default:
      return defaults;
  }
}

// ==================== 实用工具 ====================

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn(...args);
    }
  };
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

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

export function getSystemPrompt(section: string, currentData: unknown): string {
  const dataStr = currentData ? JSON.stringify(currentData, null, 2) : '暂无数据';
  
  const prompts: Record<string, string> = {
    'daily-english': `你是一个英语学习助手。当前展示的单词信息如下：\n${dataStr}\n\n请基于这个单词为用户提供详细讲解，包括词源、同义词、反义词、常见搭配、记忆技巧等。如果用户问其他问题，也请基于英语学习角度回答。`,
    'word-detail': `你是一个英语学习助手。当前用户查询的单词信息如下：\n${dataStr}\n\n请基于这个单词为用户提供深度解析，包括词源、用法辨析、常见错误、词汇拓展等。`,
    'driving-test': `你是一个驾考理论教练。当前驾考题目信息如下：\n${dataStr}\n\n请为用户解释这道题的考点、交规原理、易错点分析，并提供相关的交通规则知识拓展。`,
    'today-history': `你是一个历史学者。今天历史上的重要事件如下：\n${dataStr}\n\n请为用户深入解读这些历史事件的背景、影响、相关人物，并提供历史脉络分析。`
  };

  return prompts[section] || '你是一个智能学习助手，请帮助用户解答学习中的问题。';
}

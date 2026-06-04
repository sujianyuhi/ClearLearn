import type { ParsedContent, DailyWordData, WordDetailData, DrivingQuestionData, HistoryEventData, SanguoPersonData, TranslatorData, ProverbData, MathQuestionData, EquationData, ElementData, PoetryItem, IdiomData } from '../types';

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
    case 'sanguo-heroes':
      return parseSanguoHeroes(data as SanguoPersonData | null);
    case 'translator':
      return parseTranslator(data as TranslatorData | null);
    case 'proverbs':
      return parseProverbs(data as ProverbData | null);
    case 'idioms':
      return parseIdioms(data as IdiomData | null);
    case 'math-quiz':
      return parseMathQuiz(data as MathQuestionData | null);
    case 'equation-balancer':
      return parseEquationBalancer(data as EquationData | null);
    case 'chemical-element':
      return parseChemicalElement(data as ElementData | null);
    case 'poetry':
      return parsePoetry(data as PoetryItem | null);
    case 'idiom':
      return parseIdiom(data as IdiomData | null);
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
  if (!data) {
    return { title: '驾考练习', summary: '暂无数据', keyPoints: [], details: {}, rawData: data };
  }

  const options: string[] = [];
  if (data.option1) options.push(`A. ${data.option1}`);
  if (data.option2) options.push(`B. ${data.option2}`);
  if (data.option3) options.push(`C. ${data.option3}`);
  if (data.option4) options.push(`D. ${data.option4}`);

  const isQuestion = options.length > 0 && !!data.answer;

  if (isQuestion) {
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
        mode: 'question',
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

  const content = data.question || data.explain || '暂无内容';
  const keyPoints = [`类型: 知识点`, `内容: ${content}`];
  if (data.chapter) keyPoints.push(`章节: ${data.chapter}`);

  return {
    title: '驾考知识点',
    summary: `当前内容: ${content}`,
    keyPoints,
    details: {
      mode: 'knowledge',
      content,
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

function parseSanguoHeroes(data: SanguoPersonData | null): ParsedContent {
  if (!data || !data.name) {
    return { title: '三国人物志', summary: '暂无人物数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints = [
    `姓名: ${data.name}`,
    data.zi || '',
    data.guo || '',
    data.sex || '',
    data.real || '',
    data.age || '',
  ].filter(Boolean);

  return {
    title: `三国人物: ${data.name}`,
    summary: `当前人物是 "${data.name}"，${data.guo || ''}。${data.content ? data.content.substring(0, 100) + '...' : ''}`,
    keyPoints,
    details: {
      name: data.name,
      zi: data.zi,
      guo: data.guo,
      sex: data.sex,
      real: data.real,
      age: data.age,
      content: data.content,
    },
    rawData: data,
  };
}

function parseTranslator(data: TranslatorData | null): ParsedContent {
  if (!data || !data.sourceText) {
    return { title: '聚合翻译', summary: '暂无翻译数据', keyPoints: [], details: {}, rawData: data };
  }

  const langMap: Record<number, string> = {
    1: '中文', 2: '英文', 3: '繁体中文', 4: '日语', 5: '韩语',
    6: '法语', 7: '西班牙语', 8: '泰语', 9: '阿拉伯语', 10: '俄语',
    11: '葡萄牙语', 12: '德语', 13: '意大利语',
  };

  const targetLang = langMap[data.targetLang] || '未知语言';

  return {
    title: `翻译: ${data.sourceText}`,
    summary: `将 "${data.sourceText}" 翻译为 ${targetLang}，结果为: ${data.translatedText}`,
    keyPoints: [
      `原文: ${data.sourceText}`,
      `译文: ${data.translatedText}`,
      `目标语言: ${targetLang}`,
    ],
    details: {
      sourceText: data.sourceText,
      translatedText: data.translatedText,
      targetLang,
      targetLangCode: data.targetLang,
    },
    rawData: data,
  };
}

function parseProverbs(data: ProverbData | null): ParsedContent {
  if (!data || !data.saying) {
    return { title: '随机谚语', summary: '暂无谚语数据', keyPoints: [], details: {}, rawData: data };
  }

  return {
    title: `谚语: ${data.saying}`,
    summary: `当前谚语: "${data.saying}"，寓意: ${data.content}`,
    keyPoints: [
      `谚语: ${data.saying}`,
      `寓意: ${data.content}`,
    ],
    details: {
      saying: data.saying,
      content: data.content,
    },
    rawData: data,
  };
}

function parseIdioms(data: IdiomData | null): ParsedContent {
  if (!data || !data.words) {
    return { title: '随机成语', summary: '暂无成语数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints: string[] = [];
  keyPoints.push(`成语: ${data.words}`);
  if (data.pinyin) keyPoints.push(`拼音: ${data.pinyin}`);
  if (data.jieshi) keyPoints.push(`释义: ${data.jieshi}`);
  if (data.chuchu) keyPoints.push(`出处: ${data.chuchu}`);
  if (data.tongyi) keyPoints.push(`同义词: ${data.tongyi}`);
  if (data.fanyi) keyPoints.push(`反义词: ${data.fanyi}`);
  if (data.yufa) keyPoints.push(`语法: ${data.yufa}`);
  if (data.en) keyPoints.push(`英文翻译: ${data.en}`);

  return {
    title: `成语: ${data.words}`,
    summary: `当前成语: "${data.words}"，拼音: ${data.pinyin || '暂无'}，释义: ${data.jieshi || '暂无'}`,
    keyPoints,
    details: {
      words: data.words,
      pinyin: data.pinyin,
      jieshi: data.jieshi,
      chuchu: data.chuchu,
      tongyi: data.tongyi,
      fanyi: data.fanyi,
      liju: data.liju,
      yinzheng: data.yinzheng,
      yufa: data.yufa,
      en: data.en,
      bushou: data.bushou,
      shouzi: data.shouzi,
    },
    rawData: data,
  };
}

function parseIdiom(data: IdiomData | null): ParsedContent {
  if (!data || !data.words) {
    return { title: '成语字典', summary: '暂无成语数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints: string[] = [
    `成语: ${data.words}`,
    `拼音: ${data.pinyin || '暂无'}`,
    `部首: ${data.bushou || '暂无'}`,
    `首字: ${data.shouzi || '暂无'}`,
  ];
  if (data.jieshi) keyPoints.push(`释义: ${data.jieshi.trim()}`);
  if (data.chuchu) keyPoints.push(`出处: ${data.chuchu.trim()}`);
  if (data.tongyi) keyPoints.push(`同义词: ${data.tongyi}`);
  if (data.fanyi) keyPoints.push(`反义词: ${data.fanyi}`);
  if (data.yufa) keyPoints.push(`语法: ${data.yufa.trim()}`);
  if (data.en) keyPoints.push(`英文释义: ${data.en}`);

  return {
    title: `成语: ${data.words}`,
    summary: `当前查询的成语是 "${data.words}"（${data.pinyin || ''}），${data.jieshi ? data.jieshi.trim().substring(0, 80) + '...' : '暂无释义'}`,
    keyPoints,
    details: {
      words: data.words,
      pinyin: data.pinyin,
      bushou: data.bushou,
      shouzi: data.shouzi,
      jieshi: data.jieshi,
      chuchu: data.chuchu,
      tongyi: data.tongyi,
      fanyi: data.fanyi,
      yufa: data.yufa,
      yinzheng: data.yinzheng,
      liju: data.liju,
      en: data.en,
    },
    rawData: data,
  };
}

function parseMathQuiz(data: MathQuestionData | null): ParsedContent {
  if (!data || !data.timu) {
    return { title: '小学数学挑战', summary: '暂无题目数据', keyPoints: [], details: {}, rawData: data };
  }

  return {
    title: `数学题: ${data.timu.substring(0, 30)}...`,
    summary: `当前题目: ${data.timu}`,
    keyPoints: [
      `题目: ${data.timu}`,
      `答案: ${data.daan}`,
      `解析: ${data.jiexi}`,
    ],
    details: {
      timu: data.timu,
      daan: data.daan,
      jiexi: data.jiexi,
    },
    rawData: data,
  };
}

function parseEquationBalancer(data: EquationData | null): ParsedContent {
  if (!data || !data.fcs) {
    return { title: '化学方程式配平', summary: '暂无配平数据', keyPoints: [], details: {}, rawData: data };
  }

  const reactantsStr = data.reactants.map(r => `${r.coefficient}${r.formula}`).join(' + ');
  const productsStr = data.products.map(p => `${p.coefficient}${p.formula}`).join(' + ');

  const keyPoints = [
    `配平方程式: ${data.fcs}`,
    `反应物: ${reactantsStr}`,
    `生成物: ${productsStr}`,
    ...data.reactants.map(r => `${r.formula} 的系数为 ${r.coefficient}`),
    ...data.products.map(p => `${p.formula} 的系数为 ${p.coefficient}`),
  ];

  return {
    title: `化学方程式配平: ${data.fcs}`,
    summary: `配平结果: ${data.fcs}`,
    keyPoints,
    details: {
      fcs: data.fcs,
      fcsall: data.fcsall,
      left: data.left,
      right: data.right,
      reactants: data.reactants,
      products: data.products,
    },
    rawData: data,
  };
}

function parseChemicalElement(data: ElementData | null): ParsedContent {
  if (!data || !data.zwmc) {
    return { title: '元素周期表', summary: '暂无元素数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints = [
    `元素名称: ${data.zwmc} (${data.ysfh})`,
    `原子序数: ${data.id}`,
    `原子质量: ${data.yzzl} u`,
    `电子构型: ${data.dzgx}`,
    data.yht ? `氧化态: ${data.yht}` : '',
    data.yzbj ? `原子半径: ${data.yzbj} Å` : '',
    data.zt ? `状态: ${data.zt}` : '',
  ].filter(Boolean);

  return {
    title: `化学元素: ${data.zwmc} (${data.ysfh})`,
    summary: `当前元素是 "${data.zwmc}"（${data.ywmc}），原子序数 ${data.id}，原子质量 ${data.yzzl} u。${data.zt || ''}`,
    keyPoints,
    details: {
      name: data.zwmc,
      symbol: data.ysfh,
      atomicNumber: data.id,
      atomicMass: data.yzzl,
      electronConfig: data.dzgx,
      oxidationState: data.yht,
      atomicRadius: data.yzbj,
      state: data.zt,
      discovery: data.fx,
      source: data.ly,
      usage: data.yt,
    },
    rawData: data,
  };
}

function parsePoetry(data: PoetryItem | null): ParsedContent {
  if (!data || !data.name) {
    return { title: '古诗文大全', summary: '暂无诗文数据', keyPoints: [], details: {}, rawData: data };
  }

  const keyPoints = [
    `诗名: ${data.name}`,
    `作者: ${data.author}`,
    `朝代: ${data.dynasty}`,
    data.tag ? `标签: ${data.tag}` : '',
  ].filter(Boolean);

  const contentText = data.content.replace(/<[^>]+>/g, ' ').trim();

  return {
    title: `${data.dynasty} · ${data.author}《${data.name}》`,
    summary: `当前诗文是 ${data.dynasty} ${data.author} 的《${data.name}》。${contentText.substring(0, 80)}...`,
    keyPoints,
    details: {
      name: data.name,
      author: data.author,
      dynasty: data.dynasty,
      tag: data.tag,
      content: data.content,
      ywjzsy: data.ywjzsy,
      ywjzse: data.ywjzse,
      czbj: data.czbj,
      sxy: data.sxy,
      sxe: data.sxe,
      jj: data.jj,
      wyzs: data.wyzs,
      xzsf: data.xzsf,
      dj: data.dj,
      pj: data.pj,
      jx: data.jx,
    },
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

  const drivingMode = (parsed.details.mode as string) || 'question';

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

    'driving-test': drivingMode === 'knowledge'
      ? `\n\n【角色定位】你是驾考理论教练。当前展示的是一条驾考知识点，请提供：
1. 该知识点的核心要义提炼
2. 背后的交通规则原理
3. 容易混淆或出错的地方提醒
4. 记忆口诀或技巧
5. 如果有相关的真题场景，可以举例说明，帮助用户加深理解。`
      : `\n\n【角色定位】你是驾考理论教练。请基于当前题目提供：
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

    'sanguo-heroes': `\n\n【角色定位】你是三国历史专家。请基于当前三国人物提供：
1. 人物生平详细梳理与重要节点分析
2. 人物性格特点与历史评价（包括正史与演义对比）
3. 与该人物相关的经典战役或典故
4. 该人物在三国格局中的地位和影响
5. 相关人物关系网络（君臣、同僚、对手等）`,

    'translator': `\n\n【角色定位】你是专业翻译顾问。请基于当前翻译内容提供：
1. 翻译质量的评估与优化建议
2. 原文和译文的用词分析与语境理解
3. 该翻译在不同场景下的适用性（如商务、学术、日常等）
4. 相关语言表达的文化背景知识
5. 如果用户想要更地道的表达，请提供多个替代表述方案`,

    'proverbs': `\n\n【角色定位】你是中国传统文化与语言专家。请基于当前谚语提供：
1. 谚语的出处与历史背景
2. 谚语的深层文化含义与哲学思想
3. 相似或相关的其他谚语、成语对比
4. 在现代生活中的应用场景与启示
5. 如有典故，请详细讲解典故故事`,

    'idioms': `\n\n【角色定位】你是中国传统文化与语言专家。请基于当前成语提供：
1. 成语的详细出处与历史典故（包括原文引用）
2. 成语的字面意思与深层寓意解析
3. 该成语在古代与现代的不同用法演变
4. 相似成语或相关成语的对比辨析
5. 在实际写作和口语中的正确使用场景
6. 如有历史人物或事件关联，请生动讲述相关故事`,

    'math-quiz': `\n\n【角色定位】你是小学数学教育专家。请基于当前数学题提供：
1. 题目类型的识别与解题策略分析
2. 分步详细讲解，确保小学生能够理解
3. 这道题涉及的核心数学知识点总结
4. 类似题型的变式练习或拓展思考
5. 如果用图形或实物类比能帮助理解，请尽量使用`,

    'equation-balancer': `

【角色定位】你是化学教育专家。请基于当前配平的化学方程式提供：
1. 该化学反应的类型判断（化合、分解、置换、复分解、氧化还原等）
2. 反应物与生成物的化学性质简介
3. 该反应在日常生活或工业生产中的应用场景
4. 与该反应相关的化学实验注意事项或安全提示
5. 如果用户输入的方程式配平有误或无法配平，请分析可能的原因并给出正确写法`,

    'chemical-element': `

【角色定位】你是化学教育专家。请基于当前化学元素提供：
1. 该元素在元素周期表中的位置与族类归属分析
2. 该元素的电子构型与化学性质解释
3. 该元素的重要化合物及日常生活/工业应用
4. 与该元素相关的有趣化学实验或科学史故事
5. 如果用户提问化学学习相关问题，请耐心解答并适当拓展`,

    'poetry': `

【角色定位】你是中国古典文学与诗词研究专家。请基于当前诗文提供：
1. 诗歌的创作背景与历史情境分析
2. 逐句赏析，解读意象、修辞手法与情感表达
3. 诗歌的文学价值与在文学史上的地位
4. 与作者其他作品或同时代作品的对比分析
5. 诗歌对现代读者的启示与共鸣点
6. 如涉及典故，请详细讲解典故出处与含义`,

    'idiom': `

【角色定位】你是中国传统文化与汉语语言学专家。请基于当前成语提供：
1. 成语的出处溯源与典故故事详细讲解
2. 成语中每个字的含义与整体寓意深度解读
3. 该成语在古代与现代语境中的用法演变
4. 与该成语意思相近或相关的其他成语对比辨析
5. 该成语在现代写作、演讲中的运用建议
6. 如有涉及的历史人物或事件，请补充背景知识`,
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
      const mode = (parsed.details.mode as string) || 'question';
      if (mode === 'knowledge') {
        return [
          `这个知识点的核心是什么？`,
          `有什么容易混淆的地方？`,
          `有什么记忆技巧？`,
          `相关的交通规则还有哪些？`,
        ];
      }
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
    case 'sanguo-heroes': {
      const name = (parsed.details.name as string) || '这位人物';
      return [
        `${name} 有哪些经典战役或典故？`,
        `正史和演义中对 ${name} 的评价有何不同？`,
        `${name} 的人际关系网络是怎样的？`,
        `${name} 在三国格局中处于什么地位？`,
      ];
    }
    case 'translator': {
      const sourceText = (parsed.details.sourceText as string) || '这段文字';
      const targetLang = (parsed.details.targetLang as string) || '目标语言';
      return [
        `"${sourceText}" 的翻译是否地道？有什么优化建议？`,
        `这个翻译在商务场景和日常场景中有什么不同表达？`,
        `原文中有没有什么文化梗或隐含意义？`,
        `请提供一些 ${targetLang} 中类似表达的替代表述`,
      ];
    }
    case 'proverbs': {
      const saying = (parsed.details.saying as string) || '这条谚语';
      return [
        `"${saying}" 有什么出处或典故？`,
        `"${saying}" 蕴含着怎样的文化哲理？`,
        `有哪些和 "${saying}" 意思相近的谚语或成语？`,
        `"${saying}" 在现代生活中有什么应用场景？`,
      ];
    }
    case 'idioms': {
      const words = (parsed.details.words as string) || '这个成语';
      return [
        `"${words}" 出自哪个历史典故？`,
        `"${words}" 的字面意思和深层寓意有何区别？`,
        `有哪些和 "${words}" 意思相近或相反的成语？`,
        `"${words}" 在现代写作和口语中如何正确使用？`,
      ];
    }
    case 'math-quiz': {
      return [
        `这道题属于什么类型的应用题？`,
        `请用更直观的方式讲解这道题的解题思路`,
        `这道题涉及哪些核心数学知识点？`,
        `有没有类似的变式题目可以练习？`,
      ];
    }
    case 'equation-balancer': {
      return [
        `这个反应属于什么类型？`,
        `该反应在日常生活或工业中有什么应用？`,
        `进行这个反应时需要注意哪些安全事项？`,
        `请详细讲解这个反应的化学原理`,
      ];
    }
    case 'chemical-element': {
      const name = (parsed.details.name as string) || '这个元素';
      const symbol = (parsed.details.symbol as string) || '';
      return [
        `${name} (${symbol}) 在周期表中属于哪一族？有什么特点？`,
        `${name} 的电子构型如何影响其化学性质？`,
        `${name} 有哪些重要的化合物和日常应用？`,
        `关于 ${name} 有什么有趣的科学史故事？`,
      ];
    }
    case 'poetry': {
      const poemName = (parsed.details.name as string) || '这首诗';
      const author = (parsed.details.author as string) || '';
      return [
        `《${poemName}》的创作背景是什么？`,
        `${author ? `${author}的` : '这首'}诗有什么独特的艺术手法？`,
        `请逐句赏析《${poemName}》`,
        `《${poemName}》在文学史上有怎样的地位和影响？`,
      ];
    }
    case 'idiom': {
      const words = (parsed.details.words as string) || '这个成语';
      return [
        `"${words}" 有什么典故或历史故事？`,
        `"${words}" 中每个字分别是什么意思？`,
        `"${words}" 在古代和现代用法上有什么不同？`,
        `请用 "${words}" 造几个不同语境的句子`,
      ];
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

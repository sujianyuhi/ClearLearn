export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  section: string;
  status?: 'sending' | 'sent' | 'error';
  errorMessage?: string;
}

export interface ChatHistory {
  [section: string]: ChatMessage[];
}

export interface SectionContext {
  section: string;
  title: string;
  description: string;
}

export interface StreamingState {
  content: string;
  isLoading: boolean;
  error: string | null;
  abortController: AbortController | null;
}

export interface SectionConfig {
  section: string;
  title: string;
  icon: string;
  description: string;
  quickQuestions: string[];
  systemPromptTemplate: (data: unknown) => string;
  contentParser: (data: unknown) => ParsedContent;
}

export interface ParsedContent {
  title: string;
  summary: string;
  keyPoints: string[];
  details: Record<string, unknown>;
  rawData: unknown;
}

export type MarkdownToken =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'code'; content: string }
  | { type: 'codeBlock'; language: string; content: string }
  | { type: 'heading'; level: number; content: string }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'quote'; content: string }
  | { type: 'link'; text: string; url: string }
  | { type: 'lineBreak' };

// Daily English API response
export interface DailyWordData {
  word: string;
  usphone?: string;
  ukphone?: string;
  usspeech?: string;
  ukspeech?: string;
  translations?: Array<{
    pos: string;
    tran_cn: string;
  }>;
  sentences?: Array<{
    s_content: string;
    s_cn: string;
  }>;
  phrases?: Array<{
    p_content: string;
    p_cn: string;
  }>;
  relWords?: Array<{
    Pos: string;
    Hwds: Array<{
      hwd: string;
      tran: string;
    }>;
  }>;
  synonyms?: Array<{
    pos: string;
    tran: string;
    Hwds: Array<{
      word: string;
    }>;
  }>;
}

// Word Detail API response (same structure as daily)
export interface WordDetailData {
  word: string;
  usphone?: string;
  ukphone?: string;
  usspeech?: string;
  ukspeech?: string;
  translations?: Array<{
    pos: string;
    tran_cn: string;
  }>;
  sentences?: Array<{
    s_content: string;
    s_cn: string;
  }>;
  phrases?: Array<{
    p_content: string;
    p_cn: string;
  }>;
  relWords?: Array<{
    Pos: string;
    Hwds: Array<{
      hwd: string;
      tran: string;
    }>;
  }>;
  synonyms?: Array<{
    pos: string;
    tran: string;
    Hwds: Array<{
      word: string;
    }>;
  }>;
}

// Driving Test API response
export interface DrivingQuestionData {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  explain: string;
  chapter?: string;
  pic?: string;
  type?: string;
}

// History API response - array of strings
export type HistoryEventData = string;

// Sanguo (Three Kingdoms) API response
export interface SanguoPersonData {
  name: string;
  guo: string;
  sex: string;
  real: string;
  zi: string;
  py: string;
  age: string;
  content: string;
}

// Translator API response
export interface TranslatorData {
  sourceText: string;
  translatedText: string;
  targetLang: number;
}

// Proverb API response
export interface ProverbData {
  saying: string;
  content: string;
}

// Idiom API response
export interface IdiomData {
  code: number;
  msg?: string;
  words: string;
  bushou: string;
  shouzi: string;
  pinyin: string;
  jieshi: string;
  chuchu: string;
  tongyi: string;
  fanyi: string;
  liju: string;
  yinzheng: string;
  yufa: string;
  en: string;
}

// Math Quiz API response
export interface MathQuestionData {
  code: number;
  timu: string;
  daan: string;
  jiexi: string;
}

// Chemical Equation Balancer API response
export interface EquationData {
  code: number;
  fcs: string;
  fcsall: string;
  left: string;
  right: string;
  reactant: string[];
  product: string[];
  reactants: Array<{ formula: string; coefficient: number }>;
  products: Array<{ formula: string; coefficient: number }>;
}

// Chemical Element API response
export interface ElementData {
  id: string;
  zwmc: string;
  ysfh: string;
  ywmc: string;
  yzzl: string;
  yzbj: string;
  dzgx: string;
  gjbj: string;
  yztj: string;
  lzbj: string;
  yht: string;
  fx: string;
  ly: string;
  yt: string;
  zt: string;
  fd: string;
  br: string;
  rhr: string;
  drxs: string;
  sd: string;
  rd: string;
  md: string;
  zfr: string;
  ddl: string;
  zrd: string;
  ty: string;
  diq: string;
  tpybm: string;
  dxysc: string;
  zlsj: string;
  hsz: string;
  dxybm: string;
  daq: string;
  tpysc: string;
  qgz: string;
  xie: string;
  gu: string;
  gan: string;
  jr: string;
  rsrl: string;
  rtzl: string;
  code: number;
  dzmx: string;
}

// Poetry API response
export interface PoetryItem {
  name: string;
  content: string;
  author: string;
  dynasty: string;
  tag: string | null;
  ywjzsy: string | null;
  ywjzse: string | null;
  czbj: string | null;
  jsy: string | null;
  jse: string | null;
  sxy: string | null;
  sxe: string | null;
  jj: string | null;
  wyzs: string | null;
  yj: string | null;
  xzsf: string | null;
  dj: string | null;
  pj: string | null;
  jx: string | null;
}

export interface PoetryData {
  code: number;
  page: number;
  data: PoetryItem[];
}

export type ApiData = DailyWordData | WordDetailData | DrivingQuestionData | HistoryEventData[] | SanguoPersonData | TranslatorData | ProverbData | IdiomData | MathQuestionData | EquationData | ElementData | PoetryData | PoetryItem | null;

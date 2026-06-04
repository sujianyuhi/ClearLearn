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

export type ApiData = DailyWordData | WordDetailData | DrivingQuestionData | HistoryEventData[] | null;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  section: string;
}

export interface ChatHistory {
  [section: string]: ChatMessage[];
}

export interface SectionContext {
  section: string;
  title: string;
  description: string;
}

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

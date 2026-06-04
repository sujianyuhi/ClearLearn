import { createContext } from 'react';
import type { ApiData, ChatHistory, StreamingState } from '../types';

export interface ChatContextType {
  chatHistory: ChatHistory;
  sendMessage: (content: string, section: string, currentData: ApiData) => Promise<void>;
  clearMessages: (section: string) => void;
  cancelGeneration: (section: string) => void;
  getSectionState: (section: string) => StreamingState;
  subscribe: (callback: () => void) => () => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

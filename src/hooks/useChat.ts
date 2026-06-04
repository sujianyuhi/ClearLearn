import { useContext, useSyncExternalStore } from 'react';
import type { ApiData } from '../types';
import { ChatContext } from '../context/chatContext';

export function useChat(section: string) {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }

  const sectionMessages = context.chatHistory[section] || [];

  const sectionState = useSyncExternalStore(
    context.subscribe,
    () => context.getSectionState(section),
    () => context.getSectionState(section)
  );

  return {
    messages: sectionMessages,
    sendMessage: (content: string, currentData: ApiData) =>
      context.sendMessage(content, section, currentData),
    clearMessages: () => context.clearMessages(section),
    cancelGeneration: () => context.cancelGeneration(section),
    isLoading: sectionState.isLoading,
    currentStreamingContent: sectionState.content,
    error: sectionState.error,
  };
}

import { createContext } from 'react';
import { type ChatroomType, type MessageType } from '../../type';

export interface ChatContextType {
  chatrooms: ChatroomType[];
  selectedRoom: string | null;
  messages: MessageType[];
  aiThinking: boolean;
  addNewChat: (title: string) => Promise<string | undefined>;
  removeChat: (id: string) => Promise<void>;
  renameTitle: (newTitle: string, chatId: string) => Promise<void>;
  selectRoom: (id: string | null) => void;
  sendMessage: (
    chatId: string,
    text: string,
    sender: 'user' | 'ai',
  ) => Promise<void>;
  selectAiThinking: (thinking: boolean) => void;
}

export const ChatContext = createContext<ChatContextType>({
  chatrooms: [],
  selectedRoom: null,
  messages: [],
  aiThinking: false,
  addNewChat: async () => {
    throw new Error('ChatContext not initialized');
  },
  removeChat: async () => {
    throw new Error('ChatContext not initialized');
  },
  renameTitle: async () => {
    throw new Error('ChatContext not initialized');
  },
  selectRoom: () => {
    throw new Error('ChatContext not initialized');
  },
  sendMessage: async () => {
    throw new Error('ChatContext not initialized');
  },
  selectAiThinking: () => {
    throw new Error('ChatContext not initialized');
  },
});

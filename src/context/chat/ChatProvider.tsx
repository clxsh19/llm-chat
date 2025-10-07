import { useState, useEffect, useRef } from 'react';
import {
  getUserChatrooms,
  addChatroom,
  addMessage,
  deleteChatroom,
  renameChatroom,
  listenToMessages,
} from '../../firebase/firestoreService';
import { useAuth } from '../auth/UseAuth';
import { ChatContext } from './ChatContext';
import { type ChatroomType, type MessageType } from '../../type';

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [chatrooms, setChatrooms] = useState<ChatroomType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const unsubscribeRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    setChatrooms([]);
    setMessages([]);
    if (user) {
      getUserChatrooms(user.uid).then(setChatrooms);
    }
  }, [user]);

  useEffect(() => {
    // Cleanup old listener when switching rooms
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!selectedRoom) {
      setMessages([]);
      return;
    }

    // Start new listener
    const unsubscribe = listenToMessages(selectedRoom, setMessages);
    unsubscribeRef.current = unsubscribe;

    // Cleanup when component unmounts or room changes
    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [selectedRoom]);

  const addNewChat = async (title: string) => {
    if (!user) return;
    const { id, createdAt } = await addChatroom(user.uid, title);
    setChatrooms((prev) => [
      ...prev,
      {
        id,
        title,
        userId: user.uid,
        createdAt,
      },
    ]);

    return id;
  };

  const renameTitle = async (newTitle: string, chatId: string) => {
    setChatrooms((prev) =>
      prev.map((r) => (r.id === chatId ? { ...r, title: newTitle } : r)),
    );
    await renameChatroom(chatId, newTitle);
  };

  const removeChat = async (chatId: string) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setChatrooms((prev) => prev.filter((c) => c.id !== chatId));

    // If deleted chatroom is selected, reset messages
    if (selectedRoom === chatId) {
      setSelectedRoom(null);
      setMessages([]);
    }

    await deleteChatroom(chatId);
  };

  const sendMessage = async (
    chatId: string,
    text: string,
    sender: 'user' | 'ai',
  ) => {
    setMessages((prev) => [
      ...prev,
      { text, sender, createdAt: new Date().toISOString() },
    ]);
    if (user && chatId !== '-2') {
      await addMessage(chatId, text, sender, user.uid);
    }
  };

  const selectRoom = (chatId: string | null) => setSelectedRoom(chatId);
  const selectAiThinking = (thinking: boolean) => setAiThinking(thinking);

  return (
    <ChatContext.Provider
      value={{
        chatrooms,
        messages,
        selectedRoom,
        aiThinking,
        addNewChat,
        renameTitle,
        removeChat,
        sendMessage,
        selectRoom,
        selectAiThinking,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

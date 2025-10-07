export type ChatroomType = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
};

export type MessageType = {
  text: string;
  sender: 'user' | 'ai';
  createdAt: string;
};

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { type ChatroomType, type MessageType } from '../type';

// Create user doc in Firestore
export const createUserInFirestore = async (uid: string, email: string) => {
  await setDoc(doc(db, 'users', uid), { email });
};

// Get all chatrooms for a user
export const getUserChatrooms = async (userId: string) => {
  const q = query(collection(db, 'chatrooms'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title ?? 'Untitled',
      userId: data.userId,
      messages: data.messages ?? [],
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as ChatroomType;
  });
};

// Add chatroom
export const addChatroom = async (userId: string, title: string) => {
  const docRef = await addDoc(collection(db, 'chatrooms'), {
    title,
    userId,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
};

// Delete chatroom
export const deleteChatroom = async (chatId: string) => {
  // Delete messages subcollection
  const messagesRef = collection(db, 'chatrooms', chatId, 'messages');
  const snapshot = await getDocs(messagesRef);
  const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(deletePromises);
  // Delete chatroom
  await deleteDoc(doc(db, 'chatrooms', chatId));
};

// Rename chatroom
export const renameChatroom = async (chatId: string, newTitle: string) => {
  const chatRef = doc(db, 'chatrooms', chatId);
  await updateDoc(chatRef, { title: newTitle });
};

// Add message
export const addMessage = async (
  chatId: string,
  text: string,
  sender: 'user' | 'ai',
  senderId: string,
) => {
  const messagesRef = collection(db, 'chatrooms', chatId, 'messages');
  await addDoc(messagesRef, {
    text,
    sender,
    senderId,
    createdAt: serverTimestamp(),
  });
};

// Real-time listener for messages subcollection
export const listenToMessages = (
  chatId: string,
  callback: (messages: MessageType[]) => void,
) => {
  const messagesRef = collection(db, 'chatrooms', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: MessageType[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        text: data.text,
        sender: data.sender,
        senderId: data.senderId,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
    callback(messages);
  });

  return unsubscribe;
};

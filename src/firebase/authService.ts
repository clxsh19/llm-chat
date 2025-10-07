import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserInFirestore } from './firestoreService';

// Email signup
export const signup = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await createUserInFirestore(result.user.uid, email);
  return result.user;
};

// Email login
export const login = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Google login
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await createUserInFirestore(result.user.uid, result.user.email || 'unknown');
  return result.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};

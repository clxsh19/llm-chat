import { createContext } from 'react';
import { type User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// define auth context to be consumed
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

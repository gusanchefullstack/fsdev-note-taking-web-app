import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types';

const USERS_KEY = 'notes-app-users';
const SESSION_KEY = 'notes-app-session';

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as User[];
  } catch { /* ignore */ }
  return [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(password: string): string {
  /* Deterministic pseudo-hash for localStorage sim — not cryptographic */
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => string | null;
  signup: (email: string, password: string) => string | null;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): string | null => {
    const users = getUsers();
    const found = users.find((u) => u.email === email.toLowerCase());
    if (!found) return 'No account found with that email.';
    if (found.passwordHash !== hashPassword(password)) return 'Incorrect password.';
    setUser(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    return null;
  };

  const signup = (email: string, password: string): string | null => {
    const users = getUsers();
    if (users.find((u) => u.email === email.toLowerCase())) {
      return 'An account with that email already exists.';
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
    };
    saveUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const resetPassword = (email: string, newPassword: string): string | null => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === email.toLowerCase());
    if (idx === -1) return 'No account found with that email.';
    users[idx] = { ...users[idx], passwordHash: hashPassword(newPassword) };
    saveUsers(users);
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

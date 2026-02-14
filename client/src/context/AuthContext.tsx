import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authService, type User } from '../services/authService';
import { storage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(() => {
    const storedUser = storage.getUser();
    const token = storage.getToken();
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        storage.clear();
      }
    } else if (storedUser || token) {
      storage.clear();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const u = res.data.user;
    const accessToken = res.data.accessToken;
    if (!accessToken) throw new Error('No access token received');
    setUser(u);
    storage.setUser(JSON.stringify(u));
    storage.setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.clear();
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authService.register({ name, email, password });
      const u = res.data.user;
      const accessToken = res.data.accessToken;
      if (!accessToken) throw new Error('No access token received');
      setUser(u);
      storage.setUser(JSON.stringify(u));
      storage.setToken(accessToken);
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

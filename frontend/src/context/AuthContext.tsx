import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { auth } from '@/api/cms';
import { getToken, setToken } from '@/api/client';

interface AuthContextValue {
  email: string | null;
  isAuthenticated: boolean;
  /** Null while the stored token is being checked on first load. */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // A stored token may have expired while the tab was closed, so confirm it
  // with the server rather than trusting its presence.
  useEffect(() => {
    if (!getToken()) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    auth
      .me()
      .then((result) => {
        if (!cancelled) setEmail(result.admin.email);
      })
      .catch(() => setToken(null))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (address: string, password: string) => {
    const session = await auth.login(address, password);
    setToken(session.token);
    setEmail(session.admin.email);
  }, []);

  const signOut = useCallback(() => {
    auth.logout();
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      email,
      isAuthenticated: email !== null,
      isLoading,
      signIn,
      signOut,
    }),
    [email, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

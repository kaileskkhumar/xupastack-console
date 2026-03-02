import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  const signInWithGitHub = useCallback(async () => {
    // Stub: simulate GitHub OAuth login
    setUser({ id: "stub-1", email: "dev@example.com", name: "Developer", avatarUrl: undefined });
  }, []);

  const signInWithMagicLink = useCallback(async (_email: string) => {
    // Stub: simulate magic link sent
    // In real implementation, this would send the magic link via backend
    setUser({ id: "stub-1", email: _email, name: _email.split("@")[0], avatarUrl: undefined });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGitHub, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

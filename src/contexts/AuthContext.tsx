import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AppRole, Tenant } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  roles: AppRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  setTenant: (tenant: Tenant) => void;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    roles: [],
    isLoading: true,
    isAuthenticated: false,
    needsOnboarding: false,
  });

  useEffect(() => {
    // TODO: Replace with supabase.auth.onAuthStateChange
    // For now, check if there's a mock session
    const timer = setTimeout(() => {
      setState((prev) => ({ ...prev, isLoading: false }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with supabase.auth.signInWithPassword({ email, password })
    setState((prev) => ({
      ...prev,
      user: { id: "mock-id", email, full_name: email.split("@")[0] },
      isAuthenticated: true,
      needsOnboarding: true, // will check tenant membership
      isLoading: false,
    }));
  };

  const signup = async (email: string, password: string, fullName: string) => {
    // TODO: Replace with supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    setState((prev) => ({
      ...prev,
      user: { id: "mock-id", email, full_name: fullName },
      isAuthenticated: true,
      needsOnboarding: true,
      isLoading: false,
    }));
  };

  const logout = async () => {
    // TODO: Replace with supabase.auth.signOut()
    setState({
      user: null,
      tenant: null,
      roles: [],
      isLoading: false,
      isAuthenticated: false,
      needsOnboarding: false,
    });
  };

  const setTenant = (tenant: Tenant) => {
    setState((prev) => ({ ...prev, tenant, needsOnboarding: false }));
  };

  const hasRole = (role: AppRole) => state.roles.includes(role);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, setTenant, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

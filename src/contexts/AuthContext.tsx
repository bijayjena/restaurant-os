import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { account, databases, DATABASE_ID, COLLECTIONS, Query } from "@/lib/appwrite";
import type { AppRole, Tenant } from "@/lib/appwrite";
import type { Models } from "appwrite";

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

  const getUserRoles = async (userId: string): Promise<AppRole[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USER_ROLES,
        [Query.equal('user_id', userId)]
      );
      return response.documents.map((doc) => (doc as { role: AppRole }).role);
    } catch {
      return [];
    }
  };

  const checkAuth = async () => {
    try {
      const session = await account.get();
      const userRoles = await getUserRoles(session.$id);
      
      setState({
        user: {
          id: session.$id,
          email: session.email,
          full_name: session.name,
        },
        tenant: null,
        roles: userRoles,
        isLoading: false,
        isAuthenticated: true,
        needsOnboarding: userRoles.length === 0,
      });
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await checkAuth();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      await account.create('unique()', email, password, fullName);
      await account.createEmailPasswordSession(email, password);
      await checkAuth();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setState({
        user: null,
        tenant: null,
        roles: [],
        isLoading: false,
        isAuthenticated: false,
        needsOnboarding: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
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

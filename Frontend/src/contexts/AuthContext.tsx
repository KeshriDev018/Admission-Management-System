import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userName: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ role: string; name: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.isAuthenticated(),
  );
  const [userRole, setUserRole] = useState<string | null>(
    authAPI.getUserRole(),
  );
  const [userName, setUserName] = useState<string | null>(
    authAPI.getUserName(),
  );
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authAPI.isAuthenticated());
      setUserRole(authAPI.getUserRole());
      setUserName(authAPI.getUserName());
    };

    checkAuth();

    // Listen for storage changes (e.g., logout in another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { role, name } = await authAPI.login(email, password);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserName(name);
      return { role, name };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } finally {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userName,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

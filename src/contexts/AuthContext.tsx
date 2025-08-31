import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, removeAuthToken } from '@/services/api';
import { authService } from '@/services/auth';
import { AdminProfile } from '@/types/api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: AdminProfile | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsLoggedIn(true);
          
          // If user is on login page and authenticated, redirect to dashboard
          if (location.pathname === '/') {
            navigate('/dashboard');
          }
        } else {
          // If not authenticated and not on login page, redirect to login
          if (location.pathname !== '/') {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUser(null);
        if (location.pathname !== '/') {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = (token: string) => {
    setIsLoggedIn(true);
    // The profile will be fetched by the useEffect
  };

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
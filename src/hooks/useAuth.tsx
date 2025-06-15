import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { apiService } from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import { authConfig } from '../config/env';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem(authConfig.tokenKey);
      const storedUser = localStorage.getItem(authConfig.userDataKey);

      if (storedToken && storedUser) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token expired, clear storage
            localStorage.removeItem(authConfig.tokenKey);
            localStorage.removeItem(authConfig.userDataKey);
          }
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          localStorage.removeItem(authConfig.tokenKey);
          localStorage.removeItem(authConfig.userDataKey);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login(credentials);

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem(authConfig.tokenKey, response.token);
      localStorage.setItem(authConfig.userDataKey, JSON.stringify(response.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.register(data);

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem(authConfig.tokenKey, response.token);
      localStorage.setItem(authConfig.userDataKey, JSON.stringify(response.user));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(authConfig.tokenKey);
    localStorage.removeItem(authConfig.userDataKey);

    // Call API logout (optional, for server-side cleanup)
    apiService.logout().catch(console.error);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
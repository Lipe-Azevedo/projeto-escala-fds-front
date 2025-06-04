'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string;
  user_type: 'master' | 'colaborador';
  work_info?: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Interface para a estrutura de erro esperada do backend Go
interface ApiErrorResponse {
  message: string;
  error: string;
  code: number;
  causes?: any[];
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string, password: string }) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
  isMaster: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUserString = localStorage.getItem('currentUser');
      if (storedToken && storedUserString) {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUserString));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string, password: string }): Promise<void> => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json(); // Lê o corpo da resposta JSON

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        throw new Error(errorData.message || `Erro ${response.status}: ${errorData.error || 'Falha no login'}`);
      }

      const authData = data as AuthResponse;

      if (authData.token && authData.user) {
        localStorage.setItem('authToken', authData.token);
        localStorage.setItem('currentUser', JSON.stringify(authData.user));
        setToken(authData.token);
        setCurrentUser(authData.user);
        console.log('AuthContext: Login successful, user type:', authData.user.user_type);

        if (authData.user.user_type === 'master') {
          router.push('/master/dashboard');
        } else if (authData.user.user_type === 'colaborador') {
          router.push('/collaborator/dashboard');
        } else {
          logout();
          throw new Error('Tipo de usuário desconhecido recebido do servidor.');
        }
      } else {
        throw new Error('Resposta de login inválida do servidor (faltando token ou usuário).');
      }
    } catch (err: any) {
      console.error('AuthContext: Login failed', err);
      clearSession();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setToken(null);
    setCurrentUser(null);
  };

  const logout = () => {
    clearSession();
    router.push('/login');
    console.log('AuthContext: User logged out.');
  };

  const isLoggedIn = (): boolean => {
    return !!token && !!currentUser;
  };

  const isMaster = (): boolean => {
    return !!currentUser && currentUser.user_type === 'master';
  };

  useEffect(() => {
    if (!isLoading && !isLoggedIn() && pathname !== '/login' && !pathname.startsWith('/public')) {
      // router.push('/login'); // Comentado para não ser agressivo durante o desenvolvimento inicial das páginas
    }
  }, [isLoading, token, currentUser, pathname, router]);

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoading, login, logout, isLoggedIn, isMaster }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
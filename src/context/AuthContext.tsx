import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../config/supabaseClient';

interface AuthContextType {
  user: any;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Cria o usuário no sistema de autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Insere o usuário na tabela 'usuario'
      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .insert([
          {
            user_id: authData.user?.id,
            email,
            nome: name,
          }
        ])
        .select();

      if (userError) throw userError;

      setUser(userData[0]);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  const login = async (userData: any) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
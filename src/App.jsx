import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './config/supabaseClient';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import DashboardGamer from './pages/DashboardGamer';
import MinhaBiblioteca from './pages/MinhaBiblioteca';
import CadastroJogo from './pages/CadastroJogo';
import DetalhesJogo from './pages/DetalhesJogo';
import GlobalStyles from './styles/GlobalStyles';
import MeuJogo from './pages/MeuJogo';
import MeusDesafios from './pages/MeusDesafios';
import CadastroDesafio from './pages/CadastroDesafio';
import EditarPerfil from './pages/EditarPerfil';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalStyles />
        {session && <Header />}
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas protegidas */}
          <Route path="/MinhaBiblioteca" element={
            <PrivateRoute>
              <MinhaBiblioteca />
            </PrivateRoute>
          } />
          
          <Route path="/DashboardGamer" element={
            <PrivateRoute>
              <DashboardGamer />
            </PrivateRoute>
          } />

          <Route path="/MeusDesafios" element={
            <PrivateRoute>
              <MeusDesafios />
            </PrivateRoute>
          } />

          <Route path="/CadastroDesafio" element={
            <PrivateRoute>
              <CadastroDesafio />
            </PrivateRoute>
          } />

          <Route path="/DetalhesJogo" element={
            <PrivateRoute>
              <DetalhesJogo />
            </PrivateRoute>
          } />

          <Route path="/MeuJogo" element={
            <PrivateRoute>
              <MeuJogo />
            </PrivateRoute>
          } />

          <Route path="/EditarPerfil" element={
            <PrivateRoute>
              <EditarPerfil />
            </PrivateRoute>
          } />

          {/* Rota padrão */}
          <Route path="/" element={<Navigate to="/DashboardGamer" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App; 
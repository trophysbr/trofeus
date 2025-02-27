import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  // Componente para proteger rotas
  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Carregando...</div>;
    return session ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <GlobalStyles />
      {session && <Header />}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/biblioteca" />} />
        <Route path="/register" element={!session ? <Register /> : <Navigate to="/biblioteca" />} />
        
        {/* Rotas protegidas */}
        <Route path="/biblioteca" element={
          <PrivateRoute>
            <MinhaBiblioteca />
          </PrivateRoute>
        } />
        
        <Route path="/" element={
          session ? <Navigate to="/biblioteca" /> : <Navigate to="/login" />
        } />
        
        <Route path="/DashboardGamer" element={
          <PrivateRoute>
            <DashboardGamer />
          </PrivateRoute>
        } />
        <Route path="/cadastro-jogo" element={
          <PrivateRoute>
            <CadastroJogo />
          </PrivateRoute>
        } />
        <Route path="/jogo" element={
          <PrivateRoute>
            <DetalhesJogo />
          </PrivateRoute>
        } />
        <Route path="/meu-jogo" element={
          <PrivateRoute>
            <MeuJogo />
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
        <Route path="/editar-perfil" element={
          <PrivateRoute>
            <EditarPerfil />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App; 
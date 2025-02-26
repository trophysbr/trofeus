import { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
`;

const RegisterBox = styled.div`
  background-color: #2d2d2d;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #6c5ce7;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #3d3d3d;
  border-radius: 4px;
  background-color: #3d3d3d;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #6c5ce7;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5f4ed0;
  }

  &:disabled {
    background-color: #4a4a4a;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  text-align: center;
  margin-bottom: 1rem;
`;

const LoginLink = styled(Link)`
  color: #6c5ce7;
  text-decoration: none;
  text-align: center;
  display: block;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Cadastra o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Insere o usuário na tabela Usuarios
      const { data: userData, error: userError } = await supabase
        .from('Usuarios')
        .insert([
          {
            email,
            nome,
            dt_inclusao: new Date().toISOString(),
            ultimo_login: new Date().toISOString(),
          },
        ]);

      if (userError) throw userError;

      // 3. Redireciona para o DashboardGamer
      navigate('/DashboardGamer');
    } catch (error) {
      setError(error.message || 'Erro ao cadastrar. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <Title>Criar Conta</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleRegister}>
          <div>
            <FaUser />
            <Input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div>
            <FaEnvelope />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <FaLock />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </Form>

        <LoginLink to="/login">
          Já tem uma conta? Faça login
        </LoginLink>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default Register; 
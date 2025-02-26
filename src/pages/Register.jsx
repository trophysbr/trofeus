import { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/biblioteca'
        }
      });

      if (error) throw error;

      // Mostrar mensagem de sucesso e redirecionar para login
      alert('Cadastro realizado com sucesso! Por favor, verifique seu email.');
      navigate('/login');
    } catch (error) {
      setError('Erro ao criar conta. ' + error.message);
      console.error('Erro:', error.message);
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
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
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
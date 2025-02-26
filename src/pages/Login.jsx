import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
`;

const LoginBox = styled.div`
  background: rgba(45, 45, 61, 0.7);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: #6c5ce7;
  text-shadow: 0 0 10px rgba(108, 92, 231, 0.3);
  
  span {
    display: block;
    font-size: 1rem;
    color: #a0a0a0;
    margin-top: 0.5rem;
    text-shadow: none;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputGroup = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c5ce7;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid rgba(108, 92, 231, 0.3);
  border-radius: 8px;
  background: rgba(45, 45, 61, 0.5);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: #6c5ce7;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #5f4ed0;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #4a4a6a;
    cursor: not-allowed;
    transform: none;
  }
`;

const GoogleButton = styled(Button)`
  background: #4285f4;
  margin-top: 0.5rem;

  &:hover {
    background: #3367d6;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  span {
    padding: 0 1rem;
    color: #a0a0a0;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
`;

const RegisterLink = styled(Link)`
  color: #6c5ce7;
  text-decoration: none;
  text-align: center;
  display: block;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  &:hover {
    color: #5f4ed0;
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    setLoading(true);
    setError(null);

    try {
      // 1. Autentica o usuário com e-mail e senha
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. Obtém os dados do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();

      // 3. Verifica se o usuário já existe na tabela Usuarios
      const { data: existingUser, error: userError } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();
      
        if (userError) {
          console.error('Erro na consulta:', error.message);
          if (error.code === 'PGRST116') {
            console.log('Nenhum ou mais de um registro encontrado');
          }
        }

      if (!existingUser) {
        // 4. Se o usuário não existir, cria um novo registro
        const { data: newUser, error: insertError } = await supabase
          .from('Usuarios')
          .insert([
            {
              email: user.email,
              nome: user.email, // Usa o e-mail como nome, pois o nome não está disponível no login com e-mail/senha
              dt_inclusao: new Date().toISOString(),
              ultimo_login: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
      } else {
        // 5. Se o usuário já existir, atualiza o último login
        const { error: updateError } = await supabase
          .from('Usuarios')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('email', user.email);

        if (updateError) throw updateError;
      }

      // 6. Redireciona para o DashboardGamer
      navigate('/DashboardGamer');
    } catch (error) {
      setError('Email ou senha incorretos.');
      console.error('Erro:', error.message);
    } finally {
      setLoading(false); // Desabilita o estado de carregamento
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null); // Limpa o erro antes de iniciar o login

    try {
      // 1. Autentica o usuário com o Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/DashboardGamer`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      // 2. Aguarda um pequeno atraso para garantir que a autenticação seja concluída
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Obtém os dados do usuário autenticado
      const { data: { user } } = await supabase.auth.getUser();

      // 4. Verifica se o usuário já existe na tabela Usuarios
      const { data: existingUser, error: userError } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', user.email)
        .maybeSingle(); // Usa maybeSingle() para evitar erros se o usuário não existir

      if (userError) throw userError;

      if (!existingUser) {
        // 5. Se o usuário não existir, cria um novo registro
        const { data: newUser, error: insertError } = await supabase
          .from('Usuarios')
          .insert([
            {
              email: user.email,
              nome: user.user_metadata.full_name || user.email,
              dt_inclusao: new Date().toISOString(),
              ultimo_login: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
      } else {
        // 6. Se o usuário já existir, atualiza o último login
        const { error: updateError } = await supabase
          .from('Usuarios')
          .update({ ultimo_login: new Date().toISOString() })
          .eq('email', user.email);

        if (updateError) throw updateError;
      }

      // 7. Redireciona para o DashboardGamer
      navigate('/DashboardGamer');
    } catch (error) {
      // Exibe a mensagem de erro apenas se o login falhar
      if (error.message !== 'OAuth login cancelled') {
        setError('Erro ao fazer login com Google.');
      }
      console.error('Erro:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Logo>
          🏆 Trophys
          <span>Gerencie sua coleção de jogos</span>
        </Logo>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleLogin}>
          <InputGroup>
            <FaEnvelope />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <FaLock />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <Divider>
          <span>ou continue com</span>
        </Divider>

        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <FaGoogle />
          Entrar com Google
        </GoogleButton>

        <RegisterLink to="/register">
          Não tem uma conta? Cadastre-se
        </RegisterLink>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login; 
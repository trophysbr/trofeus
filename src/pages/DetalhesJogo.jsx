import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardContainer,
  Header,
  WelcomeText,
  LevelInfo,
  Level,
  XP,
} from '../styles/components/DashboardStyles';
import {
  GameDetailsContainer,
  GameHeader,
  GameImage,
  GameInfo,
  GameTitle,
  GameMetadata,
  MetadataItem,
  Label,
  Value,
  GameDescription,
  GameRating,
  RatingValue,
  RatingLabel,
  GameModes,
  ModeTag,
  Section,
  SectionTitle,
  InfoGrid
} from '../styles/components/GameDetailsStyles';
import styled from 'styled-components';
import { supabase } from '../config/supabaseClient';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import Footer from '../components/Footer';

const LoadingContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  gap: '20px'
};

const LoadingSpinner = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AddButton = styled.button`
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background-color: #5f4ed0;
  }
`;

const BackButton = styled.button`
  background-color: transparent;
  color: #6C5CE7;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const FooterContainer = styled.footer`
  text-align: center;
  padding: 10px;
  background-color: #16213e;
`;

const DetalhesJogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(location.state?.isLoading ?? true);
  const [userLevel, setUserLevel] = useState(0);
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          const { data: userData, error: userDataError } = await supabase
            .from('Usuarios')
            .select('level, xp')
            .eq('user_id', user.id)
            .single();

          if (userDataError) throw userDataError;

          if (userData) {
            setUserLevel(userData.level || 0);
            setUserXP(userData.xp || 0);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Adiciona os keyframes ao head do documento
    const styleSheet = document.createElement("style");
    styleSheet.textContent = spinnerKeyframes;
    document.head.appendChild(styleSheet);

    if (!location.state) {
      navigate('/MinhaBiblioteca');
      return;
    }
    
    setIsLoading(location.state.isLoading);
    if (location.state.gameData) {
      setGameData(location.state.gameData);
    }

    // Limpa os keyframes quando o componente é desmontado
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <div style={LoadingContainer}>
        <div style={LoadingSpinner}></div>
        <p>Carregando detalhes do jogo...</p>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div style={LoadingContainer}>
        <p>Nenhum dado encontrado</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const handleAddToLibrary = async () => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user.id;

      // Verificar se o jogo já existe na biblioteca do usuário
      const { data: existingGame, error: checkError } = await supabase
        .from('Jogos')
        .select('jogo_id')
        .eq('id_igdb', gameData.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingGame) {
        toast.error('Este jogo já está na sua biblioteca!');
        return;
      }

      // Se não existir, prosseguir com a inserção
      const { data, error } = await supabase
        .from('Jogos')
        .insert([
          {
            jogo_nome: gameData.name,
            jogo_imagem_url: gameData.cover?.url 
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.cover.url.split('/').pop()}`
              : '',
            jogo_status: 'Na Fila',
            jogo_tempo_jogo: '00:00:00',
            user_id: userId,
            jogo_historia: gameData.storyline || gameData.summary || '',
            jogo_ano_lancamento: gameData.first_release_date 
              ? new Date(gameData.first_release_date * 1000).getFullYear()
              : null,
            jogo_desenvolvedora: gameData.nome_developers || '',
            jogo_modos_jogo: gameData.nome_game_modes || '',
            jogo_plataforma: gameData.nome_plataforms || '',
            jogo_genero: gameData.nome_genres || '',
            jogo_thema: gameData.nome_themes || '',
            jogo_nota_comunidade: gameData.rating ? (gameData.rating / 10).toFixed(1) : null,
            jogo_editora: gameData.nome_publishers || '',
            id_igdb: gameData.id
          }
        ]);

      if (error) throw error;
      
      // Exibir toast e redirecionar após 1 segundo
      toast.success('Jogo adicionado à biblioteca com sucesso!');
      setTimeout(() => {
        navigate('/biblioteca');
      }, 1000); // 1 segundo de delay para o usuário ver a mensagem

    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      toast.error('Erro ao adicionar jogo à biblioteca');
    }
  };

  return (
    <DashboardContainer>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '1rem',
            padding: '16px 24px',
            minWidth: '300px',
          },
          success: {
            style: {
              background: '#4BB543',
            },
          },
          error: {
            style: {
              background: '#ff4444',
            },
          },
        }}
      />
      
      <Header>
        <WelcomeText>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BackButton onClick={() => navigate('/DashboardGamer')}>
              <FaArrowLeft />
              Voltar
            </BackButton>
            <h1>Detalhes do Jogo</h1>
          </div>
          <LevelInfo>
            <Level>Nível {userLevel}</Level>
            <XP>XP: {userXP.toLocaleString()}</XP>
          </LevelInfo>
        </WelcomeText>
      </Header>

      <GameDetailsContainer>
        <GameHeader>
          <div>
            <GameImage 
              src={gameData.cover?.url 
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.cover.url.split('/').pop()}`
                : ''}
              alt={gameData.name}
            />
            <AddButton onClick={handleAddToLibrary}>
              Adicionar na biblioteca
            </AddButton>
          </div>
          <GameInfo>
            <GameTitle>{gameData.name}</GameTitle>
            <GameMetadata>
              <MetadataItem>
                <Label>Data de Lançamento</Label>
                <Value>{formatDate(gameData.first_release_date)}</Value>
              </MetadataItem>
              <MetadataItem>
                <Label>Desenvolvedora</Label>
                <Value>{gameData.nome_developers || 'Não disponível'}</Value>
              </MetadataItem>
              <MetadataItem>
                <Label>Publisher</Label>
                <Value>{gameData.nome_publishers || 'Não disponível'}</Value>
              </MetadataItem>
            </GameMetadata>
            {gameData.rating && (
              <GameRating>
                <RatingValue>
                  ★ {(gameData.rating / 10).toFixed(1)}
                </RatingValue>
                <RatingLabel>Nota da Comunidade</RatingLabel>
              </GameRating>
            )}
          </GameInfo>
        </GameHeader>

        <InfoGrid>
          <Section>
            <SectionTitle>Plataformas</SectionTitle>
            <Value>{gameData.nome_plataforms || 'Não disponível'}</Value>
          </Section>

          <Section>
            <SectionTitle>Gêneros</SectionTitle>
            <Value>{gameData.nome_genres || 'Não disponível'}</Value>
          </Section>

          <Section>
            <SectionTitle>Temas</SectionTitle>
            <Value>{gameData.nome_themes || 'Não disponível'}</Value>
          </Section>

          <Section>
            <SectionTitle>Modos de Jogo</SectionTitle>
            <Value>{gameData.nome_game_modes || 'Não disponível'}</Value>
          </Section>
        </InfoGrid>

        <Section>
          <SectionTitle>História</SectionTitle>
          <GameDescription>
            {gameData.storyline || gameData.summary || 'Descrição não disponível'}
          </GameDescription>
        </Section>
      </GameDetailsContainer>

      <FooterContainer>
        <Footer />
      </FooterContainer>
    </DashboardContainer>
  );
};

export default DetalhesJogo; 
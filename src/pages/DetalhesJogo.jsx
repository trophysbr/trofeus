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

const DetalhesJogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(location.state?.isLoading ?? true);

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
      const { data, error } = await supabase
        .from('Jogos')
        .insert([
          {
            jogo_id: gameData.id,
            jogo_nome: gameData.name,
            jogo_imagem_url: gameData.cover?.url 
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.cover.url.split('/').pop()}`
              : '',
            jogo_status: 'Na Fila',
            jogo_tempo_jogo: '00:00:00',
            user_id: (await supabase.auth.getUser()).data.user.id,
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
      alert('Jogo adicionado à biblioteca com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      alert('Erro ao adicionar jogo à biblioteca');
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <WelcomeText>
          <h1>Detalhes do Jogo</h1>
          <LevelInfo>
            <Level>Nível 42</Level>
            <XP>XP: 12,450</XP>
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
    </DashboardContainer>
  );
};

export default DetalhesJogo; 
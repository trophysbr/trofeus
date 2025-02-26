import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../config/supabaseClient';
import {
  DashboardContainer,
  Header,
  WelcomeText,
  LevelInfo,
  Level,
  XP,
} from '../styles/components/DashboardStyles';
import { toast } from 'react-hot-toast';

const GameContainer = styled.div`
  padding: 2rem;
  color: white;
`;

const GameHeader = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  background: rgba(44, 46, 64, 0.4);
  border-radius: 10px;
  padding: 2rem;
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GameImage = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GameTitle = styled.h2`
  font-size: 2rem;
  margin: 0;
  color: #fff;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const Value = styled.div`
  color: #fff;
  font-size: 1rem;
`;

const Select = styled.select`
  background: #2d2d3d;
  color: white;
  padding: 0.5rem;
  border: 1px solid #3d3d4d;
  border-radius: 4px;
  width: 100%;
  font-size: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  background: #2d2d3d;
  color: white;
  padding: 0.5rem;
  border: 1px solid #3d3d4d;
  border-radius: 4px;
  width: 100%;
  font-size: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &[type="number"] {
    width: 80px;
  }

  &[type="date"] {
    width: 150px;
  }
`;

const Button = styled.button`
  background: #6c5ce7;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #5f4ed0;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #ffd700;
`;

const MeuJogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    status: '',
    plataforma_jogada: '',
    data_inicio: '',
    data_conclusao: '',
    dificuldade: '',
    minha_nota: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!location.state?.gameId) {
      navigate('/biblioteca');
      return;
    }
    fetchGameData(location.state.gameId);
  }, [location.state, navigate]);

  const fetchGameData = async (gameId) => {
    try {
      const { data, error } = await supabase
        .from('Jogos')
        .select('*')
        .eq('jogo_id', gameId)
        .single();

      if (error) throw error;
      setGameData(data);
      setEditedData({
        status: data.jogo_status || '',
        plataforma_jogada: data.jogo_plataforma_jogada || '',
        data_inicio: data.jogo_data_inicio || '',
        data_conclusao: data.jogo_data_fim || '',
        dificuldade: data.jogo_dificuldade || '',
        minha_nota: data.jogo_nota || ''
      });
    } catch (error) {
      console.error('Erro ao buscar dados do jogo:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('Jogos')
        .update({
          jogo_status: editedData.status,
          jogo_plataforma_jogada: editedData.plataforma_jogada,
          jogo_data_inicio: editedData.data_inicio,
          jogo_data_fim: editedData.data_conclusao,
          jogo_dificuldade: editedData.dificuldade,
          jogo_nota: editedData.minha_nota,
          data_alteracao: new Date().toISOString()
        })
        .eq('jogo_id', gameData.jogo_id);

      if (error) throw error;
      setIsEditing(false);
      fetchGameData(gameData.jogo_id);
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast.error('Erro ao salvar alterações. Por favor, tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!gameData) return <div>Carregando...</div>;

  return (
    <DashboardContainer>
      <Header>
        <WelcomeText>
          <h1>Meu Jogo</h1>
          <LevelInfo>
            <Level>Nível 42</Level>
            <XP>XP: 12,450</XP>
          </LevelInfo>
        </WelcomeText>
      </Header>

      <GameContainer>
        <GameHeader>
          <ImageSection>
            <GameImage src={gameData.jogo_imagem_url} alt={gameData.jogo_nome} />
            {!isEditing ? (
              <Button onClick={handleEdit}>Editar</Button>
            ) : (
              <Button onClick={handleSave}>Salvar</Button>
            )}
          </ImageSection>

          <InfoSection>
            <GameTitle>{gameData.jogo_nome}</GameTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Status</Label>
                {isEditing ? (
                  <Select
                    value={editedData.status}
                    onChange={(e) => setEditedData({...editedData, status: e.target.value})}
                  >
                    <option value="Na Fila">Na Fila</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Jogando">Jogando</option>
                    <option value="Suspenso">Suspenso</option>
                  </Select>
                ) : (
                  <Value>{gameData.jogo_status}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Plataforma Jogada</Label>
                {isEditing ? (
                  <Select
                    value={editedData.plataforma_jogada}
                    onChange={(e) => setEditedData({...editedData, plataforma_jogada: e.target.value})}
                  >
                    <option value="Emulador">Emulador</option>
                    <option value="Console Nativo">Console Nativo</option>
                    <option value="Epic">Epic</option>
                    <option value="GamePass">GamePass</option>
                    <option value="Boosteroid">Boosteroid</option>
                    <option value="Pc">Pc</option>
                    <option value="Steam">Steam</option>
                  </Select>
                ) : (
                  <Value>{gameData.jogo_plataforma_jogada || 'Não definida'}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Data de Início</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedData.data_inicio}
                    onChange={(e) => setEditedData({...editedData, data_inicio: e.target.value})}
                  />
                ) : (
                  <Value>{gameData.jogo_data_inicio || 'Não definida'}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Data de Conclusão</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedData.data_conclusao}
                    onChange={(e) => setEditedData({...editedData, data_conclusao: e.target.value})}
                  />
                ) : (
                  <Value>{gameData.jogo_data_fim || 'Não definida'}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Dificuldade</Label>
                {isEditing ? (
                  <Select
                    value={editedData.dificuldade}
                    onChange={(e) => setEditedData({...editedData, dificuldade: e.target.value})}
                  >
                    <option value="Fácil Demais">Fácil Demais</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Média">Média</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Souls-Like">Souls-Like</option>
                    <option value="Extrema">Extrema</option>
                    <option value="Nem tente Jogar">Nem tente Jogar</option>
                  </Select>
                ) : (
                  <Value>{gameData.jogo_dificuldade || 'Não definida'}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Minha Nota</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={editedData.minha_nota}
                    onChange={(e) => setEditedData({...editedData, minha_nota: e.target.value})}
                  />
                ) : (
                  <Rating>★ {gameData.jogo_nota || 'Não avaliado'}</Rating>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Desenvolvedora</Label>
                <Value>{gameData.jogo_desenvolvedora}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Editora</Label>
                <Value>{gameData.jogo_editora}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Ano de Lançamento</Label>
                <Value>{gameData.jogo_ano_lancamento}</Value>
              </InfoItem>

              <InfoItem>
                <Label>Nota da Comunidade</Label>
                <Rating>★ {gameData.jogo_nota_comunidade}</Rating>
              </InfoItem>
            </InfoGrid>
          </InfoSection>
        </GameHeader>

        <InfoGrid>
          <InfoItem>
            <Label>Gêneros</Label>
            <Value>{gameData.jogo_genero}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Temas</Label>
            <Value>{gameData.jogo_thema}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Plataformas</Label>
            <Value>{gameData.jogo_plataforma}</Value>
          </InfoItem>

          <InfoItem>
            <Label>Modos de Jogo</Label>
            <Value>{gameData.jogo_modos_jogo}</Value>
          </InfoItem>
        </InfoGrid>

        <InfoItem style={{ marginTop: '2rem' }}>
          <Label>História</Label>
          <Value>{gameData.jogo_historia}</Value>
        </InfoItem>
      </GameContainer>
    </DashboardContainer>
  );
};

export default MeuJogo; 
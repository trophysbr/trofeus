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
import { FaArrowLeft } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';

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

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const DeleteButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #cc3333;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #2C2E40;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
`;

const ModalTitle = styled.h2`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ModalText = styled.p`
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid #6c5ce7;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(108, 92, 231, 0.1);
  }
`;

const ConfirmButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #cc3333;
  }
`;

const MeuJogo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const [userXP, setUserXP] = useState(0);
  const [editedData, setEditedData] = useState({
    status: '',
    plataforma_jogada: '',
    data_inicio: '',
    data_conclusao: '',
    dificuldade: '',
    minha_nota: '',
    tempo_jogado: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [dataError, setDataError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [notaError, setNotaError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!location.state?.gameId) {
      navigate('/MinhaBiblioteca');
      return;
    }
    fetchGameData(location.state.gameId);
  }, [location.state, navigate]);

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

  const formatarData = (data) => {
    if (!data) return 'Não definida';
    const date = new Date(data);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
        data_inicio: data.jogo_data_inicio ? data.jogo_data_inicio.split('T')[0] : '',
        data_conclusao: data.jogo_data_fim ? data.jogo_data_fim.split('T')[0] : '',
        dificuldade: data.jogo_dificuldade || '',
        minha_nota: data.jogo_nota || '',
        tempo_jogado: data.jogo_tempo_jogo || ''
      });
    } catch (error) {
      console.error('Erro ao buscar dados do jogo:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const validarDatas = (inicio, conclusao) => {
    const hoje = new Date().toISOString().split('T')[0];
    const dataInicio = new Date(inicio);
    const dataConclusao = new Date(conclusao);
    const dataAtual = new Date(hoje);

    if (conclusao && inicio && dataConclusao < dataInicio) {
      return 'A data de conclusão não pode ser anterior à data de início';
    }

    if (conclusao && dataConclusao > dataAtual) {
      return 'A data de conclusão não pode ser maior que a data atual';
    }

    return '';
  };

  const handleSave = async () => {
    if (!editedData.status) {
      setStatusError('O status é obrigatório');
      return;
    } else {
      setStatusError('');
    }

    if (editedData.minha_nota && editedData.minha_nota > 11) {
      setNotaError('A nota não pode ser maior que 11');
      return;
    } else {
      setNotaError('');
    }

    const erro = validarDatas(editedData.data_inicio, editedData.data_conclusao);
    if (erro) {
      setDataError(erro);
      return;
    }

    setIsSaving(true);
    setDataError('');

    try {
      let tempoJogadoFormatado = null;
      if (editedData.tempo_jogado) {
        const [hours, minutes] = editedData.tempo_jogado.split(':');
        tempoJogadoFormatado = `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}:00`;
      }

      // Função para converter strings vazias em null
      const convertEmptyToNull = (value) => (value === '' ? null : value);

      const updateData = {
        jogo_status: convertEmptyToNull(editedData.status),
        jogo_plataforma_jogada: convertEmptyToNull(editedData.plataforma_jogada),
        jogo_data_inicio: convertEmptyToNull(editedData.data_inicio),
        jogo_data_fim: convertEmptyToNull(editedData.data_conclusao),
        jogo_dificuldade: convertEmptyToNull(editedData.dificuldade),
        jogo_nota: convertEmptyToNull(editedData.minha_nota),
        jogo_tempo_jogo: tempoJogadoFormatado,
        data_alteracao: new Date().toISOString()
      };

      const { error } = await supabase
        .from('Jogos')
        .update(updateData)
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

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Verificar se o jogo estava concluído antes de excluir
      const wasCompleted = gameData.jogo_status === 'Concluído';

      // Primeiro, deletar todos os desafios associados ao jogo
      const { error: desafiosError } = await supabase
        .from('Desafios')
        .delete()
        .eq('jogo_id', gameData.jogo_id);

      if (desafiosError) throw desafiosError;

      // Depois, deletar o jogo
      const { error: jogosError } = await supabase
        .from('Jogos')
        .delete()
        .eq('jogo_id', gameData.jogo_id);

      if (jogosError) throw jogosError;

      setShowDeleteModal(false);
      toast.success('Jogo excluído com sucesso!', {
        duration: 2000,
        style: {
          background: '#4BB543',
          color: '#fff',
          fontSize: '1rem'
        }
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/MinhaBiblioteca');
      }, 2000);

    } catch (error) {
      console.error('Erro ao excluir jogo:', error);
      toast.error('Erro ao excluir jogo. Por favor, tente novamente.', {
        duration: 3000,
        style: {
          background: '#ff4444',
          color: '#fff',
          fontSize: '1rem'
        }
      });
    }
  };

  if (!gameData) return <div>Carregando...</div>;

  return (
    <DashboardContainer>
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirmar Exclusão</ModalTitle>
            <ModalText>
              Tem certeza que deseja excluir o jogo "{gameData.jogo_nome}"? Esta ação não pode ser desfeita.
            </ModalText>
            <ModalButtons>
              <CancelButton onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </CancelButton>
              <ConfirmButton onClick={confirmDelete}>
                Confirmar Exclusão
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
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
            <BackButton onClick={() => navigate('/MinhaBiblioteca')}>
              <FaArrowLeft />
              Voltar
            </BackButton>
            <h1>Meu Jogo</h1>
          </div>
          <LevelInfo>
            <Level>Nível {userLevel}</Level>
            <XP>XP: {userXP.toLocaleString()}</XP>
          </LevelInfo>
        </WelcomeText>
      </Header>

      <GameContainer>
        <GameHeader>
          <ImageSection>
            <GameImage src={gameData.jogo_imagem_url} alt={gameData.jogo_nome} />
            <ButtonContainer>
              {!isEditing ? (
                <>
                  <Button onClick={handleEdit}>Editar</Button>
                  <DeleteButton onClick={handleDelete}>Excluir</DeleteButton>
                </>
              ) : (
                <Button onClick={handleSave}>Salvar</Button>
              )}
            </ButtonContainer>
          </ImageSection>

          <InfoSection>
            <GameTitle>{gameData.jogo_nome}</GameTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Status</Label>
                {isEditing ? (
                  <>
                    <Select
                      value={editedData.status || ''}
                      onChange={(e) => {
                        setEditedData({...editedData, status: e.target.value || ''});
                        setStatusError('');
                      }}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="Na Fila">Na Fila</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Jogando">Jogando</option>
                      <option value="Suspenso">Suspenso</option>
                    </Select>
                    {statusError && (
                      <div style={{ color: '#ff4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {statusError}
                      </div>
                    )}
                  </>
                ) : (
                  <Value>{gameData.jogo_status || 'Não definido'}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Plataforma Jogada</Label>
                {isEditing ? (
                  <Select
                    value={editedData.plataforma_jogada || ''}
                    onChange={(e) => setEditedData({...editedData, plataforma_jogada: e.target.value || ''})}
                  >
                    <option value="">Selecione...</option>
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
                  <Value>{formatarData(gameData.jogo_data_inicio)}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Data de Conclusão</Label>
                {isEditing ? (
                  <>
                    <Input
                      type="date"
                      value={editedData.data_conclusao}
                      onChange={(e) => {
                        setEditedData({...editedData, data_conclusao: e.target.value});
                        setDataError('');
                      }}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {dataError && <div style={{ color: '#ff4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{dataError}</div>}
                  </>
                ) : (
                  <Value>{formatarData(gameData.jogo_data_fim)}</Value>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Dificuldade</Label>
                {isEditing ? (
                  <Select
                    value={editedData.dificuldade || ''}
                    onChange={(e) => setEditedData({...editedData, dificuldade: e.target.value || ''})}
                  >
                    <option value="">Selecione...</option>
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
                  <>
                    <Input
                      type="number"
                      min="0"
                      max="11"
                      step="0.1"
                      value={editedData.minha_nota}
                      onChange={(e) => {
                        setEditedData({...editedData, minha_nota: e.target.value});
                        setNotaError('');
                      }}
                    />
                    {notaError && (
                      <div style={{ color: '#ff4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {notaError}
                      </div>
                    )}
                  </>
                ) : (
                  <Rating>★ {gameData.jogo_nota || 'Não avaliado'}</Rating>
                )}
              </InfoItem>

              <InfoItem>
                <Label>Tempo Jogado</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    placeholder="HHH:MM"
                    value={editedData.tempo_jogado || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Remove caracteres não numéricos
                      const numericValue = value.replace(/\D/g, '');
                      // Separa horas e minutos
                      let hours = '';
                      let minutes = '';
                      if (numericValue.length <= 2) {
                        hours = numericValue;
                      } else {
                        hours = numericValue.slice(0, -2);
                        minutes = numericValue.slice(-2);
                      }
                      // Limita minutos a 2 dígitos
                      minutes = minutes.slice(0, 2);
                      // Formata para HHH:MM
                      const formattedValue = minutes ? `${hours}:${minutes}` : hours;
                      setEditedData({...editedData, tempo_jogado: formattedValue});
                    }}
                    autoComplete="off"
                  />
                ) : (
                  <Value>
                    {gameData.jogo_tempo_jogo 
                      ? gameData.jogo_tempo_jogo.replace(/:00$/, '') // Remove os segundos
                      : 'Não informado'}
                  </Value>
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

      <FooterContainer>
        <Footer />
      </FooterContainer>
    </DashboardContainer>
  );
};

export default MeuJogo; 
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaCalendar } from 'react-icons/fa';
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
  ErrorMessage,
} from '../styles/components/FormStyles';
import JogoSearch from '../components/JogoSearch';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #111827;
  color: white;
  padding: 2rem;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #f3f4f6;
  text-align: center;
`;

const FormSection = styled.div`
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  .space-y-6 > * {
    margin-bottom: 2rem;
  }

  .grid {
    margin-bottom: 2rem;
  }

  /* Aumentar espaçamento entre os campos dentro do grid */
  .grid.grid-cols-1.md\\:grid-cols-2 {
    display: grid;
    gap: 2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const DeleteButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }
`;

const SaveButton = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }
`;

const BackButtonContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
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
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  color: #f3f4f6;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: #d1d5db;
  margin-bottom: 2rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${props => props.confirm ? `
    background-color: #dc2626;
    color: white;
    &:hover {
      background-color: #b91c1c;
    }
  ` : `
    background-color: #374151;
    color: white;
    &:hover {
      background-color: #4b5563;
    }
  `}
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #2d2d3d;
  border-radius: 4px;
  background-color: #1a1a2e;
  color: white;
  font-size: 1rem;
  resize: vertical;
  line-height: 1.5;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  &::-webkit-scrollbar-thumb {
    background: #2d2d3d;
    border-radius: 4px;
  }
`;

const DatePickerContainer = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    background-color: #1a1a2e;
    border-color: #2d2d3d;
    font-family: inherit;
  }

  .react-datepicker__header {
    background-color: #2d2d3d;
    border-bottom: 1px solid #3d3d4d;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: white;
  }

  .react-datepicker__day:hover {
    background-color: #4f46e5;
  }

  .react-datepicker__day--selected {
    background-color: #6366f1;
  }

  .react-datepicker__time-container {
    border-left-color: #2d2d3d;
  }

  .react-datepicker__time-box {
    background-color: #1a1a2e;
  }

  .react-datepicker__time-list-item {
    color: white;
  }

  .react-datepicker__time-list-item:hover {
    background-color: #4f46e5 !important;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #6366f1 !important;
  }
`;

const DatePickerInput = styled.div`
  position: relative;
  width: 100%;

  input {
    width: 100%;
    padding: 10px;
    padding-right: 35px;
    border: 1px solid #2d2d3d;
    border-radius: 4px;
    background-color: #1a1a2e;
    color: white;
    font-size: 1rem;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #6366f1;
    }
  }

  svg {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
    pointer-events: none;
  }
`;

const CadastroDesafio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingDesafio = location.state?.desafio;
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [formData, setFormData] = useState({
    desafio_id: '',
    jogo_id: '',
    desafio_nome: '',
    desafio_descricao: '',
    desafio_dificuldade: '',
    desafio_conclusao: '',
    desafio_recompensa: '',
    desafio_percentual: 0,
    desafio_status: '',
    desafio_inicio: null,
    desafio_fim: null
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('Jogos')
        .select('jogo_id, jogo_nome')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar jogos:', error);
      } else {
        setGames(data);
        
        if (editingDesafio) {
          const selectedGame = data.find(game => game.jogo_id === editingDesafio.jogo_id);
          setSelectedGame(selectedGame);
        }
      }
    };
    fetchGames();
  }, [editingDesafio]);

  useEffect(() => {
    if (editingDesafio) {
      setIsEditing(true);
      const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return null;
          
          // Ajustar para o fuso horário de São Paulo (UTC-3)
          const offset = -3;
          const spDate = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours() + offset, // Adicionar offset para exibir no horário local
            date.getUTCMinutes(),
            date.getUTCSeconds()
          );
          
          return spDate;
        } catch (error) {
          console.error('Error parsing date:', error);
          return null;
        }
      };

      setFormData({
        desafio_id: editingDesafio.desafio_id,
        jogo_id: editingDesafio.jogo_id,
        desafio_nome: editingDesafio.desafio_nome,
        desafio_descricao: editingDesafio.desafio_descricao || '',
        desafio_dificuldade: editingDesafio.desafio_dificuldade || '',
        desafio_conclusao: editingDesafio.desafio_conclusao || '',
        desafio_recompensa: editingDesafio.desafio_recompensa || '',
        desafio_percentual: editingDesafio.desafio_percentual || 0,
        desafio_status: editingDesafio.desafio_status || '',
        desafio_inicio: formatDate(editingDesafio.desafio_inicio),
        desafio_fim: formatDate(editingDesafio.desafio_fim)
      });
    } else {
      setIsEditing(false);
      setFormData({
        desafio_id: '',
        jogo_id: '',
        desafio_nome: '',
        desafio_descricao: '',
        desafio_dificuldade: '',
        desafio_conclusao: '',
        desafio_recompensa: '',
        desafio_percentual: 0,
        desafio_status: '',
        desafio_inicio: null,
        desafio_fim: null
      });
    }
  }, [editingDesafio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setFormData(prev => ({ ...prev, jogo_id: game.jogo_id }));
  };

  const handleDateChange = (date, field) => {
    if (!date) {
      setFormData(prev => ({ ...prev, [field]: null }));
      return;
    }

    try {
      const localDate = new Date(date);
      if (isNaN(localDate.getTime())) {
        console.error('Invalid date:', date);
        return;
      }
      setFormData(prev => ({
        ...prev,
        [field]: localDate
      }));
    } catch (error) {
      console.error('Error handling date:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Se o desafio estava concluído, remover XP
      if (editingDesafio.desafio_status === 'Concluído') {
        const { data, error: xpError } = await supabase
          .rpc('update_user_xp', {
            user_id_param: user.id,
            xp_gain_param: -5
          });

        if (xpError) {
          console.error('Erro ao atualizar XP:', xpError);
          toast.warning('Desafio excluído, mas houve um erro ao atualizar o XP');
        }
      }

      const { error } = await supabase
        .from('Desafios')
        .delete()
        .eq('desafio_id', editingDesafio.desafio_id);

      if (error) {
        toast.error('Erro ao excluir desafio.');
        throw error;
      }

      toast.success('Desafio excluído com sucesso!');
      navigate('/MeusDesafios');
    } catch (error) {
      console.error('Erro ao excluir desafio:', error);
    }
    setShowDeleteModal(false);
  };

  const formatDateForSubmit = (date) => {
    if (!date) return null;
    try {
      const localDate = new Date(date);
      if (isNaN(localDate.getTime())) return null;

      // Ajustar para UTC-3 de forma simples
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      const seconds = String(localDate.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`;
    } catch (error) {
      console.error('Error formatting date for submit:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.jogo_id || !formData.desafio_nome) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const dataToSubmit = {
      jogo_id: formData.jogo_id,
      desafio_nome: formData.desafio_nome,
      desafio_descricao: formData.desafio_descricao || null,
      desafio_dificuldade: formData.desafio_dificuldade || null,
      desafio_recompensa: formData.desafio_recompensa || null,
      desafio_conclusao: formData.desafio_conclusao || null,
      desafio_percentual: formData.desafio_percentual || 0,
      desafio_status: formData.desafio_status || null,
      desafio_inicio: formatDateForSubmit(formData.desafio_inicio),
      desafio_fim: formatDateForSubmit(formData.desafio_fim)
    };

    try {
      let response;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (editingDesafio) {
        response = await supabase
          .from('Desafios')
          .update(dataToSubmit)
          .eq('desafio_id', editingDesafio.desafio_id);
          
        if (response.error) throw response.error;

        // Verificar se o status mudou para Concluído
        if (formData.desafio_status === 'Concluído' && editingDesafio.desafio_status !== 'Concluído') {
          // Chamar a função para adicionar XP
          const { data, error: xpError } = await supabase
            .rpc('update_user_xp', {
              user_id_param: user.id,
              xp_gain_param: 5
            });

          if (xpError) {
            console.error('Erro ao atualizar XP:', xpError);
            toast.warning('Desafio salvo, mas houve um erro ao atualizar o XP');
          }
        }
        
        await toast.promise(
          Promise.resolve(),
          {
            success: 'Desafio atualizado com sucesso!',
            pending: 'Salvando alterações...',
            error: 'Erro ao atualizar desafio'
          }
        );
      } else {
        response = await supabase
          .from('Desafios')
          .insert([dataToSubmit]);
          
        if (response.error) throw response.error;

        // Se o novo desafio já está como Concluído
        if (formData.desafio_status === 'Concluído') {
          // Chamar a função para adicionar XP
          const { data, error: xpError } = await supabase
            .rpc('update_user_xp', {
              userid: user.id,
              xp_value: 5
            });

          if (xpError) {
            console.error('Erro ao atualizar XP:', xpError);
            toast.warning('Desafio salvo, mas houve um erro ao atualizar o XP');
          }
        }
        
        await toast.promise(
          Promise.resolve(),
          {
            success: 'Desafio criado com sucesso!',
            pending: 'Salvando desafio...',
            error: 'Erro ao criar desafio'
          }
        );
      }

      setTimeout(() => {
        navigate('/MeusDesafios');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar desafio:', error);
      const errorMessage = `Erro ao ${editingDesafio ? 'atualizar' : 'cadastrar'} desafio.`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <PageContainer>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButtonContainer>
            <BackButton onClick={() => navigate('/MeusDesafios')}>
              <FaArrowLeft /> Voltar
            </BackButton>
          </BackButtonContainer>

          <Title>{editingDesafio ? 'Editar Desafio' : 'Cadastro de Desafio'}</Title>
          
          <FormSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormGroup>
                <Label>Jogo</Label>
                <JogoSearch 
                  games={games} 
                  onSelect={handleSelectGame} 
                  initialGame={selectedGame}
                />
              </FormGroup>

              <div className="space-y-6">
                <FormGroup>
                  <Label>Nome do Desafio</Label>
                  <Input
                    type="text"
                    name="desafio_nome"
                    value={formData.desafio_nome}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Descrição</Label>
                  <Input
                    type="text"
                    name="desafio_descricao"
                    value={formData.desafio_descricao}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Dificuldade</Label>
                  <Select
                    name="desafio_dificuldade"
                    value={formData.desafio_dificuldade}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Expert">Expert</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Recompensa</Label>
                  <Select
                    name="desafio_recompensa"
                    value={formData.desafio_recompensa}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Reconhecimento pessoal">Reconhecimento pessoal</option>
                    <option value="Glória eterna">Glória eterna</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Como Concluir</Label>
                  <TextArea
                    name="desafio_conclusao"
                    value={formData.desafio_conclusao}
                    onChange={handleChange}
                    placeholder="Descreva os passos necessários para concluir o desafio..."
                  />
                </FormGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup>
                    <Label>Progresso (%)</Label>
                    <Input
                      type="number"
                      name="desafio_percentual"
                      value={formData.desafio_percentual}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Status</Label>
                    <Select
                      name="desafio_status"
                      value={formData.desafio_status}
                      onChange={handleChange}
                    >
                      <option value="">Selecione...</option>
                      <option value="Não Iniciado">Não Iniciado</option>
                      <option value="Em Progresso">Em Progresso</option>
                      <option value="Concluído">Concluído</option>
                    </Select>
                  </FormGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup>
                    <Label>Data de Início</Label>
                    <DatePickerContainer>
                      <DatePickerInput>
                        <DatePicker
                          selected={formData.desafio_inicio}
                          onChange={(date) => handleDateChange(date, 'desafio_inicio')}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          placeholderText="Selecione a data e hora"
                          customInput={
                            <input />
                          }
                        />
                        <FaCalendar />
                      </DatePickerInput>
                    </DatePickerContainer>
                  </FormGroup>

                  <FormGroup>
                    <Label>Data de Fim</Label>
                    <DatePickerContainer>
                      <DatePickerInput>
                        <DatePicker
                          selected={formData.desafio_fim}
                          onChange={(date) => handleDateChange(date, 'desafio_fim')}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="dd/MM/yyyy HH:mm"
                          placeholderText="Selecione a data e hora"
                          customInput={
                            <input />
                          }
                        />
                        <FaCalendar />
                      </DatePickerInput>
                    </DatePickerContainer>
                  </FormGroup>
                </div>
              </div>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <ButtonContainer>
                <SaveButton type="submit">
                  Salvar
                </SaveButton>
                
                {editingDesafio && (
                  <DeleteButton 
                    type="button" 
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Excluir
                  </DeleteButton>
                )}
              </ButtonContainer>
            </form>
          </FormSection>
        </motion.div>
      </ContentContainer>

      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirmar Exclusão</ModalTitle>
            <ModalText>
              Tem certeza que deseja excluir o desafio "{editingDesafio.desafio_nome}"? 
              Esta ação não pode ser desfeita.
            </ModalText>
            <ModalButtons>
              <ModalButton onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </ModalButton>
              <ModalButton confirm onClick={handleDelete}>
                Confirmar Exclusão
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default CadastroDesafio;

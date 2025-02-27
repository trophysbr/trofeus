import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import styled from 'styled-components';
import { supabase } from '../config/supabaseClient'; // Certifique-se de que o caminho está correto
import { FaCalendarAlt, FaTrophy, FaRegCalendarCheck } from 'react-icons/fa'; // Importar ícones
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0f0f1a;
  color: white;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #2d2d3d;
  background-color: #1a1a2e;
  color: white;
  margin-right: 10px;
  width: 300px;
`;

const Button = styled.button`
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5f4ed0;
  }
`;

const Dropdown = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #2d2d3d;
  background-color: #1a1a2e;
  color: white;
  margin-right: 10px;
`;

const ChallengesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ChallengeCard = styled.div`
  background: rgba(45, 45, 61, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex: 1 1 calc(45% - 20px);
  min-width: 320px;
  max-width: 550px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 0;
`;

const Tag = styled.span`
  display: inline-block;
  background-color: ${({ color }) => color || '#6c5ce7'};
  color: white;
  padding: 3px 8px; /* Reduzir o padding dos alertas de status */
  border-radius: 5px;
  font-size: 0.8rem;
  margin-right: 10px;
  margin-bottom: 15px;
  white-space: nowrap; /* Evitar quebra de linha */
`;

const LargeTag = styled(Tag)`
  font-size: 1.1rem; /* Aumentar a fonte do percentual e da dificuldade */
`;

const Paragraph = styled.p`
  font-size: 1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  margin-right: 5px;
`;

const FooterContainer = styled.footer`
  text-align: center;
  padding: 10px;
  background-color: #16213e;
`;

const MeusDesafios = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [desafios, setDesafios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesafios = async () => {
      try {
        // Obter o usuário logado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;

        if (!user) {
          navigate('/login');
          return;
        }

        // Buscar desafios do usuário logado
        const { data, error } = await supabase
          .from('Desafios')
          .select(`
            *,
            Jogos!inner (
              user_id,
              jogo_nome
            )
          `)
          .eq('Jogos.user_id', user.id)
          .order('desafio_inicio', { ascending: false });

        if (error) throw error;

        setDesafios(data || []);
      } catch (error) {
        console.error('Erro ao buscar desafios:', error);
      }
    };

    fetchDesafios();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Não Iniciado':
        return '#7f8c8d'; // Cinza
      case 'Em Progresso':
        return '#f39c12'; // Amarelo
      case 'Concluído':
        return '#2ecc71'; // Verde
      default:
        return '#6c5ce7'; // Padrão
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Expert':
        return '#c0392b'; // Vermelho escuro
      case 'Dificil':
        return '#e74c3c'; // Vermelho claro
      default:
        return '#6c5ce7'; // Padrão
    }
  };

  const filteredDesafios = desafios.filter((desafio) => {
    const matchesStatus = status ? desafio.desafio_status === status : true;
    const matchesDifficulty = difficulty ? desafio.desafio_dificuldade === difficulty : true;
    const matchesSearch = search ? desafio.desafio_nome.toLowerCase().includes(search.toLowerCase()) : true;
    return matchesStatus && matchesDifficulty && matchesSearch;
  });

  return (
    <Container>
      <Content>
        <SearchContainer>
          <FiltersContainer>
            <Input
              type="text"
              placeholder="Buscar desafios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Dropdown value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="Não Iniciado">Não Iniciado</option>
              <option value="Em Progresso">Em Progresso</option>
              <option value="Concluído">Concluído</option>
            </Dropdown>
            <Dropdown value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Dificuldades</option>
              <option value="Reconhecimento pessoal">Reconhecimento pessoal</option>
              <option value="Glória eterna">Glória eterna</option>
            </Dropdown>
          </FiltersContainer>
          <Button onClick={() => navigate('/CadastroDesafio')}>Novo Desafio</Button>
        </SearchContainer>

        <ChallengesContainer>
          {filteredDesafios.map((desafio) => (
            <ChallengeCard 
              key={desafio.id} 
              onClick={() => navigate('/CadastroDesafio', { state: { desafio } })}
            >
              <TitleContainer>
                <Title>{desafio.Jogos.jogo_nome}</Title>
                <Tag color={getStatusColor(desafio.desafio_status)}>
                  {desafio.desafio_status}
                </Tag>
              </TitleContainer>
              <Paragraph>{desafio.desafio_nome}</Paragraph>
              <LargeTag color="#4b0082">{desafio.desafio_percentual}%</LargeTag>
              <LargeTag color={getDifficultyColor(desafio.desafio_dificuldade)}>
                {desafio.desafio_dificuldade}
              </LargeTag>
              <Paragraph>
                <Icon><FaCalendarAlt /></Icon>
                Início: {desafio.desafio_inicio}
              </Paragraph>
              <Paragraph>
                <Icon><FaRegCalendarCheck /></Icon>
                Conclusão: {desafio.desafio_fim}
              </Paragraph>
              <Paragraph>
                <Icon><FaTrophy /></Icon>
                Recompensa: {desafio.desafio_recompensa}
              </Paragraph>
            </ChallengeCard>
          ))}
        </ChallengesContainer>
      </Content>
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </Container>
  );
};

export default MeusDesafios; 
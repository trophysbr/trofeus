import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import {
  DashboardContainer,
  Header,
  WelcomeText,
  LevelInfo,
  Level,
  XP,
} from '../styles/components/DashboardStyles';
import {
  LibraryContainer,
  FilterSection,
  FilterButton,
  GamesGrid,
  GameCard,
  GameImage,
  GameInfo,
  GameTitle,
  GameStatus,
  StatusBadge,
  SortSelect,
  FilterGroup,
  FilterControls,
  Button
} from '../styles/components/LibraryStyles';
import { useNavigate } from 'react-router-dom';
import BibliotecaSearch from '../components/BibliotecaSearch';
import styled from 'styled-components';

const SearchWrapper = styled.div`
  width: 500px;
  margin-right: 1rem;
`;

const MinhaBiblioteca = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('nome');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('Jogos')
        .select('*')
        .order('jogo_nome', { ascending: true });

      if (error) throw error;

      const mappedGames = data.map(game => ({
        id: game.jogo_id,
        title: game.jogo_nome,
        image: game.jogo_imagem_url,
        status: game.jogo_status,
        playtime: game.jogo_tempo_jogo,
        lastPlayed: game.data_alteracao
      }));

      setGames(mappedGames);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesFilter = filter === 'todos' || game.status.toLowerCase() === filter;
    const matchesSearch = searchTerm.length < 3 || 
      game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortGames = (games) => {
    switch (sortBy) {
      case 'nome':
        return [...games].sort((a, b) => 
          (a.title || '').localeCompare(b.title || '')
        );
      case 'recentes':
        return [...games].sort((a, b) => {
          // Se não houver data, coloca no final
          if (!a.lastPlayed) return 1;
          if (!b.lastPlayed) return -1;
          return new Date(b.lastPlayed) - new Date(a.lastPlayed);
        });
      case 'tempo':
        return [...games].sort((a, b) => {
          // Se não houver tempo de jogo, coloca no final
          if (!a.playtime) return 1;
          if (!b.playtime) return -1;
          return parseFloat(b.playtime) - parseFloat(a.playtime);
        });
      default:
        return games;
    }
  };

  const sortedAndFilteredGames = sortGames(filteredGames);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'concluído':
        return '#4CAF50';
      case 'jogando':
        return '#6c5ce7';
      case 'pausado':
        return '#FFA500';
      case 'na fila':
        return '#808080';
      default:
        return '#808080';
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const convertTimeToHours = (timeString) => {
    if (!timeString) return null;
    
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const totalHours = hours + minutes/60 + seconds/3600;
    return Math.round(totalHours);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <WelcomeText>
          <h1>Minha Biblioteca</h1>
          <LevelInfo>
            <Level>Nível 42</Level>
            <XP>XP: 12,450</XP>
          </LevelInfo>
        </WelcomeText>
      </Header>
      
      <LibraryContainer>
        <FilterSection>
          <FilterGroup>
            <FilterControls>
              <SearchWrapper>
                <BibliotecaSearch onSearch={handleSearch} />
              </SearchWrapper>
              <SortSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="todos">Status: Todos</option>
                <option value="jogando">Jogando</option>
                <option value="concluído">Concluídos</option>
                <option value="pausado">Pausados</option>
                <option value="na fila">Na Fila</option>
              </SortSelect>
              <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="nome">Ordenar por: Nome</option>
                <option value="recentes">Mais Recentes</option>
                <option value="tempo">Tempo de Jogo</option>
              </SortSelect>
            </FilterControls>
          </FilterGroup>
        </FilterSection>

        <GamesGrid>
          {sortedAndFilteredGames.map(game => (
            <GameCard key={game.id} onClick={() => navigate('/meu-jogo', { state: { gameId: game.id } })}>
              <GameImage src={game.image} alt={game.title} />
              <GameInfo>
                <GameTitle>{game.title}</GameTitle>
                <GameStatus>
                  <StatusBadge color={getStatusColor(game.status)}>
                    {game.status}
                  </StatusBadge>
                  {game.playtime && game.status.toLowerCase() !== 'na fila' && (
                    <span>{convertTimeToHours(game.playtime)}h jogadas</span>
                  )}
                </GameStatus>
              </GameInfo>
            </GameCard>
          ))}
        </GamesGrid>
      </LibraryContainer>
    </DashboardContainer>
  );
};

export default MinhaBiblioteca; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { supabase } from '../config/supabaseClient';
import { IGDB } from '../config/constants';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #2d3436;
  background-color: #1e1e2e;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1e1e2e;
  border: 1px solid #2d3436;
  border-radius: 8px;
  margin-top: 0.5rem;
  padding: 0.5rem;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const ResultItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 4px;

  &:hover {
    background-color: #2d2d44;
  }
`;

const GameImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const GameTitle = styled.span`
  color: white;
`;

const SearchAutoComplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      console.log('Buscando:', value);
      const searchUrl = IGDB.BASE_URL;
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IGDB.AUTH_TOKEN}`
        },
        body: JSON.stringify({
          search: value
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
    }
  };

  const handleSelectGame = async (gameId) => {
    try {
      // Limpar o estado imediatamente
      setSearchTerm('');
      setResults([]);

      // Primeiro navega com loading true
      navigate('/jogo', { 
        state: { 
          gameData: null,
          isLoading: true 
        } 
      });

      console.log('Selecionando jogo:', gameId);
      console.log('URL do fetch:', IGDB.BASE_URL);
      
      const response = await fetch(IGDB.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IGDB.AUTH_TOKEN}`
        },
        body: JSON.stringify({
          id: gameId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (!data || data.length === 0) {
        throw new Error('Nenhum dado recebido do jogo');
      }

      const gameData = data[0];
      
      // Ajustar a URL da imagem se existir
      if (gameData.cover && gameData.cover.url) {
        gameData.cover.url = gameData.cover.url.replace('//images.igdb.com', 'https://images.igdb.com');
      }
      
      console.log('Dados do jogo:', gameData);

      // Navegar para a página de detalhes com os dados e loading false
      navigate('/jogo', { 
        state: { 
          gameData: gameData,
          isLoading: false 
        },
        replace: true 
      });

    } catch (error) {
      console.error('Erro ao buscar detalhes do jogo:', error);
      alert('Erro ao carregar detalhes do jogo. Por favor, tente novamente.');
      // Em caso de erro, navega com loading false
      navigate('/jogo', { 
        state: { 
          gameData: null,
          isLoading: false 
        } 
      });
    }
  };

  const formatReleaseYear = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp * 1000).getFullYear();
  };

  return (
    <SearchContainer>
      <Input
        type="text"
        placeholder="Buscar jogos..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {results.length > 0 && (
        <ResultsList>
          {results.map((game) => (
            <ResultItem key={game.id} onClick={() => handleSelectGame(game.id)}>
              {game.cover && (
                <GameImage
                  src={game.cover.url.replace('//images.igdb.com', 'https://images.igdb.com')}
                  alt={game.name}
                />
              )}
              <GameTitle>
                {game.name} {game.first_release_date && `(${formatReleaseYear(game.first_release_date)})`}
              </GameTitle>
            </ResultItem>
          ))}
        </ResultsList>
      )}
    </SearchContainer>
  );
};

export default SearchAutoComplete; 
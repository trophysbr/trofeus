import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../config/supabaseClient';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #2d2d3d;
  border-radius: 4px;
  background-color: #1a1a2e;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1a1a2e;
  border: 1px solid #2d2d3d;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;

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

const GameItem = styled.div`
  padding: 10px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background-color: #2d2d3d;
  }
`;

const GameImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const GameImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #2d2d3d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #9ca3af;
`;

const GameName = styled.span`
  flex: 1;
`;

const NoResults = styled.div`
  padding: 10px;
  color: #9ca3af;
  text-align: center;
`;

const JogoSearch = ({ onSelect, initialGame }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data, error } = await supabase
          .from('Jogos')
          .select('jogo_id, jogo_nome, jogo_imagem_url')
          .eq('user_id', user.id)
          .order('jogo_nome');

        if (error) throw error;
        
        setGames(data || []);
        setFilteredGames(data || []);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    if (initialGame) {
      setSearchTerm(initialGame.jogo_nome);
    }
  }, [initialGame]);

  useEffect(() => {
    const filtered = games.filter(game =>
      game.jogo_nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchTerm, games]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (game) => {
    setSearchTerm(game.jogo_nome);
    setShowResults(false);
    onSelect(game);
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <SearchContainer ref={containerRef}>
      <SearchInput
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowResults(true)}
        placeholder="Buscar jogo..."
      />
      {showResults && (
        <ResultsContainer>
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <GameItem
                key={game.jogo_id}
                onClick={() => handleSelect(game)}
              >
                {game.jogo_imagem_url ? (
                  <>
                    <GameImage 
                      src={game.jogo_imagem_url} 
                      alt={game.jogo_nome}
                      onError={handleImageError}
                    />
                    <GameImagePlaceholder style={{ display: 'none' }}>
                      Sem Imagem
                    </GameImagePlaceholder>
                  </>
                ) : (
                  <GameImagePlaceholder>
                    Sem Imagem
                  </GameImagePlaceholder>
                )}
                <GameName>{game.jogo_nome}</GameName>
              </GameItem>
            ))
          ) : (
            <NoResults>Nenhum jogo encontrado</NoResults>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default JogoSearch; 
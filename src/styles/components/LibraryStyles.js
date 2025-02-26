import styled from 'styled-components';

export const LibraryContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
`;

export const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const FilterControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #2d3436;
  background-color: #1e1e2e;
  color: white;
  font-size: 1rem;
  width: 300px;
  
  &::placeholder {
    color: #a0a0a0;
  }
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

export const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #2d3436;
  background-color: #1e1e2e;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 180px;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
  
  option {
    background-color: #1e1e2e;
    color: white;
    padding: 0.5rem;
  }
`;

export const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? '#6c5ce7' : '#2d3436'};
  background-color: ${props => props.active ? '#6c5ce7' : 'transparent'};
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#5849c2' : '#2d3436'};
  }
`;

export const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

export const GameCard = styled.div`
  background-color: #1e1e2e;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

export const GameImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

export const GameInfo = styled.div`
  padding: 1rem;
`;

export const GameTitle = styled.h3`
  color: white;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const GameStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #a0a0a0;
`;

export const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.color};
  color: white;
  font-size: 0.8rem;
`;

export const Button = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  background-color: #6c5ce7;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5849c2;
  }
  
  &:disabled {
    background-color: #4a4a6a;
    cursor: not-allowed;
  }
`; 
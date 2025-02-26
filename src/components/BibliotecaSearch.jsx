import { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
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

const BibliotecaSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <SearchContainer>
      <Input
        type="text"
        placeholder="Buscar na biblioteca..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </SearchContainer>
  );
};

export default BibliotecaSearch; 
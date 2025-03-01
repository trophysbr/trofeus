import styled from 'styled-components';

export const BibliotecaContainer = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 60px);
`;

export const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  justify-items: center;
`;

export const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`; 
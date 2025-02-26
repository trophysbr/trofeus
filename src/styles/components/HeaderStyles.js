import styled from 'styled-components';

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #0f0f1a;
  border-bottom: 1px solid #2d2d3d;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

export const NavIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

export const UserIcon = styled(IconButton)`
  color: white;
`; 
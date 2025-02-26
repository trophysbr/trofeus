import React from 'react';
import { FaHome, FaTrophy, FaStar, FaUser, FaBell, FaSignOutAlt } from 'react-icons/fa';
import styled from 'styled-components';
import SearchAutocomplete from './SearchAutocomplete';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #0f0f1a;
  border-bottom: 1px solid #2d2d3d;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  min-width: 200px;
`;

const NavIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const IconButton = styled.button`
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

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 320px;
`;

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/DashboardGamer');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <HeaderContainer>
      <Logo>🏆 Trophys</Logo>
      <NavIcons>
        <SearchContainer>
          <SearchAutocomplete />
        </SearchContainer>
        <IconButton><FaHome onClick={handleHomeClick} style={{ cursor: 'pointer' }} /></IconButton>
        <IconButton><FaTrophy /></IconButton>
        <IconButton><FaStar /></IconButton>
        <IconButton><FaBell /></IconButton>
        <IconButton><FaUser /></IconButton>
        <IconButton><FaSignOutAlt onClick={handleLogout} style={{ cursor: 'pointer' }} /></IconButton>
      </NavIcons>
    </HeaderContainer>
  );
};

export default Header; 
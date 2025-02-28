import React, { useState, useEffect } from 'react';
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

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ProfileIcon = styled(FaUser)`
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c5ce7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          const { data: userData, error: profileError } = await supabase
            .from('Usuarios')
            .select('foto_perfil')
            .eq('user_id', user.id)
            .single();

          if (profileError) throw profileError;

          if (userData?.foto_perfil) {
            setProfileImage(userData.foto_perfil);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar foto do perfil:', error);
      }
    };

    fetchProfileImage();
  }, []);

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

  const handleRedirect = () => {
    navigate('/MeusDesafios');
  };

  const handleProfileClick = () => {
    navigate('/editar-perfil');
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
        <IconButton><FaStar onClick={handleRedirect} style={{ cursor: 'pointer' }} /></IconButton>
        <IconButton><FaBell /></IconButton>
        {profileImage ? (
          <ProfileImage 
            src={profileImage} 
            alt="Foto de perfil" 
            onClick={handleProfileClick}
            onError={(e) => {
              e.target.onerror = null;
              setProfileImage(null);
            }}
          />
        ) : (
          <ProfileIcon onClick={handleProfileClick} />
        )}
        <IconButton><FaSignOutAlt onClick={handleLogout} style={{ cursor: 'pointer' }} /></IconButton>
      </NavIcons>
    </HeaderContainer>
  );
};

export default Header; 
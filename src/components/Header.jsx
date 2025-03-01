import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import { FaBars, FaTimes, FaHome, FaGamepad, FaTasks, FaBookmark, FaUser, FaSignOutAlt, FaCamera, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import SearchAutoComplete from './SearchAutocomplete';

const HeaderContainer = styled.header`
  background-color: #1a1a2e;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 997;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #ffd700;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
  position: relative;

  .search-autocomplete {
    width: 100%;
    
    input {
      width: 100%;
      padding: 10px 40px 10px 15px;
      border-radius: 20px;
      border: none;
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        background-color: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .suggestions-container {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #1a1a2e;
      border-radius: 8px;
      margin-top: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
    }

    .suggestion-item {
      padding: 10px 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;

      &:hover {
        background-color: rgba(108, 92, 231, 0.1);
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  z-index: 1000;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;

  &:hover {
    color: #6c5ce7;
    background-color: rgba(108, 92, 231, 0.1);
  }
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const SideMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100%;
  background-color: #1a1a2e;
  padding: 80px 20px 20px;
  transition: right 0.3s ease;
  z-index: 999;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(108, 92, 231, 0.1);
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #6c5ce7;
`;

const ChangePhotoButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #6c5ce7;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  text-align: center;
  color: white;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #6c5ce7;
  }

  p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #888;
  }
`;

const MenuSection = styled.div`
  margin-bottom: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #6c5ce7;
    transform: translateX(-5px);
  }

  svg {
    margin-right: 15px;
    font-size: 20px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 20px 0;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState(null);

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMxYTFhMmUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjUwIiByPSIzMCIgZmlsbD0iIzZjNWNlNyIvPjxwYXRoIGQ9Ik0yNSAxMjBDMjUgOTEuNzE2IDQ3LjcxNiA2OSA3NiA2OUMxMDQuMjg0IDY5IDEyNyA5MS43MTYgMTI3IDEyMFYxNTBIMjVWMTIwWiIgZmlsbD0iIzZjNWNlNyIvPjwvc3ZnPg==';

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        if (!user?.id) return;

        const { data, error } = await supabase
          .from('Usuarios')
          .select('nome, level, foto_perfil')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (isMounted && data) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload da imagem para o storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('FotoPerfil')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('FotoPerfil')
        .getPublicUrl(filePath);

      // Atualizar o perfil do usuário com a nova URL da foto
      const { error: updateError } = await supabase
        .from('Usuarios')
        .update({ foto_perfil: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Atualizar o estado local
      setUserData(prev => ({
        ...prev,
        foto_perfil: publicUrl
      }));
      
      toast.success('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      toast.error('Erro ao atualizar foto de perfil');
    }
  };

  return (
    <>
      <HeaderContainer>
        <Logo onClick={() => navigate('/DashboardGamer')}>
          <FaTrophy size={24} />
          Trophys
        </Logo>
        
        <SearchWrapper>
          <SearchAutoComplete />
        </SearchWrapper>

        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>
      </HeaderContainer>

      <MenuOverlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      
      <SideMenu $isOpen={isMenuOpen}>
        <ProfileSection>
          <ProfileImageContainer>
            <ProfileImage 
              src={userData?.foto_perfil || defaultAvatar} 
              alt="Foto de perfil" 
            />
            <ChangePhotoButton onClick={() => fileInputRef.current?.click()}>
              <FaCamera />
            </ChangePhotoButton>
          </ProfileImageContainer>
          <HiddenFileInput 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          <UserInfo>
            <h3>{userData?.nome || 'Usuário'}</h3>
            <p>Nível {userData?.level || '1'}</p>
          </UserInfo>
        </ProfileSection>

        <MenuSection>
          <MenuItem onClick={() => handleMenuClick('/DashboardGamer')}>
            <FaHome />
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/MinhaBiblioteca')}>
            <FaGamepad />
            Minha Biblioteca
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/MeusDesafios')}>
            <FaTasks />
            Meus Desafios
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/EditarPerfil')}>
            <FaUser />
            Perfil
          </MenuItem>
        </MenuSection>

        <Divider />

        <MenuItem onClick={handleSignOut} style={{ color: '#ff6b6b' }}>
          <FaSignOutAlt />
          Sair
        </MenuItem>
      </SideMenu>
    </>
  );
};

export default Header; 
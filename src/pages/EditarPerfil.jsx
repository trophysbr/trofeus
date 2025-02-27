import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #111827;
  color: white;
  padding: 2rem;
`;

const ContentContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #f3f4f6;
  text-align: center;
`;

const ProfileSection = styled.div`
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #6366f1;
`;

const ProfileImagePlaceholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #2d2d3d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 3px solid #6366f1;

  svg {
    width: 50px;
    height: 50px;
    color: #6366f1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #6366f1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4f46e5;
  }
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #f3f4f6;
  padding: 0.75rem;
  background-color: #374151;
  border-radius: 0.375rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const EditarPerfil = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setUserData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      toast.error('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Verificar o tamanho do arquivo (limite de 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB');
        return;
      }

      // Verificar o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      // Criar um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userData.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Mostrar toast de loading
      toast.info('Enviando imagem...', { autoClose: false, toastId: 'uploadProgress' });

      // Remover foto antiga se existir
      if (userData.foto_perfil) {
        try {
          const oldFileName = userData.foto_perfil.split('/').pop();
          await supabase.storage
            .from('FotoPerfil')
            .remove([oldFileName]);
        } catch (error) {
          console.log('Erro ao remover imagem antiga:', error);
        }
      }

      // Upload da nova imagem
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('FotoPerfil')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Construir a URL completa da imagem
      const { data } = await supabase.storage
        .from('FotoPerfil')
        .createSignedUrl(filePath, 31536000); // URL assinada válida por 1 ano

      const imageUrl = data.signedUrl;

      // Atualizar o perfil do usuário
      const { error: updateError } = await supabase
        .from('Usuarios')
        .update({ foto_perfil: imageUrl })
        .eq('user_id', userData.user_id);

      if (updateError) throw updateError;

      // Atualizar o estado local
      setUserData(prev => ({ ...prev, foto_perfil: imageUrl }));
      
      // Fechar o toast de loading e mostrar sucesso
      toast.dismiss('uploadProgress');
      toast.success('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      toast.dismiss('uploadProgress');
      toast.error('Erro ao atualizar foto de perfil');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <PageContainer>
      <ToastContainer position="top-right" theme="dark" />
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft /> Voltar
          </BackButton>

          <Title>Editar Perfil</Title>

          <ProfileSection>
            <ProfileImageContainer>
              {userData?.foto_perfil ? (
                <ProfileImage 
                  src={userData.foto_perfil} 
                  alt="Foto de perfil"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    // Mostrar o placeholder se a imagem falhar
                    const placeholder = document.getElementById('profile-placeholder');
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
              ) : (
                <ProfileImagePlaceholder id="profile-placeholder">
                  <FaUser />
                </ProfileImagePlaceholder>
              )}
              <FileInput
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <UploadButton onClick={() => document.getElementById('profile-image').click()}>
                Alterar foto
              </UploadButton>
            </ProfileImageContainer>

            <InfoGroup>
              <Label>Nome</Label>
              <Value>{userData?.nome || 'N/A'}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Email</Label>
              <Value>{userData?.email || 'N/A'}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Último Login</Label>
              <Value>{formatDate(userData?.ultimo_login)}</Value>
            </InfoGroup>
          </ProfileSection>
        </motion.div>
      </ContentContainer>
    </PageContainer>
  );
};

export default EditarPerfil; 
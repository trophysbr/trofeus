import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import {
  DashboardContainer,
  Header,
  WelcomeText,
} from '../styles/components/DashboardStyles';
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
  ImagePreview,
  ErrorMessage
} from '../styles/components/FormStyles';
import Footer from '../components/Footer';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  text-align: center;
  padding: 10px;
  background-color: #16213e;
`;

const CadastroJogo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    imagem_url: '',
    status: 'na fila',
    tempo_jogo: '00:00:00',
    plataforma: '',
    genero: '',
    data_lancamento: '',
    desenvolvedor: '',
    publicador: '',
    descricao: ''
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleChange = (e) => {
    if (!mounted) return;
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mounted) return;
    
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('Jogos')
        .insert([
          {
            jogo_nome: formData.nome,
            jogo_imagem_url: formData.imagem_url,
            jogo_status: formData.status,
            jogo_tempo_jogo: formData.tempo_jogo,
            jogo_plataforma: formData.plataforma,
            jogo_genero: formData.genero,
            jogo_data_lancamento: formData.data_lancamento,
            jogo_desenvolvedor: formData.desenvolvedor,
            jogo_publicador: formData.publicador,
            jogo_descricao: formData.descricao
          }
        ])
        .select();

      if (error) throw error;

      navigate('/MinhaBiblioteca');
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao cadastrar o jogo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <WelcomeText>
          <h1>Adicionar Novo Jogo</h1>
        </WelcomeText>
      </Header>

      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nome do Jogo *</Label>
          <Input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>URL da Imagem</Label>
          <Input
            type="url"
            name="imagem_url"
            value={formData.imagem_url}
            onChange={handleChange}
          />
          {formData.imagem_url && mounted && (
            <ImagePreview src={formData.imagem_url} alt="Preview" />
          )}
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="na fila">Na Fila</option>
            <option value="jogando">Jogando</option>
            <option value="concluído">Concluído</option>
            <option value="pausado">Pausado</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Plataforma</Label>
          <Input
            type="text"
            name="plataforma"
            value={formData.plataforma}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Gênero</Label>
          <Input
            type="text"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Data de Lançamento</Label>
          <Input
            type="date"
            name="data_lancamento"
            value={formData.data_lancamento}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Desenvolvedor</Label>
          <Input
            type="text"
            name="desenvolvedor"
            value={formData.desenvolvedor}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Publicador</Label>
          <Input
            type="text"
            name="publicador"
            value={formData.publicador}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Descrição</Label>
          <Input
            as="textarea"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={4}
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar à Biblioteca'}
        </Button>
      </FormContainer>

      <FooterContainer>
        <Footer />
      </FooterContainer>
    </DashboardContainer>
  );
};

export default CadastroJogo; 
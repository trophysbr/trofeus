import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GameCard from '../components/GameCard';
import ChallengeCard from '../components/ChallengeCard';
import { supabase } from '../config/supabaseClient';
import {
  DashboardContainer,
  GameCardWrapper,
  Header,
  WelcomeText,
  LevelInfo,
  Level,
  XP,
  StatsGrid,
  StatCard,
  Section,
  ChallengesGrid
} from '../styles/components/DashboardStyles';
import styled from 'styled-components';
import Footer from '../components/Footer';
import { FaStar, FaTrophy } from 'react-icons/fa';

const WelcomeTextStyled = styled.div`
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    span {
      color: #FFD700;
      font-weight: bold;
    }
  }
`;

const FooterContainer = styled.footer`
  text-align: center;
  padding: 10px;
  background-color: #16213e;
`;

const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  margin: 20px 0;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: max-content;
`;

const CarouselImage = styled.img`
  width: 250px;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 2;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }
`;

const DashboardGamer = () => {
  const [recentGames, setRecentGames] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [userStats, setUserStats] = useState({
    gamesCount: 0,
    challengesCount: 0,
    trophiesCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('Jogador');
  const [userLevel, setUserLevel] = useState(0);
  const [userXP, setUserXP] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndUpdate = async () => {
      try {
        // 1. Obtém os dados do usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          navigate('/login');
          return;
        }

        setUser(user);

        // 2. Buscar dados do usuário incluindo level e xp
        const { data: userData, error: userDataError } = await supabase
          .from('Usuarios')
          .select('nome, level, xp')
          .eq('user_id', user.id)
          .single();

        if (userDataError) throw userDataError;

        if (userData) {
          const firstName = userData.nome.split(' ')[0];
          setUserName(firstName);
          setUserLevel(userData.level || 0);
          setUserXP(userData.xp || 0);
        } else {
          // 3. Se o usuário não existir, cria um novo registro
          const fullName = user.user_metadata.full_name || user.email;
          const { error: insertError } = await supabase
            .from('Usuarios')
            .insert([
              {
                email: user.email,
                nome: fullName,
                dt_inclusao: new Date().toISOString(),
                ultimo_login: new Date().toISOString(),
                user_id: user.id,
                level: 0,
                xp: 0
              },
            ]);

          if (insertError) throw insertError;
          
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
          setUserLevel(0);
          setUserXP(0);
        }
      } catch (error) {
        console.error('Erro ao buscar ou atualizar usuário:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndUpdate();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (images.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const formatGameTime = (timeString) => {
    if (!timeString) return '0';
    
    const [hours, minutes, seconds] = timeString.split(':');
    const totalHours = parseInt(hours) + (parseInt(minutes) / 60) + (parseInt(seconds) / 3600);
    return Math.round(totalHours);
  };

  const fetchData = async () => {
    try {
      // Buscar jogos recentes do usuário
      const { data: games, error: gamesError } = await supabase
        .from('Jogos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_alteracao', { ascending: false, nullsFirst: false })
        .order('data_inclusao', { ascending: false })
        .limit(50);

      if (gamesError) throw gamesError;

      // Buscar desafios ativos do usuário com o nome do jogo
      const { data: challenges, error: challengesError } = await supabase
        .from('Desafios')
        .select(`
          *,
          Jogos!inner (
            user_id,
            jogo_nome
          )
        `)
        .eq('Jogos.user_id', user.id)
        .order('desafio_inicio', { ascending: false })
        .limit(10);

      if (challengesError) throw challengesError;

      // Obter contagem de jogos
      const { count: gamesCount, error: gamesCountError } = await supabase
        .from('Jogos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (gamesCountError) throw gamesCountError;

      // Obter contagem de desafios
      const { count: challengesCount, error: challengesCountError } = await supabase
        .from('Desafios')
        .select('*, Jogos!inner(user_id)', { count: 'exact', head: true })
        .eq('Jogos.user_id', user.id);

      if (challengesCountError) throw challengesCountError;

      // Obter contagem de conquistas
      const { count: trophiesCount, error: trophiesCountError } = await supabase
        .from('Conquistas')
        .select('*, Jogos!inner(user_id)', { count: 'exact', head: true })
        .eq('Jogos.user_id', user.id);

      if (trophiesCountError) throw trophiesCountError;

      // Mapear os dados dos jogos
      const mappedGames = games.map(game => ({
        id: game.jogo_id,
        title: game.jogo_nome,
        image: game.jogo_imagem_url,
        progress: game.jogo_status === 'Na Fila' 
          ? 'Na Fila'
          : `${game.jogo_status} - ${formatGameTime(game.jogo_tempo_jogo)}h`,
        onClick: () => navigate('/MeuJogo', { state: { gameId: game.jogo_id } })
      }));

      // Mapear os dados dos desafios
      const mappedChallenges = challenges.map(challenge => ({
        id: challenge.desafio_id,
        game: challenge.Jogos.jogo_nome,
        title: challenge.desafio_nome,
        progress: challenge.desafio_percentual,
        daysLeft: challenge.desafio_dias_restantes,
        difficulty: challenge.desafio_dificuldade,
        onClick: () => navigate('/CadastroDesafio', { 
          state: { 
            desafio: challenge 
          }
        })
      }));

      setRecentGames(mappedGames);
      setActiveChallenges(mappedChallenges);
      setUserStats({
        gamesCount: gamesCount || 0,
        challengesCount: challengesCount || 0,
        trophiesCount: trophiesCount || 0
      });

      setImages(games.map(game => game.jogo_imagem_url));
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <WelcomeTextStyled>
          <h1>
            Bem-vindo de volta, <span>{userName}</span>
          </h1>
          <LevelInfo>
            <Level>Nível {userLevel}</Level>
            <XP>XP: {userXP.toLocaleString()}</XP>
          </LevelInfo>
        </WelcomeTextStyled>
      </Header>

      <StatsGrid>
        <StatCard onClick={() => navigate('/MinhaBiblioteca')}>
          <h2>{userStats.gamesCount}</h2>
          <p>Jogos na coleção</p>
        </StatCard>
        <StatCard onClick={() => navigate('/MeusDesafios')}>
          <h2>{userStats.challengesCount}</h2>
          <p>Desafios ativos</p>
        </StatCard>
        <StatCard>
          <h2>{userStats.trophiesCount}</h2>
          <p>Troféus desbloqueados</p>
        </StatCard>
      </StatsGrid>

      <Section style={{ marginBottom: '-2.0rem' }}>
        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>Jogos Recentes</h2>
        <CarouselContainer>
          <CarouselButton 
            className="prev" 
            onClick={handlePrevClick}
            style={{ display: images.length > 1 ? 'flex' : 'none' }}
          >
            &#8249;
          </CarouselButton>
          <CarouselTrack 
            style={{ 
              transform: `translateX(-${currentIndex * 270}px)`,
              transition: currentIndex === 0 && images.length > 0 ? 'none' : 'transform 0.5s ease-in-out'
            }}
          >
            {[...images, ...images].map((image, index) => (
              <CarouselImage
                key={`${index}-${image}`}
                src={image}
                alt={`Slide ${(index % images.length) + 1}`}
                onClick={() => recentGames[index % images.length]?.onClick()}
              />
            ))}
          </CarouselTrack>
          <CarouselButton 
            className="next" 
            onClick={handleNextClick}
            style={{ display: images.length > 1 ? 'flex' : 'none' }}
          >
            &#8250;
          </CarouselButton>
        </CarouselContainer>
      </Section>

      <Section style={{ marginTop: '4rem' }}>
        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.25rem' }}>Desafios Ativos</h2>
        <ChallengesGrid style={{ gap: '0.5rem' }}>
          {activeChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} {...challenge} />
          ))}
        </ChallengesGrid>
      </Section>

      <FooterContainer>
        <Footer />
      </FooterContainer>
    </DashboardContainer>
  );
};

export default DashboardGamer;
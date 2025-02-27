import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GameCard from '../components/GameCard';
import ChallengeCard from '../components/ChallengeCard';
import { supabase } from '../config/supabaseClient';
import {
  DashboardContainer,
  CarouselContainer,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndUpdate = async () => {
      try {
        // 1. Obtém os dados do usuário autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!user) {
          navigate('/login'); // Redireciona para o login se o usuário não estiver autenticado
          return;
        }

        setUser(user);

        // 2. Extrai o primeiro nome do usuário
        const fullName = user.user_metadata.full_name || user.email;
        const firstName = fullName.split(' ')[0]; // Pega o primeiro nome
        setUserName(firstName);

        // 3. Verifica se o usuário já existe na tabela Usuarios
        const { data: existingUser, error: queryError } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('email', user.email)
          .maybeSingle(); // Usa maybeSingle() para evitar erros se o usuário não existir

        if (queryError) throw queryError;

        if (!existingUser) {
          // 4. Se o usuário não existir, cria um novo registro
          const { error: insertError } = await supabase
            .from('Usuarios')
            .insert([
              {
                email: user.email,
                nome: fullName,
                dt_inclusao: new Date().toISOString(),
                ultimo_login: new Date().toISOString(),
                user_id: user.id,
              },
            ]);

          if (insertError) throw insertError;
        } else {
          // 5. Se o usuário já existir, atualiza o último login
          const { error: updateError } = await supabase
            .from('Usuarios')
            .update({ ultimo_login: new Date().toISOString() })
            .eq('email', user.email);

          if (updateError) throw updateError;
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
        .limit(10);

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
        onClick: () => navigate('/meu-jogo', { state: { gameId: game.jogo_id } })
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
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: true,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
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
            <Level>Nível 42</Level>
            <XP>XP: 12,450</XP>
          </LevelInfo>
        </WelcomeTextStyled>
      </Header>

      <StatsGrid>
        <StatCard onClick={() => navigate('/biblioteca')}>
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
        <CarouselContainer style={{ margin: '4px' }}>
          <Slider {...settings}>
            {recentGames.map(game => (
              <div key={game.id} style={{ padding: '4px' }}>
                <GameCardWrapper>
                  <GameCard {...game} />
                </GameCardWrapper>
              </div>
            ))}
          </Slider>
        </CarouselContainer>
      </Section>

      <Section style={{ marginTop: '1.0rem' }}>
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
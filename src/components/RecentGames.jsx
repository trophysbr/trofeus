import styled from 'styled-components';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecentGamesSection = styled.section`
  margin: 2px;
  width: 100%;
  height: 500px; // Aumentado para acomodar as imagens maiores
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 2rem;
  font-size: 1.5rem;
`;

const GameCard = styled.div`
  width: 400px; // Ajustado para corresponder ao tamanho da imagem
  height: 400px; // Ajustado para acomodar a imagem + título + progresso
  margin: 0 auto;
`;

const RecentGames = ({ games }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <RecentGamesSection>
      <SectionTitle>Jogos Recentes</SectionTitle>
      <Slider {...settings}>
        {games.map((game) => (
          <GameCard key={game.id}>
            <img src={game.image} alt={game.title} />
            <h3>{game.title}</h3>
            <p>{game.progress}</p>
          </GameCard>
        ))}
      </Slider>
    </RecentGamesSection>
  );
};

export default RecentGames; 
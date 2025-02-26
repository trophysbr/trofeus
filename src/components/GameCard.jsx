import styled from 'styled-components';

const GameCard = ({ title, image, progress }) => {
  return (
    <CardContainer>
      <GameImage src={image} alt={title} />
      <GameInfo>
        <h3>{title}</h3>
        <Progress>{progress}</Progress>
      </GameInfo>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: #1e1e2e;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  height: 370px;

  
  &:hover {
    transform: translateY(-4px);
  }
`;

const GameImage = styled.div`
  width: 100%;
  height: 300px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const GameInfo = styled.div`
  padding: 1rem;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const Progress = styled.span`
  font-size: 0.875rem;
  color: #a0a0a0;
`;

export default GameCard; 
import styled from 'styled-components';

const GameCard = ({ id, title, image, progress, onClick }) => {
  return (
    <CardContainer 
      style={{ 
        cursor: 'pointer',
        backgroundColor: '#1e1e2e',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        height: '370px'
      }}
      onClick={onClick}
    >
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

const GameImage = styled.img`
  width: 250px;
  height: 350px;
  object-fit: cover;
`;

const GameInfo = styled.div`
  padding: 1rem;
  width: 250px;
`;

const GameTitle = styled.h3`
  color: white;
  font-size: 1rem;
  margin: 0;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GameProgress = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
`;

const Progress = styled.span`
  font-size: 0.875rem;
  color: #a0a0a0;
`;

export default GameCard; 
import styled from 'styled-components';

const Card = styled.div`
  background: rgba(45, 45, 61, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const GameTitle = styled.h3`
  font-size: 1.1rem;
  color: #6366f1;
  margin: 0 0 0.5rem 0;
`;

const ChallengeTitle = styled.h4`
  font-size: 1rem;
  color: #f3f4f6;
  margin: 0 0 1rem 0;
`;

const Progress = styled.div`
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  background-color: #374151;
  height: 8px;
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background-color: #6366f1;
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 0.875rem;
`;

const ChallengeCard = ({ game, title, progress, daysLeft, difficulty, onClick }) => {
  return (
    <Card onClick={onClick}>
      <GameTitle>{game}</GameTitle>
      <ChallengeTitle>{title}</ChallengeTitle>
      <Progress>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </Progress>
      <Info>
        <span>{daysLeft} dias restantes</span>
        <span>Dificuldade: {difficulty}</span>
      </Info>
    </Card>
  );
};

export default ChallengeCard; 
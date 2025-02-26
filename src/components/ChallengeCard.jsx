import styled from 'styled-components';

const ChallengeCard = ({ game, title, progress, daysLeft, difficulty }) => {
  return (
    <CardContainer>
      <GameTitle>{game}</GameTitle>
      <ChallengeTitle>{title}</ChallengeTitle>
      <ProgressBar>
        <Progress width={progress} />
      </ProgressBar>
      <InfoRow>
        <ProgressText>Progresso: {progress}%</ProgressText>
        <DaysLeft>{daysLeft} dias restantes</DaysLeft>
      </InfoRow>
      <DifficultyBadge difficulty={difficulty}>{difficulty}</DifficultyBadge>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: #1e1e2e;
  padding: 1.5rem;
  border-radius: 8px;
  position: relative;
`;

const GameTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const ChallengeTitle = styled.h4`
  margin: 0;
  color: #a0a0a0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #2d2d3d;
  border-radius: 2px;
  margin-bottom: 1rem;
`;

const Progress = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  background-color: #6c5ce7;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const ProgressText = styled.span`
  color: #a0a0a0;
`;

const DaysLeft = styled.span`
  color: #a0a0a0;
`;

const DifficultyBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  background-color: ${props => 
    props.difficulty === 'Expert' ? '#e74c3c' : '#6c5ce7'};
`;

export default ChallengeCard; 
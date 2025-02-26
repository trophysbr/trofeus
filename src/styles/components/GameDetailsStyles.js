import styled from 'styled-components';

export const GameDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1e1e2e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const GameHeader = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

export const GameImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

export const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const GameTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin: 0;
`;

export const GameMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Label = styled.span`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

export const Value = styled.span`
  color: white;
  font-size: 1.1rem;
`;

export const GameRating = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding: 1rem;
  background-color: #2d2d44;
  border-radius: 8px;
  width: fit-content;
`;

export const RatingValue = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: #6c5ce7;
`;

export const RatingLabel = styled.span`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: #2d2d44;
  border-radius: 8px;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #a0a0a0;
  margin-bottom: 0.5rem;
`;

export const GameDescription = styled.p`
  color: white;
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-line;
`;

export const GameModes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ModeTag = styled.span`
  padding: 0.5rem 1rem;
  background-color: #6c5ce7;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
`; 
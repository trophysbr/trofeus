import styled from 'styled-components';
import Slider from 'react-slick';

export const DashboardContainer = styled.div`
  padding: 5px;
  max-width: 1800px;
  margin: 0 auto;
  background-color: #0f0f1a;
  min-height: 100vh;
  color: white;
  overflow-x: hidden;
`;

export const CarouselContainer = styled.div`
  width: 100%;
  margin: 10px 0;
  height: 450px;

  .slick-slide {
    padding: 0 3px;
    height: 500px;
  }

  .slick-track {
    display: flex;
    align-items: stretch;
    height: 100%;
  }

  .slick-list {
    margin: 0 -3px;
    height: 100%;
  }

  .slick-prev,
  .slick-next {
    z-index: 1;
    width: 35px;
    height: 35px;
    background: #6c5ce7;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
      background: #5849c2;
      transform: scale(1.1);
    }

    &:before {
      font-size: 20px;
      opacity: 2;
    }
  }

  .slick-prev {
    left: 10px;
    &:before {
      content: '←';
    }
  }

  .slick-next {
    right: 10px;
    &:before {
      content: '→';
    }
  }

  .slick-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: #6c5ce7;
      transform: none;
    }
  }
`;

export const GameCardWrapper = styled.div`
  padding: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const GameImage = styled.img`
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
`;

export const GameTitle = styled.h3`
  color: white;
  font-size: 14px;
  margin: 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
  line-height: 20px;
`;

export const GameProgress = styled.p`
  color: #a0a0a0;
  font-size: 12px;
  margin: 3px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
`;

export const WelcomeText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const LevelInfo = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Level = styled.span`
  background-color: #6c5ce7;
  padding: 0.5rem 1rem;
  border-radius: 4px;
`;

export const XP = styled.span`
  background-color: #2d3436;
  padding: 0.5rem 1rem;
  border-radius: 4px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background-color: #1e1e2e;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background-color: #2a2a3d;
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    margin-bottom: 0.25rem;
  }
  
  p {
    margin: 0;
    color: #a0a0a0;
  }
`;

export const Section = styled.section`
  margin: 2rem 0 2.5rem 0;
  
  h2 {
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }

  &:first-of-type {
    margin-top: 1.5rem;
  }

  &:last-child {
    margin-bottom: 1.5rem;
  }
`;

export const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`; 
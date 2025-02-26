import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: #1e1e2e;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  width: 350px;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    
    &::after {
      opacity: 0.9;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,0.7) 80%,
      rgba(0,0,0,0.9) 100%
    );
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
`;

export const GameImage = styled.div`
  width: 100%;
  height: 500px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
`;

export const GameInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  z-index: 1;
  
  h3 {
    color: white;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    margin-bottom: 4px;
  }
`;

export const Progress = styled.span`
  color: #a0a0a0;
  font-size: 0.875rem;
  display: block;
`;
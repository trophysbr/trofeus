import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #16213e; /* Cor de fundo do footer */
  color: white;
  text-align: center;
  padding: 1rem 0;
  position: relative;
  bottom: 0;
  width: 100%;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>© 2025 Trophys. Todos os direitos reservados.</FooterText>
    </FooterContainer>
  );
};

export default Footer; 
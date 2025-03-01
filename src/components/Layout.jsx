import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #0f0f1a;
`;

const MainContent = styled.main`
  padding-top: 80px; // Espaço para o header fixo
  min-height: calc(100vh - 80px);
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #0f0f1a;
    color: white;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  button {
    font-family: 'Inter', sans-serif;
  }

  input, select, textarea {
    font-family: 'Inter', sans-serif;
  }
`;

export default GlobalStyles; 
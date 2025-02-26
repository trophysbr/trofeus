import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import "~slick-carousel/slick/slick.css";
  @import "~slick-carousel/slick/slick-theme.css";

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #0f0f1a;
    color: white;
  }

  button {
    cursor: pointer;
  }

  /* Estilos para o carrossel */
  .slick-slider {
    position: relative;
    display: block;
    box-sizing: border-box;
    user-select: none;
    touch-action: pan-y;
  }

  .slick-list {
    position: relative;
    display: block;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .slick-slide {
    float: left;
    height: 100%;
    min-height: 1px;
    display: block;
  }
`;

export default GlobalStyles; 
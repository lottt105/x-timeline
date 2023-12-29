import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #eeeff3;
    color: #4d4d63;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  /* 스크롤 기능 사용할 때, 스크롤 바 없앰 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default GlobalStyle;

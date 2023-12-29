import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { colors } from "../resources/colors";

const GlobalStyle = createGlobalStyle`
  ${reset};

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${colors.light_gray};
    color: ${colors.deep_gray};
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  /* 스크롤 기능 사용할 때, 스크롤 바 없앰 */
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default GlobalStyle;

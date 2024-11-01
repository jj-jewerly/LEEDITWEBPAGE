// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: ${theme.colors.primary.main};
    --secondary-color: ${theme.colors.secondary.main};
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --bg-light: ${theme.colors.background.paper};
  }

  body {
    font-family: ${theme.typography.fontFamily};
    color: ${theme.colors.text.primary};
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
`;
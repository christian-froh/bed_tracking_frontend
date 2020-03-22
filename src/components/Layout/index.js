import React from 'react';
import { GlobalStyles } from './globalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

export const Layout = ({ children }) => {

  return (
    <ThemeProvider theme={ theme }>
      <GlobalStyles />
      { children }
    </ThemeProvider>
  );
}
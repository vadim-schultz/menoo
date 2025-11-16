import { render } from 'preact';
import { App } from './app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';

const root = document.getElementById('app');
if (root) {
  render(
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>,
    root
  );
}

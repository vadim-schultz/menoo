import { render } from 'preact';
import { App } from './app';
import '@picocss/pico/css/pico.min.css';

const root = document.getElementById('app');
if (root) {
  render(<App />, root);
}

import './styles/main.css';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { ChakraProvider } from '@chakra-ui/react';
import system from './theme';
import { ErrorBoundary } from './test-error-boundary';

// Global error handlers for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error, {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent default browser behavior
  event.preventDefault();
});

const rootElement = document.getElementById('app');
if (!rootElement) {
  // Fallback error display if root element is missing
  document.body.innerHTML = `
    <div style="
      padding: 20px;
      font-family: monospace;
      background: #fee;
      color: #c00;
      border: 2px solid #c00;
      margin: 20px;
      border-radius: 4px;
    ">
      <h1>Application Error</h1>
      <p>Root element '#app' not found in DOM.</p>
      <p>Please ensure index.html contains: &lt;div id="app"&gt;&lt;/div&gt;</p>
    </div>
  `;
  console.error('Root element #app not found in DOM');
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <ChakraProvider value={system}>
          <App />
        </ChakraProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to render application:', error);
    rootElement.innerHTML = `
      <div style="
        padding: 20px;
        font-family: monospace;
        background: #fee;
        color: #c00;
        border: 2px solid #c00;
        border-radius: 4px;
      ">
        <h1>Application Render Error</h1>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
        <pre style="overflow: auto; max-height: 300px;">${error instanceof Error ? error.stack : String(error)}</pre>
        <button onclick="window.location.reload()" style="
          margin-top: 10px;
          padding: 8px 16px;
          background: #c00;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Reload Page</button>
      </div>
    `;
  }
}

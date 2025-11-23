import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging with component stack
    console.error('Error caught by boundary:', {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      errorInfo,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const errorInfo = this.state.errorInfo;

      // Inline styles to ensure visibility even if CSS fails
      const containerStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        padding: '20px',
        fontFamily: 'monospace',
        backgroundColor: '#fee',
        color: '#c00',
        border: '2px solid #c00',
        overflow: 'auto',
        boxSizing: 'border-box',
      };

      const headerStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#c00',
      };

      const messageStyle: React.CSSProperties = {
        fontSize: '16px',
        marginBottom: '12px',
        padding: '12px',
        backgroundColor: '#fff',
        border: '1px solid #c00',
        borderRadius: '4px',
      };

      const stackStyle: React.CSSProperties = {
        fontSize: '12px',
        marginBottom: '12px',
        padding: '12px',
        backgroundColor: '#fff',
        border: '1px solid #c00',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight: '300px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      };

      const buttonStyle: React.CSSProperties = {
        marginTop: '12px',
        padding: '10px 20px',
        backgroundColor: '#c00',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
      };

      return (
        <div style={containerStyle}>
          <h1 style={headerStyle}>Application Error</h1>
          <div style={messageStyle}>
            <strong>Error Message:</strong> {error?.message || 'Unknown error'}
          </div>
          {error?.stack && (
            <div>
              <strong>Stack Trace:</strong>
              <pre style={stackStyle}>{error.stack}</pre>
            </div>
          )}
          {errorInfo?.componentStack && (
            <div>
              <strong>Component Stack:</strong>
              <pre style={stackStyle}>{errorInfo.componentStack}</pre>
            </div>
          )}
          <button onClick={this.handleReload} style={buttonStyle}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


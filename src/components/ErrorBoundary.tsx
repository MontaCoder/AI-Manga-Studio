import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback">
          <div className="status-card status-card--error">
            <h3 style={{ marginBottom: '0.5rem' }}>Something went wrong</h3>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button className="button-secondary" onClick={this.handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

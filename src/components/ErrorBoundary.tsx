import React from 'react';
import { FishIcon } from './Icons';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you might want to log this to an error reporting service
    if (import.meta.env.PROD) {
      // logErrorToService(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ error, resetError }) => {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="surface-card border-coral-200 p-8 dark:border-coral-900">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-coral-50 p-4 dark:bg-coral-950/40">
              <FishIcon className="h-12 w-12 text-coral-600" />
            </div>
          </div>
          <h1 className="display mb-4 text-3xl">Something went wrong</h1>
          <p className="mb-6 text-ink-600 dark:text-cream-100/70">
            Your tank data is still saved. Retry, or return home and continue from the overview.
          </p>
          {import.meta.env.DEV && error && (
            <details className="mb-6 text-left">
              <summary className="mb-2 cursor-pointer text-sm text-ink-500">
                Technical details (development only)
              </summary>
              <pre className="overflow-auto rounded-2xl bg-cream-100 p-3 text-xs text-ink-700 dark:bg-ink-900 dark:text-cream-100">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </details>
          )}
          <div className="space-y-3">
            <button onClick={resetError} className="btn-primary w-full">
              Try again
            </button>
            <button onClick={() => { window.location.href = '/'; }} className="btn-secondary w-full">
              Return home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
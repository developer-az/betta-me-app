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
    if (process.env.NODE_ENV === 'production') {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30 p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FishIcon className="h-12 w-12 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Don't worry - your fish data is safe. We've encountered a technical issue, but you can try again.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 mb-2">
                Technical details (development only)
              </summary>
              <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-3 rounded-lg overflow-auto text-slate-700 dark:text-slate-300">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </details>
          )}
          
          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors duration-200"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
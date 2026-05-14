import React from 'react';

const isProduction = import.meta.env.PROD;

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (isProduction) {
      return;
    }

    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 px-6 text-center text-red-700 dark:text-red-400'>
          <h1 className='text-2xl font-bold mb-4'>Something went wrong.</h1>
          {!isProduction && (
            <pre className='text-xs bg-white/80 dark:bg-black/30 p-4 rounded-xl max-w-lg overflow-x-auto text-left'>
              {this.state.error?.toString()}
            </pre>
          )}
          <button
            className='mt-6 px-6 py-2 bg-brand-gold text-black font-bold rounded-xl'
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

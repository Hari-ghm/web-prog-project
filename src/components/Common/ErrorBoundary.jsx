import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center my-4">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Something went wrong</h2>
          <p className="text-sm text-red-600 dark:text-red-300">
            {this.props.fallbackMessage || "Failed to load component. Using estimated/fallback data."}
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition"
            onClick={() => {
              this.setState({ hasError: false });
              // Trigger page reload to recover from error state
              window.location.reload();
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

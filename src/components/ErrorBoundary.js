import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error', error, errorInfo);
    // You can also log error info to an external service here
  }

  handleReload = () => {
    // Optionally reload the page or reset error state
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>We're working on it! Please try again later or reload the page.</p>
          <p>If this issue persists please email help@gettraveltogether.com</p>
          <button onClick={this.handleReload} style={{ marginTop: '10px' }}>
            Reload Page
          </button>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;

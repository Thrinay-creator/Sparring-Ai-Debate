import React from 'react';
import ErrorPage from '../../pages/ErrorPage';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Sparring ErrorBoundary Caught Anomaly]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset: this.handleReset });
      }
      return (
        <ErrorPage
          error={this.state.error}
          onReload={() => {
            this.handleReset();
            window.location.reload();
          }}
          onResetSession={() => {
            try {
              sessionStorage.clear();
              localStorage.removeItem('sparring_active_session');
            } catch {}
            this.handleReset();
            window.location.href = '/';
          }}
          onNavigateHome={() => {
            this.handleReset();
            window.location.href = '/';
          }}
        />
      );
    }

    return this.props.children;
  }
}

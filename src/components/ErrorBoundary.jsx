import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TreeView error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--danger)',
          fontFamily: 'var(--font-sans)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: 8 }}>
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Failed to render tree view</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{this.state.error}</div>
          <button
            onClick={() => {
              this.setState({ error: null });
              this.props.onRetry?.();
            }}
            style={{
              marginTop: 12,
              padding: '6px 16px',
              border: '1px solid var(--border)',
              borderRadius: 4,
              background: 'var(--bg-secondary)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

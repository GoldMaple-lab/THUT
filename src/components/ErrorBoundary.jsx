import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-10 text-red-900">
          <h1 className="text-3xl font-bold mb-4">💥 แอพพังครับ (Something went wrong)</h1>
          <div className="bg-white p-6 rounded shadow-lg border border-red-200 max-w-2xl w-full overflow-auto">
            <h2 className="font-bold text-lg mb-2">Error Message:</h2>
            <pre className="text-red-600 font-mono text-sm mb-4">
              {this.state.error && this.state.error.toString()}
            </pre>
            <h2 className="font-bold text-lg mb-2">ตำแหน่งที่พัง:</h2>
            <pre className="bg-slate-100 p-2 rounded text-xs text-slate-700 font-mono">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            รีเฟรชหน้าเว็บ
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
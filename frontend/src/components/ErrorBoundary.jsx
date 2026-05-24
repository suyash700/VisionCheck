import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error) {
    console.error("Frontend error boundary caught an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-rose-200 bg-white p-8 shadow-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">Application Error</p>
            <h1 className="mt-3 text-3xl font-bold text-ink">A screen failed to render.</h1>
            <p className="mt-4 text-slate-600">
              Refresh the page or return to the home screen to restart the VisionCheck AI screening flow.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Return Home
            </Link>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

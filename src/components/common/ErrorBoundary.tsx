import { AlertTriangle, ArrowLeft, RotateCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering issue occurred.',
    };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Error captured and displayed via the editorial fallback interface.
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F1EA] text-[#101010] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full bg-[#FAF8F4] border border-[#101010]/15 p-8 sm:p-10 space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#101010] text-[#B6A48D] mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#632B37]">
                House of Fashion Nepal · Recovery
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#101010]">
                Unable to Display This View
              </h1>
              <p className="text-sm text-[#101010]/70 leading-relaxed">
                A temporary issue interrupted rendering this page. Reloading the session typically restores normal navigation.
              </p>
            </div>

            {this.state.errorMessage && (
              <p className="text-xs font-mono text-[#101010]/50 bg-[#F5F1EA] border border-[#101010]/10 px-3 py-2 break-words">
                {this.state.errorMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#101010] text-[#FAF8F4] text-xs uppercase tracking-[0.16em] hover:bg-[#632B37] transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#101010]/25 text-xs uppercase tracking-[0.16em] hover:border-[#101010] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

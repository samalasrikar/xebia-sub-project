import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          retry: this.handleRetry,
        });
      }

      return (
        <div className="min-h-[320px] flex flex-col items-center justify-center text-center p-8 bg-slate-50">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 mb-5">
            <AlertTriangle size={26} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            {this.props.title ?? "Something went wrong"}
          </h2>
          <p className="text-[13px] text-slate-500 max-w-md mb-6 leading-relaxed">
            {this.props.description ??
              "An unexpected error occurred while rendering this page. Your work may still be saved on the server."}
          </p>
          <Button
            type="button"
            onClick={this.handleRetry}
            className="bg-[#6C1D5F] hover:bg-[#521347] text-white font-bold"
          >
            <RefreshCw size={14} className="mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

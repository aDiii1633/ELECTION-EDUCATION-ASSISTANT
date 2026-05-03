// components/ErrorBoundary.tsx
'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Oops! Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
              We encountered an unexpected error. Don&apos;t worry, your election data is safe.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200"
              >
                <RefreshCw size={18} /> Refresh Page
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl transition-all"
              >
                <Home size={18} /> Back to Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-red-50 rounded-2xl text-left border border-red-100 overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-red-700 font-bold uppercase mb-2 tracking-widest">Error Logs</p>
                <p className="text-xs font-mono text-red-600">{this.state.error?.message}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

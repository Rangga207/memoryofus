'use client';
import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("UI Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silent fail for 3D background
    }

    return this.props.children;
  }
}

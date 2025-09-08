import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Log to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // In production, you would send this to your error reporting service
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error, errorInfo) => {
    // Mock error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    }

    // In a real app, send to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    console.log('Error report:', errorReport)
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state
      const isDevelopment = process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-surface rounded-lg shadow-card p-8 border border-gray-100">
              {/* Error Icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600">
                  We're sorry, but something unexpected happened. Our team has been notified.
                </p>
              </div>

              {/* Error ID */}
              <div className="bg-gray-50 rounded-md p-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Bug className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Error ID:</span>
                  <code className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                    {errorId}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Go Home</span>
                </button>
              </div>

              {/* Development Error Details */}
              {isDevelopment && error && (
                <details className="bg-red-50 border border-red-200 rounded-md p-4">
                  <summary className="cursor-pointer font-medium text-red-800 mb-2">
                    Development Error Details (Click to expand)
                  </summary>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">Error Message:</h4>
                      <pre className="text-sm text-red-700 bg-red-100 p-2 rounded overflow-x-auto">
                        {error.message}
                      </pre>
                    </div>
                    
                    {error.stack && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Stack Trace:</h4>
                        <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {errorInfo && errorInfo.componentStack && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Component Stack:</h4>
                        <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  If this problem persists, please contact our support team with the error ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for functional components
export const withErrorBoundary = (Component, fallback) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Hook for error handling in functional components
export const useErrorHandler = () => {
  return (error, errorInfo) => {
    // In a real app, you might want to throw the error to be caught by ErrorBoundary
    // or handle it differently based on your error handling strategy
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // You could also dispatch to a global error state or show a toast notification
    throw error
  }
}

export default ErrorBoundary

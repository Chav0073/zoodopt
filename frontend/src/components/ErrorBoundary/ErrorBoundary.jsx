import React from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <Alert variant="danger" className="text-center shadow-lg">
                  <Alert.Heading>🐾 Oops! Something went wrong</Alert.Heading>
                  <p className="lead">
                    We're sorry, but ZooDopt encountered an unexpected error.
                  </p>
                  <p className="mb-4">
                    Don't worry - no pets were harmed in the making of this error! 
                    Please try one of the options below.
                  </p>
                  <hr />
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Button
                      variant="outline-danger"
                      onClick={this.handleReset}
                      className="px-4"
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => window.location.reload()}
                      className="px-4"
                    >
                      Refresh Page
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => window.location.href = '/'}
                      className="px-4"
                    >
                      Go Home
                    </Button>
                  </div>
                  
                  {/* Development mode: Show error details */}
                  {import.meta.env.DEV && this.state.error && (
                    <details className="mt-4 text-start">
                      <summary className="mb-2" style={{ cursor: 'pointer' }}>
                        🔍 Error Details (Development)
                      </summary>
                      <pre className="bg-light p-3 rounded text-danger small">
                        <strong>Error:</strong> {this.state.error.toString()}
                        {this.state.errorInfo && (
                          <>
                            <br /><br />
                            <strong>Component Stack:</strong>
                            {this.state.errorInfo.componentStack}
                          </>
                        )}
                      </pre>
                    </details>
                  )}
                </Alert>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

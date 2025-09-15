import React, { useState, useEffect } from 'react';
import { runAllTests } from '../utils/testConnection';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        const results = await runAllTests();
        setTestResults(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  const renderTestResult = (result, title) => {
    if (!result) return null;
    
    return (
      <div className={`test-result ${result.success ? 'success' : 'failure'}`}>
        <h3>{title}</h3>
        {result.success ? (
          <p className="success-message">✅ {result.message || 'Connection successful'}</p>
        ) : (
          <p className="error-message">❌ {result.error || 'Connection failed'}</p>
        )}
        {result.data && (
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        )}
      </div>
    );
  };

  return (
    <div className="connection-test">
      <h2>Connection Test Results</h2>
      {loading ? (
        <p>Running connection tests...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : testResults ? (
        <div className="test-results">
          {renderTestResult(testResults.api, 'API Connection')}
          {renderTestResult(testResults.webSocket, 'WebSocket Connection')}
          {renderTestResult(testResults.socketIO, 'Socket.IO Connection')}
          
          <div className="overall-result">
            <h3>Overall Result</h3>
            {testResults.allSuccessful ? (
              <p className="success-message">✅ All connections successful</p>
            ) : (
              <p className="error-message">❌ Some connections failed</p>
            )}
          </div>
        </div>
      ) : null}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .connection-test {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .test-result {
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }
        
        .test-result.success {
          border-left: 5px solid #4CAF50;
        }
        
        .test-result.failure {
          border-left: 5px solid #F44336;
        }
        
        .success-message {
          color: #4CAF50;
          font-weight: bold;
        }
        
        .error-message {
          color: #F44336;
          font-weight: bold;
        }
        
        pre {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          overflow-x: auto;
        }
        
        .overall-result {
          margin-top: 30px;
          padding: 15px;
          border-radius: 5px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
        }
      ` }} />
    </div>
  );
};

export default ConnectionTest;
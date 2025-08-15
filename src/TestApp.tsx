import React from 'react';

const TestApp = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1>🎉 React is Working!</h1>
        <p>If you see this, the basic React setup is functional.</p>
        <p>The white screen issue is likely in the main App component.</p>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => alert('JavaScript is working!')}
            style={{
              padding: '10px 20px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestApp;

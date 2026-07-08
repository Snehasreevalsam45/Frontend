import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFount = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '60px', color: '#dc2626' }}>404</h1>
      <h2>Page Not Found</h2>
      <button onClick={() => navigate('/')} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Back to Home</button>
    </div>
  );
};

export default NotFount;
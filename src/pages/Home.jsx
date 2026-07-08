import React from 'react';

function Home() {
  // ബാക്കിയുള്ള എല്ലാ വിവരണങ്ങളും ഫീച്ചർ ഗ്രിഡുകളും ഒഴിവാക്കി, വെറും വെൽക്കം മെസ്സേജ് മാത്രം നിലനിർത്തി
  return (
    <div style={styles.container}>
      <div style={styles.heroCard}>
        <h1 style={styles.title}>Welcome to GreenStock</h1>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#f0fdf4', // Light green background
    padding: '20px'
  },
  heroCard: {
    textAlign: 'center',
    minWidth: '450px',
    backgroundColor: 'white',
    padding: '50px 40px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #bbf7d0'
  },
  title: {
    color: '#064e3b',
    fontSize: '2.8rem',
    margin: 0
  }
};

export default Home;
import React, { useState } from 'react';

const Signup = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // App.jsx വഴി ബാക്കെൻഡിലേക്ക് അയക്കുന്നു
    const result = await onRegister({ firstName: name, lastName: '.', email, password });

    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } else {
      setError(result.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Create Account</h2>
      <p style={styles.subtitle}>Fill in the details below to get started.</p>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleSignup}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} />
        </div>
        <button type="submit" style={styles.btn}>Sign Up</button>
      </form>
      <p style={styles.switchText}>
        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} style={styles.link}>Sign in</a>
      </p>
    </div>
  );
};

const styles = {
  card: { background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)', width: '100%', maxWidth: '380px', boxSizing: 'border-box', border: '1px solid #d1fae5' },
  title: { margin: '0 0 6px 0', fontSize: '28px', fontWeight: 'bold', color: '#064e3b', textAlign: 'center' },
  subtitle: { color: '#047857', fontSize: '14px', marginBottom: '24px', opacity: 0.7, textAlign: 'center' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '11px', color: '#065f46', marginBottom: '6px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f0fdf4' },
  btn: { width: '100%', padding: '12px', color: 'white', backgroundColor: '#059669', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)' },
  errorMessage: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', border: '1px solid rgba(220, 38, 38, 0.2)', fontWeight: '500', textAlign: 'center' },
  successMessage: { backgroundColor: '#ecfdf5', color: '#059669', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', border: '1px solid rgba(5, 150, 105, 0.2)', fontWeight: '500', textAlign: 'center' },
  switchText: { marginTop: '24px', fontSize: '14px', color: '#6b7280', textAlign: 'center' },
  link: { color: '#059669', textDecoration: 'none', fontWeight: 'bold' }
};

export default Signup;
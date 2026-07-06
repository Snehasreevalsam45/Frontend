import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToSignup, onUserNotFound }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 1. പാസ്‌വേഡ് കാണിക്കാൻ പുതിയ സ്റ്റേറ്റ്

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // App.jsx-ലേക്ക് ലോഗിൻ റിക്വസ്റ്റ് അയക്കുന്നു
    const result = await onLogin({ email, password });

    // 1. ലോഗിൻ സക്സസ് ആയാൽ
    if (result && result.success) {
      setSuccess(`Welcome back! Login Successful.`);
      localStorage.setItem('token', result.accessToken);
      localStorage.setItem('user', JSON.stringify(result.data));
    } 
    // 2. യൂസറെ ഡാറ്റാബേസിൽ കാണാത്തപ്പോൾ (ഇമെയിൽ തെറ്റാകുമ്പോൾ ബാക്കെൻഡ് തരുന്ന മെസ്സേജ് ആണെങ്കിൽ)
    else if (result && result.message === "Email does not exist") { 
      onUserNotFound(); // സൈൻഅപ്പിലേക്ക് വിടുന്നു
    } 
    // 3. പാസ്‌വേഡ് തെറ്റുകയോ മറ്റ് എററുകൾ വരികയോ ചെയ്യുമ്പോൾ
    else {
      setError(result?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Welcome Back</h2>
      <p style={styles.subtitle}>Please enter your details to sign in.</p>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          {/* 👈 2. ബട്ടൺ ഇൻപുട്ടിന് ഉള്ളിൽ വരാൻ ഒരു റിലേറ്റീവ് ഡിവ് (div) ചേർത്തു */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type={showPassword ? "text" : "password"} // 👈 3. സ്റ്റേറ്റ് അനുസരിച്ച് ടൈപ്പ് മാറും
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ ...styles.input, paddingRight: '60px' }} // ബട്ടൺ ഇരിക്കാൻ വലതുവശത്ത് ചെറിയ സ്പേസ് നൽകി
            />
            
            {/* 👁️ 4. SHOW / HIDE ബട്ടൺ */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showHideBtn}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>
        
        <button type="submit" style={styles.btn}>Sign In</button>
      </form>
      <p style={styles.switchText}>
        Don't have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }} style={styles.link}>Create Account</a>
      </p>
    </div>
  );
};

const styles = {
  card: { background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)', width: '100%', maxWidth: '380px', boxSizing: 'border-box', border: '1px solid #d1fae5' },
  title: { margin: '0 0 6px 0', fontSize: '28px', fontWeight: 'bold', color: '#064e3b', textAlign: 'center' },
  subtitle: { color: '#047857', fontSize: '14px', marginBottom: '24px', opacity: 0.7, textAlign: 'center' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '11px', color: '#065f46', marginBottom: '6px', fontWeight: 'bold', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f0fdf4' },
  // 👈 5. പുതിയ ബട്ടണ് വേണ്ടിയുള്ള സ്റ്റൈൽ ഇവിടെ ചേർത്തു
  showHideBtn: { position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', outline: 'none' },
  btn: { width: '100%', padding: '12px', color: 'white', backgroundColor: '#059669', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)' },
  errorMessage: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', border: '1px solid rgba(220, 38, 38, 0.2)', fontWeight: '500', textAlign: 'center' },
  successMessage: { backgroundColor: '#ecfdf5', color: '#059669', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', border: '1px solid rgba(5, 150, 105, 0.2)', fontWeight: '500', textAlign: 'center' },
  switchText: { marginTop: '24px', fontSize: '14px', color: '#6b7280', textAlign: 'center' },
  link: { color: '#059669', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;
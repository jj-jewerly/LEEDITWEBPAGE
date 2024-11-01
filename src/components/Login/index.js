// src/components/Login/index.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../firebase/authConfig';
import './Login.css';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/'); // 로그인 성공 후 홈페이지로 이동
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>로그인</h2>
        {error && <div className="error-message">{error}</div>}
        <button 
          className="google-signin-button"
          onClick={handleGoogleSignIn}
        >
          <img 
            src="/google-icon.png" 
            alt="Google" 
            className="google-icon"
          />
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
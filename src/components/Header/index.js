// src/components/Header/index.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { signInWithGoogle } from '../../firebase/config';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
        const user = await signInWithGoogle();
        console.log('Successfully logged in:', user);  // 성공 로그
    } catch (error) {
        console.error('Login error details:', error);  // 상세 에러 로그
        
        // 사용자에게 에러 메시지 표시
        if (error.code === 'auth/popup-closed-by-user') {
            alert('Login was cancelled');
        } else if (error.code === 'auth/cancelled-popup-request') {
            alert('Another login is already in progress');
        } else {
            alert('Login failed. Please try again later');
        }
    }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="header-logo">
          EverPoint
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="menu-icon"></span>
        </button>
        
        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <div className="nav-group main-nav">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
            <a href="#about" className="nav-link" onClick={closeMenu}>
              About
            </a>
            <a href="#services" className="nav-link" onClick={closeMenu}>
              Services
            </a>
            <a href="#products" className="nav-link" onClick={closeMenu}>
              Products
            </a>
            <Link to="/bulletin" className="nav-link" onClick={closeMenu}>
              Bulletin Board
            </Link>
          </div>
          
          <div className="nav-group auth-nav">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName} 
                      className="user-avatar"
                    />
                  )}
                  <span className="user-name">{user.displayName}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="auth-button logout"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin} 
                className="auth-button login"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
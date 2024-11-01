// src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container text-center">
        <p>&copy; 2024 EverPoint. All rights reserved.</p>
        <p className="footer-links">
          <a href="#">Privacy Policy</a> | 
          <a href="#">Terms of Use</a> | 
          <a href="#">Sitemap</a>
        </p>
        <div className="social-icons mt-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="facebook-icon.png" alt="Facebook" style={{ width: '24px' }} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="twitter-icon.png" alt="Twitter" style={{ width: '24px' }} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="instagram-icon.png" alt="Instagram" style={{ width: '24px' }} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

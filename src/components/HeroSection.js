// src/components/HeroSection.js
import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          Revolutionizing
          <span className="hero-title-highlight">LEED Certification</span>
          Through Technology
        </h1>
        
        <p className="hero-description">
          Transform your building certification process with our innovative AI-powered solutions
        </p>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50%</span>
            <span className="stat-label">Time Saved</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
        
        <div className="hero-actions">
          <a href="#contact" className="hero-button primary">
            Start Your Project
          </a>
          <a href="#about" className="hero-button secondary">
            Learn More
          </a>
        </div>
        
        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon">🌱</div>
            <span className="feature-text">Sustainable Solutions</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <span className="feature-text">AI-Powered Analysis</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <span className="feature-text">Real-time Monitoring</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
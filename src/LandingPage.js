import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GlassStyles.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/form');
  };

  return (
    <div className="glass-container">
      <div className="glass-card">
        <h1 className="glass-title">Welcome to Glass Demo</h1>
        <p className="glass-subtitle">Experience the future of web design</p>
        <button className="glass-button" onClick={handleNext}>
          Get Started
          <span className="button-shimmer"></span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
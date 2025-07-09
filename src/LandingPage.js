import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GlassStyles.css';
import FluidGlass from './FluidGlass';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/form');
  };

  return (
    <div className="glass-container">
      {/* FluidGlass as background layer */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        opacity: 0.7
      }}>
        <FluidGlass 
          mode="lens"
          lensProps={{
            scale: 0.15,
            ior: 1.2,
            thickness: 3,
            chromaticAberration: 0.05,
            anisotropy: 0.005
          }}
        />
      </div>
      
      {/* Your glassmorphism content on top */}
      <div className="glass-card" style={{ position: 'relative', zIndex: 2 }}>
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
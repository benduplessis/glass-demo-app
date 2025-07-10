import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GlassStyles.css';
import WaterBlobBackground from './components/WaterBlobBackground';
import EnhancedFluidGlass from './EnhancedFluidGlass';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/form');
  };

  return (
    <div className="glass-container">
      {/* CSS Water Blob Background */}
      <WaterBlobBackground 
        primaryColor="#87CEEB"
        secondaryColor="#ADD8E6"
        accentColor="#FFB6C1"
        intensity="medium"
      />
      
      {/* Enhanced FluidGlass overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        opacity: 0.8
      }}>
        <EnhancedFluidGlass 
          mode="lens"
          backgroundColor="#f8f9fa"
          lensProps={{
            scale: 0.12,
            ior: 1.2,
            thickness: 4,
            chromaticAberration: 0.08,
            anisotropy: 0.008,
            roughness: 0.1,
            transmission: 0.95,
            color: '#ffffff'
          }}
        />
      </div>
      
      {/* Your glassmorphism content on top */}
      <div className="glass-card" style={{ position: 'relative', zIndex: 2 }}>
        <h1 className="glass-title">Welcome to Glass Demo</h1>
        <p className="glass-subtitle">Experience the future of web design with fluid water effects</p>
        <button className="glass-button" onClick={handleNext}>
          Get Started
          <span className="button-shimmer"></span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
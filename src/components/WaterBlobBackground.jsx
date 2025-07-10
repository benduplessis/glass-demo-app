import React from 'react';
import './WaterBlobBackground.css';

const WaterBlobBackground = ({
  primaryColor = '#87CEEB',
  secondaryColor = '#ADD8E6',
  accentColor = '#FFB6C1',
  intensity = 'medium' // 'low', 'medium', 'high'
}) => {
  const intensitySettings = {
    low: { blur: '40px', opacity: 0.3, animationDuration: '12s' },
    medium: { blur: '60px', opacity: 0.4, animationDuration: '8s' },
    high: { blur: '80px', opacity: 0.5, animationDuration: '6s' }
  };

  const settings = intensitySettings[intensity];

  return (
    <div className="water-blob-background">
      {/* Main background gradient */}
      <div 
        className="blob-base"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}15, ${accentColor}10)`
        }}
      />
      
      {/* Animated blobs */}
      <div 
        className="blob blob-1"
        style={{
          background: `radial-gradient(circle, ${primaryColor}${Math.round(settings.opacity * 255).toString(16)}, transparent 70%)`,
          filter: `blur(${settings.blur})`,
          animationDuration: settings.animationDuration
        }}
      />
      
      <div 
        className="blob blob-2"
        style={{
          background: `radial-gradient(ellipse, ${secondaryColor}${Math.round(settings.opacity * 0.8 * 255).toString(16)}, transparent 65%)`,
          filter: `blur(${settings.blur})`,
          animationDuration: `${parseFloat(settings.animationDuration) * 1.2}s`
        }}
      />
      
      <div 
        className="blob blob-3"
        style={{
          background: `radial-gradient(circle, ${accentColor}${Math.round(settings.opacity * 0.6 * 255).toString(16)}, transparent 60%)`,
          filter: `blur(${settings.blur})`,
          animationDuration: `${parseFloat(settings.animationDuration) * 0.8}s`
        }}
      />
      
      <div 
        className="blob blob-4"
        style={{
          background: `radial-gradient(ellipse, ${primaryColor}${Math.round(settings.opacity * 0.7 * 255).toString(16)}, transparent 75%)`,
          filter: `blur(${settings.blur})`,
          animationDuration: `${parseFloat(settings.animationDuration) * 1.5}s`
        }}
      />
      
      <div 
        className="blob blob-5"
        style={{
          background: `radial-gradient(circle, ${secondaryColor}${Math.round(settings.opacity * 0.5 * 255).toString(16)}, transparent 55%)`,
          filter: `blur(${settings.blur})`,
          animationDuration: `${parseFloat(settings.animationDuration) * 0.9}s`
        }}
      />
      
      {/* Subtle overlay for depth */}
      <div className="blob-overlay" />
    </div>
  );
};

export default WaterBlobBackground;
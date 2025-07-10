import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlassStyles.css';

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (submitted) {
    return (
      <div className="glass-container">
        <div className="glass-card">
          <h1 className="glass-title">Thank You!</h1>
          <p className="glass-subtitle">Your message has been received.</p>
          <button className="glass-button" onClick={handleBack}>
            Go Back
            <span className="button-shimmer"></span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-container">
      <div className="glass-card">
        <h1 className="glass-title">Contact Us</h1>
        <form onSubmit={handleSubmit} className="glass-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="glass-textarea"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="form-buttons">
            <button type="button" className="glass-button secondary" onClick={handleBack}>
              Back
            </button>
            <button type="submit" className="glass-button primary">
              Submit
              <span className="button-shimmer"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
// src/components/TopMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPages.css';

const TopMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="top-menu">
      <div className="top-menu-links">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/faq')}>FAQ</button>
        <button onClick={() => navigate('/privacy-policy')}>Privacy Policy</button>
        <button onClick={() => navigate('/terms-of-use')}>Terms of Use</button>
      </div>
      <div className="top-menu-auth">
        <button onClick={() => navigate('/sign-in')} className="sign-in-btn">
          Sign In
        </button>
        <button onClick={() => navigate('/register')} className="register-btn">
          Register
        </button>
      </div>
    </div>
  );
};

export default TopMenu;

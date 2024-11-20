// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header>
      <nav>
        <h1>TravelTogether</h1>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="auth-buttons">
          <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
          <button onClick={() => window.location.href = '/login'}>Log In</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

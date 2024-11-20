// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} TravelTogether. All Rights Reserved.</p>
      <ul>
        <li><a href="#privacy-policy" aria-label="Privacy Policy">Privacy Policy</a></li>
        <li><a href="#terms-of-service" aria-label="Terms of Service">Terms of Service</a></li>
        <li><a href="https://instagram.com/gettraveltogether" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">Instagram</a></li>
      </ul>
    </footer>
  );
};

export default Footer;

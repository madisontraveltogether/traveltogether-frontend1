// src/pages/PrivacyPolicy.js
import React from 'react';
import './LandingPages.css';
import TopMenu from './TopMenu';

const PrivacyPolicy = () => (
  <div className="privacy-policy-page">
    <TopMenu />
    <div className="section">
      <h2>Privacy Policy</h2>
      <p>
        At Travel Together, we are committed to protecting your personal
        information. This policy explains how we collect, use, and protect your
        data.
      </p>
      <h3>What Information We Collect</h3>
      <ul>
        <li>Personal details like name, email, and contact information.</li>
        <li>Trip-related data for planning purposes.</li>
        <li>Usage data to improve our services.</li>
      </ul>
      <h3>Contact Us</h3>
      <p>
        If you have questions about our privacy practices, email us at{' '}
        <a href="mailto:privacy@traveltogether.ca">privacy@traveltogether.ca</a>.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;

// src/pages/TermsOfUse.js
import React from 'react';
import './LandingPages.css';
import TopMenu from '../components/TopMenu';

const TermsOfUse = () => {
  return (
    <div className="terms-of-use-page">
      <TopMenu />
      <header className="terms-header">
        <h1>Terms of Use</h1>
      </header>
      <div className="terms-content">
        <h2>Introduction</h2>
        <p>
          By using Travel Together, you agree to comply with these terms. Please read them carefully before using the platform.
        </p>
        <h3>1. Use of the Platform</h3>
        <p>
          Travel Together provides tools for organizing group travel. You agree not to misuse the platform or engage in any unlawful activity.
        </p>
        <h3>2. User Responsibilities</h3>
        <p>
          You are responsible for the accuracy of the information you provide and ensuring that your activities comply with Canadian law.
        </p>
        <h3>3. Intellectual Property</h3>
        <p>
          All content on the platform, including logos and designs, is the property of Travel Together and protected by copyright laws.
        </p>
        <h3>4. Limitation of Liability</h3>
        <p>
          Travel Together is not liable for any disputes or issues arising from trip plans made through the platform.
        </p>
        <h3>5. Updates to Terms</h3>
        <p>
          These terms may be updated from time to time. Continued use of the platform implies acceptance of any changes.
        </p>
        <h3>Contact Us</h3>
        <p>
          If you have questions about these terms, contact us at support@traveltogether.ca.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;

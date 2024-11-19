import React from 'react';
import './LandingPages.css';
import TopBar from '../components/TopBar';

const AboutPage = () => {
  return (
    <div className="about-page">
      <TopBar title="About Us" />
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          At TravelTogether, our mission is to make group travel planning
          seamless and enjoyable. Whether you're planning a family reunion, a
          weekend getaway, or an epic adventure, we’re here to help you
          collaborate, organize, and share experiences with ease.
        </p>
      </section>
      <section className="values-section">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Collaboration:</strong> Bringing people together.</li>
          <li><strong>Simplicity:</strong> Making travel planning easy.</li>
          <li><strong>Innovation:</strong> Empowering users with intuitive tools.</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPages.css'; // Import your CSS file

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Top Section */}
      <header className="homepage-header">
        <h1>TravelTogether</h1>
        <p>Plan. Collaborate. Travel Stress-Free.</p>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          Get Started
        </button>
      </header>

      {/* Key Features Section */}
      <section className="features-section">
        <h2>Why Choose TravelTogether?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src="/assets/budget-icon.svg" alt="Budgeting Icon" />
            <h3>Effortless Budgeting</h3>
            <p>Split expenses and track spending with ease.</p>
          </div>
          <div className="feature-item">
            <img src="/assets/itinerary-icon.svg" alt="Itinerary Icon" />
            <h3>Collaborative Itineraries</h3>
            <p>Plan and vote on trip activities together.</p>
          </div>
          <div className="feature-item">
            <img src="/assets/messaging-icon.svg" alt="Messaging Icon" />
            <h3>Group Messaging</h3>
            <p>Stay connected with your travel group.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Start Planning Your Next Trip Today!</h2>
        <button className="cta-button" onClick={() => navigate('/signup')}>
          Sign Up for Free
        </button>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2024 TravelTogether. All rights reserved.</p>
        <nav>
          <a href="/about">About</a>
          <a href="/features">Features</a>
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
};

export default Homepage;

import React from 'react';
import './Homepage.css';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Plan Group Trips Effortlessly</h1>
        <p>Join the community making travel planning simple and fun.</p>
        <button className="cta-button">Get Started</button>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-item">
          <img src="/images/planning-icon.png" alt="Planning Icon" />
          <h3>Collaborative Trip Planning</h3>
          <p>Plan seamlessly with everyone’s input.</p>
        </div>
        <div className="features-item">
          <img src="/images/expense-icon.png" alt="Expense Icon" />
          <h3>Expense Tracking</h3>
          <p>Split bills and track budgets easily.</p>
        </div>
        <div className="features-item">
          <img src="/images/itinerary-icon.png" alt="Itinerary Icon" />
          <h3>Customizable Itineraries</h3>
          <p>Build and share your travel plans effortlessly.</p>
        </div>
        <div className="features-item">
          <img src="/images/chat-icon.png" alt="Chat Icon" />
          <h3>Polls and Messaging</h3>
          <p>Keep everyone engaged with real-time communication.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-heading">Frequently Asked Questions</h2>
        <div className="faq-list">
          <details className="faq-item">
            <summary>What is TravelTogether?</summary>
            <p>TravelTogether simplifies group travel planning with tools for itineraries, expense tracking, and collaboration.</p>
          </details>
          <details className="faq-item">
            <summary>Can I use TravelTogether for free?</summary>
            <p>Yes! Our Free Plan includes basic features for group travel planning. You can upgrade to Premium for more.</p>
          </details>
          <details className="faq-item">
            <summary>How does expense tracking work?</summary>
            <p>Expense tracking helps split costs, track payments, and ensure transparency among group members.</p>
          </details>
        </div>
      </section>

      {/* Sign-Up Form Section */}
      <section className="signup-form">
        <h2>Sign Up for Updates</h2>
        <p>Be the first to know about our latest features and updates!</p>
        <iframe
          src="https://forms.gle/eVQnAMJEC94pWFzUA"
          title="Sign-Up Form"
        ></iframe>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 TravelTogether. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

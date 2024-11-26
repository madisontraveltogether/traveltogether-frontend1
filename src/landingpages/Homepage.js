import React from 'react';
import './Homepage.css';

const Home = () => {
  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">TravelTogether</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#faq">FAQs</a></li>
          <li><a href="#signup">Sign Up</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <h1>Effortless Group Travel Planning</h1>
        <p>Join thousands of travelers making trips stress-free and fun.</p>
        <button className="cta-button" onClick={() => document.getElementById('signup').scrollIntoView()}>Get Started</button>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Features</h2>
        <div className="features-item">
          <img src="/images/planning-icon.png" alt="Planning Icon" />
          <h3>Collaborative Planning</h3>
          <p>Plan trips with everyone’s input in one place.</p>
        </div>
        <div className="features-item">
          <img src="/images/expense-icon.png" alt="Expense Icon" />
          <h3>Expense Tracking</h3>
          <p>Keep track of expenses and split bills effortlessly.</p>
        </div>
        <div className="features-item">
          <img src="/images/itinerary-icon.png" alt="Itinerary Icon" />
          <h3>Customizable Itineraries</h3>
          <p>Create and share travel plans with ease.</p>
        </div>
        <div className="features-item">
          <img src="/images/chat-icon.png" alt="Chat Icon" />
          <h3>Polls and Messaging</h3>
          <p>Engage your group with polls and messaging.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq">
        <h2>Frequently Asked Questions</h2>
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
      </section>

      {/* Sign-Up Form Section */}
      <section id="signup" className="signup-form">
        <h2>Sign Up for Updates</h2>
        <p>Be the first to know about our latest features and updates!</p>
        <iframe
          src="https://forms.gle/eVQnAMJEC94pWFzUA"
          title="Sign-Up Form"
        ></iframe>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 TravelTogether. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

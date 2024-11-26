import React from 'react';
import './Homepage.css';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Plan Group Trips Effortlessly</h1>
          <p>Join the community making travel planning simple and fun.</p>
          <button className="cta-button">Get Started</button>
          <button className="secondary-button">Log In</button>
        </div>
        <div className="hero-image">
          <img src="/images/app-preview.png" alt="TravelTogether App Preview" />
        </div>
      </section>

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

      <section className="pricing">
        <div className="pricing-card">
          <h3>Free Plan</h3>
          <p>Basic tools to get started with group travel planning.</p>
          <button className="cta-button">Sign Up for Free</button>
        </div>
        <div className="pricing-card">
          <h3>Premium Plan</h3>
          <p>Unlock all features, unlimited trips, and priority support.</p>
          <button className="cta-button">Explore Premium</button>
        </div>
      </section>

      <section className="testimonials">
        <blockquote>
          "TravelTogether made planning our family reunion a breeze! The expense tracking was a lifesaver."
          <cite>– Sarah L.</cite>
        </blockquote>
        <blockquote>
          "I can't believe how easy it was to coordinate our trip to Europe. Highly recommended!"
          <cite>– Alex W.</cite>
        </blockquote>
      </section>

      <footer className="footer">
        <p>&copy; 2024 TravelTogether. All rights reserved.</p>
        <nav>
          <a href="#about">About</a> | <a href="#faq">FAQ</a> | <a href="#contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
};

export default Home;

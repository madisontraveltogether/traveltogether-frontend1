// src/pages/Home.js
import React from 'react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="hero">
        <h1>Welcome to TravelTogether</h1>
        <p>Effortless group travel planning at your fingertips.</p>
        <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
        <button onClick={() => window.location.href = '/login'}>Log In</button>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>At TravelTogether, our mission is to make group travel seamless and fun. Whether you're planning a family reunion, a friend's getaway, or a corporate retreat, we have the tools you need to bring everyone together.</p>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Features</h2>
        <ul>
          <li>Collaborative Trip Planning</li>
          <li>Expense Tracking and Splitting</li>
          <li>Customizable Itineraries</li>
          <li>Polls and Messaging</li>
        </ul>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <h2>Pricing</h2>
        <div>
          <h3>Free Plan</h3>
          <p>Basic features to get started.</p>
        </div>
        <div>
          <h3>Premium Plan</h3>
          <p>All features, unlimited trips, and priority support.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq">
        <h2>FAQ</h2>
        <div>
          <h3>How does TravelTogether work?</h3>
          <p>We make group travel planning easier by centralizing all the tools you need.</p>
        </div>
        <div>
          <h3>Is there a free plan?</h3>
          <p>Yes! You can start with basic features for free.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <form>
          <label>Name</label>
          <input type="text" placeholder="Your Name" />
          <label>Email</label>
          <input type="email" placeholder="Your Email" />
          <label>Message</label>
          <textarea placeholder="Your Message"></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default Home;

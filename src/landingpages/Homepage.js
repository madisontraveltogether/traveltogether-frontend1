// src/pages/Home.js
import React from 'react';
import { Flight, AttachMoney, EventNote, Chat } from '@mui/icons-material';
import './Homepage.css';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="hero">
        <h1>Welcome to TravelTogether</h1>
        <p>Effortless group travel planning at your fingertips.</p>
        <button onClick={() => window.location.href = '/signup'} aria-label="Sign up for an account">
          Sign Up
        </button>
        <button onClick={() => window.location.href = '/login'} aria-label="Log in to your account">
          Log In
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
          At TravelTogether, our mission is to make group travel seamless and fun. Whether you're planning a family reunion, a friend's getaway, or a corporate retreat, we have the tools you need to bring everyone together.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Features</h2>
        <ul className="features-list">
          <li>
            <Flight fontSize="large" aria-hidden="true" />
            <h3>Collaborative Trip Planning</h3>
            <p>Plan trips with your group effortlessly.</p>
          </li>
          <li>
            <AttachMoney fontSize="large" aria-hidden="true" />
            <h3>Expense Tracking</h3>
            <p>Split bills and track budgets seamlessly.</p>
          </li>
          <li>
            <EventNote fontSize="large" aria-hidden="true" />
            <h3>Customizable Itineraries</h3>
            <p>Organize every detail in one place.</p>
          </li>
          <li>
            <Chat fontSize="large" aria-hidden="true" />
            <h3>Polls and Messaging</h3>
            <p>Engage your group in real-time.</p>
          </li>
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
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Your Name" aria-required="true" />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Your Email" aria-required="true" />
          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Your Message" aria-required="true"></textarea>
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default Home;


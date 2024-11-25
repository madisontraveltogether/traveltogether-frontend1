import React from 'react';
import './Homepage.css';

const Home = () => {
  return (
    <div>
      {/* Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">Skip to main content</a>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Welcome to TravelTogether</h1>
          <p>Effortless group travel planning, made for every journey.</p>
          <button 
            onClick={() => window.location.href = '/signup'} 
            aria-label="Sign up for TravelTogether"
            className="cta-button"
          >
            Get Started
          </button>
          <button 
            onClick={() => window.location.href = '/login'} 
            aria-label="Log in to TravelTogether"
            className="secondary-button"
          >
            Log In
          </button>
        </div>
        <div className="hero-image">
          <img src="/images/hero-banner.jpg" alt="A group of friends enjoying a trip together" />
        </div>
      </section>

      {/* Main Content Wrapper */}
      <div id="main-content">
        {/* About Section */}
        <section id="about" className="about">
          <h2>About Us</h2>
          <p>
            At TravelTogether, we’re passionate about simplifying group travel. 
            Whether it’s a family reunion, a weekend getaway with friends, or a corporate retreat, 
            our tools are designed to make planning easy, fun, and collaborative.
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2>Features</h2>
          <ul className="features-list">
            <li>
              <img src="/images/planning-icon.png" alt="" aria-hidden="true" />
              <h3>Collaborative Trip Planning</h3>
              <p>Plan your trip seamlessly with everyone’s input in one place.</p>
            </li>
            <li>
              <img src="/images/expense-icon.png" alt="" aria-hidden="true" />
              <h3>Expense Tracking</h3>
              <p>Split bills, track budgets, and keep everyone on the same page.</p>
            </li>
            <li>
              <img src="/images/itinerary-icon.png" alt="" aria-hidden="true" />
              <h3>Customizable Itineraries</h3>
              <p>Build and share your travel plans effortlessly.</p>
            </li>
            <li>
              <img src="/images/chat-icon.png" alt="" aria-hidden="true" />
              <h3>Polls and Messaging</h3>
              <p>Keep everyone engaged with real-time messaging and polls.</p>
            </li>
          </ul>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <h2>Pricing</h2>
          <div className="pricing-card">
            <h3>Free Plan</h3>
            <p>Access basic tools to get started.</p>
            <button className="cta-button">Sign Up for Free</button>
          </div>
          <div className="pricing-card">
            <h3>Premium Plan</h3>
            <p>Unlock all features, unlimited trips, and priority support.</p>
            <button className="cta-button">Explore Premium</button>
          </div>
        </section>

        {/* Social Proof Section */}
        <section id="testimonials" className="testimonials">
          <h2>What Our Users Say</h2>
          <blockquote>
            "TravelTogether made planning our family reunion a breeze! The expense tracking and itinerary features were a lifesaver." 
            <cite>– Sarah L.</cite>
          </blockquote>
          <blockquote>
            "I can't believe how easy it was to coordinate our trip to Europe with TravelTogether. Highly recommended!" 
            <cite>– Alex W.</cite>
          </blockquote>
        </section>

        {/* Call-to-Action Section */}
        <section id="cta" className="cta">
          <h2>Start Your Journey Today</h2>
          <p>Sign up now and take the stress out of group travel planning!</p>
          <button 
            onClick={() => window.location.href = '/signup'} 
            aria-label="Sign up for TravelTogether"
            className="cta-button"
          >
            Get Started
          </button>
        </section>

        {/* FAQ Section */}
        <section id="faq" class="faq-section">
  <h2 class="faq-heading">Frequently Asked Questions</h2>

  <input type="text" placeholder="Search FAQs..." class="faq-search" aria-label="Search FAQs" />

  <div class="faq-list">
    <details class="faq-item">
      <summary>What is TravelTogether?</summary>
      <p>TravelTogether is a platform designed to simplify group travel planning by providing tools for itineraries, expense tracking, and real-time collaboration.</p>
    </details>
    <details class="faq-item">
      <summary>Who is TravelTogether for?</summary>
      <p>TravelTogether is perfect for families, friends, and colleagues planning group trips.</p>
    </details>
    <details class="faq-item">
      <summary>Do I need to download an app, or can I use it on a web browser?</summary>
      <p>TravelTogether is accessible via both web browsers and our mobile app, available for iOS and Android.</p>
    </details>
    <details class="faq-item">
      <summary>Can I use TravelTogether for free?</summary>
      <p>Yes! Our Free Plan includes basic features, and you can upgrade to Premium for unlimited trips and additional features.</p>
    </details>
    <details class="faq-item">
      <summary>How does expense tracking work?</summary>
      <p>Expense tracking allows you to split costs, track payments, and ensure transparency among group members.</p>
    </details>
    <details class="faq-item">
      <summary>Can I invite others to collaborate on a trip?</summary>
      <p>Absolutely! You can invite others via email or share a link to join your trip.</p>
    </details>
    <details class="faq-item">
      <summary>What happens to a trip after it’s completed?</summary>
      <p>Completed trips are archived automatically, and you can revisit them anytime for memories or financial records.</p>
    </details>
    <details class="faq-item">
      <summary>Is my data safe with TravelTogether?</summary>
      <p>Yes, we use encryption to secure your data and comply with international privacy standards.</p>
    </details>
    <details class="faq-item">
      <summary>How do I contact support if I have an issue?</summary>
      <p>You can reach us anytime at help@gettraveltogether.com.</p>
    </details>
  </div>
</section>


        {/* Sign-Up Form Section */}
        <section id="signup-form" className="signup-form">
          <h2>Sign Up for Updates</h2>
          <p>Be the first to know about our latest features and updates!</p>
          <iframe
            src="https://forms.gle/eVQnAMJEC94pWFzUA"
            width="100%"
            height="500"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Sign-Up Form"
          >
            Loading…
          </iframe>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <p>Email us at <a href="mailto:help@gettraveltogether.com">help@gettraveltogether.com</a></p>
        </section>
      </div>

      {/* Footer Section */}
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

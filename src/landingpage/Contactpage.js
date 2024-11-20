import React, { useState } from 'react';
import './LandingPages.css';
import TopMenu from './TopMenu';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We’ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <TopMenu/>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;

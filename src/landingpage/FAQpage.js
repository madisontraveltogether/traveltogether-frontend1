// src/pages/FAQ.js
import React, { useState } from 'react';
import './LandingPages.css';
import TopMenu from './TopMenu';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What is Travel Together?',
      answer: 'Travel Together is an app that simplifies group travel planning. From itineraries to expenses, it keeps everything organized in one place.',
    },
    {
      question: 'How do I sign up?',
      answer: 'Click on the "Register" button at the top of the page and fill in your details to create an account.',
    },
    {
      question: 'Is Travel Together free?',
      answer: 'Yes! Travel Together is free to use. Additional premium features may be introduced in the future.',
    },
    {
      question: 'Can I use Travel Together on my phone?',
      answer: 'Absolutely! Our platform is fully optimized for mobile devices.',
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-page">
      <TopMenu />
      <div className="section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <h3>{faq.question}</h3>
            {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

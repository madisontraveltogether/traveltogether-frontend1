import React from 'react';
import './LandingPages.css';
import TopBar from '../components/TopBar';

const FeaturesPage = () => {
  const features = [
    {
      title: 'Effortless Budgeting',
      description: 'Split expenses and track spending seamlessly.',
      icon: '/assets/budget-icon.svg',
    },
    {
      title: 'Collaborative Itineraries',
      description: 'Plan and vote on trip activities together.',
      icon: '/assets/itinerary-icon.svg',
    },
    {
      title: 'Group Messaging',
      description: 'Stay connected with your travel group.',
      icon: '/assets/messaging-icon.svg',
    },
  ];

  return (
    <div className="features-page">
      <TopBar title="Features" />
      <section className="features-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <img src={feature.icon} alt={feature.title} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FeaturesPage;

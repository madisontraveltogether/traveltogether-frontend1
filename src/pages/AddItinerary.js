import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../css/AddItinerary.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const AddItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tripDates = location.state?.tripDates || [];  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    day: '', // Selected day
  });
  const [error, setError] = useState('');
  console.log('Received Trip Dates:', tripDates); // Debugging: Ensure the dates are passed correctly


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/trips/${tripId}/itinerary`, formData);
      navigate(`/trips/${tripId}/itinerary`);
    } catch (err) {
      setError('Failed to add itinerary item.');
    }
  };

  return (
    <div className="ass-itinerary">
      <TopBar title="New Itinerary Item" />
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Day *</label>
          {tripDates.length > 0 ? (
        <ul>
          {tripDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      ) : (
        <p>No trip dates available</p>
      )}
        </div>
        <button type="submit" className="submit-btn">
          Add Item
        </button>
      </form>
      <BottomNav />
    </div>
  );
};

export default AddItinerary;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import '../css/AddItinerary.css';

const AddItinerary = () => {
  const { tripId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
          <label>Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
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

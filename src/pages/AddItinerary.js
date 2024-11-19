import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/AddItinerary.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const AddItinerary = () => {
  const { tripId } = useParams();
  const [suggestion, setSuggestion] = useState({
    name: '',
    type: '',
    dateTime: '',
    link: '',
    description: '',
    voteCutoff: '',
  });
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    setPhotos([...photos, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', suggestion.name);
    formData.append('type', suggestion.type);
    formData.append('dateTime', suggestion.dateTime);
    formData.append('link', suggestion.link);
    formData.append('description', suggestion.description);
    formData.append('voteCutoff', suggestion.voteCutoff);
    photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });

    try {
      await api.post(`/trips/${tripId}/itinerary/suggestions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Suggestion added successfully!');
      navigate(`/trips/${tripId}/itinerary`);

    } catch (err) {
      setError('Failed to add suggestion.');
    }
  };

  return (
    <div className="ass-itinerary">
      <TopBar title="New Suggestion" />
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Add Photos</label>
          <input type="file" multiple onChange={handleAddPhoto} />
          <div className="photos-preview">
            {photos.map((photo, index) => (
              <img key={index} src={URL.createObjectURL(photo)} alt="Preview" />
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Event Name *</label>
          <input
            type="text"
            value={suggestion.name}
            onChange={(e) => setSuggestion({ ...suggestion, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Type *</label>
          <select
            value={suggestion.type}
            onChange={(e) => setSuggestion({ ...suggestion, type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            <option value="Flights">Flights</option>
            <option value="Train">Train</option>
            <option value="Bus">Bus</option>
            <option value="Car Rental">Car Rental</option>
            <option value="Taxi/Rideshare">Taxi/Rideshare</option>
            <option value="Hotel">Hotel</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Hostel">Hostel</option>
            <option value="Camping">Camping</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
            <option value="Sightseeing">Sightseeing</option>
            <option value="Shows/Entertainment">Shows/Entertainment</option>
            <option value="Tours">Tours</option>
            <option value="Adventure">Adventure</option>
            <option value="Shopping">Shopping</option>
            <option value="Weddings">Weddings</option>
            <option value="Parties">Parties</option>
            <option value="Festivals">Festivals</option>
            <option value="Free Time">Free Time</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={suggestion.dateTime}
            onChange={(e) => setSuggestion({ ...suggestion, dateTime: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Link</label>
          <input
            type="url"
            value={suggestion.link}
            onChange={(e) => setSuggestion({ ...suggestion, link: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={suggestion.description}
            onChange={(e) => setSuggestion({ ...suggestion, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Voting Cutoff Date</label>
          <input
            type="date"
            value={suggestion.voteCutoff}
            onChange={(e) => setSuggestion({ ...suggestion, voteCutoff: e.target.value })}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-btn">
            Add Suggestion
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItinerary;

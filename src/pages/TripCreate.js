// src/pages/TripCreate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api';

const TripCreate = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [tripType, setTripType] = useState('vacation');
  const [coverImage, setCoverImage] = useState(null);
  const [guests, setGuests] = useState(['']); // Array for guests
  const [collaborators, setCollaborators] = useState(['']); // Array for collaborators
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (location) formData.append('location', location);
      if (description) formData.append('description', description);
      if (startDate) formData.append('startDate', startDate);
      if (endDate) formData.append('endDate', endDate);
      formData.append('privacy', privacy);
      formData.append('tripType', tripType);
      if (coverImage) formData.append('coverImage', coverImage);

      // Add guests and collaborators if they are entered
      guests.forEach((guest, index) => {
        if (guest) formData.append(`guests[${index}]`, guest);
      });
      collaborators.forEach((collaborator, index) => {
        if (collaborator) formData.append(`collaborators[${index}]`, collaborator);
      });

      const response = await createTrip(formData);
      navigate(`/trip/${response._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating trip');
    }
  };

  const handleGuestChange = (index, value) => {
    const newGuests = [...guests];
    newGuests[index] = value;
    setGuests(newGuests);
  };

  const handleAddGuest = () => {
    setGuests([...guests, '']);
  };

  const handleCollaboratorChange = (index, value) => {
    const newCollaborators = [...collaborators];
    newCollaborators[index] = value;
    setCollaborators(newCollaborators);
  };

  const handleAddCollaborator = () => {
    setCollaborators([...collaborators, '']);
  };

  return (
    <div>
      <h2>Create a New Trip</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name (Required):
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>

        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>

        <label>
          Privacy:
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>

        <label>
          Trip Type:
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="vacation">Vacation</option>
            <option value="business">Business</option>
            <option value="family">Family</option>
            <option value="adventure">Adventure</option>
          </select>
        </label>

        <label>
          Cover Image:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        <h3>Guests</h3>
        {guests.map((guest, index) => (
          <div key={index}>
            <input
              type="email"
              placeholder="Guest email"
              value={guest}
              onChange={(e) => handleGuestChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddGuest}>Add Guest</button>

        <h3>Collaborators</h3>
        {collaborators.map((collaborator, index) => (
          <div key={index}>
            <input
              type="email"
              placeholder="Collaborator email"
              value={collaborator}
              onChange={(e) => handleCollaboratorChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddCollaborator}>Add Collaborator</button>

        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
};

export default TripCreate;

// src/pages/TripDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TripDetails = () => {
  const { tripId } = useParams(); // Get trip ID from the URL
  const [trip, setTrip] = useState(null); // Store trip details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`); // Fetch trip details
        console.log('Trip details response:', response.data); // Debug response
        setTrip(response.data); // Set trip data
        setLoading(false); // Stop loading
      } catch (err) {
        console.error('Error fetching trip details:', err); // Log error
        setError('Failed to load trip details. Please try again later.');
        setLoading(false); // Stop loading
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return <p>Loading trip details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!trip) {
    return <p>No trip details available.</p>;
  }

  return (
    <div className="trip-details">
      <h2>{trip.name || 'Untitled Trip'}</h2>

      {/* Trip Cover Image */}
      <div className="trip-cover">
        <img
          src={trip.coverImage || 'default-image.jpg'}
          alt={trip.name || 'Trip Cover'}
          className="cover-image"
        />
      </div>

      {/* Trip Information */}
      <div className="trip-info">
        <p><strong>Location:</strong> {trip.location || 'Not specified'}</p>
        <p>
          <strong>Dates:</strong>{' '}
          {trip.startDate
            ? new Date(trip.startDate).toLocaleDateString()
            : 'Start date not set'}{' '}
          -{' '}
          {trip.endDate
            ? new Date(trip.endDate).toLocaleDateString()
            : 'End date not set'}
        </p>
        <p><strong>Description:</strong> {trip.description || 'No description available'}</p>
        <p><strong>Organizer:</strong> {trip.organizer?.name || 'Unknown'}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={() => window.location.href = `/trips/${tripId}/plans`}>
          Plans
        </button>
        <button onClick={() => window.location.href = `/trips/${tripId}/expenses`}>
          Expenses
        </button>
        <button onClick={() => window.location.href = `/trips/${tripId}/messages`}>
          Messages
        </button>
      </div>
    </div>
  );
};

export default TripDetails;
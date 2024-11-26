import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/MyTrips.css';
import TopBar from '../components/TopBar';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await api.get('api/trips/all');
        setTrips(response.data); // Use the response data directly
      } catch (err) {
        setError('Failed to load trips.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleCreateNewTrip = () => {
    navigate('/create-trip');
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || trip.privacy === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="my-trips-container">
      <TopBar title="My Trips" />

      <div className="my-trips-header">
        <button onClick={handleCreateNewTrip}>Create New Trip</button>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {loading ? (
        <p>Loading trips...</p>
      ) : trips.length === 0 ? (
        <p>No trips found. Click "Create New Trip" to start planning!</p>
      ) : (
        <ul className="trip-list">
          {filteredTrips.map((trip) => (
            <li key={trip._id}>
              <div className="trip-info" onClick={() => navigate(`/trips/${trip._id}`)}>
                <img
                  src={trip.coverImage || '/default-cover.jpg'}
                  alt={`${trip.name} cover`}
                />
                <div>
                  <h3>{trip.name}</h3>
                  <p>Location: {trip.location || 'Not specified'}</p>
                  <p>
                    Dates:{' '}
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'N/A'} -{' '}
                    {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>Privacy: {trip.privacy}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTrips;

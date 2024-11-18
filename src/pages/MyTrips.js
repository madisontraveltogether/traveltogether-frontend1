import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/MyTrips.css'; // Import the new CSS file

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
        const response = await api.get('/trips/all');
        setTrips(response.data);
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

  const now = new Date();
  const upcomingTrips = filteredTrips.filter((trip) => new Date(trip.startDate) > now);
  const pastTrips = filteredTrips.filter((trip) => new Date(trip.startDate) <= now);

  return (
    <div className="my-trips-container">
      <div className="my-trips-header">
        <h2>My Trips</h2>
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
        <div>
          <h3>Upcoming Trips</h3>
          <ul className="trip-list">
            {upcomingTrips.length === 0 ? (
              <p>No upcoming trips found.</p>
            ) : (
              upcomingTrips.map((trip) => (
                <li key={trip._id} onClick={() => navigate(`/trips/${trip._id}`)}>
                  <img
                    src={trip.coverImage || '/default-cover.jpg'}
                    alt={`${trip.name} cover`}
                  />
                  <div>
                    <h3>{trip.name}</h3>
                    <p>Location: {trip.location || 'Not specified'}</p>
                    <p>
                      Dates:{' '}
                      {trip.startDate
                        ? new Date(trip.startDate).toLocaleDateString()
                        : 'N/A'}{' '}
                      -{' '}
                      {trip.endDate
                        ? new Date(trip.endDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p>Privacy: {trip.privacy}</p>
                  </div>
                </li>
              ))
            )}
          </ul>

          <h3>Past Trips</h3>
          <ul className="trip-list">
            {pastTrips.length === 0 ? (
              <p>No past trips found.</p>
            ) : (
              pastTrips.map((trip) => (
                <li key={trip._id} onClick={() => navigate(`/trips/${trip._id}`)}>
                  <img
                    src={trip.coverImage || '/default-cover.jpg'}
                    alt={`${trip.name} cover`}
                  />
                  <div>
                    <h3>{trip.name}</h3>
                    <p>Location: {trip.location || 'Not specified'}</p>
                    <p>
                      Dates:{' '}
                      {trip.startDate
                        ? new Date(trip.startDate).toLocaleDateString()
                        : 'N/A'}{' '}
                      -{' '}
                      {trip.endDate
                        ? new Date(trip.endDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p>Privacy: {trip.privacy}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyTrips;

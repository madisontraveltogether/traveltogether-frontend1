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
  const [menuOpen, setMenuOpen] = useState(null); // Track which trip's menu is open
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await api.get('api/trips/all');
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

  const handleMenuToggle = (tripId) => {
    setMenuOpen(menuOpen === tripId ? null : tripId);
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        await api.delete(`/api/trips/${tripId}`);
        setTrips(trips.filter((trip) => trip.tripId !== tripId));
      } catch (err) {
        setError('Failed to delete trip.');
      }
    }
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
        <div>
          <h3>Upcoming Trips</h3>
          <ul className="trip-list">
            {upcomingTrips.length === 0 ? (
              <p>No upcoming trips found.</p>
            ) : (
              upcomingTrips.map((trip) => (
                <li key={trip.tripId}>
                  <div className="trip-info" onClick={() => navigate(`/trips/${trip.tripId}`)}>
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
                  </div>

                  <div className="kebab-menu">
                    <button className="menu-button" onClick={(e) => { e.stopPropagation(); handleMenuToggle(trip.tripId); }}>
                      &#x22EE; {/* Three vertical dots */}
                    </button>
                    {menuOpen === trip.tripId && (
                      <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => navigate(`/trips/${trip.tripId}/edit`)}>Edit Trip</button>
                        <button onClick={() => navigate(`/trips/${trip.tripId}/add-guests`)}>Add Guests</button>
                        <button className="delete-button" onClick={() => handleDeleteTrip(trip.tripId)}>
                          Delete Trip
                        </button>
                      </div>
                    )}
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
                <li key={trip.tripId}>
                  <div className="trip-info" onClick={() => navigate(`/trips/${trip.tripId}`)}>
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
                  </div>

                  <div className="kebab-menu">
                    <button className="menu-button" onClick={(e) => { e.stopPropagation(); handleMenuToggle(trip.tripId); }}>
                      &#x22EE;
                    </button>
                    {menuOpen === trip.tripId && (
                      <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => navigate(`/trips/${trip.tripId}/edit`)}>Edit Trip</button>
                        <button onClick={() => navigate(`/trips/${trip.tripId}/add-guests`)}>Add Guests</button>
                        <button className="delete-button" onClick={() => handleDeleteTrip(trip.tripId)}>
                          Delete Trip
                        </button>
                      </div>
                    )}
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

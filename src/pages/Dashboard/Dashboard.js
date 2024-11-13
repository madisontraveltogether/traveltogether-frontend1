import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/trips'); // Assuming an endpoint to fetch user's trips
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <h3>Your Trips</h3>
      {trips.map(trip => (
        <div key={trip._id}>
          <Link to={`/trip/${trip._id}`}>{trip.name}</Link>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

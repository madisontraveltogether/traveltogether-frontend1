// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import tripService from '../../services/tripService'; // Service to fetch trip details
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [invitedTrips, setInvitedTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        fetchUserTrips(userData.id); // Assuming `id` represents user’s unique ID
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchUserTrips = async (userId) => {
    try {
      const createdTrips = await tripService.getUserTrips(userId); // Fetch trips created by the user
      const invitedTripsData = await tripService.getInvitedTrips(userId); // Fetch trips the user is invited to
      setTrips(createdTrips);
      setInvitedTrips(invitedTripsData);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button onClick={handleLogout}>Logout</button>

      <h3>Your Trips</h3>
      {trips.length ? (
        <ul>
          {trips.map(trip => (
            <li key={trip._id}>
              {trip.name} - <button onClick={() => navigate(`/trips/${trip._id}`)}>View</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no trips yet.</p>
      )}

      <h3>Invited Trips</h3>
      {invitedTrips.length ? (
        <ul>
          {invitedTrips.map(trip => (
            <li key={trip._id}>
              {trip.name} - <button onClick={() => navigate(`/trips/${trip._id}`)}>View</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No invitations at the moment.</p>
      )}
    </div>
  );
}

export default Profile;

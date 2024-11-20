// src/pages/TripInvitations.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TripInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await api.get('/user/invitations');
        setInvitations(response.data);
      } catch (err) {
        setError('Failed to load invitations.');
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId) => {
    try {
      await api.post(`/user/invitations/${invitationId}/accept`);
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
    } catch (err) {
      setError('Failed to accept invitation.');
    }
  };

  const handleDecline = async (invitationId) => {
    try {
      await api.post(`/user/invitations/${invitationId}/decline`);
      setInvitations(invitations.filter(inv => inv._id !== invitationId));
    } catch (err) {
      setError('Failed to decline invitation.');
    }
  };

  return (
    <div>
      <TopBar title="Trip Invitations" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {invitations.length === 0 ? (
        <p>You have no invitations.</p>
      ) : (
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation._id}>
              <h3>{invitation.trip.name}</h3>
              <p>Organizer: {invitation.trip.organizer.name}</p>
              <p>Destination: {invitation.trip.destination}</p>
              <button onClick={() => handleAccept(invitation._id)}>Accept</button>
              <button onClick={() => handleDecline(invitation._id)}>Decline</button>
            </li>
          ))}
        </ul>
      )}
<BottomNav tripId={tripId} />
    </div>
  );
};

export default TripInvitations;

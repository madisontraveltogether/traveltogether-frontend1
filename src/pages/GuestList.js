import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const GuestList = () => {
  const { tripId } = useParams();
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [sortField, setSortField] = useState('');
  const [rsvpCounters, setRSVPCounters] = useState({
    going: 0,
    maybe: 0,
    notGoing: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/guests`);
        setGuests(response.data);
        fetchRSVPCounters();
      } catch (err) {
        setError('Failed to load guest list.');
      }
    };

    const fetchRSVPCounters = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/guests/rsvp-counters`);
        setRSVPCounters(response.data);
      } catch (err) {
        setError('Failed to fetch RSVP counters.');
      }
    };

    fetchGuests();
  }, [tripId]);

  const handleAddGuest = async () => {
    if (!newGuestEmail || !newGuestName) {
      setError('Both name and email are required.');
      return;
    }

    try {
      const response = await api.post(`/trips/${tripId}/guests`, {
        email: newGuestEmail,
        name: newGuestName,
      });
      setGuests(response.data);
      setNewGuestEmail('');
      setNewGuestName('');
      setError('');
    } catch (err) {
      setError('Failed to add guest.');
    }
  };

  const handleRemoveGuest = async (email) => {
    if (!window.confirm('Are you sure you want to remove this guest?')) return;

    try {
      const response = await api.delete(`/trips/${tripId}/guests/${email}`);
      setGuests(response.data);
    } catch (err) {
      setError('Failed to remove guest.');
    }
  };

  const handleUpdateRSVP = async (email, rsvpStatus) => {
    try {
      const response = await api.patch(`/trips/${tripId}/guests/${email}/rsvp`, {
        rsvpStatus,
      });
      setGuests(response.data);
    } catch (err) {
      setError('Failed to update RSVP status.');
    }
  };

  const sortedGuests = [...guests].sort((a, b) => {
    if (!sortField) return 0;
    return a[sortField].localeCompare(b[sortField]);
  });

  return (
    <div>
      <TopBar title="Guest List" />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* RSVP Counters */}
      <div>
        <p>Going: {rsvpCounters.going}</p>
        <p>Maybe: {rsvpCounters.maybe}</p>
        <p>Not Going: {rsvpCounters.notGoing}</p>
        <p>Pending: {rsvpCounters.pending}</p>
      </div>

      {/* Add Guest Form */}
      <div>
        <input
          type="text"
          placeholder="Guest Name"
          value={newGuestName}
          onChange={(e) => setNewGuestName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Guest Email"
          value={newGuestEmail}
          onChange={(e) => setNewGuestEmail(e.target.value)}
        />
        <button onClick={handleAddGuest}>Add Guest</button>
      </div>

      {/* Sort Options */}
      <label>
        Sort By:
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="">None</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="rsvpStatus">RSVP Status</option>
        </select>
      </label>

      {/* Guest List */}
      <ul>
        {sortedGuests.map((guest) => (
          <li key={guest.email}>
            <p>
              <strong>{guest.name}</strong> ({guest.email}) - {guest.rsvpStatus}
            </p>
            <button onClick={() => handleUpdateRSVP(guest.email, 'going')}>Going</button>
            <button onClick={() => handleUpdateRSVP(guest.email, 'maybe')}>Maybe</button>
            <button onClick={() => handleUpdateRSVP(guest.email, 'notGoing')}>Not Going</button>
            <button onClick={() => handleRemoveGuest(guest.email)}>Remove</button>
          </li>
        ))}
      </ul>
ctive="messages"
    </div>
  );
};

export default GuestList;

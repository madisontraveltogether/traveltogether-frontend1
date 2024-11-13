import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data);
      } catch (error) {
        console.error('Error fetching trip details:', error);
      }
    };
    fetchTripDetails();
  }, [tripId]);

  return (
    <div>
      {trip ? (
        <>
          <h2>{trip.name}</h2>
          <p>{trip.description}</p>
          <p>Location: {trip.location}</p>
          {/* Add links to navigate to expenses, tasks, etc. */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TripDetails;

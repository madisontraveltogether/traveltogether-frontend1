import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/TripDashboard"
const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}`);
        setTrip(response.data);
      } catch (err) {
        setError("Failed to load trip details.");
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-container">
      <div className="cover-photo">
        <img src="https://via.placeholder.com/428x200" alt="Cover" />
      </div>

      <div className="trip-details">
        <h1>{trip.name || "Trip Name"}</h1>
        <p>{trip.description || "Trip Description"}</p>
        <div className="trip-info">
          <span>{trip.location || "Location"}</span>
          <span>{trip.dates || "Dates"}</span>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TripDetails;

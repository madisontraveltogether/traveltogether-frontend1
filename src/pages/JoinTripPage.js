import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const JoinTrip = ({ currentUser }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, );

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}`);
      setTripDetails(response.data);
    } catch (err) {
      setError("Failed to load trip details. The link may be invalid or expired.");
    }
  };

  const handleJoinTrip = async () => {
    if (!currentUser) {
      alert("You need to log in to join the trip.");
      navigate("/login");
      return;
    }

    setJoining(true);
    try {
      await api.post(`/api/trips/${tripId}/join`, { userId: currentUser.id });
      alert("Successfully joined the trip!");
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError("Failed to join the trip. Please try again later.");
    } finally {
      setJoining(false);
    }
  };

  if (!tripDetails && !error) return <p>Loading...</p>;

  return (
    <div className="join-trip-page">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="trip-invitation-details">
          <h1>You're Invited to a Trip!</h1>
          <p>
            <strong>{tripDetails.organizer?.name || "The organizer"}</strong> has invited you to join the trip{" "}
            <strong>"{tripDetails.name}"</strong> on TravelTogether.
          </p>
          <p>{tripDetails.description || "No additional details provided."}</p>
          <p>
            Start Date: {tripDetails.startDate ? new Date(tripDetails.startDate).toLocaleDateString() : "N/A"} <br />
            End Date: {tripDetails.endDate ? new Date(tripDetails.endDate).toLocaleDateString() : "N/A"}
          </p>
          {currentUser ? (
            <button className="join-trip-button" onClick={handleJoinTrip} disabled={joining}>
              {joining ? "Joining..." : "Join Trip"}
            </button>
          ) : (
            <div>
              <p>If you don't have a TravelTogether account, sign up to join the trip:</p>
              <button onClick={() => navigate("/signup")} className="signup-button">
                Sign Up Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinTrip;

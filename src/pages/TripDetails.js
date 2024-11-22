import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/TripDashboard.css"

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const isOrganizer = currentUser?.id === trip?.organizer?.id;

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}`);
        setTrip(response.data);
        setEditForm({
          description: response.data.description || "",
          location: response.data.location || "",
          startDate: response.data.startDate || "",
          endDate: response.data.endDate || "",
        });
      } catch (err) {
        setError("Failed to load trip details.");
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSaveChanges = async () => {
    try {
      const response = await api.patch(`/api/trips/${tripId}`, editForm);
      setTrip(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes.");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      description: trip.description,
      location: trip.location,
      startDate: trip.startDate,
      endDate: trip.endDate,
    });
    setIsEditing(false);
  };


  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-container">
      <div className="cover-photo">
        <img src="https://via.placeholder.com/428x200" alt="Cover" />
      </div>

      <div className="trip-details">
        {isEditing ? (
          <div className="edit-trip-form">
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleInputChange}
              placeholder="Enter trip description"
            />
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleInputChange}
              placeholder="Enter location"
            />
            <input
              type="date"
              name="startDate"
              value={editForm.startDate}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="endDate"
              value={editForm.endDate}
              onChange={handleInputChange}
            />
            <button onClick={handleSaveChanges}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <>
            <h1>{trip.name || "Trip Name"}</h1>
            <p>{trip.description || "No description provided."}</p>
            <p>{trip.location || "Location not set."}</p>
            <p>
              {trip.startDate
                ? `Start Date: ${new Date(trip.startDate).toLocaleDateString()}`
                : "Start Date not set."}
            </p>
            <p>
              {trip.endDate
                ? `End Date: ${new Date(trip.endDate).toLocaleDateString()}`
                : "End Date not set."}
            </p>
            {isOrganizer && (
              <button onClick={() => setIsEditing(true)}>Edit Trip</button>
            )}
          </>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};


export default TripDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../css/TripDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEdit, faUserCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import BottomNav from '../components/BottomNav';

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [organizerName, setOrganizerName] = useState("Organizer Unknown");
  const [inviteLink, setInviteLink] = useState("");
  const [attendees, setAttendees] = useState([]);

  const isOrganizer = currentUser?.id === trip?.organizer?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setCurrentUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}`);
        setTrip(response.data);
        setEditForm({
          name: response.data.name || "",
          description: response.data.description || "",
          location: response.data.location || "",
          startDate: response.data.startDate || "",
          endDate: response.data.endDate || "",
          organizer: response.data.organizer,
        });
        const organizerResponse = await api.get(`/api/trips/users/${response.data.organizer}`);
          setOrganizerName(organizerResponse.data.name || "Organizer Unknown");
          const inviteResponse = await api.get(`/api/trips/${tripId}/invite-link`);
          setInviteLink(inviteResponse.data.inviteLink);
  
          // Fetch attendees
          if (response.data.guests) {
            setAttendees(response.data.guests);
          }
        } catch (err) {
        setError("Failed to load trip details.");
      }
    };
    fetchUser();
    fetchTripDetails();
  }, [tripId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

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
      name: trip.name,
      description: trip.description,
      location: trip.location,
      startDate: trip.startDate,
      endDate: trip.endDate,
    });
    setIsEditing(false);
  };

  if (!currentUser || !trip) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <div className="box">
        <div className="trip-container">
          <div className="cover-photo">
            <img src="https://via.placeholder.com/428x200" alt="Cover" />
          </div>

          <div className="trip-details">
            {isEditing ? (
              <div className="edit-trip-form">
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter trip name"
                  className="edit-input"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter trip description"
                  className="edit-input"
                />
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="edit-input"
                />
                <input
                  type="date"
                  name="startDate"
                  value={editForm.startDate}
                  onChange={handleInputChange}
                  className="edit-input"
                />
                <input
                  type="date"
                  name="endDate"
                  value={editForm.endDate}
                  onChange={handleInputChange}
                  className="edit-input"
                />
                <button className="save-button" onClick={handleSaveChanges}>
                  Save
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className="trip-header">
                  <h1>{trip.name || "Trip Name"}</h1>
                  {isOrganizer && (
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div>
                <div className="dates-box">
                  {trip.startDate && trip.endDate
                    ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(
                        trip.endDate
                      ).toLocaleDateString()}`
                    : "Dates not set"}
                </div>
                <div className="location-container">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                  <span>{trip.location || "Location not set"}</span>
                </div>
                <p className="trip-description">
                  {trip.description || "No description provided."}
                </p>
                <div className="organizer-container">
                  <p>Organized By </p>
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="organizer-icon"
                  />
                    <span>{organizerName}</span>
                </div>
              </>
              
            )}
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      <div className="attendees-section">
      <h3>Attendees</h3>
          {attendees.length === 0 ? (
            <p>
              Looks like you haven't invited anyone to your trip yet. Use the link or code below to invite your trip group.
            </p>
          ) : (
          <ul>
            {attendees.map((attendee) => (
              <li key={attendee.user}>
                <FontAwesomeIcon icon={faUserCircle} />
                {attendee.name} - {attendee.rsvpStatus || "Pending"}
              </li>
            ))}
          </ul>
          )}
        </div>

        {isOrganizer && (
          <div className="invite-section">
            <h3>Invite Others</h3>
            <p>Share this link to invite collaborators:</p>
            <div className="invite-link">
              <input type="text" value={inviteLink} readOnly />
              <button onClick={handleCopyLink}>
                <FontAwesomeIcon icon={faCopy} /> Copy Link
              </button>
            </div>
            <p>Or share this code: {trip.inviteCode || "Not generated"}</p>
          </div>
        )}

        <div className="trip-actions">
          <h3>Quick Links</h3>
          <button onClick={() => navigate(`/trips/${tripId}/tasks`)}>View Tasks</button>
        </div>

        <div className="tasks-summary">
          <h3>Tasks Overview</h3>
          <p>Pending: {pendingTasks}</p>
          <p>In Progress: {inProgressTasks}</p>
          <p>Completed: {completedTasks}</p>
          <button onClick={() => navigate(`/trips/${tripId}/tasks`)}>Manage Tasks</button>
        </div>
              <BottomNav tripId={tripId}  activeSection="home" />
    </div>
  );
};

export default TripDetails;

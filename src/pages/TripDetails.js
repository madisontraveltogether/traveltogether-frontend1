import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/TripDashboard.css";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState({
    pendingInvites: [],
    attendees: [],
    notifications: [],
    announcements: [],
  });
  const [inviteLink, setInviteLink] = useState("");
  const [tripCode, setTripCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementComments, setAnnouncementComments] = useState({});
  const isOrganizer = currentUser?.id === trip?.organizer?.id;

  // Fetch Trip Details
  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}`);
      setTrip(response.data);
      setEditForm(response.data);
    } catch (err) {
      setError("Failed to load trip details.");
    }
  };

  // Fetch Invite Link
  const fetchInviteLink = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}/invite-link`);
      setInviteLink(response.data.inviteLink);
    } catch (err) {
      setError("Failed to load invite link.");
    }
  };

  // Fetch Trip Code
  const fetchTripCode = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}/code`);
      setTripCode(response.data.tripCode);
    } catch (err) {
      setError("Failed to load trip code.");
    }
  };

  // Generate New Trip Code
  const generateTripCode = async () => {
    try {
      const response = await api.post(`/api/trips/${tripId}/generate-code`);
      setTripCode(response.data.tripCode);
    } catch (err) {
      setError("Failed to generate trip code.");
    }
  };

  // Save Edited Trip Details
  const handleSaveChanges = async () => {
    try {
      const response = await api.patch(`/api/trips/${tripId}`, editForm);
      setTrip(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes.");
    }
  };

  // Handle Edit Form Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload Cover Photo
  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("coverPhoto", file);
      try {
        const response = await api.post(`/api/trips/${tripId}/cover`, formData);
        setTrip((prev) => ({ ...prev, coverImage: response.data.coverImage }));
      } catch (err) {
        setError("Failed to upload cover photo.");
      }
    }
  };

  // Add New Announcement
  const handleAddAnnouncement = async () => {
    try {
      const response = await api.post(`/api/trips/${tripId}/announcements`, {
        message: newAnnouncement,
      });
      setTrip((prev) => ({
        ...prev,
        announcements: [response.data, ...prev.announcements],
      }));
      setNewAnnouncement("");
    } catch (err) {
      setError("Failed to add announcement.");
    }
  };

  // Pin Announcement
  const handlePinAnnouncement = async (announcementId) => {
    try {
      await api.post(`/api/trips/${tripId}/announcements/${announcementId}/pin`);
      setTrip((prev) => ({
        ...prev,
        announcements: prev.announcements.map((a) =>
          a._id === announcementId ? { ...a, isPinned: true } : { ...a, isPinned: false }
        ),
      }));
    } catch (err) {
      setError("Failed to pin announcement.");
    }
  };

  // Add Comment to Announcement
  const handleAddComment = async (announcementId, comment) => {
    try {
      const response = await api.post(
        `/api/trips/${tripId}/announcements/${announcementId}/comments`,
        { comment }
      );
      setAnnouncementComments((prev) => ({
        ...prev,
        [announcementId]: [...(prev[announcementId] || []), response.data],
      }));
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  // Notify All Attendees
  const handleNotifyAll = async () => {
    try {
      await api.post(`/api/trips/${tripId}/notify`);
      alert("Notifications sent to all attendees!");
    } catch (err) {
      setError("Failed to send notifications.");
    }
  };

  useEffect(() => {
    fetchTripDetails();
    fetchInviteLink();
    fetchTripCode();
  }, [tripId]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-details-page">
      <TopBar title="Trip Details" />
      {error && <p className="error-message">{error}</p>}

      {/* Cover Photo */}
      <div className="cover-photo">
        <img src={trip.coverImage || "/assets/default-trip-image.jpg"} alt="Trip Cover" />
        {isOrganizer && (
          <div className="cover-photo-upload">
            <input
              type="file"
              id="cover-photo"
              accept="image/*"
              onChange={handleCoverPhotoUpload}
            />
            <label htmlFor="cover-photo">Upload Cover Photo</label>
          </div>
        )}
      </div>

      {/* Invite Link */}
      {isOrganizer && (
        <div className="invite-link-section">
          <h3>Invite Link</h3>
          <input
            type="text"
            value={inviteLink}
            readOnly
            onClick={(e) => e.target.select()}
          />
          <button
            onClick={() =>
              navigator.clipboard.writeText(inviteLink).then(() => alert("Link copied!"))
            }
          >
            Copy Link
          </button>
        </div>
      )}

      {/* Trip Code */}
      {isOrganizer && (
        <div className="trip-code-section">
          <h3>Trip Code</h3>
          {tripCode ? (
            <p>{tripCode}</p>
          ) : (
            <button onClick={generateTripCode}>Generate Code</button>
          )}
        </div>
      )}

      {/* Announcements */}
      <div className="announcements-section">
        <h3>Announcements</h3>
        {isOrganizer && (
          <div className="new-announcement">
            <textarea
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Add a new announcement..."
            />
            <button onClick={handleAddAnnouncement}>Post</button>
          </div>
        )}
        {trip.announcements.map((announcement) => (
          <div key={announcement._id} className="announcement">
            <p>{announcement.content}</p>
            {isOrganizer && (
              <button onClick={() => handlePinAnnouncement(announcement._id)}>
                Pin
              </button>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default TripDetails;

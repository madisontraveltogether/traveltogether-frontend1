import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "../css/AddItinerary.css";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const AddItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tripDates = location.state?.tripDates || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    day: "",
    startTime: "",
    endTime: "",
    category: "",
    assignedTo: [],
  });
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    // Fetch attendees for tagging and assignment
    const fetchAttendees = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/attendees`);
        setAttendees(response.data);
      } catch (err) {
        setError("Failed to fetch attendees.");
      }
    };

    fetchAttendees();
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.day || !formData.category) {
      setError("Title, Day, and Category are required.");
      return;
    }

    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("location", formData.location);
      submissionData.append("day", formData.day);
      submissionData.append("startTime", formData.startTime);
      submissionData.append("endTime", formData.endTime);
      submissionData.append("category", formData.category);
      submissionData.append("assignedTo", JSON.stringify(formData.assignedTo));
      if (attachment) submissionData.append("attachment", attachment);

      await api.post(`/api/trips/${tripId}/itinerary`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Itinerary item added successfully!");
      navigate(`/trips/${tripId}/itinerary`);
    } catch (err) {
      setError("Failed to add itinerary item.");
    }
  };

  return (
    <div className="add-itinerary-page">
      <TopBar title="New Itinerary Item" />
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>

        {/* Day Selection */}
        <div className="form-group">
          <label>Day *</label>
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            <option value="">Select a day</option>
            {tripDates.map((date, index) => (
              <option key={index} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Start and End Time */}
        <div className="form-group time-group">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group time-group">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        {/* Category Selection with Icons */}
        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="food">🍔 Food</option>
            <option value="travel">✈️ Travel</option>
            <option value="accommodation">🏨 Accommodation</option>
            <option value="activity">🎡 Activity</option>
            <option value="other">🔧 Other</option>
          </select>
        </div>

        {/* Tagging Attendees */}
        <div className="form-group">
          <label>Tag Attendees</label>
          <select
            multiple
            name="assignedTo"
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({
                ...formData,
                assignedTo: Array.from(e.target.selectedOptions, (opt) => opt.value),
              })
            }
          >
            {attendees.map((attendee) => (
              <option key={attendee.id} value={attendee.id}>
                {attendee.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Attachment */}
        <div className="form-group">
          <label>Attachment</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Add Itinerary Item
        </button>
      </form>
      <BottomNav tripId={tripId} activeTab="itinerary" />
    </div>
  );
};

export default AddItinerary;

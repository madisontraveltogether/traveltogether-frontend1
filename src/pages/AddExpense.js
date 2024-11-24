import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/AddExpense.css";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const AddExpense = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [attendees, setAttendees] = useState([]);
  const [picture, setPicture] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [dates, setDates] = useState([{ date: "", time: "" }]);
  const [membersAffected, setMembersAffected] = useState([]);
  const [totalCost, setTotalCost] = useState("");
  const [costPerPerson, setCostPerPerson] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleDateChange = (index, field, value) => {
    const updatedDates = [...dates];
    updatedDates[index][field] = value;
    setDates(updatedDates);
  };

  const addMoreDates = () => {
    setDates([...dates, { date: "", time: "" }]);
  };

  const handleCostChange = (field, value) => {
    if (field === "total") {
      setTotalCost(value);
      const perPersonCost =
        value && membersAffected.length
          ? (parseFloat(value) / membersAffected.length).toFixed(2)
          : "";
      setCostPerPerson(perPersonCost);
    } else {
      setCostPerPerson(value);
      const total =
        value && membersAffected.length
          ? (parseFloat(value) * membersAffected.length).toFixed(2)
          : "";
      setTotalCost(total);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("dates", JSON.stringify(dates));
      formData.append("membersAffected", JSON.stringify(membersAffected));
      formData.append("totalCost", totalCost);
      formData.append("costPerPerson", costPerPerson);
      formData.append("notes", notes);
      if (picture) formData.append("picture", picture);

      await api.post(`/api/trips/${tripId}/expenses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/trips/${tripId}/expenses`);
    } catch (err) {
      setError("Failed to add expense.");
    }
  };

  return (
    <div className="add-expense-container">
      <TopBar title="Add an Expense" />
      <form className="expense-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        {/* Picture Upload */}
        <div className="form-group">
          <label>Picture</label>
          <input type="file" accept="image/*" onChange={handlePictureChange} />
        </div>

        {/* Expense Name */}
        <div className="form-group">
          <label>Expense Name *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter expense name"
            required
          />
        </div>

        {/* Type Dropdown */}
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="food">🍔 Food</option>
            <option value="travel">✈️ Travel</option>
            <option value="accommodation">🏨 Accommodation</option>
            <option value="activity">🎡 Activity</option>
            <option value="other">🔧 Other</option>
          </select>
        </div>

        {/* Date & Time */}
        <div className="form-group">
          <label>Date & Time</label>
          {dates.map((item, index) => (
            <div key={index} className="date-time-inputs">
              <input
                type="date"
                value={item.date}
                onChange={(e) => handleDateChange(index, "date", e.target.value)}
              />
              <input
                type="time"
                value={item.time}
                onChange={(e) => handleDateChange(index, "time", e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addMoreDates}>
            + Add More Dates
          </button>
        </div>

        {/* Members Affected */}
        <div className="form-group">
          <label>Members Affected</label>
          <select
            multiple
            value={membersAffected}
            onChange={(e) =>
              setMembersAffected(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {attendees.map((attendee) => (
              <option key={attendee.id} value={attendee.id}>
                {attendee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cost */}
        <div className="form-group">
          <label>Total Cost *</label>
          <input
            type="number"
            value={totalCost}
            onChange={(e) => handleCostChange("total", e.target.value)}
            placeholder="Enter total cost"
            required
          />
        </div>
        <div className="form-group">
          <label>Cost Per Person</label>
          <input
            type="number"
            value={costPerPerson}
            onChange={(e) => handleCostChange("person", e.target.value)}
            placeholder="Enter cost per person"
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes"
          />
        </div>

        <button type="submit" className="submit-button">
          Add Expense
        </button>
      </form>
      <BottomNav tripId={tripId} activeTab="expenses" />
    </div>
  );
};

export default AddExpense;

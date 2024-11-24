import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [dates, setDates] = useState([{ startDateTime: new Date() }]);
  const [membersAffected, setMembersAffected] = useState([]);
  const [totalCost, setTotalCost] = useState("");
  const [costPerPerson, setCostPerPerson] = useState("");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [customCategories, setCustomCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/attendees`);
        const rsvpYesAttendees = response.data.filter(
          (attendee) => attendee.rsvpStatus === "yes"
        );
        setAttendees(response.data);
        setMembersAffected(rsvpYesAttendees.map((attendee) => attendee.id));
      } catch (err) {
        setError("Failed to fetch attendees.");
      }
    };

    fetchAttendees();
  }, [tripId]);

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleDateTimeChange = (index, value) => {
    const updatedDates = [...dates];
    updatedDates[index].startDateTime = value;
    setDates(updatedDates);
  };

  const addMoreDates = () => {
    setDates([...dates, { startDateTime: new Date() }]);
  };

  const handleCostChange = (field, value) => {
    const numAttendees = membersAffected.length;

    if (field === "total") {
      setTotalCost(value);
      if (numAttendees > 0) {
        const calculatedCostPerPerson = (parseFloat(value) / numAttendees).toFixed(2);
        setCostPerPerson(calculatedCostPerPerson);
      } else {
        setCostPerPerson(""); // Reset if no attendees selected
      }
    } else if (field === "person") {
      setCostPerPerson(value);
      if (numAttendees > 0) {
        const calculatedTotalCost = (parseFloat(value) * numAttendees).toFixed(2);
        setTotalCost(calculatedTotalCost);
      } else {
        setTotalCost(""); // Reset if no attendees selected
      }
    }
  };

  const addCustomCategory = () => {
    const newCategory = prompt("Enter a custom category:");
    if (newCategory) {
      setCustomCategories((prev) => [...prev, newCategory]);
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
      formData.append("currency", currency);
      if (picture) formData.append("picture", picture);

      await api.post(`/api/trips/${tripId}/expenses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Expense added successfully!");
      setTimeout(() => navigate(`/trips/${tripId}/expenses`), 2000);
    } catch (err) {
      setError("Failed to add expense.");
    }
  };

  return (
    <div className="add-expense-container">
      <TopBar title="Add Expense" />
      <form className="expense-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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
            {customCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button type="button" onClick={addCustomCategory}>
            + Add Custom Category
          </button>
        </div>

        {/* Date & Time Picker */}
        <div className="form-group">
          <label>Date & Time</label>
          {dates.map((item, index) => (
            <div key={index} className="date-time-picker">
              <DatePicker
                selected={item.startDateTime}
                onChange={(date) => handleDateTimeChange(index, date)}
                showTimeSelect
                dateFormat="Pp"
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

        {/* Cost Inputs */}
        <div className="form-group">
          <label>Total Cost *</label>
          <input
            type="number"
            value={totalCost}
            onChange={(e) => handleCostChange("total", e.target.value)}
            placeholder={`Enter total cost in ${currency}`}
            required
          />
        </div>
        <div className="form-group">
          <label>Cost Per Person</label>
          <input
            type="number"
            value={costPerPerson}
            onChange={(e) => handleCostChange("person", e.target.value)}
            placeholder={`Enter cost per person in ${currency}`}
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

        {/* Currency Selector */}
        <div className="form-group">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
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

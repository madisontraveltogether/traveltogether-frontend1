import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/AddExpense.css'; // Add styling details later
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const AddExpense = () => {
  const { tripId } = useParams();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('even');
  const [splitWith, setSplitWith] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/trips/${tripId}/expenses`, {
        title,
        amount: parseFloat(amount),
        splitType,
        splitWith,
        date,
        description,
      });
      navigate(`/trips/${tripId}/expenses`);
    } catch (err) {
      setError('Failed to add expense.');
    }
  };

  return (
    <div className="add-expense-container">
      <TopBar title="Add an Expense" />

      <div className="expense-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="header-title">New Budget Item</h1>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label className="form-label">Expense Name *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter expense name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Total Cost *</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter total cost"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Split Type</label>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            className="form-select"
          >
            <option value="even">Even</option>
            <option value="byAmount">By Amount</option>
            <option value="byPercentage">By Percentage</option>
            <option value="byShares">By Shares</option>
          </select>
        </div>

        {splitType !== 'even' && (
          <div className="form-group">
            <label className="form-label">Split With</label>
            <input
              type="text"
              value={splitWith}
              onChange={(e) => setSplitWith(e.target.value)}
              placeholder="Specify group members or amounts"
              className="form-input"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any notes"
            className="form-textarea"
          />
        </div>

        <button type="submit" className="submit-button">
          Add Budget Item
        </button>
      </form>

      <BottomNav tripId={tripId} activeTab="expenses" />
    </div>
  );
};

export default AddExpense;

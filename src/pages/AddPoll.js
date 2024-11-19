import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/Polls.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const AddPoll = () => {
  const { tripId } = useParams();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const validateOptions = () => {
    const uniqueOptions = new Set(options.map((option) => option.trim()));
    return uniqueOptions.size === options.length && !Array.from(uniqueOptions).includes('');
  };

  const validateExpirationDate = () => {
    return !expirationDate || new Date(expirationDate) > new Date();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOptions()) {
      setError('Options must be unique and non-empty.');
      return;
    }

    if (!validateExpirationDate()) {
      setError('Expiration date must be in the future.');
      return;
    }

    try {
      await api.post(`/trips/${tripId}/polls`, {
        question,
        options,
        expirationDate,
      });
      navigate(`/trips/${tripId}/polls`);
    } catch (err) {
      setError('Failed to create poll.');
    }
  };

  return (
    <div className="add-poll-container">
      <TopBar title="Add a Poll" />
      {error && <p className="error-message">{error}</p>}
      <form className="poll-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Poll Question</label>
          <input
            type="text"
            className="form-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Options</label>
          {options.map((option, index) => (
            <div key={index} className="poll-option">
              <input
                type="text"
                className="form-input"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                required
              />
            </div>
          ))}
          <button type="button" className="add-option-button" onClick={handleAddOption}>
            Add Option
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Expiration Date</label>
          <input
            type="date"
            className="form-input"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default AddPoll;

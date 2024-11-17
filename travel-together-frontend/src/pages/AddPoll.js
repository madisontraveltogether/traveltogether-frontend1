// src/pages/AddPoll.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

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
    <div>
      <h2>Create Poll</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </label>
        <label>
          Options:
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              required
            />
          ))}
          <button type="button" onClick={handleAddOption}>
            Add Option
          </button>
        </label>
        <label>
          Expiration Date:
          <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
        </label>
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
};

export default AddPoll;

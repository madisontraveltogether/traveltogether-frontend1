import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import pollService from '../../services/pollService';

function AddPoll() {
  const { tripId } = useParams();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [expirationDate, setExpirationDate] = useState('');

  const handleAddOption = () => setOptions([...options, '']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pollService.createPoll(tripId, { question, options, expirationDate });
      // Optionally navigate back to poll list
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div>
      <h3>Create Poll</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <h4>Options</h4>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={handleAddOption}>Add Option</button>
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}

export default AddPoll;

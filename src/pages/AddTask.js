// src/pages/AddTask.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddTask = () => {
  const { tripId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/trips/${tripId}/tasks`, {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        isRecurring
      });
      navigate(`/trips/${tripId}/tasks`);
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleAddAssignee = () => {
    setAssignedTo([...assignedTo, '']);
  };

  return (
    <div>
      <h2>Create Task</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Due Date:
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <label>
          Priority:
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Recurring:
          <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
        </label>
        <label>
          Assign To:
          {assignedTo.map((assignee, index) => (
            <input
              key={index}
              type="text"
              placeholder="User ID"
              value={assignee}
              onChange={(e) => {
                const newAssignedTo = [...assignedTo];
                newAssignedTo[index] = e.target.value;
                setAssignedTo(newAssignedTo);
              }}
            />
          ))}
          <button type="button" onClick={handleAddAssignee}>Add Assignee</button>
        </label>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default AddTask;

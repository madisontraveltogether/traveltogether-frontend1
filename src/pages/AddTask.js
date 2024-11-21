import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TaskPages.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

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
        isRecurring,
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
    <div className="add-task-container">
      <TopBar title="Add a Task" />
      {error && <p className="error-message">{error}</p>}
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Recurring Task</label>
          <input
            type="checkbox"
            className="form-checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assign To</label>
          {assignedTo.map((assignee, index) => (
            <input
              key={index}
              type="text"
              className="form-input"
              placeholder="Enter assignee name or email"
              value={assignee}
              onChange={(e) => {
                const newAssignedTo = [...assignedTo];
                newAssignedTo[index] = e.target.value;
                setAssignedTo(newAssignedTo);
              }}
            />
          ))}
          <button
            type="button"
            className="add-assignee-button"
            onClick={handleAddAssignee}
          >
            Add Assignee
          </button>
        </div>

        <button type="submit" className="submit-button">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;

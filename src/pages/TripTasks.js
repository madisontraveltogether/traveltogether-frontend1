// src/pages/TripTasks.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TripTasks = () => {
  const { tripId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/tasks`);
        setTasks(response.data);
      } catch (err) {
        setError('Failed to load tasks.');
      }
    };
    fetchTasks();
  }, [tripId]);

  const handleAddTask = () => {
    navigate(`/trips/${tripId}/tasks/new`);
  };

  const filteredTasks = tasks.filter((task) =>
    filterStatus ? task.status === filterStatus : true
  );

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortField === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div>
      <h2>Trip Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>
          Filter by Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          Sort by:
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <button onClick={handleAddTask}>Create New Task</button>

      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <ul>
          {sortedTasks.map((task) => (
            <li key={task._id} onClick={() => navigate(`/trips/${tripId}/tasks/${task._id}`)}>
              <h3>{task.title}</h3>
              <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not specified'}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripTasks;

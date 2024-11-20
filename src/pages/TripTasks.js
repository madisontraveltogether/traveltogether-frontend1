import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TaskPages.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

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
    <div className="tasks-container">
      <TopBar title="Tasks" />
      {error && <p className="error-message">{error}</p>}

      <div className="filter-sort-container">
        <label className="filter-label">
          Filter by Status
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="filter-label">
          Sort by
          <select
            className="form-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <button className="add-task-button" onClick={handleAddTask}>
        Create New Task
      </button>

      {tasks.length === 0 ? (
        <p className="no-tasks-message">No tasks added yet.</p>
      ) : (
        <ul className="task-list">
          {sortedTasks.map((task) => (
            <li
              key={task._id}
              className="task-card"
              onClick={() => navigate(`/trips/${tripId}/tasks/${task._id}`)}
            >
              <h3 className="task-title">{task.title}</h3>
              <p className="task-meta">Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not specified'}</p>
              <p className="task-meta">Priority: {task.priority}</p>
              <p className="task-meta">Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
<BottomNav tripId={tripId} />    </div>
  );
};

export default TripTasks;

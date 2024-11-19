import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TaskDetails = () => {
  const { tripId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/tasks/${taskId}`);
        setTask(response.data);
        setStatus(response.data.status);
      } catch (err) {
        setError('Failed to load task.');
      }
    };
    fetchTask();
  }, [tripId, taskId]);

  const handleUpdateStatus = async () => {
    try {
      await api.patch(`/trips/${tripId}/tasks/${taskId}/status`, { status });
      setTask({ ...task, status });
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleToggleRecurring = async () => {
    try {
      const updatedTask = await api.patch(`/trips/${tripId}/tasks/${taskId}`, {
        isRecurring: !task.isRecurring,
      });
      setTask(updatedTask.data);
    } catch (err) {
      setError('Failed to toggle recurring status.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/trips/${tripId}/tasks/${taskId}`);
        navigate(`/trips/${tripId}/tasks`);
      } catch (err) {
        setError('Failed to delete task.');
      }
    }
  };

  if (!task) return <p>Loading task...</p>;

  return (
    <div>
      <TopBar title="Task Details" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>{task.title}</h3>
      <p>Description: {task.description}</p>
      <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not specified'}</p>
      <p>Priority: {task.priority}</p>
      <p>Assigned To: {task.assignedTo.map(user => user.name || user._id).join(', ')}</p>
      <p>Status: {task.status}</p>
      <p>Recurring: {task.isRecurring ? 'Yes' : 'No'}</p>

      <label>
        Update Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleUpdateStatus}>Update Status</button>
      </label>

      <button onClick={handleToggleRecurring}>
        {task.isRecurring ? 'Disable Recurring' : 'Enable Recurring'}
      </button>

      <button onClick={handleDelete}>Delete Task</button>
      <button onClick={() => navigate(`/trips/${tripId}/tasks`)}>Back to Tasks</button>
      <BottomNav />

    </div>
  );
};

export default TaskDetails;

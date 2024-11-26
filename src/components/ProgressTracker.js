import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './ProgressTracker.css';
import io from 'socket.io-client';

const ProgressTracker = ({ tripId }) => {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/progress`);
        setProgress(response.data);
      } catch (err) {
        console.error('Error fetching trip progress:', err);
        setError('Failed to load trip progress.');
      }
    };

    const socket = io(process.env.REACT_APP_SOCKET_URL);

    // Join trip room for real-time updates
    socket.emit('joinTrip', tripId);

    // Listen for real-time progress updates
    socket.on('tripProgressUpdated', (updatedProgress) => {
      setProgress(updatedProgress);
    });

    // Fetch initial progress
    fetchProgress();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [tripId]);

  if (error) return <p className="error">{error}</p>;
  if (!progress) return <p>Loading progress...</p>;

  return (
    <div className="progress-tracker">
      <h2>Trip Progress</h2>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress.taskCompletionPercentage}%` }}
          />
        </div>
        <p>{progress.taskCompletionPercentage}% Tasks Completed</p>
      </div>
      <ul className="milestones">
        {progress.milestones.map((milestone, index) => (
          <li key={index}>
            <strong>{milestone.label}:</strong> {milestone.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;

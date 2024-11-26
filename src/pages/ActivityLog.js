import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../css/ActivityLog.css';
import io from 'socket.io-client';

const ActivityLog = ({ tripId }) => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/activity-logs`);
        setLogs(response.data);
      } catch (err) {
        setError('Failed to load activity logs.');
      }
    };

    const socket = io(process.env.REACT_APP_SOCKET_URL);

  socket.emit('joinTrip', tripId);

  socket.on('activityLogged', (newActivity) => {
    setLogs((prevLogs) => [newActivity, ...prevLogs]);
  });
  
  return () => socket.disconnect();

    fetchLogs();
  }, [tripId]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="activity-log">
      <h3>Activity Log</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <p>
              <strong>{log.user?.name || 'Unknown User'}:</strong> {log.action}
            </p>
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import pollService from '../../services/pollService';

function PollList() {
  const { tripId } = useParams();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await pollService.getPolls(tripId);
        setPolls(response);
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };
    fetchPolls();
  }, [tripId]);

  return (
    <div>
      <h3>Polls</h3>
      <ul>
        {polls.map(poll => (
          <li key={poll._id}>
            {poll.question} - {poll.expirationDate} 
            <Link to={`/trip/${tripId}/polls/${poll._id}`}>View Details</Link>
          </li>
        ))}
      </ul>
      <Link to={`/trip/${tripId}/add-poll`}>Create New Poll</Link>
    </div>
  );
}

export default PollList;

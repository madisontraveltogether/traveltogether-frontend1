import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import taskService from '../../services/taskService';

function TaskList() {
  const { tripId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getTasks(tripId);
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [tripId]);

  return (
    <div>
      <h3>Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} - {task.status} 
            <Link to={`/trip/${tripId}/tasks/${task._id}`}>View Details</Link>
          </li>
        ))}
      </ul>
      <Link to={`/trip/${tripId}/add-task`}>Add New Task</Link>
    </div>
  );
}

export default TaskList;

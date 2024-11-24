import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import '../css/TaskDetails.css';

const TaskDetails = () => {
  const { tripId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [error, setError] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskResponse = await api.get(`/api/trips/${tripId}/tasks/${taskId}`);
        setTask(taskResponse.data);
        setSubtasks(taskResponse.data.subtasks || []);
        setComments(taskResponse.data.comments || []);
        setTags(taskResponse.data.tags || []);
        setAttachments(taskResponse.data.attachments || []);
        calculateProgress(taskResponse.data.subtasks || []);
      } catch (err) {
        setError('Failed to load task details.');
      }
    };

    const fetchAvailableTags = async () => {
      try {
        const tagsResponse = await api.get(`/api/trips/${tripId}/tags`);
        setAvailableTags(tagsResponse.data);
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      }
    };

    fetchTaskDetails();
    fetchAvailableTags();
  }, [tripId, taskId]);

  const calculateProgress = (subtasks) => {
    if (subtasks.length === 0) {
      setProgress(0);
      return;
    }
    const completed = subtasks.filter((subtask) => subtask.completed).length;
    setProgress(Math.round((completed / subtasks.length) * 100));
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      const response = await api.post(`/api/trips/${tripId}/tasks/${taskId}/subtasks`, {
        title: newSubtask,
      });
      setSubtasks((prev) => [...prev, response.data]);
      setNewSubtask('');
      calculateProgress([...subtasks, response.data]);
    } catch (err) {
      setError('Failed to add subtask.');
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const updatedSubtask = await api.patch(
        `/api/trips/${tripId}/tasks/${taskId}/subtasks/${subtaskId}/toggle`
      );
      setSubtasks((prev) =>
        prev.map((subtask) =>
          subtask._id === subtaskId ? { ...subtask, completed: updatedSubtask.data.completed } : subtask
        )
      );
      calculateProgress(
        subtasks.map((subtask) =>
          subtask._id === subtaskId
            ? { ...subtask, completed: updatedSubtask.data.completed }
            : subtask
        )
      );
    } catch (err) {
      setError('Failed to toggle subtask.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await api.post(`/api/trips/${tripId}/tasks/${taskId}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  const handleAddAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('attachment', file);
      const response = await api.post(`/api/trips/${tripId}/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAttachments((prev) => [...prev, response.data]);
    } catch (err) {
      setError('Failed to upload attachment.');
    }
  };

  const handleReassignTask = async () => {
    if (!assignedTo.trim()) return;
    try {
      const response = await api.patch(`/api/trips/${tripId}/tasks/${taskId}/assign`, {
        assignedTo,
      });
      setTask((prev) => ({ ...prev, assignedTo: response.data.assignedTo }));
    } catch (err) {
      setError('Failed to reassign task.');
    }
  };

  return (
    <div>
      <TopBar title="Task Details" />
      {error && <p className="error">{error}</p>}
      {task && (
        <>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.status}</p>
          <p>Tags: {tags.join(', ')}</p>
          <p>Progress: {progress}%</p>
          <div>
            <h3>Subtasks</h3>
            <ul>
              {subtasks.map((subtask) => (
                <li key={subtask._id}>
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask._id)}
                  />
                  {subtask.title}
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
            />
            <button onClick={handleAddSubtask}>Add Subtask</button>
          </div>
          <div>
            <h3>Attachments</h3>
            <input type="file" onChange={handleAddAttachment} />
            <ul>
              {attachments.map((attachment) => (
                <li key={attachment._id}>
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                    {attachment.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Comments</h3>
            <ul>
              {comments.map((comment) => (
                <li key={comment._id}>{comment.content}</li>
              ))}
            </ul>
            <textarea
              placeholder="Add comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </>
      )}
      <BottomNav />
    </div>
  );
};

export default TaskDetails;

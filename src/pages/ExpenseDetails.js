// src/pages/ExpenseDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const ExpenseDetails = () => {
  const { tripId, expenseId } = useParams();
  const [expense, setExpense] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch expense details and comments
  useEffect(() => {
    const fetchExpenseAndComments = async () => {
      try {
        const expenseResponse = await api.get(`api/trips/${tripId}/expenses/${expenseId}`);
        setExpense(expenseResponse.data);

        const commentsResponse = await api.get(`api/trips/${tripId}/expenses/${expenseId}/comments`);
        setComments(commentsResponse.data);
      } catch (err) {
        setError('Failed to load expense details or comments.');
      }
    };

    fetchExpenseAndComments();
  }, [tripId, expenseId]);

  // Handle comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/trips/${tripId}/expenses/${expenseId}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/trips/${tripId}/expenses/${expenseId}/comments/${commentId}`);
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      } catch (err) {
        setError('Failed to delete comment.');
      }
    }
  };

  // Handle expense deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
        navigate(`/trips/${tripId}/expenses`);
      } catch (err) {
        setError('Failed to delete expense.');
      }
    }
  };

  if (!expense) return <p>Loading expense...</p>;

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={() => navigate(`/trips/${tripId}/expenses`)}>Back to Expenses</button>

      <h3>{expense.title}</h3>
      <p>Amount: ${expense.amount}</p>
      <p>Payer: {expense.payer?.name || 'Unknown'}</p>
      <p>Date: {expense.date || 'Not specified'}</p>
      <p>Description: {expense.description || 'No description'}</p>

      <h4>Split Details:</h4>
      <ul>
        {expense.splitWith.map((split, index) => (
          <li key={index}>
            {split.user?.name || 'Unknown'}: ${split.amount || 0}
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>Delete Expense</button>

      <h3>Comments</h3>
      {comments.length === 0 ? <p>No comments yet. Add one below!</p> : null}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.user?.name || 'Unknown'}:</strong> {comment.content}
            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <textarea
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleAddComment}>Add Comment</button>
      <BottomNav />

    </div>
  );
};

export default ExpenseDetails;

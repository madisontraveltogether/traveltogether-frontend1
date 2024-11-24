import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripExpenses.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TripExpenses = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get(`api/trips/${tripId}/expenses`);
        setExpenses(response.data);
      } catch (err) {
        setError('Failed to load expenses.');
      }
    };

    fetchExpenses();
  }, [tripId]);

  const handleAddExpense = () => {
    navigate(`/trips/${tripId}/expenses/new`);
  };

  return (
    <div className="trip-expenses-page">
      <header className="expenses-header">
        <h1>Budget Forecast</h1>
        <button className="add-expense-btn" onClick={handleAddExpense}>
          + Add Item
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      {expenses.length === 0 ? (
        <div className="no-expenses">
          <div className="icon-placeholder">
            <img src="/assets/no-expenses-icon.svg" alt="No expenses" />
          </div>
          <p>Let’s Talk Money</p>
          <p>
            Add potential expense items and who it will be split with. We’ll do
            the rest.
          </p>
        </div>
      ) : (
        <div className="expenses-list">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="expense-item"
              onClick={() =>
                navigate(`/trips/${tripId}/expenses/${expense._id}`)
              }
            >
              <div className="expense-date">
                {new Date(expense.date).toLocaleDateString()}
              </div>
              <div className="expense-content">
                <div className="expense-info">
                  <h3>{expense.title}</h3>
                  <p>Total: ${expense.amount}</p>
                  <p>Cost per person: ${expense.amount / expense.splitWith.length}</p>
                </div>
                {expense.image && (
                  <img
                    src={expense.image}
                    alt={expense.title}
                    className="expense-image"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

<BottomNav tripId={tripId} activeSection="expenses" />


    </div>
  );
};

export default TripExpenses;

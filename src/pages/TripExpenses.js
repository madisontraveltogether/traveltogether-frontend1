// src/pages/TripExpenses.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const TripExpenses = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [balances, setBalances] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/expenses`);
        setExpenses(response.data);
        calculateBalances(response.data);
      } catch (err) {
        setError('Failed to load expenses.');
      }
    };

    fetchExpenses();
  }, [tripId]);

  const handleAddExpense = () => {
    navigate(`/trips/${tripId}/expenses/new`);
  };

  const calculateBalances = (expenses) => {
    const balanceMap = {};
    expenses.forEach((expense) => {
      // Update payer's balance
      if (!balanceMap[expense.payer]) balanceMap[expense.payer] = 0;
      balanceMap[expense.payer] += expense.amount;

      // Update balances for those sharing the expense
      expense.splitWith.forEach((split) => {
        if (!balanceMap[split.user]) balanceMap[split.user] = 0;
        balanceMap[split.user] -= split.amount;
      });
    });
    setBalances(balanceMap);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Trip Expenses</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleAddExpense}>Add Expense</button>

      <div style={{ margin: '1em 0' }}>
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No expenses match your search.</p>
      ) : (
        <ul>
          {filteredExpenses.map((expense) => (
            <li
              key={expense._id}
              onClick={() => navigate(`/trips/${tripId}/expenses/${expense._id}`)}
              style={{ cursor: 'pointer', margin: '1em 0', padding: '1em', border: '1px solid #ccc' }}
            >
              <h3>{expense.title}</h3>
              <p>Amount: ${expense.amount}</p>
              <p>Payer: {expense.payer?.name || 'Unknown'}</p>
              <p>Date: {expense.date || 'Not specified'}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>Balances</h3>
      <ul>
        {Object.entries(balances).map(([user, balance]) => (
          <li key={user}>
            {user}: ${balance.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripExpenses;

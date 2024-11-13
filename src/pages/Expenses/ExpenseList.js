import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

function ExpenseList() {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/expenses`);
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, [tripId]);

  return (
    <div>
      <h3>Expenses</h3>
      <ul>
        {expenses.map(expense => (
          <li key={expense._id}>
            {expense.title} - ${expense.amount} - Paid by {expense.payer.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;

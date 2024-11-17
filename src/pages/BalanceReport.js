import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const BalanceReport = () => {
  const { tripId } = useParams();
  const [balances, setBalances] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/balances`);
        setBalances(response.data.balances);
        setTotalExpenses(response.data.totalExpenses);
      } catch (err) {
        setError('Failed to load balance report.');
      }
    };

    fetchBalances();
  }, [tripId]);

  return (
    <div className="balance-report">
      <h2>Balance Report</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="summary">
        <h3>Total Expenses: ${totalExpenses.toFixed(2)}</h3>
      </div>

      <div className="balances">
        <h3>Individual Balances:</h3>
        <ul>
          {balances.map((balance) => (
            <li key={balance.user._id}>
              <strong>{balance.user.name}</strong>: 
              {balance.amount < 0 ? (
                <span style={{ color: 'red' }}> owes ${Math.abs(balance.amount).toFixed(2)}</span>
              ) : (
                <span style={{ color: 'green' }}> is owed ${balance.amount.toFixed(2)}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BalanceReport;

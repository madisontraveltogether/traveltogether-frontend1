// src/pages/ReportBalance.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const ReportBalance = () => {
  const { tripId } = useParams();
  const [balances, setBalances] = useState([]);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/balances`);
        setBalances(response.data.balances);
        setSummary(response.data.summary);
        setFilteredSummary(response.data.summary);
      } catch (err) {
        setError('Failed to load balances.');
      }
    };

    fetchBalances();
  }, [tripId]);

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = summary.filter(
      (item) =>
        item.from.toLowerCase().includes(value) || item.to.toLowerCase().includes(value)
    );
    setFilteredSummary(filtered);
  };

  const handleSort = (field) => {
    setSortField(field);
    const sorted = [...filteredSummary].sort((a, b) => {
      if (field === 'amount') {
        return b.amount - a.amount;
      }
      return a[field].localeCompare(b[field]);
    });
    setFilteredSummary(sorted);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get(`/trips/${tripId}/balances/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'trip_balances.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to export report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <h2>Trip Report & Balance</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={handleFilter}
        />
        <button onClick={() => handleSort('from')}>Sort by From</button>
        <button onClick={() => handleSort('to')}>Sort by To</button>
        <button onClick={() => handleSort('amount')}>Sort by Amount</button>
        <button onClick={handleExport} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      <h3>Balance Summary</h3>
      {filteredSummary.length === 0 ? (
        <p>No balances to display.</p>
      ) : (
        <ul>
          {filteredSummary.map((item, index) => (
            <li key={index}>
              {item.from} owes {item.to}: ${item.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}

      <h3>Detailed Balances</h3>
      {balances.length === 0 ? (
        <p>No balances to show.</p>
      ) : (
        <ul>
          {balances.map((balance) => (
            <li key={balance.user._id}>
              {balance.user.name}: ${balance.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportBalance;

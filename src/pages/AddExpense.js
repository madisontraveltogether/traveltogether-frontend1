import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddExpense = () => {
  const { tripId } = useParams();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitType, setSplitType] = useState('even');
  const [splitWith, setSplitWith] = useState([{ user: '', amount: '' }]);
  const [calculatedSplit, setCalculatedSplit] = useState([]);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const calculateSplit = () => {
    const totalAmount = parseFloat(amount);
    let calculated = [];

    switch (splitType) {
      case 'even':
        const evenAmount = Math.floor((totalAmount / splitWith.length) * 100) / 100;
        const remainder = totalAmount - evenAmount * splitWith.length;
        calculated = splitWith.map((entry, index) => ({
          user: entry.user,
          amount: index === splitWith.length - 1 ? evenAmount + remainder : evenAmount,
        }));
        break;

      case 'byAmount':
        const totalSplitAmount = splitWith.reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);
        if (totalSplitAmount !== totalAmount) {
          setError('Split amounts do not add up to the total expense amount');
          return;
        }
        calculated = splitWith.map((entry) => ({ user: entry.user, amount: parseFloat(entry.amount) }));
        break;

      case 'byPercentage':
        const totalPercentage = splitWith.reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);
        if (totalPercentage !== 100) {
          setError('Total percentage must equal 100%');
          return;
        }
        calculated = splitWith.map((entry) => ({
          user: entry.user,
          amount: Math.floor((totalAmount * (parseFloat(entry.amount) / 100)) * 100) / 100,
        }));
        break;

      case 'byShares':
        const totalShares = splitWith.reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);
        if (totalShares === 0) {
          setError('Total shares cannot be zero');
          return;
        }
        calculated = splitWith.map((entry) => ({
          user: entry.user,
          amount: Math.floor((totalAmount * (parseFloat(entry.amount) / totalShares)) * 100) / 100,
        }));
        break;

      default:
        setError('Invalid split type');
    }

    setCalculatedSplit(calculated);
    setError('');
  };

  const handleAddSplitWith = () => {
    setSplitWith([...splitWith, { user: '', amount: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/trips/${tripId}/expenses`, {
        title,
        amount: parseFloat(amount),
        payer,
        splitType,
        splitWith: calculatedSplit,
        date,
        description,
      });
      navigate(`/trips/${tripId}/expenses`);
    } catch (err) {
      setError('Failed to add expense.');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setCalculatedSplit([]);
            }}
            required
          />
        </label>
        <label>
          Payer:
          <input type="text" value={payer} onChange={(e) => setPayer(e.target.value)} required />
        </label>
        <label>
          Split Type:
          <select
            value={splitType}
            onChange={(e) => {
              setSplitType(e.target.value);
              setCalculatedSplit([]);
            }}
          >
            <option value="even">Even</option>
            <option value="byAmount">By Amount</option>
            <option value="byPercentage">By Percentage</option>
            <option value="byShares">By Shares</option>
          </select>
        </label>
        <label>
          Split With:
          {splitWith.map((split, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="User"
                value={split.user}
                onChange={(e) => {
                  const newSplitWith = [...splitWith];
                  newSplitWith[index].user = e.target.value;
                  setSplitWith(newSplitWith);
                }}
              />
              <input
                type="number"
                placeholder={splitType === 'even' ? 'N/A' : splitType === 'byAmount' ? 'Amount' : splitType === 'byPercentage' ? 'Percentage' : 'Shares'}
                value={split.amount}
                onChange={(e) => {
                  const newSplitWith = [...splitWith];
                  newSplitWith[index].amount = e.target.value;
                  setSplitWith(newSplitWith);
                }}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddSplitWith}>
            Add Split Participant
          </button>
        </label>
        <button type="button" onClick={calculateSplit}>
          Calculate Split
        </button>
        <h4>Calculated Split:</h4>
        <ul>
          {calculatedSplit.map((split, index) => (
            <li key={index}>
              {split.user}: ${split.amount}
            </li>
          ))}
        </ul>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;

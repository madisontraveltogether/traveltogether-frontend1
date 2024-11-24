import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/TripExpenses.css";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const TripExpenses = () => {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [categorySummary, setCategorySummary] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/expenses`);
        setExpenses(response.data);
        calculateCategorySummary(response.data);
        if (response.data.length > 0) {
          setCurrency(response.data[0].currency || "USD");
        }
      } catch (err) {
        setError("Failed to load expenses.");
      }
    };

    fetchExpenses();
  }, [tripId]);

  const handleAddExpense = () => {
    navigate(`/trips/${tripId}/expenses/new`);
  };

  const calculateCategorySummary = (expenses) => {
    const summary = expenses.reduce((acc, expense) => {
      const category = expense.type || "Other";
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});
    setCategorySummary(summary);
  };

  const chartData = {
    labels: Object.keys(categorySummary),
    datasets: [
      {
        data: Object.values(categorySummary),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <div className="trip-expenses-page">
      <TopBar title="Expenses" />
      <header className="expenses-header">
        <h1>Budget Forecast</h1>
        <button className="add-expense-btn" onClick={handleAddExpense}>
          + Add Item
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      {/* Show Summary Chart */}
      {Object.keys(categorySummary).length > 0 && (
        <div className="chart-container">
          <h3>Expense Summary</h3>
          <Pie data={chartData} />
        </div>
      )}

      {/* List of Expenses */}
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
              onClick={() => navigate(`/trips/${tripId}/expenses/${expense._id}`)}
            >
              <div className="expense-date">
                {new Date(expense.date).toLocaleDateString()}
              </div>
              <div className="expense-content">
                <div className="expense-info">
                  <h3>{expense.title}</h3>
                  <p>
                    Total: {currency} {expense.amount}
                  </p>
                  <p>
                    Cost per person: {currency}{" "}
                    {(expense.amount / expense.splitWith.length).toFixed(2)}
                  </p>
                </div>
                {expense.attachments && expense.attachments.length > 0 && (
                  <div className="attachments">
                    <h4>Attachments:</h4>
                    <ul>
                      {expense.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {attachment.name || "Attachment"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav tripId={tripId} activeTab="expenses" />
    </div>
  );
};

export default TripExpenses;

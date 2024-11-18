import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import api from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TripCreate from './pages/TripCreate';
import MyTrips from './pages/MyTrips';
import TripExpenses from './pages/TripExpenses';
import AddExpense from './pages/AddExpense';
import ExpenseDetails from './pages/ExpenseDetails';
import TripPolls from './pages/TripPolls';
import AddPoll from './pages/AddPoll';
import PollDetails from './pages/PollDetails';
import TripTasks from './pages/TripTasks';
import AddTask from './pages/AddTask';
import TaskDetails from './pages/TaskDetails';
import Announcements from './pages/Announcements';
import Messaging from './pages/Messaging';
import GuestList from './pages/GuestList';
import BalanceReport from './pages/BalanceReport';
import Itinerary from './pages/Itinerary';
import ErrorBoundary from './components/ErrorBoundary';
import PasswordReset from './pages/PasswordReset';

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [user, setUser] = useState(null);

  // Check if the user is already logged in on app load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('User not authenticated');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <Router>
        <nav>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <Link to="/my-trips">My Trips</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </>
          )}
        </nav>

        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<Navigate to={user ? '/my-trips' : '/login'} replace />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/my-trips" replace />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/my-trips" replace />} />
          <Route path="/reset-password" element={<PasswordReset />} />


          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} setUser={setUser} /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute user={user}><TripCreate /></ProtectedRoute>} />
          <Route path="/my-trips" element={<ProtectedRoute user={user}><MyTrips /></ProtectedRoute>} />
          <Route path="/trips/:tripId/expenses" element={<ProtectedRoute user={user}><TripExpenses /></ProtectedRoute>} />
          <Route path="/trips/:tripId/expenses/new" element={<ProtectedRoute user={user}><AddExpense /></ProtectedRoute>} />
          <Route path="/trips/:tripId/expenses/:expenseId" element={<ProtectedRoute user={user}><ExpenseDetails /></ProtectedRoute>} />
          <Route path="/trips/:tripId/polls" element={<ProtectedRoute user={user}><TripPolls /></ProtectedRoute>} />
          <Route path="/trips/:tripId/polls/new" element={<ProtectedRoute user={user}><AddPoll /></ProtectedRoute>} />
          <Route path="/trips/:tripId/polls/:pollId" element={<ProtectedRoute user={user}><PollDetails /></ProtectedRoute>} />
          <Route path="/trips/:tripId/tasks" element={<ProtectedRoute user={user}><TripTasks /></ProtectedRoute>} />
          <Route path="/trips/:tripId/tasks/new" element={<ProtectedRoute user={user}><AddTask /></ProtectedRoute>} />
          <Route path="/trips/:tripId/tasks/:taskId" element={<ProtectedRoute user={user}><TaskDetails /></ProtectedRoute>} />
          <Route path="/trips/:tripId/announcements" element={<ProtectedRoute user={user}><Announcements /></ProtectedRoute>} />
          <Route path="/trips/:tripId/messages" element={<ProtectedRoute user={user}><Messaging /></ProtectedRoute>} />
          <Route path="/trips/:tripId/guests" element={<ProtectedRoute user={user}><GuestList /></ProtectedRoute>} />
          <Route path="/trips/:tripId/balance-report" element={<ProtectedRoute user={user}><BalanceReport /></ProtectedRoute>} />
          <Route path="/trips/:tripId/itinerary" element={<ProtectedRoute user={user}><Itinerary /></ProtectedRoute>} />
          
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

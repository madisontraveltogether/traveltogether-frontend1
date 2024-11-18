import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../services/api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log(response.data);

      // Assuming the response contains user data and tokens
      setUser(response.data.user); // Update the user state
      localStorage.setItem('accessToken', response.data.accessToken); // Save token to localStorage
      
      // Navigate to the user dashboard
      navigate('/mytrips');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); // Backend error
      } else {
        setError('Network error. Please try again later.'); // Network or CORS error
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

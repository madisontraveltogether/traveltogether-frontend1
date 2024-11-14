import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TripDetails from './pages/TripDetails';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/trips/:id" element={<TripDetails />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}

export default App;

import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const response = await fetchUserProfile();
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile', error);
                navigate('/login');
            }
        };
        getUserProfile();
    }, [navigate]);

    return (
        <div>
            <h2>User Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}

export default UserProfile;

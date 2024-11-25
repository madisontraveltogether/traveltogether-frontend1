import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
    }

    // Fetch user activity log
    const fetchActivityLog = async () => {
      try {
        const response = await api.get('/auth/profile/activity-log');
        setActivityLog(response.data);
      } catch (err) {
        console.error('Error fetching activity log', err);
      }
    };

    fetchActivityLog();
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      if (!name.trim() || !email.trim() || !username.trim()) {
        throw new Error('Name, email, and username are required.');
      }
      const response = await api.patch('/auth/profile', { name, email, username });
      setUser(response.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicturePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPEG and PNG formats are allowed.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be under 2MB.');
        return;
      }
      setProfilePicture(file);
      setPreviewPicture(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureUpload = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Please select a picture to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await api.post('/auth/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser((prevUser) => ({ ...prevUser, profilePicture: response.data.profilePicture }));
      setMessage('Profile picture updated successfully');
      setPreviewPicture(null); // Clear the preview
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading profile picture');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    try {
      await api.patch('/auth/profile/password', { oldPassword, newPassword });
      setMessage('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    }
  };



  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/profile');
        setUser(null);
        window.location.href = '/logout'; // Redirect to logout or homepage
      } catch (err) {
        setError('Error deleting account');
      }
    }
  };

  return (
    <div className="profile-container">
      <TopBar title="Profile" />
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <button onClick={handleUpdateProfile} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>

      <h3>Profile Picture</h3>
      {user?.profilePicture && <img src={user.profilePicture} alt="Current Profile" className="profile-picture" />}
      {previewPicture && <img src={previewPicture} alt="Preview" className="profile-picture-preview" />}
      <form>
        <input type="file" accept="image/*" onChange={handleProfilePicturePreview} />
        <button type="submit" onClick={handleProfilePictureUpload}>Upload Profile Picture</button>
      </form>

      <h3>Change Password</h3>
      <div>
        <label htmlFor="oldPassword">Old Password:</label>
        <input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <button onClick={handleChangePassword}>Change Password</button>

      <h3>Recent Activity</h3>
      <ul>
        {activityLog.map((activity) => (
          <li key={activity.id}>
            {activity.action} on {new Date(activity.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>

      <button className="delete-account-button" onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default Profile;

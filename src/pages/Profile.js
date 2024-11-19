import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      if (!name.trim() || !email.trim()) {
        setError('Name and email cannot be empty.');
        return;
      }
      const response = await api.patch('/auth/profile', { name, email });
      setUser(response.data.user);
      setMessage('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
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
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading profile picture');
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
    } catch (error) {
      setError(error.response?.data?.message || 'Error changing password');
    }
  };

  const handleProfilePicturePreview = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      setPreviewPicture(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <TopBar title="Profile" />
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button onClick={handleUpdateProfile}>Update Profile</button>

      <h3>Profile Picture</h3>
      {previewPicture && <img src={previewPicture} alt="Preview" style={{ width: '100px', height: '100px' }} />}
      <form onSubmit={handleProfilePictureUpload}>
        <input type="file" accept="image/*" onChange={handleProfilePicturePreview} />
        <button type="submit">Upload Profile Picture</button>
      </form>

      <h3>Change Password</h3>
      <div>
        <label>Old Password:</label>
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      </div>
      <div>
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default Profile;

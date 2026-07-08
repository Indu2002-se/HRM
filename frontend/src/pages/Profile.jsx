import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import FaceEnrollment from '../components/face/FaceEnrollment';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [faceStatus, setFaceStatus] = useState(null);

  useEffect(() => {
    fetchFaceStatus();
  }, []);

  const fetchFaceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/face/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setFaceStatus(data.data);
    } catch (error) {
      console.error('Error fetching face status:', error);
    }
  };

  return (
    <div className="page-container">
      <Header title="Profile" />
      <div className="page-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">{user?.name || 'User'}</h1>
              <p className="profile-email">{user?.email || '-'}</p>
              <span className="profile-role-badge">{user?.role || 'Employee'}</span>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user?.name || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user?.email || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value capitalize">{user?.role || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Position</span>
                <span className="info-value">{user?.position || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Level</span>
                <span className="info-value">{user?.level || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">
                  <span className="status-badge">{user?.status || '-'}</span>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Joined Date</span>
                <span className="info-value">{user?.joined_date || '-'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value id-value">{user?.id || '-'}</span>
              </div>
            </div>
          </div>

          <FaceEnrollment faceStatus={faceStatus} onEnrollSuccess={fetchFaceStatus} />
        </div>
      </div>
    </div>
  );
};

export default Profile;

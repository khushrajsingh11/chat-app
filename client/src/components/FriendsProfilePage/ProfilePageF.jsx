import React, { useContext } from 'react';
import ChatContext from '../../../context/ChatContext.jsx'; // Adjust path as needed
import './ProfilePageF.css';

const ProfilePageF = () => {
  const { selectedUser } = useContext(ChatContext);

  if (!selectedUser) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p style={{ color: 'white', textAlign: 'center' }}>No user selected...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Background decorative elements */}
      <div className="background-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>
      
      {/* Chat icon decoration */}
      <div className="chat-icon-container">
        <div className="chat-bubble">
          <div className="chat-dots">
            <span className="chat-dot"></span>
            <span className="chat-dot"></span>
            <span className="chat-dot"></span>
          </div>
        </div>
      </div>

      {/* Profile display card */}
      <div className="profile-card">
        <h2 className="profile-title">Profile Details</h2>
        
        <div className="profile-form">
          {/* Profile image display */}
          <div className="image-section">
            <div className="image-upload-container">
              <div className="image-upload-label">
                {selectedUser.profilePic ? (
                  <img src={selectedUser.profilePic} alt="Profile" className="profile-image" />
                ) : (
                  <div className="image-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <span className="image-upload-text">Profile Picture</span>
          </div>

          {/* Name display */}
          <div className="input-group">
            <div className="text-input profile-display">
              {selectedUser.fullname || selectedUser.name || 'No name provided'}
            </div>
          </div>

          {/* Bio display */}
          <div className="input-group">
            <div className="textarea-input profile-display bio-display">
              {selectedUser.bio || 'No bio available'}
            </div>
          </div>

          {/* Email display (if available) */}
          {selectedUser.email && (
            <div className="input-group">
              <div className="text-input profile-display">
                {selectedUser.email}
              </div>
            </div>
          )}

          {/* Username display (if available) */}
          {selectedUser.username && (
            <div className="input-group">
              <div className="text-input profile-display">
                @{selectedUser.username}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageF;
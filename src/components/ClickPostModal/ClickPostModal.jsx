import React, { useState } from "react";
import axios from 'axios';
import "./ClickPostModal.scss"; // Assuming you have a corresponding SCSS file

const ClickPostModal = ({ post, onClose, isOwner, fetchPosts, baseUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.post_title);
  const [editedDescription, setEditedDescription] = useState(post.post_description);
  const [editedDueDate, setEditedDueDate] = useState(new Date(post.post_duedate).toISOString().split('T')[0]);
  const [editedImage, setEditedImage] = useState(post.post_image);
  
  console.log("modal:", post);
  
  const createdDate = new Date(post.post_createdate).toLocaleDateString('en-US', {
    month: 'short', // "Dec"
    day: 'numeric', // "31"
    year: 'numeric', // "2024"
  });
  
  const dueDate = new Date(post.post_duedate).toLocaleDateString('en-US', {
    weekday: 'long', // "Saturday"
    month: 'long', // "January"
    day: 'numeric', // "25"
    year: 'numeric', // "2025"
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    try {
        await axios.put(`${baseUrl}/posts/${post.post_id}`, {
            post_title: editedTitle,
            post_description: editedDescription,
            post_duedate: editedDueDate,
            post_image: editedImage,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditing(false);
        fetchPosts(); // Refresh the posts after editing
        onClose(); // Close modal after successful save
    } catch (error) {
        console.error("Error updating post:", error);
    }
};
  
const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  const token = localStorage.getItem("authToken");
  try {
      await axios.delete(`${baseUrl}/posts/${post.post_id}`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
      onClose();
  } catch (error) {
      console.error("Error deleting post:", error);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="user-info">
            <img src={post.user_photo} alt="User" className="user-photo" />
            <div className="user-details">
              <div><h3>Posted by {post.user_name}</h3></div>
              <div><h5>{createdDate}</h5></div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <div className="close-icon">X</div>
          </button>
        </div>
        <div className="hero-section">
          <img src={post.post_image} alt="Post" className="post-image" />
        </div>
          {isEditing ? (
            <input
              type="text"
              className="input-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <h2 className="post-title">{post.post_title}</h2>
          )}

          {isEditing ? (
            <textarea
              className="textarea-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          ) : (
            <p className="post-description">{post.post_description}</p>
          )}

          <div className="due-date-section">
            <div><h3>Due date</h3></div>
            {isEditing ? (
              <input
                type="date"
                className="input-date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
              />
            ) : (
              <div><h5>{dueDate}</h5></div>
            )}
        </div>
        {isOwner ? (
          <>
            <button className="edit-button" onClick={isEditing ? handleSave : handleEdit}>
              {isEditing ? "Save" : "Edit"}
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </>
        ) : (
          <>
            <button className="accept-button">Accept</button>
            <div className="action-buttons">
              <button className="decline-button">Decline</button>
              <button className="dismiss-button">Dismiss</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClickPostModal;
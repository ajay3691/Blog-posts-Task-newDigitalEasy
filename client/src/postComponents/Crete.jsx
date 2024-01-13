// CreatePost.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { store } from '../App';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [token] = useContext(store);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/post/create',
        {
          title,
          description,
          image,
          isPrivate,
        },
        {
          headers: {
            'x-token': token,
          },
        }
      );

      console.log(response.data);
      // Redirect to the admin dashboard after successful post creation
     // navigate('/admin-d');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL:</label>
          <input type="text" className="form-control" id="image" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="isPrivate" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          <label className="form-check-label" htmlFor="isPrivate">Private</label>
        </div>
        <button type="submit" className="btn btn-primary">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
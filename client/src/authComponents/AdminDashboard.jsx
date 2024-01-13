// AdminDashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { store } from '../App';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import FontAwesome icons
import './AdminDashboard.css'; // Import your custom CSS file for styling

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useContext(store);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Updated to display 10 records per page

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/post/posts', {
          headers: {
            'x-token': token,
          },
        });

        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    if (!token) {
      // Redirect to '/login' if token is not available
      navigate('/login');
    } else {
      fetchPosts();
    }
  }, [token, navigate]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (postId) => {
    // Redirect to edit page with postId
    navigate(`/updatepost/:postId`);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/post/${postId}`, {
        headers: {
          'x-token': token,
        },
      });

      // Update posts after successful deletion
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>
        <Link to="/createpost" className="create-post-button ml-auto  btn btn-warning">Create Post</Link>
      </div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="admin-posts-container">
          {currentPosts.map((post) => (
            <div key={post._id} className="admin-post-card">
              <h3 className="admin-post-title">{post.title}</h3>
              <img src={post.image} alt={post.title} className="admin-post-image" />
              <p className="admin-post-description">{post.description}</p>
              <p className="admin-post-info">Posted by: {post.userId.name}</p>
              <p className="admin-post-info">Posted on: {new Date(post.postedDate).toLocaleString()}</p>
              <div className="admin-post-actions">
                <FaEdit onClick={() => handleEdit(post._id)} className="edit-icon" />
                <FaTrash onClick={() => handleDelete(post._id)} className="delete-icon" />
              </div>
              <hr className="admin-post-divider" />
            </div>
          ))}
          <div className="admin-pagination-container">
            <ul className="pagination">
              {Array(Math.ceil(posts.length / postsPerPage))
                .fill()
                .map((_, i) => (
                  <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { store } from '../App';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './AdminDashboard.css';
// ... (import statements)

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useContext(store);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/post/user', {
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
    navigate(`/updatepostu/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/post/${postId}`, {
        headers: {
          'x-token': token,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container-flued" style={{ marginTop: '6rem' }}>
      <div className="admin-header">
        <h2 className="user-posts-title ml-5">User Dashboard</h2>
        <Link to="/createpostu" className="create-post-button ml-5 btn btn-warning">
          Create Post
        </Link>
      </div>
      {loading ? (
        <p className="loading-message">Loading posts...</p>
      ) : (
        <div className="user-posts-container">
          {currentPosts.map((post, index) => (
            <div key={post._id} className={`admin-post-card ${index % 2 === 0 ? 'even-post' : 'odd-post'}`}>
              <img src={post.image} alt={post.title} className="admin-post-image" />
              <div className="post-details">
                <h3 className="admin-post-title">{post.title}</h3>
                <p className="admin-post-description">{post.description}</p>
                <p className="admin-post-info">Posted by: {post.name}</p>
                <p className="admin-post-info">Posted on: {new Date(post.postedDate).toLocaleString()}</p>
                <div className="admin-post-actions">
                  <FaEdit onClick={() => handleEdit(post._id)} className="edit-icon" />
                  <FaTrash onClick={() => handleDelete(post._id)} className="delete-icon" />
                </div>
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

export default UserDashboard;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './AdminDashboard.css';
import { store } from '../App';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useContext(store);
  const navigate = useNavigate();
  const postsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserPosts, setSelectedUserPosts] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentUserPage, setCurrentUserPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          axios.get('https://blog-posts-task-new-digital-easy.vercel.app/post/posts', {
            headers: {
              'x-token': token,
            },
          }),
          axios.get('https://blog-posts-task-new-digital-easy.vercel.app/user/users'),
        ]);

        const postsWithUserDetails = await Promise.all(
          postsResponse.data.map(async (post) => {
            const userResponse = await axios.get(`https://blog-posts-task-new-digital-easy.vercel.app/user/users/${post.userId}`);
            const userDetails = userResponse.data;

            return {
              ...post,
              userDetails,
            };
          })
        );

        setPosts(postsWithUserDetails);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [token, navigate]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const indexOfLastUserPost = currentUserPage * postsPerPage;
  const indexOfFirstUserPost = indexOfLastUserPost - postsPerPage;
  const currentUserPosts = selectedUserPosts.slice(indexOfFirstUserPost, indexOfLastUserPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (postId) => {
    navigate(`/updatepost/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`https://blog-posts-task-new-digital-easy.vercel.app/post/${postId}`, {
        headers: {
          'x-token': token,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(`https://blog-posts-task-new-digital-easy.vercel.app/post/user/${userId}`, {
        headers: {
          'x-token': token,
        },
      });

      const userResponse = await axios.get(`https://blog-posts-task-new-digital-easy.vercel.app/user/users/${userId}`);
      const userDetails = userResponse.data;

      const postsWithUserDetails = response.data.map((post) => ({
        ...post,
        userDetails,
      }));

      setSelectedUserPosts(postsWithUserDetails);
      setSelectedUserId(userId);
      setHoveredUserId(userId);

      setCurrentUserPage(1);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleUserPagination = (pageNumber) => {
    setCurrentUserPage(pageNumber);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid" style={{ marginTop: '6rem' }}>
      <div className="row">
        <div className="col-md-2">
          <div>
            <h3>User List:</h3>
            <label htmlFor="userFilter">Filter by user:</label>
            <div className="search-dropdown-container">
              <select
                id="userFilter"
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  handleUserClick(e.target.value);
                }}
              >
                <option value="">All Users</option>
                {filteredUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-10">
          <div className="admin-dashboard-title">
            Admin Dashboard
          </div>
          <div className="admin-create-button">
            <button
              onClick={() => navigate('/createpost')}
              className='create-post-button btn btn-warning  float-right m-3'
            >
              Create Post
            </button>
          </div>
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <div className="admin-posts-container">
              {selectedUserPosts.length > 0 && (
                <div>
                  <div className="admin-user-details">
                    <p className={currentUserPosts.length ? 'user-with-posts' : 'user-without-posts'}>
                      User ID: {selectedUserId}
                    </p>
                    <p className={currentUserPosts.length ? 'user-with-posts' : 'user-without-posts'}>
                      User Name: {selectedUserPosts[0].userDetails.name}
                    </p>
                  </div>
                  <div className="admin-posts-container">
                    {currentUserPosts.length > 0 ? (
                      currentUserPosts.map((post, index) => (
                        <div key={post._id} className={`admin-post-card ${index % 2 === 0 ? 'even-post' : 'odd-post'}`}>
                          <div className="admin-post-details">
                            <h3 className="admin-post-title">{post.title}</h3>
                            <p className="admin-post-description">{post.description}</p>
                            <p className="admin-post-info">Posted by: {post.userDetails ? post.userDetails.name : 'Unknown User'}</p>
                            <p className="admin-post-info">Posted on: {new Date(post.postedDate).toLocaleString()}</p>
                            <div className="admin-post-actions">
                              <FaEdit onClick={() => handleEdit(post._id)} className="edit-icon" />
                              <FaTrash onClick={() => handleDelete(post._id)} className="delete-icon" />
                            </div>
                          </div>
                          <img src={post.image} alt={post.title} className="admin-post-image" />
                          <hr className="admin-post-divider" />
                        </div>
                      ))
                    ) : (
                      <p className="bg-danger">This user has not created any posts.</p>
                    )}
                    {selectedUserPosts.length > 0 && (
                      <div className="admin-pagination-container">
                        <ul className="pagination">
                          {Array(Math.ceil(selectedUserPosts.length / postsPerPage))
                            .fill()
                            .map((_, i) => (
                              <li key={i} className={`page-item ${i + 1 === currentUserPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handleUserPagination(i + 1)}>
                                  {i + 1}
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!selectedUserPosts.length && (
                <div>
                  {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                      <div key={post._id} className={`admin-post-card ${index % 2 === 0 ? 'even-post' : 'odd-post'}`}>
                        <div className="admin-post-details">
                          <h3 className="admin-post-title">{post.title}</h3>
                          <p className="admin-post-description">{post.description}</p>
                          <p className="admin-post-info">Posted by: {post.userDetails ? post.userDetails.name : 'Unknown User'}</p>
                          <p className="admin-post-info">Posted on: {new Date(post.postedDate).toLocaleString()}</p>
                          <div className="admin-post-actions">
                            <FaEdit onClick={() => handleEdit(post._id)} className="edit-icon" />
                            <FaTrash onClick={() => handleDelete(post._id)} className="delete-icon" />
                          </div>
                        </div>
                        <img src={post.image} alt={post.title} className="admin-post-image" />
                        <hr className="admin-post-divider" />
                      </div>
                    ))
                  ) : (
                    <p className="user-without-posts">No posts available.</p>
                  )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

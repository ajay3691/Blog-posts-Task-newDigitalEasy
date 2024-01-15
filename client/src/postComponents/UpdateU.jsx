import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../App';

const UpdatePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({
    title: '',
    description: '',
    image: '',
    isPrivate: false,
  });
  const [imageFile, setImageFile] = useState(null); 
  const [token] = useContext(store);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!token) {
          console.error('Token not available');
          return;
        }

        const response = await axios.get(`https://blog-posts-task-new-digital-easy.vercel.app/post/${postId}`, {
          headers: {
            'x-token': token,
          },
        });

        const postData = response.data;

        setPost({
          title: postData.title,
          description: postData.description,
          image: postData.image,
          isPrivate: postData.isPrivate,
        });
      } catch (error) {
        console.error('Error fetching post:', error);

        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setError(`Error fetching post data: ${error.response.data.message || 'Unknown error'}`);
        } else {
          console.error('Unknown error:', error);
          setError('Error fetching post data: Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, token]);

  const updateHandler = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file); 
    setPost({ ...post, image: URL.createObjectURL(file) }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://blog-posts-task-new-digital-easy.vercel.app/post/${postId}`,
        {
          title: post.title,
          description: post.description,
          image: post.image || (imageFile ? URL.createObjectURL(imageFile) : ''),
          isPrivate: post.isPrivate,
        },
        {
          headers: {
            'x-token': token,
          },
        }
      );
      alert("updated succuessfully")
      navigate('/userDashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Error updating post');
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <h2>Update Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={post.title}
            onChange={updateHandler}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={post.description}
            onChange={updateHandler}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image URL:
          </label>
          <input
            type="text"
            className="form-control"
            id="image"
            name="image"
            value={post.image}
            onChange={updateHandler}
          />
        </div>
        <br />
        <label className='text-primary'>OR</label>
        <br />
        <label>Upload Image:</label>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
          className="form-control"
        />
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPrivate"
            name="isPrivate"
            checked={post.isPrivate}
            onChange={updateHandler}
          />
          <label className="form-check-label" htmlFor="isPrivate">
            Private
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;




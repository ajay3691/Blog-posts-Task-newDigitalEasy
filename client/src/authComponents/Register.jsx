import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: '',
        secretCode: '', // Change the field name to match the server-side code
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://blog-posts-task-new-digital-easy.vercel.app/user/register', formData);
            console.log(response.data);
            setShowAlert(true);
            setAlertMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response?.data?.err) {
                // Check for specific error messages
                if (error.response.data.err.includes('User already exists with this email')) {
                    setAlertMessage('Registration failed: User already exists with this email.');
                } else if (error.response.data.err.includes('Mobile number is already registered')) {
                    setAlertMessage('Registration failed: Mobile number is already registered.');
                } else if (error.response.data.err.includes('Invalid secret code for admin registration')) {
                    setAlertMessage('Registration failed: Invalid secret code for admin registration.');
                } else {
                    // Handle other errors
                    setAlertMessage(`Registration failed: ${error.response.data.err}`);
                }
            } else {
                // Handle other errors without a specific error message
                console.error('Registration failed:', error.response?.data?.err || 'Unknown error');
                setAlertMessage('Registration failed. Please check your information and try again.');
            }

            setShowAlert(true);
        }
    };

    return (
        <div className="container" style={{ marginTop: '6rem' }}>
        <h2 className="mb-4">Register</h2>

            <div className="row">
                <div className="col-md-5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Mobile:</label>
                            <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Password:</label>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Role:</label>
                            <select className="form-control" name="role" value={formData.role} onChange={handleChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {formData.role === 'admin' && (
                            <div className="form-group">
                                <label>Admin Code:</label>
                                <input type="text" className="form-control" name="secretCode" value={formData.secretCode} onChange={handleChange} />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                        <h6>----------</h6>
                        <h6>----------</h6>
                    </form>

                    {/* Alert for success or error */}
                    {showAlert && (
                        <div className={`alert ${alertMessage.includes('successful') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                            {alertMessage}
                            <button type="button" className="close" onClick={handleAlertClose} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

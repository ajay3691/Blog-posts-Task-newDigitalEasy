import React, { useContext, useEffect } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Myprofile = () => {
    const [token, setToken] = useContext(store);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            axios.get('https://blog-posts-task-new-digital-easy.vercel.app/user/adminDashboard', {
                headers: { 'x-token': token }
            })
                .then((resp) => {
                    console.log('Admin Data:', resp.data);
                    navigate('/adminDashboard');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            axios.get('https://blog-posts-task-new-digital-easy.vercel.app/user/userDashboard', {
                headers: { 'x-token': token }
            })
                .then((resp) => {
                    console.log('user Data:', resp.data);
                    navigate('/userDashboard');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [token, navigate]);

    return (
        <div>
        </div>
    );
};

export default Myprofile;

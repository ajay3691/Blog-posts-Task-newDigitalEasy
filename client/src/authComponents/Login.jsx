import axios from 'axios';
import React, { useState, useContext } from 'react';
import { store } from '../App';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const navigate = useNavigate(); // Initialize navigate
    const [token, setToken] = useContext(store);
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const changeHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(data);

        axios.post("http://localhost:5000/user/login", data)
            .then((resp) => {
                setToken(resp.data.token);
                // Use navigate to redirect to '/myprofile' on successful login
                navigate('/myprofile');
            })
            .catch(() => {
                // Handle login error here if needed
            });
    };

    if (token) {
        // You can remove this part as navigation is handled within submitHandler
        return null;
    }

    return (
        <div>
            <center>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-5">
                            <form onSubmit={submitHandler} autoComplete='off'>
                                <h3>Login Page</h3>
                                <div className="form-group">
                                    <input type="text" name="email" placeholder="Email" onChange={changeHandler} className='form-control' />
                                </div>
                                <div className="form-group">
                                    <input type="password" name="password" placeholder="Password" onChange={changeHandler} className='form-control' />
                                </div>
                                <div className="form-group">
                                    <input type="submit" className='btn btn-success' value="Login" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    );
};

export default Login;

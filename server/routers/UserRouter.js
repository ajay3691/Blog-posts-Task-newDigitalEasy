import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
// userRouter.js
import { isAdmin, isUser,authenticateToken } from './middlewere.js';

const UserRouter = express.Router();

UserRouter.get("/", (req, res) => {
    res.send("Authentication - API.......");
});

const ADMIN_SECRET_CODE = 'A1'; // Replace with your actual secret code

// User Registration Route
UserRouter.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, password, role, secretCode } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(401).json({ err: 'User already exists with this email' });
        }

        // Check if the secret code is provided and matches the admin code
        if (role === 'admin' && secretCode !== ADMIN_SECRET_CODE) {
            return res.status(401).json({ err: 'Invalid secret code for admin registration' });
        }

        // Create a new user and hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' if role is not provided
        });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
            // Duplicate mobile number error
            res.status(401).json({ err: 'Mobile number is already registered' });
        } else {
            console.log(err);
            res.status(500).json({ err: 'Internal Server Error' });
        }
    }
});

// User Login Route
UserRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
         // Check if required fields are present
         if (!email || !password ) {
            return res.status(400).json({ msg: 'Invalid request format' });
        }
        // Verify if email exists

        const user = await User.findOne({ email: email});
        console.log('Email:', email);
        if (user) {
            // Verify the password
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (isPasswordValid) {
                let payload = {};
                let secretKey = '';

                if (user.role === 'admin') {
                    payload = {
                        user: {
                            id: user.id,
                            role: user.role,
                        },
                    };
                    secretKey = 'abc'; // Replace with your actual secret key for admin
                } else {
                    payload = {
                        user: {
                            id: user.id,
                            role: user.role,
                        },
                    };
                    secretKey = 'xyz'; // Replace with your actual secret key for user
                }

                jwt.sign(payload, secretKey, { expiresIn: '9h' }, (err, token) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ msg: 'JWT Token generation Err' });
                    }
                    res.status(200).json({ token });
                });
            } else {
                res.status(401).json({ msg: 'Incorrect password' });
            }
        } else {
            res.status(401).json({ msg: 'Email/User does not exist' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'An error occurred during login' });
    }
});


/* const ADMIN_SECRET_KEY = 'abc'; // Replace with your actual admin secret key
const USER_SECRET_KEY = 'xyz'; // Replace with your actual user secret key

// Example usage of middleware in a route for the admin dashboard
UserRouter.get('/admin-dashboard', (req, res) => {
    try {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied admin' });
        }

        jwt.verify(token, ADMIN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }

            res.json({ message: `Welcome to the Admin Dashboard, ${decoded.email}!` });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Example usage of middleware in a route for the user dashboard
UserRouter.get('/userDashboard', (req, res) => {
    try {
        const token = req.header('y-auth-token');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied user' });
        }

        jwt.verify(token, USER_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }

            res.json({ message: `Welcome to the User Dashboard, ${decoded.email}!` });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}); */
// Dashboard Route (Admin Access)
// Dashboard Route (Admin Access)
UserRouter.get('/adminDashboard', authenticateToken, isAdmin, async (req, resp) => {
    try {
        // Use req.user.id instead of req.usera.id
        let user = await User.findById(req.user.id);
        if (!user) {
            return resp.status(401).json({ msg: 'User not found' });
        }
        resp.json(user);
    } catch (err) {
        console.log(err);
        return resp.status(500).send('Server Error');
    }
});

// Post List Route (User Access)
UserRouter.get('/userDashboard', authenticateToken, isUser, async (req, resp) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return resp.status(401).json({ msg: 'User not found' });
        }
        resp.json(user);
    } catch (err) {
        console.log(err);
        return resp.status(500).send('Server Error');
    }
});


export default UserRouter;

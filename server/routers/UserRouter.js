import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { isAdmin, isUser, authenticateToken } from './middlewere.js';

const UserRouter = express.Router();

UserRouter.get("/", (req, res) => {
    res.send("Authentication - API.......");
});

const ADMIN_SECRET_CODE = 'A1'; 

// User Registration Route
UserRouter.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, password, role, secretCode } = req.body;

        // Convert email to lowercase for case-insensitive matching
        const lowercaseEmail = email.toLowerCase();

        let user = await User.findOne({ email: lowercaseEmail });
        if (user) {
            return res.status(401).json({ err: 'User already exists with this email' });
        }

        if (role === 'admin' && secretCode !== ADMIN_SECRET_CODE) {
            return res.status(401).json({ err: 'Invalid secret code for admin registration' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            name,
            email: lowercaseEmail, // Store emails in lowercase
            mobile,
            password: hashedPassword,
            role: role || 'user', 
        });

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
            res.status(401).json({ err: 'Mobile number is already registered' });
        } else {
            console.error(err);
            res.status(500).json({ err: 'Internal Server Error' });
        }
    }
});


// User Login Route
UserRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Invalid request format' });
        }

        // Convert email to lowercase for case-insensitive matching
        const lowercaseEmail = email.toLowerCase();

        const user = await User.findOne({ email: lowercaseEmail });

        if (user) {
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
                    secretKey = 'abc';
                } else {
                    payload = {
                        user: {
                            id: user.id,
                            role: user.role,
                        },
                    };
                    secretKey = 'xyz';
                }

                jwt.sign(payload, secretKey, { expiresIn: '9h' }, (err, token) => {
                    if (err) {
                        console.error(err);
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
        console.error(err);
        res.status(500).json({ msg: 'An error occurred during login' });
    }
});


// Route to get all users
UserRouter.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

// Route to get user details by ID
UserRouter.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});



/* const ADMIN_SECRET_KEY = 'abc'; 
const USER_SECRET_KEY = 'xyz'; 

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
UserRouter.get('/adminDashboard', authenticateToken, isAdmin, async (req, resp) => {
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

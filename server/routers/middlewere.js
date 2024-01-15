import jwt from 'jsonwebtoken';

const ADMIN_SECRET_KEY = 'abc'; 
const USER_SECRET_KEY = 'xyz'; 

export const authenticateToken = (req, res, next) => {
    try {
        const token = req.header('x-token') || req.header('y-token');
        console.log('Token to Verify:', token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decodedToken = jwt.decode(token);
        console.log('Token Content:', decodedToken);

        let decoded;
        let secretKey;

        if (decodedToken && decodedToken.user && decodedToken.user.role) {
            secretKey =
                decodedToken.user.role === 'admin' ? ADMIN_SECRET_KEY : USER_SECRET_KEY;

            try {
                decoded = jwt.verify(token, secretKey);
                console.log('Decoded Token:', decoded);
            } catch (error) {
                console.error('JWT Verification Error:', error.message);
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            req.user = {
                id: decoded.user.id,
                role: decoded.user.role,
            };

            next(); 
        } else {
            console.log('Invalid Token Payload:', decodedToken);
            return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
/* export const authenticateToken = (req, res, next) => {
    try {
        const adminToken = req.header('x-token');
        const userToken = req.header('y-token');
        console.log('Admin Token:', adminToken);
        console.log('User Token:', userToken);

        // Choose the appropriate token based on the user's role
        const token = req.userS && req.userS.role === 'admin' ? adminToken : userToken;
        console.log('Token to Verify:', token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Decode the JWT token to inspect its content
        const decodedToken = jwt.decode(token);
        console.log('Token Content:', decodedToken);

        // Verify and decode the JWT token
        let decoded;
        let secretKey;

        if (decodedToken && decodedToken.user && decodedToken.user.role) {
            // Ensure that the role from the token matches the expected role
            if (
                (req.userS && decodedToken.user.role !== 'admin') ||
                (req.userA && decodedToken.user.role !== 'user')
            ) {
                return res.status(401).json({ message: 'Unauthorized: Invalid role' });
            }

            // Choose secret key based on the user's role
            secretKey =
                decodedToken.user.role === 'admin' ? ADMIN_SECRET_KEY : USER_SECRET_KEY;

            try {
                decoded = jwt.verify(token, secretKey);
                console.log('Decoded Token:', decoded);
            } catch (error) {
                console.error('JWT Verification Error:', error.message);
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            // Attach user data from the payload to req.userS or req.userA based on the role
            if (decoded.userA && decoded.userA.id) {
                req.userA = {
                    id: decoded.userA.id,
                    role: decoded.userA.role,
                };
            } else if (decoded.userS && decoded.userS.id) {
                req.userS = {
                    id: decoded.userS.id,
                    role: decoded.userS.role,
                };
            } else {
                console.log('Invalid Token Payload:', decoded);
                return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
            }

            next(); // Continue to the next middleware or route
        } else {
            console.log('Invalid Token Payload:', decodedToken);
            return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
 */


export const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const isUser = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'user') {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden: User access required' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export default { authenticateToken, isAdmin, isUser }
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

//Verify token and attach the logged-in user into req.user
export const protect = async (req, res, next) => {
    let token;
    // Token arrives in the header as "Bearer <token_string>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];

            // With secret verifying token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user in DB by id from token payload, excluding password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user){
                return res.status(401).json({ message: 'User not found' });
            }

            // Move to the controller
            next();
            return;

        }catch(error){
            return res.status(401).json({ message: 'Not authorized, invalid token'})
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided'});
    }
};

//Admin role check
export const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({message: 'Access denied: Admin only'});
    }
}
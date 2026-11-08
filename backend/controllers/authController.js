import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate signed JWT token with secret 
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user 
export const registerUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({email});

        if (userExists){
            return res.status(400).json({message:"User already exists with this email"});
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            emai: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: generateToken(user._id, user.role),
        });

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const logingUser = async (req, res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        
        const is_match = await user.matchPassword(password)
        if (user && is_match){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                token: generateToken(user._id, user.role),
            });
        }else{
            res.status(401).json({
                message:"Invalid email or password!"
            })
        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
};


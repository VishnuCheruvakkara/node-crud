import User from '../models/User.js';

// Users end points 

export const getUserProfile = async (req, res) => {
    try{
        res.json(req.user);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);

        if (user){
            user.name = req.body.name || user.name

            if (req.file){
                user.profileImage = `/uploads/${req.file.filename}`;
            };

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
            });
        }else{
            res.status(404).json({message: 'User not found'});
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

// Admin end points

export const getAllUsers = async (req, res) => {
    try{
        // Fetch all active users (both users and admins), excluding password
        const users = await User.find({ isDeleted: false }).select('-password');

        res.json(users);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
}

export const deleteUser= async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({message: 'User not found!'})
        }

        if (user._id.toString() === req.user._id.toString()){
            return res.status(400).json({message: 'Admins cannot delete their on account'});
        }

        user.isDeleted = true;
        await user.save();
        
        res.json({ message: 'User deleted successfully!'});
    
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

export const updateUser = async(req, res) => {
        try{
            const user = await User.findById(req.params.id);

            if(!user){
                return res.status(404).json({message:'User not found!'});
            }

            // Prevent admin from changing their own role
            if (user._id.toString() === req.user._id.toString() && req.body.role && req.body.role !== user.role) {
                return res.status(400).json({ message: 'Admins cannot change their own role!' });
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            if (req.file) {
                user.profileImage = `/uploads/${req.file.filename}`;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
            });

        }catch(error){
            res.status(500).json({message: error.message});
        }
};
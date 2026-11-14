import User from '../models/User.js';

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
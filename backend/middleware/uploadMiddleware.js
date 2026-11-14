import multer from 'multer';
import path from 'path';

// conf. how to save file
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/');
    },
    // Give a unique name for image files that saved in backend folder
    filename(req, file, cb){
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

// image validation. Should be an image

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/;

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype){
        cb(null, true);
    }else{
        cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024} // 5MB max file size
});

export default upload;
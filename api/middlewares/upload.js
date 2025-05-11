// backend/middlewares/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'masters',
        allowed_formats: ['jpg', 'png', 'jpeg', 'JPG'],
        public_id: (req, file) => {
            return file.originalname.split('.')[0]; // Задаем имя файла без расширения
        }
    },
});

// ➡️ Добавляем хук для отладки
storage._handleFile = function _handleFile(req, file, cb) {

    const stream = cloudinary.uploader.upload_stream(
        {
            folder: 'masters',
        },
        (error, result) => {
            if (error) {
                cb(error);
            } else {
                cb(null, {
                    path: result.secure_url,
                    filename: result.public_id,
                });
            }
        }
    );

    file.stream.pipe(stream);
};

const upload = multer({ storage });


export default upload;

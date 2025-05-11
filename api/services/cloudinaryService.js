import cloudinary from "../config/cloudinary.js";

export const deleteImage = async (imageUrl) => {
    try {
        // Извлекаем публичный ID из URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        console.log("🔥 Удаляем фото с ID:", publicId);

        // Исправленный вызов без коллбека
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'not found') {
            console.warn('⚠️ Изображение не найдено в Cloudinary.');
        } else {
            console.log('✅ Изображение успешно удалено из Cloudinary:', result);
        }
        return result;
    } catch (error) {
        console.error('❌ Ошибка при удалении изображения из Cloudinary:', error.message);
        throw new Error(error.message);
    }
};

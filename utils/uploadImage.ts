import imageCompression from 'browser-image-compression';

export const compressImage = async (imageFile: File): Promise<File> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        const compressedImage = await imageCompression(imageFile, options);
        return compressedImage;
    } catch (error) {
        console.error('Error compressing the image:', error);
        throw error;
    }
};

export const uploadImageToImgbb = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=272427d716bd5d87f04740819c42e62b`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await response.json();
        if (data.data.url) {
            return data.data.url;
        } else {
            throw new Error('Image upload failed');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

import axios from 'axios';
import ApiError from '../app/errors/ApiError';

export const uploadToImgBB = async (imageData:any) => {
    // console.log(imageData,"uploading".bgBlue);
    const apiKey = '2ba2463ca5b4e21bcbba22533af82910';
    const apiUrl = 'https://api.imgbb.com/1/upload';

    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axios.post(apiUrl, {
            key: apiKey,
            image: imageData.toString('base64'),
        });

        return response;
    } catch (error) {
        throw new ApiError(500,"image upload failed");
    }
};


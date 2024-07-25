// Require the cloudinary library
import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnect = async () => {
  try {
    // Return "https" URLs by setting secure: true
    await cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    console.log('cloudinary connected');
  } catch (error) {
    console.log(error)
  }
}

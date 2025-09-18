import cloudinary from "../../cloudinary";

export const uploadToCloudinary = async (fileBuffer: Buffer,folder = 'proofs'): Promise<string> => {
    console.log('heheheh');
    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder }, 
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                if (!result || !result.secure_url) {
                    return reject(new Error('Upload failed: No URL returned'));
                }
                resolve(result.secure_url);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

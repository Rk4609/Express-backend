// import{v2 as cloudinary} from "cloudinary"
// import fs from "fs"

// cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
//     });

//     const uploadOnCloudinary = async (localFilePath) =>{
//         try {
//             if(!localFilePath) return null
//             //upload the file on cloudinary

//             const response = await cloudinary.uploader.upload(localFilePath,{
//                 resource_type:"auto"
//             })
//             //File has been uploaded successfully

//             console.log("File is upload on cloudanary",response.url);
//             return response;
//         } catch (error) {
//             //Remove the locally saved temporary file as the upload operation got failed
//             fs.unlinkSync(localFilePath)
//             return null;

//         }
//     }

//     export {uploadOnCloudinary}



import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("➡️ Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ UPLOAD SUCCESS:", response.url);

    return response;

  } catch (error) {
    console.log("❌ CLOUDINARY UPLOAD FAILED:", error.message);

    if (localFilePath) {
      try {
        fs.unlinkSync(localFilePath);
      } catch {}
    }

    return null;
  }
};

export { uploadOnCloudinary };

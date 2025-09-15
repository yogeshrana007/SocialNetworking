import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "linkedin_clone/uploads",
        allowed_formats: ["jpg", "jpeg", "png"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

export { cloudinary, storage };

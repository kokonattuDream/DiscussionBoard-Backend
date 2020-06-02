const multer  = require('multer')
const cloudinary = require("cloudinary");
const dotenv = require('dotenv');
dotenv.config();
const image_src = {
  cloud_name: process.env.IMG_CLOUD_NAME || env.dev.image_src.cloud_name,
  api_key: process.env.IMG_API_KEY || env.dev.image_src.api_key,
  api_secret: process.env.IMG_API_SECRET || env.dev.image_src.api_secret
}
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config(env.dev.image_src);
const imageParser = multer({ 
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      folder: 'discussionboard'
    })
});
module.exports = imageParser;
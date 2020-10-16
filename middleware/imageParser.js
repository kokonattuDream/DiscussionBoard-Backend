const multer  = require('multer')
const cloudinary = require("cloudinary");
const dotenv = require('dotenv');
dotenv.config();
const imageSource = {
  cloud_name: process.env.IMG_CLOUD_NAME,
  api_key: process.env.IMG_API_KEY,
  api_secret: process.env.IMG_API_SECRET
}
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config(imageSource);
const imageParser = multer({ 
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      folder: 'discussionboard'
    })
});
module.exports = imageParser;
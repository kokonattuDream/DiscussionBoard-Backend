const multer  = require('multer')
const cloudinary = require("cloudinary");
const env = require("../env");
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config(env.dev.image_src);
const imageParser = multer({ 
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      folder: 'discussionboard'
    })
});
module.exports = imageParser;
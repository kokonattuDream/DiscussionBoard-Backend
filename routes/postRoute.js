const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer  = require('multer')
const cloudinary = require("cloudinary");
const env = require("../env");
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config(env.dev.image_src);
const parser = multer({ 
    storage: cloudinaryStorage({
      cloudinary: cloudinary,
      folder: 'discussionboard'
    })
});

router.get('/posts', postController.getAllPosts);
router.post('/posts', parser.single('file'), postController.createPost);
router.get('/post/:id', postController.getPost);

module.exports = router;



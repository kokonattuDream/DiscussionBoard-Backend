const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/posts', postController.getAllPosts);
router.post('/posts', postController.createPost);
router.get('/post/:id', postController.getPost);

module.exports = router;



const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const imageParser = require('../middleware/imageParser');
const sessionMiddleware = require('../middleware/sessionMiddleware');

router.get('/posts', postController.getAllPosts);
router.post('/posts', imageParser.single('file'), postController.createPost);
router.get('/post/:id', postController.getPost);

module.exports = router;



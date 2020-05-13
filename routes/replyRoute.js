const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

router.post('/replies', replyController.addReply);

module.exports = router;
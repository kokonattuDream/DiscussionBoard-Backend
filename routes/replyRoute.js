const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');

router.post('/replies', replyController.addReply);

module.exports = router;
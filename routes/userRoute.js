const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.post('/user-session',userController.loginUser);
router.delete('/user-session',userController.logoutUser);
module.exports = router;
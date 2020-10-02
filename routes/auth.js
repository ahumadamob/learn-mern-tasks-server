const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/', 
    authController.authUser
    );

router.get('/',
    auth,
    authController.loggedUser
);

module.exports = router;
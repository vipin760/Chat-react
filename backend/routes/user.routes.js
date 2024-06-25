const { userRegister, userLogin, getAllUsers } = require('../controller/user.controller');

const express =require('express');
const { authentication } = require('../middleware/auth.middleware');
const router = express()

router.route('/register').post(userRegister)

router.route('/login').post(userLogin)

router.route('/').get(authentication,getAllUsers)

module.exports =router
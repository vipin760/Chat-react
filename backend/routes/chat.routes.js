const express = require('express')
const { authentication } = require('../middleware/auth.middleware')
const { accessChat, fetchChats, createGroupChat, renameGroup, removeGroup, addGroup } = require('../controller/chat.controller')
const router = express()

router.route('/').post(authentication,accessChat).get(authentication,fetchChats)

router.route('/group').post(authentication,createGroupChat)

router.route('/rename').put(authentication,renameGroup);

router.route('/remove-group').put(authentication,removeGroup);

router.route('/add-group').put(authentication,addGroup);



module.exports = router
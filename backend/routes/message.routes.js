const express = require('express')
const { authentication } = require('../middleware/auth.middleware')
const { sendMessage, allMessage } = require('../controller/message.controller')
const router = express()

router.route("/").post(authentication,sendMessage);

router.route("/:chatId").get(authentication,allMessage);

module.exports = router
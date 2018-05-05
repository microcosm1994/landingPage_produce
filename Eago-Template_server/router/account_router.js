const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const router = express.Router()
const account_control = require(path.join(__dirname,'../control/account_control.js'))

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/login', jsonParser, account_control.login)
router.get('/logout', jsonParser, account_control.logout)
router.post('/register', jsonParser, account_control.register)
router.post('/revise', jsonParser, account_control.revise)
router.post('/delete', jsonParser, account_control.delete)


module.exports = router
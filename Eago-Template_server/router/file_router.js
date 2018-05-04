const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const router = express.Router()
const file_control = require(path.join(__dirname,'../control/file_control.js'))

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/template_list', jsonParser, file_control.template_list)
router.get('/template_read', jsonParser, file_control.template_read)
router.get('/deletedir', jsonParser, file_control.deletedir)
router.post('/revise_view', jsonParser, file_control.revise_view)
router.post('/uploadimg', upload.single('img'), file_control.uploadimg)
router.post('/revise_text', jsonParser, file_control.revise_text)

module.exports = router
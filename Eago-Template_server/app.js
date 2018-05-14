const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookiesParser = require('cookie-parser')
const account_router = require(path.join(__dirname,'router/account_router.js'))
const file_router = require(path.join(__dirname,'router/file_router.js'))
mongoose.connect('mongodb://127.0.0.1:27017/template')
const db = mongoose.connection
// 连接成功
db.on('open', function(){
    console.log('MongoDB Connection Successed')
})
// 连接失败
db.on('error', function () {
    console.log('MongoDB Connection Error')
})
const app = express()
app.use(cookiesParser())
app.use(express.static('/home/demo.eago.world'))
app.use('/',function (req, res, next) {
    let end = req.originalUrl.indexOf('?')
    let url = req.originalUrl.slice(0, end)
    if (end === -1) {
        url = req.originalUrl
    }
    if (url !== '/account/login' && !req.cookies._id) {
        let result = {}
        result.status = 1
        result.message = 'You don\'t log in now, please log in'
        return res.json(result)
    }
    next()
})
app.use('/file',file_router)
app.use('/account',account_router)

const server = app.listen(3000,() => {
    console.log('success')
})
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
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
app.use(express.static('/home/demo.eago.world'))
app.use('/',function (req, res, next) {
    next()
})
app.use('/file',file_router)
app.use('/account',account_router)

const server = app.listen(3000,() => {
    console.log('success')
})
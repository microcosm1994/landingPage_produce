const mongose = require('mongoose')
const schema = mongose.Schema

const users = new schema({
    nickname: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    portrait: {
        type: String,
        default: 'http://eago.oss-cn-hongkong.aliyuncs.com/portrait/timg.jpg'
    },
    email: {
        type: String
    },
    type: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongose.model('users', users)
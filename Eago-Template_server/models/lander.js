const mongose = require('mongoose')
const schema = mongose.Schema

const lander = new schema({
    name: {
        type: String,
        unique: true
    },
    url: {
        type: String
    },
    download: {
        type: String
    },
    des: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    users: {
        nickname: {
            type: String
        },
        username: {
            type: String
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
    }
})
module.exports = mongose.model('lander', lander)
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const async = require('async')
const crypto = require('crypto')
const User = require(path.join(__dirname, '../models/user.js'))

exports.login = (req, res) => {
    let result = {
        status: 0,
        message: '登陆成功'
    }
    let user = req.body
    const hash = crypto.createHash('md5')
    user.password = hash.update(user.password).digest('hex')
    User.findOne(user, (err, data) => {
        if (err) throw err
        if (data) {
            let id = data._id.toString()
            let expires = 10 * 24 * 60 * 60 * 1000
            res.cookie('sid', id, {
                domain: 'demo.eago.world',
                maxAge: expires,
                path: '/'
            })
            delete data.password
            result.data = data
            res.json(result)
        } else {
            result.status = 1
            result.message = '用户名或密码错误'
            res.json(result)
        }
    })
}

exports.logout = (req, res) => {
    res.clearCookie('_id', {
        domain: '.demo.eago.world',
        path: '/'
    })
    res.json({
        status: 0,
        message: '已清除你的登录信息'
    })
}

exports.register = (req, res) => {
    let result = {
        status: 0,
        message: '注册成功'
    }
}

exports.revise = (req, res) => {
    let result = {
        status: 0,
        message: '修改成功'
    }
}

exports.delete = (req, res) => {
    let result = {
        status: 0,
        message: '删除成功'
    }
}
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
    console.log(user.password)
    User.findOne(user, (err, data) => {
        if (err) throw err
        if (data) {
            let id = data._id.toString()
            let expires = 10 * 24 * 60 * 60 * 1000
            res.cookie('_id', id, {
                domain: 'demo.eago.world',
                maxAge: expires,
                path: '/'
            })
            result.data = data
            delete result.data.password
            res.json(result)
        } else {
            result.status = 1
            result.message = '用户名或密码错误'
            res.json(result)
        }
    })
}

exports.logout = (req, res) => {
    let result = {
        status: 0,
        message: '退出成功'
    }

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
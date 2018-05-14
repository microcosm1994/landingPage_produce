const fs = require('fs')
const path = require('path')
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
            res.cookie('_id', id, {
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
        message: 'Have cleared your login information'
    })
}

exports.register = (req, res) => {
    let result = {
        status: 0,
        message: 'register was successful'
    }
    let requser = req.body
    const hash = crypto.createHash('md5')
    requser.password = hash.update(requser.password).digest('hex')
    User.find({'username': requser.username}, (err, data) => {
        if (err) throw err
        if (data.length > 0) {
            result.status = 1
            result.message = 'The username has been used'
            res.json(result)
        } else {
            User.create(requser, (err, data) => {
                if (err) throw err
                if (data) {
                    res.json(result)
                } else {
                    result.status = 1
                    result.message = 'Server error'
                    res.json(result)
                }
            })
        }
    })
}

exports.all = (req, res) => {
    User.count({}, (err, data) => {
        if (err) throw err
        if (data) {
            let result = {
                status: 0,
                message: 'There are ' + data + 'users in all'
            }
            result.count = data
            User.find({}, (err, data) => {
                if (err) throw err
                if (data) {
                    result.data = data
                    res.json(result)
                }
            }).skip((req.query.page - 1) * req.query.size).limit(req.query.size - 0)
        }else{
            let result = {
                status: 1,
                count: 0,
                message: 'There are ' + 0 + 'users in all'
            }
            res.json(result)
        }
    })
}

exports.user = (req, res) => {
    let result = {
        status: 0,
        message: 'Access to user information success'
    }
    User.findById({'_id': req.query._id}, (err, data) => {
        if (err) throw err
        if (data) {
            delete data.password
            result.data = data
            res.json(result)
        } else {
            result.status = 1
            result.message = 'Access to user information failure'
            res.json(result)
        }
    })
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
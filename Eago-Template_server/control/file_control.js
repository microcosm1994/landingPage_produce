const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const async = require('async')
const OSS = require('ali-oss')
const co = require('co');
const Lander = require(path.join(__dirname, '../models/lander.js'))
const Users = require(path.join(__dirname, '../models/user.js'))
const template_url = '/home/demo.eago.world/template'
const views_url = '/home/demo.eago.world/views'
const client = new OSS({
    region: 'oss-cn-hongkong',
    accessKeyId: 'LTAIp9nawQ9RrKoh',
    accessKeySecret: 'KbbO2NtCBYaDVu09vzXv3JkFFHHtYK',
    bucket: 'lander'
})

exports.template_list = (req, res) => {
    let result = {
        status: 0,
        message: '模板列表获取成功'
    }
    fs.readdir(path.join(template_url), (err, files) => {
        if (err) throw err
        if (files) {
            result.data = []
            for (let i = 0; i < files.length; i++) {
                let template = {}
                template.filename = files[i]
                template.fileurl = 'http://demo.eago.world/template/' + files[i]
                result.data.push(template)
            }
            res.json(result)
        } else {
            result.status = 1
            result.message = '没有可用的模板列表'
            res.json(result)
        }
    })
}

exports.template_read = (req, res) => {
    let result = {
        status: 0,
        message: '模板文件复制成功'
    }
    let filename = req.query.filename
    let url = path.join(template_url, filename)
    async.auto({
        func1: function(callback) {
            travel(path.join(url), function (pathname) {
                let views_url1 = pathname.replace(/\btemplate\b/, 'views')
                let readable = fs.createReadStream(pathname)//创建读取流
                let writable = fs.createWriteStream(views_url1)//创建写入流
                readable.pipe(writable)
            })
            callback(null, path.join(views_url, filename))
        },
        func2: ['func1', function (results, callback) {
            fs.readFile(results.func1 + '/index.html', 'utf8', function (err, file) {
                if (err) throw err
                if (file) {
                    callback(null, file)
                } else{
                    result.status = 1
                    result.message = '没有获取到模板内容'
                    res.json(result)
                }
            })
        }],
        func3: ['func2', function(results, callback){
            const $ = cheerio.load(results.func2.toString())
            var data = {}
            if ($('.text-mark').toArray().length > 0) {
                data.text = []
                for (var i = 0; i < $('.text-mark').toArray().length; i++) {
                    data.text.push($('.text-mark').eq(i).text())
                }
            }
            if ($('img').toArray().length > 0) {
                data.img = []
                for (var i = 0; i < $('img').toArray().length; i++) {
                    let src = $('img').eq(i).attr('src').slice(2, $('img').eq(i).attr('src').length)
                    data.img.push(path.join('demo.eago.world/views', filename, src))
                }
            }
            if ($('.link-mark').toArray().length > 0) {
                data.link = []
                for (var i = 0; i < $('.link-mark').toArray().length; i++) {
                    data.link.push($('.link-mark').eq(i).attr('href'))
                }
            }
            if ($('.btn-mark').toArray().length > 0) {
                data.btn = []
                for (var i = 0; i < $('.btn-mark').toArray().length; i++) {
                    data.btn.push($('.btn-mark').eq(i).children('a').text())
                }
            }
            callback(null, data)
        }]
    }, function (err, results) {
        if (err) throw err
        result.data = results.func3
        result.url = path.join(views_url, filename)
        res.json(result)
    })
}

exports.revise_view = (req, res) => {
    let result = {
        status: 0,
        message: '模板文件修改成功'
    }
    let data = req.body
    let url = path.join(views_url, data.name, 'index.html')
    async.auto({
        func1: function (callback) {
            fs.readFile(url, 'utf8', function (err, file) {
                if (err) throw err
                if (file) {
                    callback(null, file)
                } else {
                    result.status = 1
                    result.message = '没有获取到模板内容'
                    res.json(result)
                }
            })
        },
        func2: ['func1', function (results, callback) {
            const $ = cheerio.load(results.func1.toString())
            if (data.type == 'text') {
                $('.text-mark').eq(data.index).html(data.html)
            }
            if (data.type == 'link') {
                $('.link-mark').eq(data.index).attr('href', data.html)
            }
            if (data.type == 'btn') {
                $('.btn-mark').eq(data.index).children('a').html(data.html)
            }
            callback(null, $.html())
        }],
        func3: ['func2', function (results, callback) {
            fs.writeFile(url, results.func2, 'utf8', function (err, data) {
                if (err) throw err
                callback(null)
            })
        }]
    }, function (err, results) {
        if (err) throw err
        res.json(result)
    })
}

exports.deletedir = (req, res) => {
    let result = {
        status: 0,
        message: '模板文件已删除'
    }
    let dirname = req.query.name
    deletedir(path.join(views_url, dirname))
    res.json(result)
}

exports.uploadimg = (req, res) => {
    let result = {
        status: 0,
        message: '图片上传成功'
    }
    let imgurl = path.join(views_url, req.body.name, 'img')
    if (fs.existsSync(imgurl)) {
        let readable = fs.createReadStream(path.join('/usr/local/server/uploads/', req.file.filename))//创建读取流
        let writable = fs.createWriteStream(path.join(imgurl, req.file.originalname))//创建写入流
        readable.pipe(writable)
    } else {
        mkdir(imgurl)
        let readable = fs.createReadStream(path.join('/usr/local/server/uploads/', req.file.filename))//创建读取流
        let writable = fs.createWriteStream(path.join(imgurl, req.file.originalname))//创建写入流
        readable.pipe(writable)
    }
    if (fs.existsSync(path.join(imgurl, req.file.originalname))){
        async.auto({
            func1: function (callback) {
                fs.readFile(path.join(views_url, req.body.name, 'index.html'), 'utf8', function (err, file) {
                    if (err) throw err
                    if (file) {
                        callback(null, file)
                    } else {
                        result.status = 1
                        result.message = '没有获取到模板内容'
                        res.json(result)
                    }
                })
            },
            func2: ['func1', function (results, callback) {
                const $ = cheerio.load(results.func1.toString())
                if (req.body.type === 'regex') {
                    $('img[src ="' + req.body.imgurl_regex + '" ]').attr('src', './img/' + req.file.originalname)
                }
                if (req.body.type === 'video') {
                    $('video').attr('src', './img/' + req.file.originalname)
                }
                if (req.body.type === 'index') {
                    $('img').eq(req.body.index).attr('src', './img/' + req.file.originalname)
                }
                callback(null, $.html())
            }],
            func3: ['func2', function (results, callback) {
                fs.writeFile(path.join(views_url, req.body.name, 'index.html'), results.func2, 'utf8', function (err, data) {
                    if (err) throw err
                    callback(null)
                })
            }]
        }, function (err, results) {
            if (err) throw err
            res.json(result)
        })
    } else {
        result.status = 1
        result.message = '操作失败,请稍后再试'
        res.json(result)
    }
}

exports.revise_text = (req, res) =>{
    let result = {
        status: 0,
        message: '文字修改成功'
    }
    async.auto({
        func1: function (callback) {
            fs.readFile(path.join(views_url, req.body.name, 'index.html'), 'utf8', function (err, file) {
                if (err) throw err
                if (file) {
                    callback(null, file)
                } else {
                    result.status = 1
                    result.message = '没有获取到模板内容'
                    res.json(result)
                }
            })
        },
        func2: ['func1', function (results, callback) {
            let regexp = new RegExp(req.body.text_before)
            let html = results.func1.toString()
            html = html.replace(regexp, req.body.text_after)
            callback(null, html)
        }],
        func3: ['func2', function (results, callback) {
            fs.writeFile(path.join(views_url, req.body.name, 'index.html'), results.func2, 'utf8', function (err, data) {
                if (err) throw err
                callback(null)
            })
        }]
    }, function (err, results) {
        if (err) throw err
        res.json(result)
    })
}

exports.save = (req, res) => {
    let result = {
        status: 0,
        message: '文字修改成功'
    }
    let filename = req.body.template_name
    let url = path.join(template_url, filename)
    console.log(req.cookies)
    uploadFload(path.join(url), function (pathname) {
        let regexp = new RegExp(filename)
        let address = pathname.replace(/\btemplate\b/, 'views')
        let alname = address.replace(regexp, req.body.name)
        if () {
            
        }
        co(function* () {
            let lander_result = yield client.put('/page/' + alname.substr(28), address)
            console.log(lander_result)
            let data = {
                name: lander_result.name,
                url: lander_result.url,
                des: req.body.des,
                type: req.body.type
            }
            Lander.create(data, (err, data) => {
                if (err) throw err
                if (data) {
                    res.json(result)
                } else {
                    result.status = 1
                    result.message = '服务器错误'
                    res.json(result)
                }
            })
            result.data = data
            result.status = lander_result.res.status
            res.json(result)
        }).catch(function (err) {
            if (err) {
                res.status(503)
                res.set('Content-Type', 'application/json charset=utf-8')
                res.json(err)
            }
        })
    })
}

/**
 * 复制文件夹
 * */
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        let pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
            let domain_url = pathname.replace(/\btemplate\b/, 'views')
            mkdir(domain_url)
            travel(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}

/**
 * 创建文件夹
 * */
function mkdir(url) {
    if (fs.existsSync(url)) {
        return true
    } else {
        if (mkdir(path.dirname(url))) {
            fs.mkdirSync(url)
            return true
        }
    }
}

/**
 * 删除文件夹
 * */
function deletedir(path) {
    let files = []
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(function(file, index) {
            var curPath = path + "/" + file
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deletedir(curPath)
            } else { // delete file
                fs.unlinkSync(curPath)
            }
        });
        fs.rmdirSync(path)
    }
}

/**
 * 上传文件夹
 * */
function uploadFload(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        let pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
            uploadFload(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}
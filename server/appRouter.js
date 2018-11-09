/*
后台应用的路由器模块
1. 引入express
2. 得到路由器
3. 注册n个路由
4. 向外暴露路由器
5. 通过 app使用上路由器
 */
// 1. 引入express
const express = require('express')
const models = require('./models')
const md5 = require('blueimp-md5')
const UserModel = models.getModel('user')
// 2. 得到路由器
const router =express.Router()
const filter = {'pwd': 0, '__v': 0} // 查询时过滤掉
// 3. 注册n个路由
router.post('/register',function (req, res) {
    // 获取请求参数
    const {name,pwd,type} = req.body // 包含所有请求参数的对象
    // 处理(操作数据库数据)
    // 根据name查询是否已经存在,
    UserModel.findOne({name},function (err, user) {
    // 如果已经存在, 返回一个错误的提示
        if (user) {
            return res.send({code: 1, msg: '用户名已存在!'})// code: 数据的标识 1: 错误 0: 正确
        }else {
     // 如果不存在, 保存到数据库
           new UserModel({name,pwd:md5(pwd),type}).save(function (err, user) {
                // 向浏览器端返回cookie(key=value)
                res.cookie('userid', user._id)
                // 返回成功的响应数据(新的user)
                res.send({code:0, data:{_id: user.id, name, type}})//不返回密码
            })
        }

    })
})


//登录路由
router.post('/login',function (req, res) {
    // 获取请求参数
    const {name,pwd} = req.body
    // 处理(操作数据库数据)根据name和pwd查询是否已经存在,
    UserModel.findOne({name,pwd:md5(pwd)},filter,function (err, user) {
        // 如果已经存在, 返回一个错误的提示
        if (!user) {
            res.send({code: 1, msg: '用户名或密码错误!'})
        }else{
            // 向浏览器端返回cookie(key=value)
            res.cookie('userid', user._id)
            //有值，则返回user
            res.send({code:0,data:user})
        }
    })
})
// 4. 向外暴露路由器
module.exports = router

// 5. 通过 app使用上路由器 在server.js中
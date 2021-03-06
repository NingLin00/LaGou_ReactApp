/*
后台应用的路由器模块
1. 引入express
2. 得到路由器
3. 注册n个路由
4. 向外暴露路由器
5. 通过 app使用上路由器
 */
// 1. 引入express
const express = require('express');
const md5 = require('blueimp-md5');
const models = require('./models');
const ChatModel = models.getModel('chat');
const UserModel = models.getModel('user');
const filter = {'pwd': 0,'__v': 0} ;// 查询时过滤掉
// 2. 得到路由器
const router =express.Router();

//注册路由
router.post('/register',function (req, res) {
    // 获取请求参数
    const {name,pwd,type} = req.body // 包含所有请求参数的对象
    // 处理(操作数据库数据)
    // 根据name查询是否已经存在,
    UserModel.findOne({name},function (err, user) {
    // 如果已经存在, 返回一个错误的提示
        if (user) {
             res.send({code: 1, msg: '用户名已存在!'})// code: 数据的标识 1: 错误 0: 正确
        }else {
     // 如果不存在, 保存到数据库
           new UserModel({name,pwd:md5(pwd),type}).save(function (err, user) {
                // 向浏览器端返回cookie(key=value)
                res.cookie('userid', user._id)//{maxAge: 1000*60*60*24*1} 持久化cookie, 浏览器会保存在本地文件
                // 返回成功的响应数据(新的user)
                res.send({code:0, data:{_id: user._id, name, type}})//不返回密码
            })
        }

    })
});

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
            // 生成一个cookie(userid: user._id), 并交给浏览器保存
            res.cookie('userid', user._id);//,{maxAge: 1000*60*60*24*1}持久化cookie
            //有值，则返回user
            res.send({code:0,data:user})
        }
    })
});

//更新用户路由
router.post('/update',function (req, res) {
    // 检查用户是否登录, 如果没有, 返回错误提示信息
    const userid = req.cookies.userid;
    if (!userid){
        return res.send({code:1,msg:'请先登录'})
    }
    //更新数据库中对应的数据
    UserModel.findByIdAndUpdate({_id:userid},req.body,function (err, user) {// user是数据库中原来的数据
        if (!user) {
            //删除浏览器的cookies中的userid
             res.clearCookie('userid');
            return res.send({code:1,msg:'请先登录'})
        }else {
            //更新成功
            const {_id,name,type} = user;
            const data = Object.assign(req.body,{_id,name,type});//合并数据
            res.send({code:0,data})
        }
    })
});

// 根据cookie获取对应的user
router.get('/user', function (req, res) {
    // 取出cookie中的userid
    const userid = req.cookies.userid
    if(!userid) {
        return res.send({code: 1, msg: '请先登录'})
    }
    // 查询对应的user
    UserModel.findOne({_id: userid}, filter, function (err, user) {
        if(!user) {
            // 清除浏览器保存userid的cookie
            res.clearCookie('userid')
            return res.send({code: 1, msg: '请先登录'})
        } else {
            return res.send({code: 0, data: user})
        }
    })
});

//根据type获取用户列表
router.get('/userlist',function (req, res) {
    const type = req.query.type;

    UserModel.find({type},filter,function (err, users) {
        res.send({code: 0, data: users})
    })
});


//获取当前用户所有相关聊天信息列表
router.get('/msglist', function (req, res) {
    // 获取cookie中的userid
    const userid = req.cookies.userid;
    // 查询得到所有user文档数组
    UserModel.find(function (err, userDocs) {
        // 用对象存储所有user信息: key为user的_id, val为name和avatar组件的user对象
        const users = {};//对象容器
        userDocs.forEach(doc => {
            users[doc._id] = {name: doc.name, avatar: doc.avatar}
        });

    //查询userid相关的所有聊天信息

        ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
            // 返回包含所有用户和当前用户相关的所有聊天消息的数据
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })
});

//修改指定消息为已读
router.post('/readmsg', function (req, res) {
    // 得到请求中的from和to
    const from = req.body.from;
    const to = req.cookies.userid;
    /*
    更新数据库中的chat数据
    参数1: 查询条件
    参数2: 更新为指定的数据对象
    参数3: 是否1次更新多条, 默认只更新一条
    参数4: 更新完成的回调函数
     */
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
        console.log('/readmsg', doc);
        res.send({code: 0, data: doc.nModified})
    })
});

// 4. 向外暴露路由器
module.exports = router;

// 5. 通过 app使用上路由器 在server.js中
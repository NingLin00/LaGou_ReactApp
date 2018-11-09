/*
后台启动服务器的入口模块
1. 引入express
2. 生成应用对象(执行express函数)
3. 注册根路由(使用app的use())
4. 启动服务器(使用app监听指定端口)
 */
// 1. 引入express
        const express = require('express')
        const bodyParser = require('body-parser')
        const cookieParser = require('cookie-parser')
        const appRouter = require('./appRouter')
// 2. 生成应用对象(执行express函数)
       const app = express()
// 3. 注册路由(使用app的use())
        app.use(cookieParser())   // 解析cookie数据
        app.use(bodyParser.json())// 解析请求体(ajax请求: json数据格式)
        app.use(bodyParser.urlencoded({extends:false}))// 解析请求体(表单数据)
        app.use('/api',appRouter)//注册上路由
// 4. 启动服务器(使用app监听指定端口)
        app.listen('4000',() => {
            console.log('start server at port:4000')
        })
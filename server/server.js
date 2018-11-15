/*
后台启动服务器的入口模块
1. 引入express
2. 生成应用对象(执行express函数)
3. 注册根路由(使用app的use())
4. 启动服务器(使用app监听指定端口)
 */
// 1. 引入express
        const express = require('express');
        const cookieParser = require('cookie-parser');
        const bodyParser = require('body-parser');
        // const cors = require('cors')
        const appRouter = require('./appRouter');
        const ChatModel = require('./models').getModel('chat');
// 2. 生成应用对象(执行express函数)
       const app = express();

//    得到服务器对象
        const server = require('http').Server(app);
//    得到IO对象
        const io = require('socket.io')(server);

//缓存所有socket连接的容器
        const sockects = {};


// 监视连接(当有一个客户连接上时回调)
io.on('connection', function(socket) {// socket代表客户端与服务器连接
    console.log('soketio 连接完成')

// 得到连接url中包含的参数userid
    const userid = socket.handshake.query.userid

// 如果userid没有值, 直接结束
    if(!userid) {
        return
    }
// 如果缓存中已经存在, 从缓存中移除, 断开连接
    const savedSocket = sockects[userid]
    if(savedSocket) {
        delete sockects[userid]
        savedSocket.disconnect()
    }
    // 将新的socket缓存起来
    sockects[userid] = socket

// 绑定sendMsg监听, 接收客户端发送的消息
    socket.on('sendMsg', function({from,to,content}) {
        console.log('服务器接收到浏览器的消息', {from,to,content});
        //保存到数据库
        const chat_id =[from , to].sort().join('_');
        const create_time = Date.now();
        const chatModel = new ChatModel({from , to , content , chat_id ,create_time});
        chatModel.save(function (err, chatMsg) {
        //发送消息给对应的客户端
            sockects[from] && sockects[from].emit('receiveMsg', chatMsg);
            sockects[to] && sockects[to].emit('receiveMsg', chatMsg);
            console.log('服务器向2个客户端发送消息', from, to, chatMsg)
        });
    })
});


// 3. 注册路由(使用app的use())
//         app.use(cors()) ;// 向响应中添加一个响应头告诉浏览器允许跨域
        app.use(cookieParser()) ;  // 解析cookie数据
        app.use(bodyParser.json());// 解析请求体(ajax请求: json数据格式)
        app.use(bodyParser.urlencoded({extends:false}));// 解析请求体(表单数据)
        app.use('/api',appRouter);//注册上路由
// 4. 启动服务器(使用app监听指定端口)
        server.listen('4000',() => {
            console.log('start server at port:4000')
        });
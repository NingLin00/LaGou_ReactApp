// 测试使用mongoose操作mongodb数据库的模块
// 1. 连接数据库
// 1.1. 引入mongoose
const mongoose = require('mongoose')

// 1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/lagou')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function () {
    console.log('数据库连接成功')
})

// 2. 得到对应特定集合的Model
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    // 用户名
    'name': {type: String, 'required': true},
    // 密码
    'pwd': {type: String, 'required': true},
    // 类型
    'type': {'type': String, 'required': true},
    // 头像
    'avatar': {'type': String},
    // 个人简介或者职位简介
    'desc': {'type': String},
    // 职位名
    'title': {'type': String},
    // 如果你是boss 还有两个字段
    // 公司名称
    'company': {'type': String},
    // 工资
    'money': {'type': String}
})

// 2.2. 定义Model(与集合对应, 可以操作集合)
mongoose.model('user', userSchema)
const UserModel = mongoose.model('user')//根据标识名称获取对应模型

// 3. 通过Model或其实例对集合数据进行CRUD操作
// 3.1. 通过Model实例的save()添加数据
function testSave() {
    const userModel = new UserModel({name: 'Jack',pwd: '123',type: 'HR',avatar: 'boy'})
    userModel.save(function (err, user) {
            console.log('save()',err,user)
    })
}
//testSave()

// 3.2. 通过Model的find()/findOne()查询多个或一个数据
function findTest() {
    UserModel.find(function (err, users) {//返回数组users 没有则返回空数组
        console.log('find()',err,users)
    })
    UserModel.findOne({_id: '5be4041a736b4417ac1354c0'}, function (err, user) { // 如果没有匹配的, 返回null
        console.log('findOne()', err, user)
    })

}
//testFind()

// 3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5be4041a736b4417ac1354c0'},{name:'Jane'},function (err, user) {
        console.log('findByIdAndUpdate',err,user)//user中被更新的值是原来的值
    })
}
//testUpdate()
// 3.4. 通过Model的remove()删除匹配的数据
function testDelete() {
    UserModel.remove({type: 'hr'},function (err, result) {
        console.log('testDelete',err,result)
    })
}
//testDelete()
//包含N个与后台接口对应的请求函数模块
//函数返回值为promise对象
import ajax from './ajax'


// 请求注册
export const reqRegister = (user) => ajax('/api/register', user, 'POST')
// 请求登陆
export const reqLogin = (user) => ajax('/api/login', user, 'POST')


import {AUTH_SUCCESS,ERROR_MSG} from './action-types'
import {reqRegister,reqLogin} from '../api'

// 同步错误消息
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
// 同步成功响应.返回一个action对象
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})


/*
异步注册
 */
export function register({name, pwd, pwd2, type}) {
    //前台验证
    if (!name || !pwd || !type) {
        return errorMsg('用户名密码必须输入!')
    }
    if (pwd !== pwd2) {
        return errorMsg('密码和确认密码不同!')
    }
    //发送异步ajax请求
    return  dispatch => { //返回一个函数是异步action
        reqRegister({name, pwd, type}).then(response =>{
            const result = response.data
            if (result.code === 0) {//成功
                dispatch(authSuccess(result.data))
            } else {
                dispatch(errorMsg(result.msg))
            }
        } )
    }
}
/*
异步登陆
 */
export const login = ({name, pwd}) => {
    if (!name || !pwd) {
        return errorMsg('用户密码必须输入')
    }
    return async dispatch => {
        const result = await reqLogin({name, pwd})
        if (result.code === 0) {
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

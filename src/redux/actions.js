import io from 'socket.io-client'

import {AUTH_SUCCESS,
        ERROR_MSG,
        RECEIVE_USER,
        RESET_USER,
        RECEIVE_USER_LIST,
        RECEIVE_MSG,
        RECEIVE_MSG_LIST,
        MSG_READ} from './action-types'
import {reqRegister,
        reqLogin,
        reqUpdateUser,
        reqUser,
        reqUserList,
        reqMsgList,
        reqReadMsg} from '../api'

// 同步错误消息
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg})
// 同步成功响应.返回一个action对象
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 同步接收用户
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 同步重置用户
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 同步接收用户列表
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
// 接收一个聊天消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}})
// 读取了消息的同步action
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})


// 初始化与服务器的io连接,绑定接收消息的监听
function initIO(userid, dispatch) {
    // 连接IO服务, 得到连接对象socket
    io.socket = io(`ws://localhost:4000?userid=${userid}`)
    // 绑定接收服务发送消息的监听
    io.socket.on('receiveMsg', function (chatMsg) {
        console.log('浏览器接收到消息', chatMsg)
        dispatch(receiveMsg(chatMsg, userid))
    })
}
/*
异步获取当前用户相关的所有聊天列表
 */
async function getMsgList(dispatch, userid) {
    const response = await reqMsgList()
    const result = response.data
    if(result.code===0) {
        const {users, chatMsgs} = result.data
        dispatch(receiveMsgList({users, chatMsgs, userid}))
    }
}

//发送消息
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        io.socket.emit('sendMsg', {from, to, content})
        console.log('浏览器向服务器发送消息', {from, to, content})
    }
};
/*
异步读取了聊天的action
 */
export const readMsg = (from) => {
    return async (dispatch, getState) => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code===0) {
            const count = result.data
            const to = getState().user._id
            dispatch(msgRead({count, from, to}))
        }
    }
}


/*
异步注册
 */
export const register = ({name, pwd, pwd2, type}) => {
    //前台验证
    if (!name || !pwd) {
        return errorMsg('用户名密码必须输入!')
    }else if (pwd !== pwd2) {
        return errorMsg('密码和确认密码不一致!')
    }
    //发送异步ajax请求
    return async dispatch => { //返回一个函数是异步action
       const response = await reqRegister({name, pwd, type})
        const result = response.data
        if (result.code === 0) {//成功
            initIO(result.data._id, dispatch)
            getMsgList(dispatch , result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
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
        const response = await reqLogin({name, pwd})
         const result = response.data
        if (result.code === 0) {
            initIO(result.data._id, dispatch)
            getMsgList(dispatch , result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}
/*
异步更新
 */
export const updateUser = (user) => {
    return async dispatch => {
        // 发送异步ajax请求
        const response = await reqUpdateUser(user)
        const result = response.data
        if (result.code === 0) { // 更新成功
            dispatch(receiveUser(result.data))
        } else { // 失败
            dispatch(resetUser(result.msg))
        }
    }
}
/*
异步获取用户
 */
export  const getUser = () => {
    return async dispatch => {
        // 发送异步ajax请求
        const response = await reqUser()
        const result = response.data
        if (result.code === 0) { // 成功
            initIO(result.data._id, dispatch)
            getMsgList(dispatch , result.data._id)
            dispatch(receiveUser(result.data))
        } else { // 失败
            dispatch(resetUser(result.msg))
        }
    }
};
/*
异步获取用户列表
 */
export const getUserList = (type) => {
    return async dispatch => {
        // 发送异步ajax请求
        const response = await reqUserList(type)
        const result = response.data
        if (result.code === 0) { // 成功
            dispatch(receiveUserList(result.data))
        }
    }
};
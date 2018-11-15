
import {combineReducers} from 'redux'
import {AUTH_SUCCESS,
        ERROR_MSG,
        RECEIVE_USER,
        RESET_USER,
        RECEIVE_USER_LIST,
        RECEIVE_MSG,
        RECEIVE_MSG_LIST,
        MSG_READ} from './action-types'
import {getRedirectPath} from "../utils";

const initUser = {
    name: '', // 用户名
    type: '', // 类型
    msg: '', // 错误提示信息
    redirectTo: '' // 需要自动跳转的路由path
}
//管理user的reducer
function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS: // 认证成功
            const user = action.data;
            return {...user,redirectTo: getRedirectPath(user.type,user.avatar)};
        case ERROR_MSG: // 错误信息提示
            return {...state, msg: action.data};//...作用是解包、打包
        case RECEIVE_USER:
            return action.data;
        case RESET_USER:
            return {...initUser, msg: action.data};
        default:
            return state
    }
}

const initUserList = [];
//管理userList的reducer
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

const initChat = {
    chatMsgs: [], // 包含所有当前用户相关的聊天列表
    users: {}, // 包含所有用户信息{name, avatar}的对象容器(不需要遍历查找)
    unReadCount: 0 // 未读消息的数量
}
// 管理聊天相关状态数据的reducer
function chat(state=initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG:
            var {chatMsg, userid} = action.data;
            return {
                chatMsgs: [...state.chatMsgs, chatMsg],
                users: state.users,
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to===userid)
            }
        case RECEIVE_MSG_LIST:
            var {chatMsgs, users, userid} = action.data;
            return {
                chatMsgs,
                users,
                unReadCount: chatMsgs.reduce((preTotal, msg) => { // 别人发给我的未读消息
                    return preTotal + (!msg.read&&msg.to===userid ? 1 : 0)
                }, 0)
            };
        case MSG_READ:
            const {count, from, to} = action.data;

            return {
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from===from && msg.to===to && !msg.read) {
                        // msg.read = true  // 不能直接修改状态
                        return {...msg, read: true}
                    } else {
                        return msg
                    }
                }),
                users: state.users,
                unReadCount: state.unReadCount-count
            };
        default:
            return state
    }
}


export default combineReducers({
    user,
    userList,
    chat
})

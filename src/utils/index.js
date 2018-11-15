/*
* 包含N个工具函数的模块
* */
export function getRedirectPath(type, avatar) {
    let path = ''
    //根据type 得到path
    path += type==='hr' ? '/hr':'/seeker'
    //没有头像则添加info
    if (!avatar) {
        path+='info'
    }
    return path
}
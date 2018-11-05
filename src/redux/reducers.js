
import {combineReducers} from 'redux'

function xxx(state = 0 , action) {
     return state
 }

function yyy(state ={} , action) {
    return state
}
// 向外暴露返回合并后的reducer函数
export default combineReducers({
    xxx,
    yyy
})
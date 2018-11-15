/*
对话消息列表组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

/*
得到跟所有人聊天(chat_id)的最后一条msg组成的数组
1. 使用{}存储每个聊天的lastMsg:   {chat_id: lastMsg}
2. 得到所有lastMsg组成的数组
3. 对数组进行排序(按create_time降序)
 */

function getLastMsgs (chatMsgs, userid) {
    // 创建存储lastMag的对象容器
    const lastMsgObjs = {}
    // 遍历chatMsgs
    chatMsgs.forEach(msg => {

        msg.unReadCount = 0
        // 统计msg
        if(!msg.read && msg.to===userid) {
            msg.unReadCount = 1
        }

        // 取出msg对应的保存的lastMsg
        const savedLastMsg = lastMsgObjs[msg.chat_id]
        // 如果不存在
        if(!savedLastMsg) {
            // 将msg保存为lastMsg
            lastMsgObjs[msg.chat_id] = msg
        } else {
            // 比较, 如果msg的create_time更大, 就替换
            if(msg.create_time>savedLastMsg.create_time) {
                lastMsgObjs[msg.chat_id] = msg
                msg.unReadCount += savedLastMsg.unReadCount
            } else {
                savedLastMsg.unReadCount += msg.unReadCount
            }
            // lastMsgObjs[msg.chat_id].unReadCount +=  + msg.unReadCount
        }
    })


    // 得到所有lastMsg组成的数组
    const lastMsgs = Object.values(lastMsgObjs)

    // 对数组进行排序(按create_time降序)
    lastMsgs.sort(function (msg1, msg2) { // 如果返回负数, msg1在前面, 如果是正数, msg2在前面, 否则不变位置
        return msg2.create_time-msg1.create_time
    })

    // 返回
    return lastMsgs
}

class Msg extends Component {

    render() {
        const {user, chat} = this.props
        const {users, chatMsgs} = chat
        const meId = user._id

        // 得到跟所有人聊天的最后一条msg组成的数组
        const lastMsgs = getLastMsgs(chatMsgs, meId)


        return (
            <List style={{marginTop: 50, marginBottom: 50}}>
                {
                    lastMsgs.map(lastMsg => {
                        const targetId = lastMsg.to===meId ? lastMsg.from : lastMsg.to
                        const targetUser = users[targetId]
                        const targetAvatarIcon = targetUser.avatar ? require(`../../assets/imgs/${targetUser.avatar}.png`) : null

                        return (
                            <Item
                                key={lastMsg._id}
                                extra={<Badge text={lastMsg.unReadCount}/>}
                                thumb={targetAvatarIcon}
                                arrow='horizontal'
                                onClick={() => this.props.history.push(`/chat/${targetId}`)}
                            >
                                {lastMsg.content}
                                <Brief>{targetUser.name}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
)(Msg)
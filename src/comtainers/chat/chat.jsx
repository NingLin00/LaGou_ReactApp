/*
对话聊天的路由组件
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem,Icon, Grid} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

import {sendMsg,readMsg} from '../../redux/actions'

const Item = List.Item

 class Chat extends Component {

     state = {
         content: '',
         isShow: false //表情列表是否显示
     };

     componentWillMount () { // 在第一次调用render()之前调用
         const emojis = [ '😄', '😆', '😉', '😆', '😎', '😉',
              '😍', '😅', '😉', '😄', '😅', '😉',
              '😄', '😅', '😉', '😄', '😅', '😉',
              '😄', '😅', '😉', '😄', '😅', '😉',
              '😄', '😅', '😉', '😄', '😅', '😉',
              '😄', '😅', '😉', '😄', '😅', '😉',
              '😄', '😅', '😉', '😄', '😅', '😉']
         this.emojis = emojis.map(text => ({text}))
     }

     componentWillUnmount () {
         // 请求标识当前消息已读
         const from = this.props.match.params.userid;
         this.props.readMsg(from)
     }
     componentDidMount() {
         // 初始显示列表
         window.scrollTo(0, document.body.scrollHeight)
     }
     componentDidUpdate () {
         console.log('更新显示列表')
         // 更新显示列表
         window.scrollTo(0, document.body.scrollHeight)
     }

     //收集发送内容
     handleChange = (content) => {
         this.setState({content})
     };

     //发送消息
     send = () => {
         const content = this.state.content.trim();
         if(content) {
             const from = this.props.user._id;
             console.log('from', from);
             const to = this.props.match.params.userid;
             // 发送消息
             this.props.sendMsg({from, to, content});
             // 清除输入数据并隐藏表情
             this.setState({content: '', isShow: false})
         }
     };

     toggleShow = () => {
         const isShow = !this.state.isShow;
         this.setState({isShow});

         if(isShow) {
             // 异步手动派发resize事件,解决表情列表显示的bug
             setTimeout(() => {
                 window.dispatchEvent(new Event('resize'))
             }, 0)
         }
     };


    render() {

        // 找到所有当前登陆用户与目标用户的聊天列表
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat;
        if(!users[user._id]) { // 当没有数据时, 不做任何显示
            return null
        }else if (!users[user._id].avatar){
            Object.assign({avatar: user.avatar}, this.props.chat.users[user._id])
        }
        const targetId = this.props.match.params.userid
        const meId = user._id
        const chat_id = [targetId, meId].sort().join('_')
        const msgs = chatMsgs.filter(msg => msg.chat_id===chat_id);

        const targetAvatar = users[targetId].avatar;
        const targetIcon = targetAvatar ? require(`../../assets/imgs/${targetAvatar}.png`) : null;
        const meIcon = require(`../../assets/imgs/${user.avatar}.png`);
        return (
            <div id='chat-page'>
                <NavBar className='stick-top' icon={<Icon type='left'/>}
                        onLeftClick={() => this.props.history.goBack()}>
                    {users[targetId].name}
                </NavBar>
                <List style={{marginTop:50, marginBottom: 50}}>
                    <QueueAnim type='left'>
                        {
                            msgs.map(msg => {
                                if(msg.to===meId) { // 发给我的
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb={targetIcon}
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                } else { // 我发的
                                    return (
                                        <Item
                                            className='chat-me'
                                            key={msg._id}
                                            extra={<img src={meIcon}/>}
                                        >
                                            {msg.content}
                                        </Item>
                                    )
                                }
                            })
                        }
                    </QueueAnim>

                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        extra={
                            <div>
                                <span onClick={this.toggleShow} style={{marginRight:6}}>😊</span>
                                <span onClick={this.send}>发送</span>
                            </div>
                        }
                        value={this.state.content}
                        onChange={val => {this.handleChange(val)}}
                        onFocus={() => this.setState({isShow: false})}
                    />
                    {this.state.isShow ? (
                        <Grid data={this.emojis}
                              columnNum={8}
                              carouselMaxRow={4}
                              isCarousel={true}
                              onClick={item => this.setState({content: this.state.content + item.text})}/>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default connect(
    state =>({user: state.user,chat:state.chat}),
    {sendMsg,readMsg}
)(Chat)


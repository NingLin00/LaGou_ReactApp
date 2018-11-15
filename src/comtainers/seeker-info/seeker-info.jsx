/*
求职者信息完善路由组件
 */
import React, {Component} from 'react'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {updateUser} from '../../redux/actions'

class SeekerInfo extends Component {

    state = {
        // 头像
        avatar: '',
        // 个人简介
        desc: '',
        // 求职岗位
        title: '',
    }

    handleChange = (name, val) => {
        //更新状态
        this.setState({[name]: val})
    }

    // 保存
    save  = () => {
        this.props.updateUser(this.state)
    }

    // 设置头像
    setAvatar = (avatar) => {
        this.setState({avatar})
    }

    render () {
        // 如果用户信息已经完成, 自动跳转到求职者的应用面板: /seeker
        const {user} = this.props
        if(user.avatar) {
            return <Redirect to='/seeker'/>
        }

        return (
            <div>
                <NavBar>求职信息完善</NavBar>
                <AvatarSelector setAvatar={this.setAvatar}/>
                <InputItem onChange={val => {this.handleChange('title', val)}}>求职岗位:</InputItem>
                <TextareaItem
                    title="个人简介:"
                    rows={3}
                    onChange={val => {this.handleChange('desc', val)}}
                />
                <Button type="primary" onClick={this.save}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(SeekerInfo)

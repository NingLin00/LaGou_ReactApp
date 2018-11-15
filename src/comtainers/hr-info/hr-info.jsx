//HR信息完善

import React, {Component} from 'react'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import AvatarSelector from '../../components/avatar-selector/avatar-selector'
import {updateUser} from '../../redux/actions'

class HrInfo extends Component {

    state = {
        // 头像
        avatar: '',
        // 个人简介或者职位简介
        desc: '',
        // 职位名
        title: '',
        // 公司名称
        company: '',
        // 工资
        money: ''
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
        // 如果用户信息已经完成, 自动跳转到HR的应用面板: /hr
        const {user} = this.props
        if(user.avatar) {

            // return null
            return <Redirect to='/hr'/>
        }

        return (
            <div>
                <NavBar>HR信息完善</NavBar>
                <AvatarSelector setAvatar={this.setAvatar}/>
                <InputItem onChange={val => {this.handleChange('title', val)}}>招聘职位:</InputItem>
                <InputItem onChange={val => {this.handleChange('company', val)}}>公司名称:</InputItem>
                <InputItem onChange={val => {this.handleChange('money', val)}}>职位薪资:</InputItem>
                <TextareaItem
                    title="职位要求:"
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
)(HrInfo)

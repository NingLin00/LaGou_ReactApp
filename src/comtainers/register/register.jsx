
// 注册组件
import React from 'react'
import {NavBar,WingBlank,InputItem,WhiteSpace,List,Button} from 'antd-mobile'
import RadioItem from "antd-mobile/es/radio/RadioItem"

import Logo from '../../components/logo/logo'



export default class Resgister extends React.Component{

    //给当前state对象指定state属性
    state = {
        name:'',
        pwd:'',
        pwd2:'',
        type:'seeker',//用户类型
    }
    // 更新指定属性名的状态
    handelChange (name,val){
        this.setState({[name]:val})
    };
    //切换到登录
    goLogin = () =>{
        this.props.history.replace('/Login')
    };
    //处理注册
    handelResgister = () =>{
        // 触发redux中register action调用
        // this.props.register(this.state)
        console.log(JSON.stringify(this.state))
    };

    render(){
        return (
            <div className='logo-comtainer'>
                <NavBar>拉勾网</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        <InputItem placeholder='输入用户名'
                                   onChange={(val) => {this.handelChange('name',val)}}>用户名:</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='输入密码'
                                   type='password'
                                   onChange={(val) => {this.handelChange('pwd',val)}}>密 码:</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder='输入确认密码'
                                   type='password'
                                   onChange={(val) => {this.handelChange('pwd2',val)}}>确认密码:</InputItem>
                        <WhiteSpace/>
                        <RadioItem checked={this.state.type==='seeker'}
                                   onClick={() =>{this.handelChange('type','seeker')}}>我要求职</RadioItem>
                        <RadioItem checked={this.state.type==='HR'}
                                   onClick={() =>{this.handelChange('type','HR')}}>我要招人</RadioItem>
                        <Button type='primary' onClick={this.handelResgister}>注册</Button>
                        <Button onClick={this.goLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }

}
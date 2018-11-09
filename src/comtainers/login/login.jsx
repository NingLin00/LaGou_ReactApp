
// 登录组件

import React from 'react'
import {NavBar,WingBlank,InputItem,WhiteSpace,List,Button} from 'antd-mobile'


import Logo from '../../components/logo/logo'



export default class Login extends React.Component{

    //给当前state对象指定state属性
    state = {
        name:'',
        pwd:'',
    }
    // 更新指定属性名的状态
    handelChange (name,val){
        this.setState({[name]:val})
    };
    //切换到注册
    goRegister = () =>{
        this.props.history.replace('/register')
    };
    //处理注册
    handelLogin = () =>{
        // 触发redux中register action调用
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
                        <Button type='primary' onClick={this.handelLogin}>登录</Button>
                        <Button onClick={this.goRegister}>还没有账号?</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }

}
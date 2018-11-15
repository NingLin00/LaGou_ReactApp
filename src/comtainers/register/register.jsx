
// 注册组件
import React from 'react'
import {NavBar,WingBlank,InputItem,WhiteSpace,List,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import RadioItem from "antd-mobile/es/radio/RadioItem"
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'



class Register extends React.Component{

    //给当前state对象指定state属性
    state = {
        name:'',
        pwd:'',
        pwd2:'',
        type:'seeker',//用户类型
    }
    
	// 更新指定属性名的状态
    handelChange (name,val){this.setState({[name]:val})};
    
	//切换到登录
    goLogin = () =>{this.props.history.replace('/login')};
    
	//处理注册
    handelRegister = () =>{
        // 触发redux中register action调用
        this.props.register(this.state)
    };

    render(){
        const {user} = this.props
		
		//如果user的redirectTo有值，则跳转到指定路径
        if(user.redirectTo){
            return <Redirect to={user.redirectTo}/>
        }
		
        return (
            <div className='logo-comtainer'>
                <NavBar>拉勾网</NavBar>
                <Logo/>
                <WingBlank>
                    {user.msg ? <p className='error-msg'>{user.msg}</p> : ''}{/*如果msg有值，则显示*/}
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
                        <RadioItem checked={this.state.type==='hr'}
                                   onClick={() =>{this.handelChange('type','hr')}}>我要招人</RadioItem>
                        <Button type='primary' onClick={this.handelRegister}>注册</Button>
                        <Button onClick={this.goLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }

}

export default connect(
    state => ({user:state.user}),//成为了组件Register的一个属性，user对象
    {register}//成为了组件Register的一个属性，register函数
)(Register)//传入的user和register都会成为组件Register的属性
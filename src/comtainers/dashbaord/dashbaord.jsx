
// 应用面版的路由组件

import React from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import cookies  from 'browser-cookies'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'

import HrInfo from '../hr-info/hr-info'
import SeekerInfo from '../seeker-info/seeker-info'
import Hr from '../hr/hr'
import Seeker from '../seeker/seeker'
import Msg from '../msg/msg'
import Chat from '../chat/chat'
import User from '../user/user'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'

import {getUser} from '../../redux/actions'
import {getRedirectPath} from "../../utils";


export class Dashbaord extends React.Component{

    // 给组件对象添加navList属性: this.navList获取
    navList = [
        {
            path: '/hr', // 路由路径
            component: Hr,
            title: '招聘列表',
            icon: 'hr',
            text: '求职者',
        },
        {
            path: '/seeker', // 路由路径
            component: Seeker,
            title: '求职列表',
            icon: 'job',
            text: 'HR',
        },
        {
            path: '/msg', // 路由路径
            component: Msg,
            title: '消息列表',
            icon: 'msg',
            text: '消息',
        },
        {
            path: '/user', // 路由路径
            component: User,
            title: '个人中心',
            icon: 'user',
            text: '我',
        }
    ];


    componentDidMount () {
        // cookie中有userid
        // redux中的user是空对象
        const userid = cookies.get('userid');
        const {user} = this.props;
        if(userid && !user._id) {
            this.props.getUser()  // 获取user并保存到redux中
        }
    }

    render(){
        // 得到当前请求的path
        const pathname = this.props.location.pathname;
        // 判断用户是否已登陆(过)(cookie中userid是否有值)
        const userid = cookies.get('userid');
        if(!userid) { // 如果没值, 自动跳转到登陆界面
            return <Redirect to='/login'/>
        }
        // cookie中有userid
        // redux中的user是空对象
        const {user} = this.props;
        if (!user._id) {
            return null
        }else {
            // 请求根路径时, 自动 跳转到对应的用户主界面
            if(pathname==='/') {
                const path = getRedirectPath(user.type, user.avatar);
                return <Redirect to={path}/>
            }
            // 指定哪个nav应该被隐藏
            if(user.type==='hr') {
                this.navList[1].hide = true
            } else {
                this.navList[0].hide = true
            }
        }
        // 得到当前的nav
        const currentNav = this.navList.find(nav => nav.path===pathname);
        return (

            <div>
                {currentNav? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path='/hrinfo' component={HrInfo}/>
                    <Route path='/seekerinfo' component={SeekerInfo}/>
                    <Route path='/hr' component={Hr}/>
                    <Route path='/seeker' component={Seeker}/>
                    <Route path='/msg' component={Msg}/>
                    <Route path='/user' component={User}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter unReadCount={this.props.unReadCount} navList={this.navList}/> : null}
            </div>
        );
    }

}
export default connect(
    state => ({user:state.user , unReadCount:state.chat.unReadCount}),
    {getUser}
)(Dashbaord)
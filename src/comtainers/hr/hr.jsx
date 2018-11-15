import React,{Component} from 'react'
import {connect} from "react-redux"

import {getUserList} from '../../redux/actions'
import UserList from "../../components/user-list/user-list";

 class Hr extends Component{

     componentDidMount(){
         //异步获取求职者的用户列表
         this.props.getUserList('seeker')
     }

  render(){
   return (
   <UserList userList={this.props.UserList}/>
   )
   }
  }
export default connect(
    state =>({UserList:state.userList}),
    {getUserList}
)(Hr)
import React,{Component} from 'react'
import {connect} from "react-redux"

import {getUserList} from '../../redux/actions'
import UserList from '../../components/user-list/user-list'

class Seeker extends Component{

    componentDidMount(){
        //异步获取Hr的用户列表
        this.props.getUserList('hr')
    }

  render(){
   return (
   <UserList userList={this.props.userList}/>
   )
  }
}
  export default connect(
      state =>({userList:state.userList}),
      {getUserList}
  )(Seeker)
/*
选择头像的组件
 */
import React,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import {PropTypes} from 'prop-types'

export default class AvatarSelector extends Component{

    static propTypes = {
        setAvatar:PropTypes.func.isRequired
    }

    state={
        icon: null,
        text: ''
    }
    constructor(props){
        super(props)
        this.avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
            .split(',')//字符串的方法split，产生一个数组。链式调用数组的map方法，返回一个数组，数组有若干个对象，对象包含文字，头像
            .map(text => ({text,icon:require(`../../assets/imgs/${text}.png`)}))
    }

    selectAvatar=({icon,text}) => {
        this.setState({icon})//更新当前组件状态
        this.props.setAvatar(text)//更新父组件状态
    }
  render(){
        const {icon} = this.state
      const girdHeader = icon ? <p>已选择头像：<img src={icon} alt="avatar"/></p> : '请选择头像'
   
   return (
	   <List renderHeader={() => girdHeader}>
		   <Grid
			   data={this.avatarList}
			   columnNum={5}
			   onClick={this.selectAvatar}/>
	   </List>

   )
   }
  }

//logo组件
import React,{Component} from 'react'

import lagouImg from './lagou_logo.png'
import './logo.less'
export default class Logo extends Component{
  render(){
   return (
   <div>
       <img src={lagouImg} alt='logoImg'/>
   </div>
   )
   }
  }
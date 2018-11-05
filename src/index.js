
// 入口js

import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'antd-mobile'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from './comtainers/login/login'
import Resgister from  './comtainers/resgister/resgister'
import Dashbaord from  './comtainers/dashbaord/dashbaord'

// 渲染到页面
ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route path='/login' component={Login}/>
            <Route path='/resgister' component={Resgister}/>
            <Route  component={Dashbaord}/>//默认路由组件
        </Switch>
    </BrowserRouter>)
    ,
    document.getElementById('root')
)
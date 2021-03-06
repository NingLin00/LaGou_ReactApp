
// 入口js

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter,Route,Switch} from 'react-router-dom'

import store from './redux/store'
import Login from './comtainers/login/login'
import Register from './comtainers/register/register'
import Dashbaord from './comtainers/dashbaord/dashbaord'

import './assets/index.less'


// 渲染到页面
ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Register}/>
                <Route component={Dashbaord}/>
            </Switch>
        </HashRouter>
    </Provider>
    ),document.getElementById('root'));
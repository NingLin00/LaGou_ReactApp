
// 入口js

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import store from './redux/store'
import Login from './comtainers/login/login'
import Resgister from './comtainers/resgister/resgister'
import Dashbaord from './comtainers/dashbaord/dashbaord'


// 渲染到页面
ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/resgister' component={Resgister}/>
                <Route component={Dashbaord}/>
            </Switch>
        </BrowserRouter>
    </Provider>
    ),document.getElementById('root'));
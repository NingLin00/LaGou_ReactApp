/*
底部导航的UI组件
 */

import React from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends React.Component {

    static propTypes = {
        navList: PropTypes.array.isRequired
    }

    render() {

        const navList = this.props.navList.filter(nav => !nav.hide);
        const {pathname} = this.props.location;
        return (
            <TabBar>
				{	navList.map((nav) => (
						<Item
							key={nav.path}
							title={nav.text}
							icon={{uri: require(`./imgs/${nav.icon}.png`)}}
							selectedIcon={{uri: require(`./imgs/${nav.icon}-active.png`)}}
							selected={pathname === nav.path}
							onPress={() => {
								this.props.history.replace(nav.path)
							}}
						>
						</Item>
					))
				}
            </TabBar>
        )
    }
}

export default withRouter(NavFooter)// 让非路由组件可以访问到路由组件的api

/*
用户列表的UI组件
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Card, WingBlank, WhiteSpace} from 'antd-mobile'

const Header = Card.Header
const Body = Card.Body

class UserList extends React.Component {
    render() {
        return (
            <WingBlank>
                <div>
                    <WhiteSpace/>
                    <Card>
                        <Header
                            title='bs1'
                            thumb={require(`../../assets/imgs/boy.png`)}
                            extra={<span>web前端工程师</span>}
                        />
                        <Body>
                        <div>公司: 百度</div>
                        <div>描述: 熟悉react, redux</div>
                        <div>薪资: 15k</div>
                        </Body>
                    </Card>
                </div>
                <div>
                    <WhiteSpace/>
                    <Card>
                        <Header
                            title='br1'
                            thumb={require(`../../assets/imgs/boy.png`)}
                            extra={<span>web前端工程师</span>}
                        />
                        <Body>
                        <div>描述: 熟悉react, redux</div>
                        </Body>
                    </Card>
                </div>
            </WingBlank>
        )
    }
}

export default UserList

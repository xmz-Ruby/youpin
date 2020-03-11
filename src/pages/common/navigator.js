import React from 'react'

import { Link,withRouter } from 'react-router-dom'

//导入导航栏内容
// import navCont from './navCont'

 class Nav extends React.Component{
    render(){
        // console.log(this.props.history.location.pathname);
        // console.log(this.state.navContArr);
        return(
            <ul className="nav nav-pills">
            {/*循环导航栏
                *不可以嵌套Router标签   
            */}            
                <li className={this.props.history.location.pathname === '/' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/'>所有可拼团</Link>
                </li>
               <li className={this.props.history.location.pathname === '/myProducts' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/myProducts'>我参加的团</Link>
                </li>
               <li className={this.props.history.location.pathname === '/myGroups' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/myGroups'>我发起的团</Link>
                </li>
                <li className={this.props.history.location.pathname === '/winnerGroups' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/winnerGroups'>我获奖的团</Link>
                </li>
                <li className={this.props.history.location.pathname === '/groupId' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/groupId'>按团号查询团</Link>
                </li>
                <li className={this.props.history.location.pathname === '/newGroup' ? 'active' : ''} role="presentation">
                    <Link className="liBtn" to='/newGroup'>新建拼奖团</Link>
                </li>
            </ul>
        )
    }

}
//通过withRouter给Nav组件注入路由信息
Nav = withRouter(Nav);
export default Nav;
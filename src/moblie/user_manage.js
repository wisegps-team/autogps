/**
 * 08/03
 * 小吴
 * 客户管理页，展示用户列表，添加用户，删除用户
 */
"use strict";

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import {ThemeProvider} from '../_theme/default';
import STORE from '../_reducers/main';

import Fab from '../_component/base/fab';
import UserList from '../_component/userList';
import Appbar from '../_component/base/appBar';

import {custAct} from '../_reducers/customer';

let unsubscribe = STORE.subscribe(() =>
    console.log('STORE更新了',STORE.getState())
)

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>,thisView);
});

class App extends Component{
    constructor(props, context) {
        super(props, context);
        
    }
    getChildContext(){
        return{
            'STORE':STORE,
            'VIEW':thisView,
            'ACT':custAct
        }
    }
    componentDidMount() {
        let data={
            parentId:_user.uid
        };
        let op={}
        STORE.dispatch(custAct.fun.get(data,op));//初始化获取数据
    }
    
    render() {
        console.log('app渲染了');
        return (
            <ThemeProvider>
            <div>
                <Fab onClick={()=>{thisView.goTo('cust_add.js')}}/>
                <UserList {...this.props.customer}/>
            </div>
            </ThemeProvider>
        );
    }
    
}

App.childContextTypes={
    STORE:React.PropTypes.object,
    VIEW:React.PropTypes.object,
    ACT:React.PropTypes.object
}

const APP=connect(function select(state) {
    return {
        user:state.user
    };
})(App);
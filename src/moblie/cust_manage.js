/**
 * 08/03
 * 小吴
 * 客户管理页，展示客户列表，添加客户，删除客户
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

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>,thisView);
    thisView.prefetch('cust_add.js',2);
});

class App extends Component{
    constructor(props, context) {
        super(props, context);
        this._data={
            parentId:_user.uid,
            custTypeId:'<>4'
        };
    }
    getChildContext(){
        return{
            'STORE':STORE,
            'VIEW':thisView,
            'ACT':custAct,
            'data':this._data
        }
    }
    componentDidMount() {
        let op={}
        STORE.dispatch(custAct.fun.get(this._data,op));//初始化获取数据
    }
    
    render() {
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
    ACT:React.PropTypes.object,
    data:React.PropTypes.object,
}

const APP=connect(function select(state) {
    return {
        customer:state.customer
    };
})(App);
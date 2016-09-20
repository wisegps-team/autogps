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
import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add'

import {userAct} from '../_reducers/customer';
import UserSearch from '../_component/user_search';

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
        this.state={
            search:false
        }
        this._data={
            parentId:_user.customer.objectId,
            custTypeId:4
        };
        this.onData = this.onData.bind(this);
    }
    getChildContext(){
        return{
            'STORE':STORE,
            'VIEW':thisView,
            'ACT':userAct,
            'data':this._data
        }
    }
    componentDidMount() {
        let op={}
        STORE.dispatch(userAct.fun.get(this._data,op));//初始化获取数据
    }

    toAdd(){
        thisView.goTo('cust_add.js',{custTypeId:4});
    }

    onData(data){
        if(data&&data.length){
            this._state={data,total:data.length};
            this.setState({search:true});
        }else{
            this.setState({search:false});
        }
    }
    
    render() {
        let list=this.state.search?(<UserList data={this._state.data} total={this._state.total}/>)
            :(<UserList {...this.props.user}/>);
        return (
            <ThemeProvider>
            <AppBar title={___.user_manage} iconElementRight={<IconButton onClick={this.toAdd}><ContentAdd/></IconButton>}/>
            <div>
                <div style={{padding:'0 10px'}}>
                    <UserSearch onData={this.onData} data={this._data}/>
                </div>
                {list}
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
        user:state.user
    };
})(App);
"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
import UserAdd from '../_component/base/UserAdd';
import STORE from '../_reducers/main';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>,thisView);
});

const _data={
            uid:'',
            name:'javascript',
            province:'广东',
            city:'广州',
            address:'天河区',
            type:'3',
            contact:'Mei',
            tel:'18576783939',
            sex:0,
            treePath:'',
            parentId:'',
            creatorId:'',
            acl:'',
        }

class AppUserAdd extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    getChildContext(){
        return {user_type:this.props.user_type};
    }
    render(){
        console.log('AppUserAdd');
        console.log(this.props);
        return(
            <ThemeProvider>
                <div>
                    <AppBar title={___.add_user}/>
                    <UserAdd data={_data}/>
                    
                </div>
            </ThemeProvider>
        );
    }
}

AppUserAdd.childContextTypes={
    user_type: React.PropTypes.array
}

const APP=connect(function select(state) {
    return {
        user_type:state.user_type
    };
})(AppUserAdd);

"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
import UserAdd from '../_component/UserAdd';
import STORE from '../_reducers/main';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>,thisView);
});

class AppUserAdd extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            cust_data:null
        }
    }
    componentDidMount() {
        let that=this;
        thisView.addEventListener('show',function(e){
            //可能会传参数过来
            console.log(e);
            if(e.params){
                that.setState({cust_data:e.params});
            }
        })
    }
    
    getChildContext(){
        return {custType:this.props.custType};
    }
    render(){
        return(
            <ThemeProvider>
                <div>
                    <AppBar title={___.add_user}/>
                    <UserAdd data={this.state.cust_data}/>
                    
                </div>
            </ThemeProvider>
        );
    }
}

AppUserAdd.childContextTypes={
    custType: React.PropTypes.array
}

const APP=connect(function select(state) {
    return {
        custType:state.custType
    };
})(AppUserAdd);

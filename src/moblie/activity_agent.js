/**
 * 2016-09-26
 * 用户预定页,因为是活动页，所以需要优化加载速度，所以不能和common.js一起用了
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from '../_modules/Wapi';
import {ThemeProvider} from '../_theme/default';


import RaisedButton from 'material-ui/RaisedButton';
import AppBar from '../_component/base/appBar';

import UserSearch from '../_component/user_search';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding:'10px'
    },
    w:{
        width:'100%',
        marginTop:'20px'
    }
}


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.setCust = this.setCust.bind(this);
        this.set = this.set.bind(this);
        this._data={
            custTypeId:5
        }
    }
    
    getChildContext(){
        return{
            'view':thisView
        }
    }

    setCust(val){
        this.data=val;
    }
    set(){
        if(this.data){
            Wapi.role.update(function(res){
                W.alert(___.setting_success);
            },{
                _objectId:'779227173931323400',
                users:'+"'+this.data.uid+'"'
            });
        }
    }

    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.activity_agent}/>
                <div style={sty.p}>
                    <UserSearch onChange={this.setCust} data={this._data}/>
                    <RaisedButton label={___.set_to_agent} style={sty.w} onClick={this.set}/>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    view:React.PropTypes.object,
}
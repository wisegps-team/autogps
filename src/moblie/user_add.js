"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
import UserAdd from '../_component/base/UserAdd';

var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<AppUserAdd/>,thisView);
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
    constructor(props){
        super(props);
    }
    render(){
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

"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
import UserAdd from '../_component/UserAdd';
import STORE from '../_reducers/main';
import {custAct,userAct} from '../_reducers/customer';


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
            cust_data:null,
            type:'cust_manage'
        }
        this.act={};
    }
    componentDidMount() {
        let that=this;
        thisView.addEventListener('show',function(e){
            let type='cust_manage';
            that.act.action=custAct;
            if(e.caller.indexOf('cust_manage')==-1){
                type='user_manage';
                that.act.action=userAct;
            }
            if(e.params){
                that.setState({cust_data:e.params,type});
            }else{
                that.setState({
                    cust_data:{
                        objectId:null,
                        name:'',
                        province:'',
                        provinceId:-1,
                        city:'',
                        cityId:-1,
                        area:'',
                        areaId:-1,
                        custTypeId:0,
                        contact:'',
                        tel:'',
                        sex:1
                    },
                    type
            });
            }
        })
    }
    
    getChildContext(){
        return {
            ACT:this.act,
            custType:this.props.custType
        };
    }
    render(){
        return(
            <ThemeProvider>
                <div>
                    <AppBar title={___.add_user} iconStyleLeft={{display:'none'}}/>
                    <UserAdd data={this.state.cust_data} type={this.state.type}/>
                </div>
            </ThemeProvider>
        );
    }
}

AppUserAdd.childContextTypes={
    custType: React.PropTypes.array,
    ACT: React.PropTypes.object
}

const APP=connect(function select(state) {
    return {
        custType:state.custType
    };
})(AppUserAdd);

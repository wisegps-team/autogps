"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';

import Login from './_component/login';
import Register from './_component/login/register';
import Forget from './_component/login/forget';
import Wapi from './_modules/Wapi';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            active:0//0,登录；1，注册；2，忘记密码
        }
        this.loginSuccess = this.loginSuccess.bind(this);
        this.forgetSuccess = this.forgetSuccess.bind(this);
    }

    componentDidMount(){
        
    }
    getUserData(user){
        if(user.userType==9){
            //如果是员工
            Wapi.employee.get(function(res){
                user.employee=res.data;
                Wapi.customer.get(function(result){
                    user.customer=result.data;
                    W._loginSuccess(user);
                    top.location="src/moblie/home.html";
                },{
                    uid:user.employee.companyId
                });
            },{
                uid:user.uid
            })
        }else
            Wapi.customer.get(function(result){
                user.customer=result.data;
                W._loginSuccess(user);
                top.location="src/moblie/home.html";
            },{
                uid:user.uid
            });
    }
    loginSuccess(res){
        let min=-Math.floor((W.date(res.data.expire_in).getTime()-new Date().getTime())/60000);
        W.setCookie("access_token", res.data.access_token,min);
        let user=res.data;
        if(!user.mobileVerified){//未通过手机验证
            W.alert(___.please_verification);
            this._user=user;//先暂存
            this.setState({active:2});
        }else{
            this.getUserData(user);
        }
    }
    forgetSuccess(res){
        W.toast(___.reset_pwd+___.success);
        if(this._user){//第一次登陆验证手机并重置密码
            this._user.mobileVerified=true;
            this.getUserData(this._user);
            this._user=undefined;
        }
        this.setState({active:0});
    }
    registerSuccess(res){
        
    }
    render() {
        let actives=[
            <Login onSuccess={this.loginSuccess}/>,
            <Register onSuccess={this.registerSuccess}/>,
            <Forget onSuccess={this.forgetSuccess} user={this._user}/>
        ]
        let buttons=[
            <FlatButton label={___.login} primary={true} onClick={()=>this.setState({active:0})} key='login'/>,null,
            // <FlatButton label={___.register} primary={true} onClick={()=>this.setState({active:1})} key='register'/>,
            <FlatButton label={___.forget_pwd} primary={true} onClick={()=>this.setState({active:2})} key='forget_pwd'/>];
        return (
            <ThemeProvider>
                <div className='login'>
                    {actives[this.state.active]}
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px'
                        }}
                    >
                        {buttons.filter((e,i)=>i!=this.state.active)}
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}
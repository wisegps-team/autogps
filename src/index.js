"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';

import Login from './_component/login';
import Forget from './_component/login/forget';
import AgentRegisterBox from './_component/login/agent_register';
import CONFIG from './_modules/config';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            active:(_g.register=='true'&&_g.parentId)?1:0 //0,登录；1，注册；2，忘记密码
        }
        this.loginSuccess = this.loginSuccess.bind(this);
        this.forgetSuccess = this.forgetSuccess.bind(this);
        this.registerCallback = this.registerCallback.bind(this);
    }

    getUserData(user){
        W.loading(1);
        if(user.userType==9){//如果是员工
            let that=this;
            Wapi.employee.get(res=>{
                user.employee=res.data;
                this.getCustomer(user);
            },{
                uid:user.uid
            })
        }else
            this.getCustomer(user);
    }
    getCustomer(user){
        let token=user.access_token;
        let cust_id=user.uid;
        let role_user;
        if(user.employee){
            cust_id=user.employee.companyId;
            role_user=user.employee.objectId;
        }
        Wapi.customer.get(function(cust){
            user.customer=cust.data;
            Wapi.role.get(function(role){
                user.role=role.data;
                Wapi.page.list(function(page){
                    if(!page.data||!page.data.length){//没有任何页面的权限，说明不是这个平台的用户
                        W.loading();
                        W.alert(___.not_allow_login);
                    }
                    user.pages=page.data;
                    W._loginSuccess(user);
                    top.location="src/moblie/home.html";
                },{
                    access_token:token,
                    ACL:'role:'+user.role.objectId+'|'+user.uid,
                    appId:CONFIG.appId
                });
            },{
                users:role_user||cust.data.objectId,
                access_token: token
            });
        },{
            uid:cust_id,
            access_token: token
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
    registerCallback(res){
        if(!res._code){//注册成功
            W.alert(___.register_success,()=>this.setState({active:0}));
        }else{
            switch (res._code) {
                case 1:
                    W.confirm(___.account_error,b=>b?this.setState({active:2}):null);
                    break;
                case 2:
                    //已经是客户了，但不是代理商
                    W.alert(___.user_type_error,()=>this.setState({active:0}));
                    break;
                default:
                    W.alert(___.unknown_err);
                    break;
            }
        }
    }
    render() {
        let sty=this.state.active==1?{padding:'10px'}:null;
        let actives=[
            <Login onSuccess={this.loginSuccess}/>,
            <AgentRegisterBox success={this.registerCallback} parentId={_g.parentId}/>,
            <Forget onSuccess={this.forgetSuccess} user={this._user}/>
        ]
        let buttons=[
            <FlatButton label={___.login} primary={true} onClick={()=>this.setState({active:0})} key='login'/>,null,
            // <FlatButton label={___.register} primary={true} onClick={()=>this.setState({active:1})} key='register'/>,
            <FlatButton label={___.forget_pwd} primary={true} onClick={()=>this.setState({active:2})} key='forget_pwd'/>];
        return (
            <ThemeProvider>
                <div className='login' style={sty}>
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
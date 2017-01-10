"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Login from './_component/login';
import Forget from './_component/login/forget';
import AgentShowBox from './_component/login/agent_register';
import VerificationCode from './_component/base/verificationCode';
import BindBox from './_component/login/bindBox';

import CONFIG from './_modules/config';
import sty from './_component/login/style';
import {getOpenIdKey} from './_modules/tool';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            active:(_g.register=='true'&&_g.parentId)?1:0 //0,登录；1，注册；2，忘记密码；3，更改绑定openid
        }
        // this.state.active=0;
        this.loginSuccess = this.loginSuccess.bind(this);
        this.forgetSuccess = this.forgetSuccess.bind(this);
        this.registerCallback = this.registerCallback.bind(this);
        this.bindSuccess = this.bindSuccess.bind(this);
        this.showBind = this.showBind.bind(this);
    }

    getUserData(user){
        //校验记录的openId是否当前获取到的openId
        if(WiStorm.agent.weixin&&_g.openid&&user.authData&&user.authData[getOpenIdKey()]){//保存有当前域名的openId
            if(user.authData[getOpenIdKey()]!==_g.openid){
                W.confirm(___.ask_change_openId,res=>{
                    if(res){
                        this._user=user;
                        this.setState({active:3});
                    }
                });
                return;
            }
        }
        W.loading(1);
        if(user.userType==9){//如果是员工
            let that=this;
            Wapi.employee.get(res=>{
                user.employee=res.data;
                this.getCustomer(user);
            },{
                uid:user.uid,
                access_token:user.access_token
            })
        }else
            this.getCustomer(user);
    }
    getCustomer(user){
        let token=user.access_token;
        let cust_data={
            access_token:token,
            appId:WiStorm.config.objectId
        };
        if(user.employee){
            cust_data.objectId=user.employee.companyId;
        }else{
            cust_data.uid=user.uid;
        }
        Wapi.customer.get(function(cust){
            user.customer=cust.data;
            let _uid=user.uid;
            if(!user.customer){
                W.loading();
                W.alert(___.not_allow_login);
                return;
            }
            Wapi.role.list(function(role){
                user.role=role.data;
                let acl=_uid;
                if(user.role&&user.role.length)
                    acl+='|role:'+user.role.map(r=>r.objectId).join('|role:');
                Wapi.page.list(function(page){
                    if(!page.data||!page.data.length){//没有任何页面的权限，说明不是这个平台的用户
                        W.loading();
                        W.alert(___.not_allow_login);
                        return;
                    }
                    user.pages=page.data;
                    W._loginSuccess(user);
                    let home="src/moblie/home.html";
                    let loginLocation=_g.loginLocation||home;
                    if(loginLocation.indexOf('.html')==-1)//需要到home.html跳转
                        loginLocation=home+"?loginLocation="+encodeURIComponent(_g.loginLocation);
                    top.location=loginLocation;
                },{
                    access_token:token,
                    ACL:acl,
                    appId:CONFIG.objectId
                });
            },{
                users: _uid, 
                access_token: token
            });
        },cust_data);
    }

    loginSuccess(res){
        let min=-Math.floor((W.date(res.data.expire_in).getTime()-new Date().getTime())/60000);
        W.setCookie("access_token", res.data.access_token,min);
        let user=res.data;
        if(!user.mobileVerified){//未通过手机验证
            W.alert(___.please_verification);
            this._res=res;//先暂存,重置密码成功之后会再调用loginSuccess传递进来
            this.setState({active:2});
        }else{
            let openIdKey=getOpenIdKey();
            if((!user.authData||!user.authData[openIdKey])&&_g.openid){//没有绑定的，进行绑定
                let u={
                    access_token:user.access_token,
                    _sessionToken:user.session_token
                };
                u['authData.'+openIdKey]=_g.openid;
                Wapi.user.updateMe(res=>{
                    delete u._sessionToken;
                    delete u.access_token;
                    user.authData=Object.assign(user.authData,u);
                    this.getUserData(user);
                },u);
            }else
                this.getUserData(user);
        }
    }
    forgetSuccess(res){
        W.toast(___.reset_pwd+___.success);
        if(this._res){//第一次登陆验证手机并重置密码
            this.loginSuccess(this._res);
            this._res=undefined;
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
    showBind(){
        this.setState({active:3});
    }
    bindSuccess(user){//绑定微信成功
        let p='';
        if(_g.wx_app_id)
            p='/?wx_app_id='+_g.wx_app_id;
        location=location.origin+p;
    }
    render() {
        let _sty=this.state.active==1?{padding:'10px'}:null;
        // WiStorm.agent.weixin=false;
        let login_sty=WiStorm.agent.weixin?{
            display:'none'
        }:null;
        let actives=[
            <Login onSuccess={this.loginSuccess} style={login_sty} ssoLoginFail={this.showBind}/>,
            <AgentShowBox success={this.registerCallback} parentId={_g.parentId}/>,
            <Forget onSuccess={this.forgetSuccess} user={this._res?this._res.data:null}/>,
            <BindBox onSuccess={this.bindSuccess} openId={_g.openid}/>
        ]
        let buttons=(this.state.active&&this.state.active!=3)?
            (<FlatButton label={___.login} primary={true} onClick={()=>this.setState({active:0})} key='login'/>)
            :null;
        return (
            <ThemeProvider>
                <div className='login' style={_sty}>
                    {actives[this.state.active]}
                    <div style={{
                        textAlign: 'right',
                        marginTop: '10px'
                        }}
                    >
                        {buttons}
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}



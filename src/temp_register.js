/**
 * 2016-09-23
 * 兼职营销人员注册页
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from './_theme/default';

import Register from './_component/login/register';
import RegisterOrig from './_component/login/registerOrig';
import Input from './_component/base/input';
import SexRadio from './_component/base/sexRadio';
import QrBox from './_component/login/qr_box';

import {getOpenIdKey,setTitle} from './_modules/tool';
import Wapi from './_modules/Wapi'; 

require('./_sass/index.scss');//包含css
setTitle(___.invite_regist);
window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});

const sty={
    r:{
        display:'flex',
        alignItems:'flex-end',
        padding:'3px 10px',
        borderBottom:'1px solid #dddddd',
        backgroundColor:'#fff',
    },
    form:{position:'relative',width:'100%',background:'#fff'},
    sex:{position:'absolute',right:'0px',top:'8px'},
    input:{
        width:'100%',
        height:'40px',
        fontSize:'16px',
        border:'none',
        outline:'none'
    }
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.registerCallback = this.registerCallback.bind(this);

        this.state={
            active:0
        }
    }

    registerCallback(res){
        if(!res._code){//注册成功
            this.setState({active:1});
        }else{
            switch (res._code) {
                case 1:
                    W.confirm(___.account_error);
                    break;
                default:
                    W.alert(___.unknown_err);
                    break;
            }
        }
    }
    render() {
        let data={
            companyId:_g.parentId,
            departId:_g.departId,
            role:'兼职营销',
            roleId:'779209108162220000',
            type:1
        }
        if(!data.departId||data.departId==0){//部门为0，是普通员工注册，赋予普通员工角色，只有我的营销页面权限
            data.role='普通员工';
            data.roleId='820194967434694700';
            data.type=0;
            data.isQuit=false;
        }
        
        let sty=this.state.active?null:{padding:'0px',background:'#eee'};
        let main=this.state.active?<QrBox/>:(
            <EmployeeRegisterBox 
                success={this.registerCallback} 
                defaultData={data}
            />
        );
        return (
            <ThemeProvider>
                <div className='login' style={sty}>
                    {main}
                </div>
            </ThemeProvider>
        );
    }
}





/**
 * 接受的props：
 *      parentId 新注册的员工的公司id
 *      roleId 注册员工的角色
 *      success 注册流程完成时的回调，未必注册成功
 *          props.success(res) 传入一个对象res，根据res._code的值判断是否注册成功，
 *          不存在或为0是注册成功，等于1为密码错误且之前已经注册过用户，
 *          
 */
class EmployeeRegisterBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.data={
            name:'',
            sex:1
        };
        Object.assign(this.data,props.defaultData);
        this.sexChange = this.sexChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.beforRegister = this.beforRegister.bind(this);
    }
    beforRegister(callback){
        if(!this.data.name){
            W.alert(___.user_name_empty);
            return;
        }
        callback();
    }
    registerSuccess(res){
        let user=res;
        if(user.status_code){
            //已注册用户，不能再注册了
            W.alert(___.error[user.status_code]);
            return;
        }
        W.loading(true);
        let that=this;
        let defaultData={
            uid:user.uid,
            tel:user.mobile,
        }
        let emp=Object.assign({},defaultData,this.data);
        Wapi.user.login(function(data){//先登录获取token
            if(data.status_code){
                W.errorCode(data);
                return;
            }
            delete data.status_code;
            Object.assign(user,data);//用户信息
            let token=data.access_token;
            emp.access_token=token;
            emp.uid=user.uid;
            //添加人员表资料
            Wapi.employee.add(function(res){
                emp.objectId=res.objectId;
                user.employee=emp;
                Wapi.role.update(function(role){
                    W.loading();
                    user._code=0;
                    that.props.success(user);
                },{
                    access_token:token,
                    _objectId:emp.roleId,
                    users:'+"'+emp.uid+'"'
                });
            },emp);
            Wapi.user.updateMe(null,{
                _sessionToken:user.session_token,
                access_token:token,
                userType:9,
                authData:{
                    openId:_g.openid
                }
            });
        },{
            account:user.mobile,
            password:user.password
        });
    }

    nameChange(e,val){
        this.data[e.target.name]=e.target.value;
    }
    sexChange(val){
        this.data.sex=val;
    }
    render() {
        let des=_g.departId==0?___.employee_register:___.marketing_personnel_register;
        return (
            <div>
                <h4 style={{textAlign:'center'}}>{_g.name}</h4>
                <p style={{textAlign:'center'}}>{des}</p>
                <div>
                    {/*<form style={{position:'relative',padding:'10px',background:'#fff'}}>
                        <Input name='name' floatingLabelText={___.person_name} onChange={this.nameChange}/>
                        <SexRadio onChange={this.sexChange} style={{position:'absolute',right:'0px',top:'32px'}}/>
                    </form>
                    <Register onSuccess={this.registerSuccess} beforRegister={this.beforRegister}/>*/}

                    <div style={sty.r}>
                        <form style={sty.form}>
                            <input name='name' onChange={this.nameChange} placeholder={___.person_name} style={sty.input}/>
                            <SexRadio onChange={this.sexChange} style={sty.sex}/>
                        </form>
                    </div>
                    <RegisterOrig onSuccess={this.registerSuccess} beforRegister={this.beforRegister}/>
                </div>
            </div>
        );
    }
}
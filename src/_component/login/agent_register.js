import React, {Component} from 'react';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

import VerificationCode from '../base/verificationCode';
import Register from './register';
import Login from './index';
import AreaSelect from '../base/areaSelect';
import Input from '../base/input';
import SexRadio from '../base/sexRadio';



/**
 * 接受的props：
 *      parentId 新注册的客户的上级id
 *      typeId 注册客户的类型
 *      success 注册流程完成时的回调，未必注册成功
 *          props.success(res) 传入一个对象res，根据res._code的值判断是否注册成功，
 *          不存在或为0是注册成功，等于1为密码错误且之前已经注册过用户，
 *          等于2是输入了正确的密码，而且已经是一个客户，客户表中已有数据，所以不能注册
 */
class AgentRegisterBox extends Component{
    constructor(props, context) {
        super(props, context);

        this.state={
            stepIndex:0
        }
        this.data={
            sex:1
        };

        this.nameChange = this.nameChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.registerSuccess = this.registerSuccess.bind(this);
    }
    beforRegister(data){
        if(!this.data.name){
            W.alert(___.user_name_empty);
            return false;
        }
        if(!this.data.cityId){
            W.alert(___.area_empty);
            return false;
        }
        if(!this.data.contact){
            W.alert(___.contact_empty);
            return false;
        }
        return true;
    }
    registerSuccess(){
        W.loading(1);
        let user=this._user;
        let that=this;
        let pid=this.props.parentId;
        let tid=getCustType();
        if(!tid){
            W.alert(___.cust_type_err);
            return;
        }
        let cust=Object.assign({},this.data,{tel:user.mobile,custTypeId:tid});
        cust.parentId=[pid];

        let token=user.access_token;
        cust.access_token=token;
        cust.uid=user.uid;
        cust.isInstall=_g.isInstall==1?1:0;
        cust.appId=WiStorm.config.objectId;

        Wapi.custType.get(type=>{
            cust.custType=type.data.name;
            Wapi.customer.add(function(res){
                cust.objectId=res.objectId;
                user.customer=cust;
                Wapi.role.update(function(role){
                    W.loading();
                    user._code=0;
                    that.props.success(user);
                },{
                    access_token:token,
                    _objectId:type.data.roleId,
                    users:'+"'+cust.uid+'"'
                })
            },cust);
            Wapi.user.updateMe(null,{
                _sessionToken:user.session_token,
                access_token:token,
                userType:type.data.userType
            });
        },{
            id:tid,
            access_token:token
        });
    }
    handleNext(res){
        W.loading(1);
        let user=res;
        let that=this;
        Wapi.user.login(function(data){//先登录获取token
            if(data.status_code){
                W.loading();
                if(data.status_code==2&&user.status_code==8){//密码错误且之前已经注册过用户
                    user._code=1;
                    that.props.success(user);
                    return;
                }
                W.errorCode(data);
                return;
            }
            delete data.status_code;
            Object.assign(user,data);//用户信息
            that._user=user;

            if(user.status_code==8){//如果是之前就已经注册过用户则先校验一下有没有添加过客户表
                customerCheck(user,that,function(){
                    that.registerSuccess();
                });
            }else{
                that.registerSuccess();
            } 
        },{
            account:user.mobile,
            password:user.password
        });
    }

    nameChange(e,val){
        this.data[e.target.name]=val;
    }
    beforRegister(){
        if(this.data.name){
            return true;
        }else
            W.alert(___.pls_input_company_name);
    }
    render() {
        return (
            <div>
                <div style={{padding:'0 10px',background:'#fff'}}>
                    <Input name='name' floatingLabelText={___.company} onChange={this.nameChange}/>
                </div>
                <Register onSuccess={this.handleNext} beforRegister={this.beforRegister}/>
            </div>
        );
    }
}

class AgentShowBox extends Component{
    render(){
        let box=_user?<JoinBox success={this.props.success}/>:<AgentRegisterBox success={this.props.success} parentId={this.props.parentId} key='register' />;
        return (
            <div>
                <h4 style={{textAlign:'center'}}>{_g.name}</h4>
                <p style={{textAlign:'center'}}>{___.agent_register}</p>
                {box}
            </div>
        );
    }
}

//验证手机然后加入其下级
class JoinBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.submit = this.submit.bind(this);
        this.change = this.change.bind(this);
    }
    
    change(code){
        this._code=code;
    }
    submit(){
        customerCheck(_user,this);
    }
    render() {
        return (
            <div>
                <div style={{background:'#fff',padding:'10px'}}>
                    <label>{___.account+'：'}</label>
                    <span>{_user.mobile}</span>
                    <VerificationCode 
                        name='valid_code'
                        type={1}
                        account={_user.mobile} 
                        onSuccess={this.change}
                        onChange={this.change}
                    />
                </div>
                <div style={{textAlign:'center'}}>
                    <RaisedButton label={___.accept_invite} primary={true} style={{marginTop:'10px'}} onClick={this.submit}/>
                </div>
            </div>
        );
    }
}


function customerCheck(user,that,nullCallback){
    Wapi.customer.get(function(cust){
        if(cust.data){//如果有，则校验类型
            user.customer=cust.data;
            if(user.customer.custTypeId==getCustType()){//判断类型
                if(!user.customer.parentId||!user.customer.parentId.includes(that.props.parentId.toString())){
                    Wapi.customer.update(res=>{
                        W.loading();
                        user._code=0;
                        that.props.success(user);
                    },{
                        access_token:user.access_token,
                        _objectId:user.customer.objectId,
                        parentId:'+"'+that.props.parentId+'"'
                    });
                }else{
                    W.loading();
                    user._code=0;
                    that.props.success(user);
                }
            }else{//不是，则提示类型不正确，返回登录
                W.loading();
                user._code=2;
                that.props.success(user);
            } 
        }else{//如果没有，则是完善资料流程
            nullCallback?nullCallback():null;
        }
    },{
        uid:user.uid,
        access_token:user.access_token,
        appId:WiStorm.config.objectId
    });
}

function getCustType(){
    let t=parseInt(_g.custType);
    let type=[5,8];
    if(type.includes(t))
        return t;
    else
        return;
}

export default AgentShowBox;
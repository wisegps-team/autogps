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
import VerificationOrig from '../base/verificationOrig';
import Register from './register';
import RegisterOrig from './registerOrig';
import Login from './index';
import AreaSelect from '../base/areaSelect';
import Input from '../base/input';
import SexRadio from '../base/sexRadio';

/*
 * 接受的props：
 *      parentId 新注册的客户的上级id
 *      typeId 注册客户的类型
 *      success 注册流程完成时的回调，未必注册成功
 *          props.success(res) 传入一个对象res，根据res._code的值判断是否注册成功，
 *          不存在或为0是注册成功，等于1为密码错误且之前已经注册过用户，
 *          等于2是输入了正确的密码，而且已经是一个客户，客户表中已有数据，所以不能注册
 */

const sty={
    f:{
        width: '100%'
    },
    r:{
        display:'flex',
        alignItems:'flex-end',
        padding:'3px 10px',
        borderBottom:'1px solid #dddddd',
        backgroundColor:'#fff',
    },
    input:{
        width:'100%',
        height:'40px',
        fontSize:'16px',
        border:'none',
        outline:'none'
    }
}

class AgentRegisterBox extends Component{
    constructor(props, context) {
        super(props, context);

        this.data={
            name:'',
            contact:'',
            sex:1
        };

        this.nameChange = this.nameChange.bind(this);
        this.sexChange = this.sexChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.registerSuccess = this.registerSuccess.bind(this);
        this.beforRegister = this.beforRegister.bind(this);
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
        if(this.props.managerId!='none'){
            let strMng=this.props.managerId+'in'+this.props.parentId;
            cust.parentMng=[strMng];
        }

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
                if(_g.Authorize === '3'){ //给印刷客户授权扫码代理权限
                    Wapi.authorize.add(auth => {
                        // console.log('印刷客户授权') 
                        Wapi.customer.update(cus => {
                            // console.log('印刷客户授权')
                        },{
                            _objectId:res.objectId,
                            Authorize:'+3'
                        })  
                    },{
                        access_token:token,
                        authorizeType:3,
                        applyCompanyId:res.objectId,
                        applyCompanyName:cust.name,
                        applyUserName:cust.contact,
                        actProductId: 4,
                        status:1
                    })
                }
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
                    // 如果为品牌商，代理商，服务商，则增加扫码挪车代理权限
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

    nameChange(e){
        this.data[e.target.name]=e.target.value;
    }
    sexChange(val){
        this.data.sex=val;
    }
    beforRegister(callback){
        if(!this.data.name){
            W.alert(___.pls_input_company_name);
            return;
        }
        if(!this.data.contact){
            W.alert(___.contact_empty);
            return;
        }
        callback();
    }
    render() {
        return (
            <div>
                <div style={sty.r}>
                    <input name='name' placeholder={___.company_name} style={sty.input} onChange={this.nameChange}/>
                </div>
                <div style={sty.r}>
                    <form style={{position:'relative',width:'100%',background:'#fff'}}>
                        <input name='contact' onChange={this.nameChange} placeholder={___.person_name} style={sty.input}/>
                        <SexRadio onChange={this.sexChange} style={{position:'absolute',right:'0px',top:'8px'}}/>
                    </form>
                </div>
                <RegisterOrig onSuccess={this.handleNext} beforRegister={this.beforRegister}/>
            </div>
        );
    }
}

class AgentShowBox extends Component{
    render(){
        let box=(_user && (_g.custType !== '10'))||(_user && (_g.custType !== '11'))?
            <JoinBox success={this.props.success} parentId={this.props.parentId} managerId={this.props.managerId}/>:
            <AgentRegisterBox success={this.props.success} parentId={this.props.parentId} managerId={this.props.managerId} key='register' />;
        return (
            <div>
                <h4 style={{textAlign:'center'}}>{_g.name}</h4>
                <p style={{textAlign:'center'}}>
                    {
                        _g.Authorize === '3'? ___.movecar_agent_register: 
                        _g.custType === '10' ? ___.movecar_customer_register: 
                        _g.custType === '11'?'扫码印刷注册':___.agent_register
                    }
                </p>
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
                {/*<div style={{background:'#fff',padding:'10px'}}>*/}
                <div style={{background:'#fff'}}>
                    <div style={sty.r}>
                        <div style={{margin:'10px 0px'}} >
                            <span>{___.account+'：'}</span>
                            <span>{_user.mobile}</span>
                        </div>
                    </div>
                    {/*<VerificationCode 
                        name='valid_code'
                        type={1}
                        account={_user.mobile} 
                        onSuccess={this.change}
                        onChange={this.change}
                    />*/}
                    <div style={{display:'flex',alignItems:'flex-end',padding:'3px 10px'}}>
                        <VerificationOrig 
                            name='valid_code'
                            type={1}
                            account={_user.mobile} 
                            onSuccess={this.change}
                            onChange={this.change}
                            style={{width:'100%'}}
                        />
                    </div>
                </div>
                <div style={{textAlign:'center'}}>
                    <RaisedButton label={___.accept_invite} onClick={this.submit} primary={true} style={{marginTop:'10px'}} labelColor='#eee'/>
                </div>
            </div>
        );
    }
}


function customerCheck(user,that,nullCallback){
    Wapi.customer.get(function(cust){
        if(cust.data){//如果有，则校验类型
            user.customer=cust.data;
            if(_g.custType === '10' || user.customer.custTypeId==getCustType()){//判断类型
                if(_g.custType === '10' && !((user.user_type === 5 || user.user_type === 2 || user.user_type === 4))) {// 已注册扫码代理商
                    W.loading();
                    user._code=3;
                    that.props.success(user);  
                    //没有父级或者不包含该邀约注册的父级时
                }else if(!user.customer.parentId||!user.customer.parentId.includes(that.props.parentId.toString())){
                    let params={
                        access_token:user.access_token,
                        _objectId:user.customer.objectId,
                        parentId:'+"'+that.props.parentId+'"',
                    };
                    if(that.props.managerId!='none'){
                        params.parentMng='+"'+that.props.managerId+'in'+that.props.parentId+'"'
                    }
                    Wapi.customer.update(res=>{
                        W.loading();
                        //给代理商经销商品牌商发送印刷客户邀约添加扫码挪车权限
                        if(_g.custType === '10' && (user.user_type === 5 || user.user_type === 2 || user.user_type === 4)){
                            // Wapi.authorize.add(auth => {
                            // // console.log('印刷客户授权') 
                            //     Wapi.customer.update(cus => {
                            //     },{
                            //         _objectId:user.customer.objectId,
                            //         Authorize:'+3'
                            //     })  
                            // },{
                            //     access_token:user.token,
                            //     authorizeType:3,
                            //     applyCompanyId:user.customer.objectId,
                            //     applyCompanyName:user.customer.name,
                            //     applyUserName:user.customer.contact,
                            //     actProductId: 4,
                            //     status:1
                            // })        
                                   
                        }
                        user._code=0;
                        that.props.success(user);
                    },params);
                }else{
                    W.loading();
                    //给代理商经销商品牌商发送印刷客户邀约添加扫码挪车权限
                    if (_g.custType === '10' && (user.user_type === 5 || user.user_type === 2 || user.user_type === 4)) {
                        // Wapi.authorize.add(auth => {
                        //     // console.log('印刷客户授权') 
                        //     Wapi.customer.update(cus => {
                        //     }, {
                        //             _objectId: user.customer.objectId,
                        //             Authorize: '+3'
                        //         })
                        // }, {
                        //     access_token: user.token,
                        //     authorizeType: 3,
                        //     applyCompanyId: user.customer.objectId,
                        //     applyCompanyName: user.customer.name,
                        //     applyUserName: user.customer.contact,
                        //     actProductId: 4,
                        //     status: 1
                        // })
                    }                    
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
    let type=[1,5,8,10,11];
    if(type.includes(t))
        return t;
    else
        return;
}

export default AgentShowBox;
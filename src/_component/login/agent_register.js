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

        this.change = this.change.bind(this);
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
                    W.loading();
                    that.setState({stepIndex:1});
                });
            }else{
                W.loading();
                that.setState({stepIndex:1});
            } 
        },{
            account:user.mobile,
            password:user.password
        });
    }

    nameChange(e,val){
        this.data[e.target.name]=val;
    }
    change(val,name){
        if(name){
            Object.assign(this.data,val);
        }else{
            this.data.sex=val;
        }
    }
    render() {
        return (
            <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                <Step>
                    <StepLabel>{___.verification_phone}</StepLabel>
                    <StepContent>
                        <Register onSuccess={this.handleNext}/>
                    </StepContent>
                </Step>
                <Step>
                    <StepLabel>{___.add_data}</StepLabel>
                    <StepContent>
                        <form>
                            <Input name='name' floatingLabelText={___.company_name} onChange={this.nameChange}/>
                            <AreaSelect name='area' onChange={this.change}/>
                            <Input name='contact' floatingLabelText={___.person} onChange={this.nameChange}/>
                            <SexRadio onChange={this.change} style={{margin:'10px 0'}}/>
                        </form>
                        <RaisedButton
                            label={___.finish_register}
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            primary={true}
                            onTouchTap={this.registerSuccess}
                        />
                    </StepContent>
                </Step>
            </Stepper>
        );
    }
}

class AgentShowBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            action:0
        }
        this.loginSuccess = this.loginSuccess.bind(this);
        this.back = this.back.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.action!=this.state.action);
    }
    
    componentDidMount() {
        document.title=_g.name;
    }

    back(){
        setTimeout(()=>{
            if(this.state.action>0)
                this.setState({action:0});
        },300);
    }

    loginSuccess(res){
        let user=res.data;
        user.access_token;
        customerCheck(user,this);
    }
    
    render(){
        let box=[
            <h4 key='h4'>{'[ '+_g.name+' ] '+___.invite_desc}</h4>
        ];
        if(!this.state.action)
            box=box.concat([
                <div style={{marginBottom:'20px'}} key='toLogin'>
                    {___.have_account}<RaisedButton label={___.join_now} primary={true} onClick={e=>this.setState({action:1})} />
                </div>,
                <div key='toRegister'>
                    {___.no_account}<RaisedButton label={___.sign_now} primary={true} onClick={e=>this.setState({action:2})} />
                </div>
            ]);
        else{
            box.unshift(<IconButton key='back' onClick={this.back}>
                <NavigationArrowBack />
            </IconButton>);
            if(this.state.action==1){
                box.push(<Login onSuccess={this.loginSuccess} key='login' />);
            }else{
                box.push(<AgentRegisterBox success={this.props.success} parentId={this.props.parentId} key='register' />);
            }
        }
        
        return(
                <div>
                    {box}
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
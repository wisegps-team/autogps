import React, {Component} from 'react';

import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

import Register from './register';
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
    
    registerSuccess(){
        if(!this.data.name){
            W.alert(___.user_name_empty);
            return;
        }
        if(!this.data.cityId){
            W.alert(___.area_empty);
            return;
        }
        if(!this.data.contact){
            W.alert(___.contact_empty);
            return;
        }
        W.loading(1);

        let user=this._user;
        let that=this;
        let pid=this.props.parentId;
        let tid=5;
        let cust=Object.assign({},this.data,{tel:user.mobile,custTypeId:tid});
        cust.parentId=[pid];

        let token=user.access_token;
        cust.access_token=token;
        cust.uid=user.uid;

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
                    _objectId:type.roleId,
                    users:'+"'+cust.objectId+'"'
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
                Wapi.customer.get(function(cust){
                    if(cust.data){//如果有，则校验类型
                        user.customer=cust.data;
                        if(res.customer.custTypeId==5){//是代理商，则在parentId里添加一个品牌商
                            Wapi.customer.update(res=>{
                                W.loading();
                                user._code=0;
                                that.props.success(user);
                            },{
                                access_token:user.access_token,
                                _uid:user.uid,
                                parentId:'+'+that.props.parentId
                            });
                        }else{//不是，则提示类型不正确，返回登录
                            W.loading();
                            user._code=2;
                            that.props.success(user);
                        } 
                    }else{//如果没有，则是完善资料流程
                        W.loading();
                        that.setState({stepIndex:1});
                    }
                },{uid:user.uid,access_token:user.access_token});
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

export default AgentRegisterBox;
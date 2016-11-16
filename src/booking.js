/**
 * 2016-09-26
 * 用户预定页,因为是活动页，所以需要优化加载速度，所以不能和common.js一起用了
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';

import Input from './_component/base/input';
import PhoneInput from './_component/base/PhoneInput';
import VerificationCode from './_component/base/verificationCode';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ActionVerifiedUser from 'material-ui/svg-icons/action/verified-user';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});
let ACT;
Wapi.activity.get(function(res){
    if(!res.data||!res.data.status)
        W.alert({title:_g.title,text:___.activity_stop},e=>history.back());
    else
        ACT=res.data;
},{
    objectId:_g.activityId
});

const sty={
    p:{
        padding:'10px'
    },
    f:{
        padding:'10px',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        borderRadius: '2px'
    },
    r:{
        display:'flex',
        alignItems:'flex-end'
    },
    i:{
        margin:'9px'
    },
    b:{
        width:'100%',
        textAlign:'center',
        padding:'16px 5px 5px 0'
    },
    w:{
        width:'100%'
    },
    ex:{
        color:'#999999',
        marginTop:'30px',
        marginLeft:'10px',
    },
    con:{
        wordBreak: 'break-all'
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            self:true,
            confirm_open:true,
            yes:e=>this.setState({confirm_open:false,self:true}),
            no:e=>this.setState({confirm_open:false,self:false}),
            yes_t:___.yes,
            no_t:___.no,
            confirm_text:___.booking_for_self
        };
        this._state={
            confirm_open:false,
            confirm_text:___.getting_qr
        }
        this.success = this.success.bind(this);
    }
    
    getChildContext(){
        return{
            'view':thisView
        }
    }

    success(booking){
        this.getQrcode(booking);//获取二维码
        if(this.state.self){
            if(ACT.deposit){
                let state={
                    confirm_text:___.booking_success+'，'+___.pay_deposit_now.replace('XX',ACT.deposit)+'，'+ACT.offersDesc,
                    yes_t:___.pay_deposit,
                    no_t:___.unpay_deposit,
                    yes:e=>alert('跳转到支付订金'),
                    no:()=>this.setState(this._state),
                    confirm_open:true
                }
                this.setState(state);
            }else
                W.alert(___.booking_success,()=>this.setState(this._state));
        }else{//为他人预订

        }
    }

    getQrcode(booking){
        let scene='1001'+booking.objectId;
        let state=W.ls(scene);
        if(state){//是否已经获取过了(应付支付后返回的情况)
            this._state=state;
            if(!this.state.confirm_open&&this.state.confirm_text==___.getting_qr){
                this.setState(this._state);
                W.setLS(scene,null);
            }
            return;
        }
        Wapi.serverApi.getAnyQrcode(res=>{
            if(res.status_code){
                W.alert(res.err_msg);
                return;
            }
            this._state={
                confirm_text:(<img src={res.url}/>),
                yes_t:___.ok,
                no_t:'',
                yes:e=>e,
                no:e=>e,
                confirm_open:true
            }
            W.setLS(scene,this._state);
            if(!this.state.confirm_open&&this.state.confirm_text==___.getting_qr){
                this.setState(this._state);
                W.setLS(scene,null);
            }
        },{
            scene,
            wxAppKey:_g.wx_app_id
        });
    }
    render() {
        let actions=[
            <FlatButton
                label={this.state.no_t}
                primary={true}
                onClick={this.state.no}
            />,
            <FlatButton
                label={this.state.yes_t}
                primary={true}
                onClick={this.state.yes}
            />
        ];
        return (
            <ThemeProvider>
                <div style={sty.p}>
                    <From self={this.state.self} onSuccess={this.success}/>
                </div>
                <Dialog
                    key='confirm'                    
                    title={_g.title}
                    actions={actions}
                    open={this.state.confirm_open}
                    contentStyle={sty.con}
                >
                    {this.state.confirm_text}
                </Dialog>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    view:React.PropTypes.object,
}

class From extends Component{
    constructor(props, context) {
        super(props, context);
        this.valid=false;
        this.data={
            sellerId:_g.sellerId,
            sellerName:_g.seller_name,
            uid:_g.uid,
            status:0,
            status0:1,
            status1:0,
            status2:0,
            status3:0,
            name:null,
            mobile:null,
            carType:null,
            openId:_g.openid,
            activityId:_g.activityId||'0',
        }
        this.change = this.change.bind(this);
        this.changeVerifi=this.changeVerifi.bind(this);
        this.changeCarName = this.changeCarName.bind(this);
        this.submit = this.submit.bind(this);
        this.mobileChange = this.mobileChange.bind(this);
    }
    
    mobileChange(val,err,userMobile){
        let that=this;
        if(err){
            if(err!=___.phone_err&&err!=___.phone_empty){
                if(userMobile||this.props.self){
                    W.alert(___.not_allow);
                    return;
                } 
            }else
                return;
        }
        Wapi.booking.get(function(res){
            if(res.data){
                W.alert(___.booked);
            }else{
                userMobile?that.data.userMobile=val:that.data.mobile=val;
                that.forceUpdate();
            }
        },{
            mobile:val,
            activityId:_g.activityId
        });
    }
    change(e,val){
        this.data[e.target.name]=val;
    }
    changeVerifi(val){
        this.valid=true;
    }
    changeCarName(e,val){
        this.data.carType={car_num:val};
    }
    submit(){
        if(!this.valid){
            W.alert(___.code_err);
            return;
        }
        let submit_data=Object.assign({},this.data);
        if(this.props.self){//为自己预订，预订人等于自己
            submit_data.userName=submit_data.name;
            submit_data.userMobile=submit_data.mobile;
        }else{
            submit_data.userName=submit_data.userName;
            submit_data.userMobile=submit_data.userMobile;
        }
        for(let k in submit_data){
            if(submit_data[k]==null||typeof submit_data[k]=='undefined'){
                W.alert(___.data_miss);
                return;
            }
        }


        let _this=this;
        Wapi.booking.add(function(res){
            submit_data.objectId=res.objectId;
            let sms_data={
                agent_mobile:_g.agent_tel,//代理商电话
                seller_name:_g.seller_name,//客户经理姓名
                seller_mobile:_g.mobile,//客户经理电话
                customer_name:_this.data.name,//客户姓名
                customer_mobile:_this.data.mobile,//客户电话
                carNum:_this.data.carType.car_num,//客户车牌
            }
            Wapi.comm.sendSMS(function(res){//发短信给客户
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
                _this.props.onSuccess(submit_data);
            },sms_data.customer_mobile,0,W.replace(___.booking_sms_customer,sms_data));
            
            Wapi.comm.sendSMS(function(res){//发短信给代理商
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
            },sms_data.agent_mobile,0,W.replace(___.booking_sms_agent,sms_data));
            
            Wapi.comm.sendSMS(function(res){//发送短信给客户经理
                if(res.status_code){
                    W.errorCode(res);
                    return;
                }
            },sms_data.seller_mobile,0,W.replace(___.booking_sms_seller,sms_data));

        },submit_data);
    }
    render() {
        let carowner=this.props.self?null:[
            <div style={sty.r} key={'carowner_name'}>
                <ActionAccountBox style={sty.i}/>
                <Input name='userName' floatingLabelText={___.carowner_name} onChange={this.change}/>
            </div>,
            <div style={sty.r} key={'carowner_phone'}>
                <HardwareSmartphone style={sty.i}/>
                <PhoneInput name='userMobile' floatingLabelText={___.booking_phone} onChange={(val,err)=>this.mobileChange(val,err,true)} needExist={false}/>
            </div>
        ];
        return (
            <div style={sty.f}>
                {carowner}
                <div style={sty.r}>
                    <ActionAccountBox style={sty.i}/>
                    <Input name='name' floatingLabelText={___.booking_name} onChange={this.change}/>
                </div>
                <div style={sty.r}>
                    <HardwareSmartphone style={sty.i}/>
                    <PhoneInput name='mobile' floatingLabelText={___.booking_phone} onChange={this.mobileChange} needExist={false}/>
                </div>
                <div style={sty.r}>
                    <ActionVerifiedUser style={sty.i}/>
                    <VerificationCode 
                        name='valid_code'
                        type={1}
                        account={this.data.mobile} 
                        onSuccess={this.changeVerifi}
                    />
                </div>
                <div style={sty.r}>
                    <MapsDirectionsCar style={sty.i}/>
                    <Input floatingLabelText={___.carNum} name='carNum' onChange={this.changeCarName}/>
                </div>
                <div style={sty.b}>
                    <RaisedButton label={___.submit_booking} primary={true} onClick={this.submit}/>
                </div>

                <div style={sty.ex}>
                    {___.please_consult+___.phone+": "}
                    <a href={'tel:'+_g.mobile}>{_g.mobile}</a>
                </div>
            </div>
        );
    }
}
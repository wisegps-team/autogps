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
    },
    img:{
        width:window.screen.width*0.75-48+'px',
        height:window.screen.width*0.75-48+'px'
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
        if(ACT.deposit){
            if(this.state.self){
                let state={
                    confirm_text:___.booking_success+'，'+___.pay_deposit_now.replace('XX',ACT.deposit)+'，'+ACT.offersDesc,
                    yes_t:___.pay_deposit,
                    no_t:___.unpay_deposit,
                    yes:e=>alert('跳转到支付订金,跳回来时给seller推送'),
                    no:()=>{
                        this.setState({
                            confirm_open:false,
                            confirm_text:___.getting_qr
                        });
                        setTimeout(e=>this.setState(this._state),500);
                        this.sendToSeller(booking);
                    },
                    confirm_open:true
                }
                this.setState(state);
            }else{//为他人预订
                let state={
                    confirm_text:___.booking_success+'，'+W.replace(___.pan_all,ACT)+'，'+ACT.offersDesc,
                    yes_t:___.pay_now,
                    no_t:___.pay_install,
                    yes:e=>alert('跳转到支付全款和安装费用,跳回来时给seller推送'),
                    no:()=>{
                        this.setState({
                            confirm_open:false,
                            confirm_text:___.getting_qr
                        });
                        setTimeout(e=>this.setState(this._state),500);
                        this.sendToSeller(booking);
                    },
                    confirm_open:true
                }
                this.setState(state);
            }
        }else{
            W.alert(___.booking_success,()=>this.setState(this._state));
            this.sendToSeller(booking);
        }
    }

    getQrcode(booking){
        let scene=booking.objectId;
        let qrRes=W.ls(scene);
        if(qrRes){//是否已经获取过了(应付支付后返回的情况)
            this.setQr(qrRes,scene);
            return;
        }
        Wapi.serverApi.getAnyQrcode(res=>{
            if(res.status_code){
                W.alert(res.err_msg);
                return;
            }
            W.setLS(scene,res);
            Wapi.booking.update(null,{_objectId:booking.objectId,'carType.qrUrl':res.url});
            this.setQr(res,scene);
        },{
            type:1001,
            data:scene,
            wxAppKey:_g.wx_app_id
        });
    }

    setQr(res,scene){
        let booking_qr=this.state.self?___.booking_qr:___._booking_qr;
        this._state={
            confirm_text:[
                <div key='booking_qr'>{booking_qr.replace('<%%>',res.name)}</div>,
                <div key='booking_do_not_share'>{___.booking_do_not_share}</div>,
                <img style={sty.img} src={res.url} key='qr'/>
            ],
            no_t:null,
            confirm_open:true
        };
        if(!this.state.confirm_open&&this.state.confirm_text==___.getting_qr){
            this.setState(this._state);
            W.setLS(scene,null);
        }
    }

    sendToSeller(booking){
        if(!_g.seller_open_id)return;
        let pay=___.not_pay;
        if(booking['payStatus']){
            if(booking['payStatus']==1)
                pay=___._deposit+'：'+booking['payMoney'];
            else if(booking['payStatus']==2)
                pay=___.all_price+'：'.booking['payMoney'];
        }
        Wapi.serverApi.sendWeixinByTemplate(function(res){
            console.log(res);
        },{
            openId:_g.seller_open_id,
            uid:_g.uid,
            type:1,
            templateId:'OPENTM407674335',
            link:'#',
            data:{
                "first": {//标题
                    "value": ACT.name,
                    "color": "#173177"
                },
                "keyword1": {//预订时间
                    "value": W.dateToString(new Date()).slice(0,16),
                    "color": "#173177"
                },
                "keyword2": {//预订人
                    "value": booking.name+'/'+booking.mobile,
                    "color": "#173177"
                },
                "keyword3": {//客户
                    "value": booking.userName+'/'+booking.userMobile,
                    "color": "#173177"
                },
                "keyword4": {//产品型号
                    "value": ACT.product+'(￥'+ACT.price+')，'+___.install_price+'：￥'+ACT.installationFee,
                    "color": "#173177"
                },
                "keyword5": {//预付款
                    "value": pay,
                    "color": "#173177"
                },
                "remark": {
                    "value": '',
                    "color": "#173177"
                }
            }
        });
    }
    render() {
        let actions=this.state.no_t?[
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
        ]:null;
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
            userMobile:val,
            activityId:_g.activityId
        });
    }
    change(e,val){
        this.data[e.target.name]=val;
        if(e.target.name=='mobile')
            this.forceUpdate();
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
            submit_data.type=0;
        }else{
            submit_data.userName=submit_data.userName;
            submit_data.userMobile=submit_data.userMobile;
            submit_data.type=1;
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
            _this.props.onSuccess(submit_data);
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
        let mobile=this.props.self?(<div style={sty.r}>
            <HardwareSmartphone style={sty.i}/>
            <PhoneInput name='mobile' floatingLabelText={___.booking_phone} onChange={this.mobileChange} needExist={false}/>
        </div>):(<div style={sty.r}>
            <HardwareSmartphone style={sty.i}/>
            <Input name='mobile' floatingLabelText={___.booking_phone} onChange={this.change}/>
        </div>);
        return (
            <div style={sty.f}>
                {carowner}
                <div style={sty.r}>
                    <ActionAccountBox style={sty.i}/>
                    <Input name='name' floatingLabelText={___.booking_name} onChange={this.change}/>
                </div>
                {mobile}
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
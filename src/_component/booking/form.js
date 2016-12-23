import React, {Component} from 'react';

import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ActionVerifiedUser from 'material-ui/svg-icons/action/verified-user';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import Input from '../base/input';
import PhoneInput from '../base/PhoneInput';
import VerificationCode from '../base/verificationCode';

const sty={
    f:{
        width: '100%'
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
    ex:{
        color:'#999999',
        marginTop:'30px',
        marginLeft:'10px',
        textAlign:'center',
    },
    c:{
        marginLeft: '9px',
        marginTop: '1em'
    },
}

class Form extends Component {
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
            openId:_g.openid,
            activityId:_g.activityId||'0',
            payStatus:0,
            payMoney:0
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
        this._valid=val;
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
            submit_data.userOpenId=submit_data.openId;
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

        let ACT=this.props.act;

        //补上数据
        submit_data.activityType=ACT.type;
        submit_data.product={
            name:ACT.product,
            id:ACT.productId,
            price:ACT.price,
            installationFee:ACT.installationFee,
            reward:ACT.reward,
            act_url:ACT.url
        };
        if(ACT.count)
            submit_data.managerId=ACT.principalId;//活动负责人id

        let _this=this;
        Wapi.user.register(function(user){
            let uid=user.uid;
            Wapi.booking.add(function(res){
                submit_data.objectId=res.objectId;
                _this.props.onSuccess(submit_data,uid);
            },submit_data);
        },{
            mobile:submit_data.mobile,
            valid_code:this._valid,
            password:submit_data.mobile.slice(-6),
            valid_type:1
        });
    }
    render() {
        let ACT=this.props.act;
        let tel=(ACT?ACT.tel:'');
        let carowner=this.props.self?null:[
            <div style={sty.r} key={'carowner_name'}>
                <ActionAccountBox style={sty.i}/>
                <Input name='userName' floatingLabelText={___.carowner_name} onChange={this.change}/>
            </div>,
            <div style={sty.r} key={'carowner_phone'}>
                <HardwareSmartphone style={sty.i}/>
                <PhoneInput name='userMobile' floatingLabelText={___.carowner_phone} onChange={(val,err)=>this.mobileChange(val,err,true)} needExist={false}/>
            </div>
        ];
        let mobile=this.props.self?(<div style={sty.r}>
            <HardwareSmartphone style={sty.i}/>
            <PhoneInput name='mobile' floatingLabelText={___.booking_phone} onChange={this.mobileChange} needExist={false}/>
        </div>):(<div style={sty.r}>
            <HardwareSmartphone style={sty.i}/>
            <Input name='mobile' floatingLabelText={___.booking_phone} onChange={this.change} type='tel'/>
        </div>);
        let ps={
            color:'#ccc',
            marginLeft: '11px'
        };
        return (
            <div style={sty.f}>
                <p style={ps}>{___.book_id+': '+_g.mobile.slice(-6)}</p>
                <Checkbox label={___.booking_for_self} checked={this.props.self} onCheck={e=>this.props.setSelf(true)} style={sty.c}/>
                <Checkbox label={___.booking_for_else} checked={!this.props.self} onCheck={e=>this.props.setSelf(false)} style={sty.c}/>
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
                <div style={sty.b}>
                    <RaisedButton label={___.submit_booking} primary={true} onClick={this.submit}/>
                </div>

                <div style={sty.ex}>
                    {___.please_consult}
                    <a href={'tel:'+tel}>{tel}</a>
                </div>
            </div>
        );
    }
}

export default Form;
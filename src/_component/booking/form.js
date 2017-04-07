import React, {Component} from 'react';

import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ActionVerifiedUser from 'material-ui/svg-icons/action/verified-user';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import Input from '../base/input';
import PhoneInput from '../base/PhoneInput';
import VerificationOrig from '../base/verificationOrig';
import {getOpenIdKey} from '../../_modules/tool';

const sty={
    f:{
        width: '100%'
    },
    r:{
        display:'flex',
        alignItems:'flex-end',
        padding:'3px 10px',
        borderBottom:'1px solid #dddddd'
    },
    i:{
        margin:'9px'
    },
    b:{
        width:'100%',
        textAlign:'center',
        padding:'20px 5px 5px 0'
    },
    ex:{
        color:'#999999',
        marginTop:'20px',
        marginBottom:'20px',
        marginLeft:'10px',
        textAlign:'center',
    },
    c:{
        marginLeft: '9px',
        marginTop: '1em'
    },
    black:{
        color:'#000000'
    },
    input:{
        width:'100%',
        height:'40px',
        fontSize:'16px',
        border:'none',
        outline:'none'
    }
}

class Form extends Component {
    constructor(props, context) {
        super(props, context);
        this.valid=false;
        // this.valid=true;//测试用
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
            payMoney:0,
            carType:{
                qrStatus:'0'
            }
        }
        this.change = this.change.bind(this);
        this.changeVerifi=this.changeVerifi.bind(this);
        this.submit = this.submit.bind(this);
    }
    
    change(e,val){
        this.data[e.target.name]=e.target.value;
        if(e.target.name=='mobile')
            this.forceUpdate();
    }
    changeVerifi(val){
        this.valid=true;
        this._valid=val;
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
            brand:ACT.brand,
            name:ACT.product,
            id:ACT.productId,
            price:ACT.price,
            installationFee:ACT.installationFee,
            reward:ACT.reward,
            act_url:ACT.url,
            actProductId:ACT.actProductId
        };
        submit_data.deposit=ACT.deposit;
        submit_data.offersDesc=ACT.offersDesc;
        // if(ACT.count)
            // submit_data.managerId=ACT.principalId;//活动负责人id
        
        W.loading(true,___.booking_now);
        let _this=this;

        //2017-04-05 改为先注册，然后再更新预定表中的相关Id
        
        // if(ACT.type==1 || ACT.type==3){
        //     //_g.sellerId 可能有3种情况：活动创建公司员工/活动创建公司所属经销商/活动创建公司所属经销商员工
        //     Wapi.employee.get(resEpl=>{
        //         if(resEpl.data){
        //             let eply=resEpl.data;
        //             if(resEpl.companyId==_g.uid){//seller为活动创建公司员工
        //                 Wapi.department.get(resDpt=>{
        //                     submit_data.managerId=resDpt.data.adminId||'';
        //                     submit_data.marcompanyId=eply.companyId;
        //                     submit_data.sellerTypeId=resDpt.data.objectId;
        //                     register();
        //                 },{objectId:eply.departId});
        //             }else{//seller为活动创建公司所属经销商的员工
        //                 Wapi.customer.get(resCust=>{
        //                     let cust=resCust.data;
        //                     let str=cust.parentMng.find(ele=>ele.includes(ACT.uid));
        //                     if(str){
        //                         submit_data.managerId=str.split('in')[0];
        //                         submit_data.marcompanyId=eply.companyId;
        //                     }
        //                     register();
        //                 },{objectId:eply.companyId});
        //             }
        //         }else{//seller为活动创建公司所属经销商
        //             Wapi.customer.get(resCust=>{
        //                 let cust=resCust.data;
        //                 let str=cust.parentMng.find(ele=>ele.includes(ACT.uid));
        //                 if(str){
        //                     submit_data.managerId=str.split('in')[0];
        //                     submit_data.marcompanyId=cust.objectId;
        //                 }
        //                 register();
        //             },{objectId:_g.sellerId});
        //         }
        //     },{objectId:_g.sellerId});
        // }else{
        //     register();
        // }

        function getRelationId(user, callback) {
            var submit_data = {};
            if(ACT.type==1 || ACT.type==3){
                //_g.sellerId 可能有3种情况：活动创建公司员工/活动创建公司所属经销商/活动创建公司所属经销商员工
                Wapi.employee.get(resEpl=>{
                    if(resEpl.data){
                        let eply=resEpl.data;
                        if(resEpl.companyId==_g.uid){//seller为活动创建公司员工
                            Wapi.department.get(resDpt=>{
                                submit_data.managerId=resDpt.data.adminId||'';
                                submit_data.marcompanyId=eply.companyId;
                                submit_data.sellerTypeId=resDpt.data.objectId;
                                callback(submit_data);
                            },{objectId:eply.departId, access_token: user.access_token});
                        }else{//seller为活动创建公司所属经销商的员工
                            Wapi.customer.get(resCust=>{
                                let cust=resCust.data;
                                let str=cust && cust.parentMng ? cust.parentMng.find(ele=>ele.includes(ACT.uid)): null;
                                if(str){
                                    submit_data.managerId=str.split('in')[0];
                                    submit_data.marcompanyId=eply.companyId;
                                    callback(submit_data);
                                }
                            },{objectId:eply.companyId, access_token: user.access_token});
                        }
                    }else{//seller为活动创建公司所属经销商
                        Wapi.customer.get(resCust=>{
                            let cust=resCust.data;
                            let str=cust && cust.parentMng ? cust.parentMng.find(ele=>ele.includes(ACT.uid)): null;
                            if(str){
                                submit_data.managerId=str.split('in')[0];
                                submit_data.marcompanyId=cust.objectId;
                                callback(submit_data);
                            }
                        },{objectId:_g.sellerId, access_token: user.access_token});
                    }
                },{objectId:_g.sellerId, access_token: user.access_token});
            }
        }

        function register(){
            console.log(submit_data);
            bonkingRegister(submit_data.mobile,_this._valid,submit_data.name,submit_data.openId,function(user){
                let uid=user.uid;
                submit_data.userId=uid;
                Wapi.booking.add(function(res){
                    submit_data.objectId=res.objectId;
                    // 更新相关的上级及管理用户ID
                    getRelationId(user, function(update){
                        Wapi.booking.update(null, update, {
                            "_objectId": res.objectId,
                            access_token: user.access_token
                        });
                    });
                    W.loading();
                    _this.props.onSuccess(submit_data,uid);
                },submit_data);
            });
        }

        register();
    }
    render() {
        let ACT=this.props.act;
        let tel=(ACT?ACT.tel:'');
        let carowner=this.props.self?null:[
            <div style={sty.r} key={'carowner_name'}>
                <input name='userName' placeholder={___.carowner_name} style={sty.input} onChange={this.change}/>
            </div>,
            <div style={sty.r} key={'carowner_phone'}>
                <input name='userMobile' placeholder={___.carowner_phone} style={sty.input} onChange={this.change}/>
            </div>
        ];
        let describe=this.props.self?
                <div style={{textAlign:'center'}}>
                    预订时支付订金{ACT.deposit}元，{ACT.offersDesc}
                </div>:
                <div style={{textAlign:'center'}}>
                    预订时支付设备款及{ACT.installationFee}元安装费，{ACT.offersDesc}
                </div>
        let ps={
            color:'#ccc',
            marginLeft: '11px'
        };
        return (
            <div style={sty.f}>
                
                <table style={{borderCollapse: 'collapse',fontSize:'0.8em',backgroundColor:'#ffffff'}}>
                <tbody>
                    <tr>
                        <td style={{width:window.innerWidth*0.62+'px',height:'125px',padding:'0px',backgroundColor:'#ffffff'}}>
                            {ACT.imgUrl?
                            <img src={ACT.imgUrl} style={{width:window.innerWidth*0.62,height:'125px',verticalAlign: 'middle'}} alt={ACT.name}/>
                            :<div style={{width:window.innerWidth*0.62,textAlign:'center'}}>{ACT.name}</div>}
                        </td>
                        <td style={{width:window.innerWidth*0.38+'px',color:'#999999'}}>
                            <div style={{marginLeft:'1em'}}>
                                预订ID：<span style={sty.black}>{_g.mobile.slice(-6)}</span>
                            </div>
                            <div style={{marginTop:'5px',marginBottom:'5px'}}>
                                预订商品：<span style={sty.black}>{ACT.brand+ACT.product}</span>
                            </div>
                            <div>
                                统一售价：<span style={sty.black}>{ACT.price.toFixed(2)}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>

                <div style={{display:'block',width:'100%',height:'50px'}}>
                    <div style={{width:'40%',float:'left'}}>
                        <Checkbox label={___.booking_for_self} checked={this.props.self} onCheck={e=>this.props.setSelf(true)} style={sty.c}/>
                    </div>
                    <div style={{width:'40%',float:'left'}}>
                        <Checkbox label={___.booking_for_else} checked={!this.props.self} onCheck={e=>this.props.setSelf(false)} style={sty.c}/>
                    </div>
                </div>
                <div style={{backgroundColor:'#ffffff'}}>
                    {carowner}
                    <div style={sty.r}>
                        <input name='name' placeholder={___.booking_name} style={sty.input} onChange={this.change}/>
                    </div>
                    <div style={sty.r}>
                        <input name='mobile' type='tel' placeholder={___.booking_phone} style={sty.input} onChange={this.change}/>
                    </div>
                    <div style={{display:'flex',alignItems:'flex-end',padding:'3px 10px'}}>
                        <VerificationOrig 
                            name='valid_code'
                            type={1}
                            account={this.data.mobile} 
                            onSuccess={this.changeVerifi}
                            style={{width:'100%'}}
                        />
                    </div>
                </div>
                <div style={{padding:'20px 10px'}}>
                    {describe}
                </div>
                <div style={sty.b}>
                    <RaisedButton label={___.submit_booking} primary={true} onClick={this.submit} labelColor='#f6f6f6'/>
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

export function bonkingRegister(mobile,valid_code,name,openId,callback){
    let password=mobile.slice(-6);
    Wapi.user.register(function(user){
        if(user.status_code&&user.status_code!=8){
            W.errorCode(user);
            return;
        }
        Wapi.user.login(lo=>{
            if(lo.status_code){
                W.errorCode(lo);
                return;
            }
            let uid=lo.uid;
            let access_token=lo.access_token;
            let data={
                _objectId:uid,
                access_token
            };
            data['authData.'+getOpenIdKey()]=openId;
            Wapi.user.update(null,data);//更新登录的openId
            Wapi.customer.get(cust=>{
                if(!cust.data){
                    Wapi.customer.add(null,{
                        uid,
                        appId:WiStorm.config.objectId,
                        access_token,
                        name,
                        tel:mobile,
                        custType:'私家车主',
                        custTypeId:7
                    });
                }
            },{
                uid,
                appId:WiStorm.config.objectId,
                access_token
            });
            callback(lo);
        },{
            password,
            account:mobile
        });
    },{
        mobile,
        valid_code,
        password,
        valid_type:1
    });
}
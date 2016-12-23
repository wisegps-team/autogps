/**
 * 2016-09-26
 * 用户预定页,因为是活动页，所以需要优化加载速度，所以不能和common.js一起用了
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import AppBox from './_component/booking/app_box';
import Form from './_component/booking/form';
import ShareApp from './_component/booking/share_app';
import CheckApp from './_component/booking/check_app';
import QrBox from './_component/booking/qr_box';
import PayBox from './_component/booking/pay_box';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    if(_g.bookingId){
        if(_g.openid)
            ReactDOM.render(<CheckApp/>,thisView);
        else{
            ReactDOM.render(<ShareApp/>,thisView);
        }
    }else{
        if(_g.activityId){
            Wapi.activity.get(function(res){
                if(!res.data||!res.data.status)
                    W.alert({title:_g.title,text:___.activity_stop},e=>history.back());
                else{
                    ACT=res.data;
                    ReactDOM.render(<App/>,thisView);
                } 
            },{
                objectId:_g.activityId
            });
        }
    }
});

let ACT=null;

const sty={
    con:{
        wordBreak: 'break-all'
    },
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            self:true,
            action:0
        };
        this.data={};
        this.success = this.success.bind(this);
        this.setSelf = this.setSelf.bind(this);
        this.cancelPay = this.cancelPay.bind(this);
    }

    componentDidMount() {
        let that=this;
        Wapi.pay.checkWxPay(function(res){
            let booking=W.ls('booking');
            let newState={action:2};
            if(res.status_code){
                W.alert(___.pay_fail);
                booking.payMoney=0;
                booking.payStatus=0;
                that.data.booking=booking;
                that.data.uid=W.ls('booking_uid',true);
                newState.self=(booking.type==0);
                newState.action=1;
            }else{
                booking.orderId=res.orderId;
                Wapi.booking.update(e=>console.log(e),{
                    _objectId:booking.objectId,
                    orderId:booking.orderId,
                    payMoney:booking.payMoney,
                    payStatus:booking.payStatus,
                    receiptDate:W.dateToString(new Date())
                });
            }
            that.setState(newState);
            that.getQrcode(booking);
        },_g.activityId);
    }

    success(booking,uid){
        W.setLS('booking',booking);
        W.setLS('booking_uid',uid);
        this.getQrcode(booking);//获取二维码
        this.data.booking=booking;
        this.data.uid=uid;
        if(ACT.deposit){
            this.setState({action:1});
        }else{
            W.alert(___.booking_success,()=>this.setState({action:2}));
        }
    }

    getQrcode(booking){
        let scene=booking.objectId;
        let qrRes=W.ls(scene);
        if(qrRes){//是否已经获取过了(应付支付后返回的情况)
            this.setQr(qrRes,scene,booking);
            return;
        }
        Wapi.serverApi.getAnyQrcode(res=>{
            if(res.status_code){
                W.alert(res.err_msg);
                return;
            }
            W.setLS(scene,res);
            Wapi.booking.update(null,{_objectId:scene,'carType.qrUrl':res.url});
            this.setQr(res,scene,booking);
        },{
            type:1001,
            data:scene,
            wxAppKey:_g.wx_app_id
        });
    }

    setQr(res,scene,booking){
        this._qrbox=(<QrBox 
            url={res.url}
            product={booking.product}
            prepayments={booking.payMoney}
        />);
        if(this.state.action==2){
            this.forceUpdate();
        }
    }

    setSelf(self){
        if(self!==this.state.self){
            this.setState({self});
        }
    }

    cancelPay(){
        //不要赠品
        this.setState({action:2});
    }
    render() {
        let boxs=[
            (<Form self={this.state.self} onSuccess={this.success} setSelf={this.setSelf} act={ACT}/>),
            (<PayBox 
                booking={this.data.booking} 
                uid={this.data.uid} 
                act={ACT} 
                onCancel={this.cancelPay}
                self={this.state.self}
            />),
            this._qrbox
        ];
        return (
            <AppBox>
                {boxs[this.state.action]}
            </AppBox>
        );
    }
}


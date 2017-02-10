import React, {Component} from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import ProductName,{color} from './product_name';

const sty={
    ex:{
        color:'#999999',
        marginTop:'30px',
        marginLeft:'10px',
        marginRigth:'10px',
        textAlign:'center',
    },
    black:{
        color:'#000000'
    }
}
class PayBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.pay = this.pay.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    
    pay(){
        let act=this.props.act;
        let booking=this.props.booking;
        let payData={
            uid:this.props.uid,
            order_type:1,
            amount:booking.payMoney,
            attach:booking.objectId,
            remark:act.product+___._deposit,
            title:___.prepayments            
        }
        if(this.props.self){
            booking.payMoney=act.deposit;
            booking.payStatus=1;
        }else{
            booking.payMoney=act.price+act.installationFee;
            booking.payStatus=2;
            payData.remark=act.product+___.all_price;
        }
        payData.amount=booking.payMoney;
        W.setLS('booking',booking);
        Wapi.pay.wxPay(payData,_g.activityId);
    }
    cancel(){//选择不要赠品
        W.loading(true,___.loading);
        Wapi.booking.update(res=>{
            W.loading();
            this.props.onCancel();
        },{
            _objectId:this.props.booking.objectId,
            'carType.noPay':'1'
        });
    }
    render() {
        let act=this.props.act;
        let booking=this.props.booking;
        let tel=(act?act.tel:'');
        // let des=this.props.self?___.booking_success+'，'+___.pay_deposit_now.replace('XX',act.deposit)+'，'+act.offersDesc:
        //     ___.booking_success+'，'+W.replace(___.pan_all,act)+'，'+act.offersDesc;
        let des=this.props.self?___.booking_success+'，'+___.pay_deposit_now.replace('XX',act.deposit.toFixed(2))+'，'+act.offersDesc:
            ___.booking_success+'，'+W.replace(___.pan_all,act)+'，'+act.offersDesc;
        return (
            <div style={{textAlign:'center'}}>
                <table style={{borderCollapse: 'collapse',fontSize:'0.8em',backgroundColor:'#ffffff',marginTop:'50px'}}>
                <tbody>
                    <tr>
                        <td style={{width:window.innerWidth*0.62+'px',height:'125px',padding:'0px',backgroundColor:'#ffffff'}}>
                            {act.imgUrl?
                            <img src={act.imgUrl} style={{width:window.innerWidth*0.62,height:'125px',verticalAlign: 'middle'}} alt={act.name}/>
                            :<div style={{width:window.innerWidth*0.62,textAlign:'center'}}>{act.name}</div>}
                        </td>
                        <td style={{width:window.innerWidth*0.38+'px',textAlign:'left',color:'#999999'}}>
                            <div style={{marginLeft:'1em'}}>
                                预订ID：<span style={sty.black}>{_g.mobile.slice(-6)}</span>
                            </div>
                            <div style={{marginTop:'5px',marginBottom:'5px'}}>
                                预订商品：<span style={sty.black}>{booking.product.brand+booking.product.name}</span>
                            </div>
                            <div>
                                统一售价：<span style={sty.black}>{booking.product.price.toFixed(2)}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
                <div style={{width:'90%',paddingLeft:'5%',textAlign:'left'}}>
                    <p style={{textIndent: '2em'}}>{des}</p>
                </div>
                <div style={{textAlign:'center'}}>
                    <RaisedButton label={___.not_gifts} secondary={true} onClick={this.cancel} style={{marginRight:'10px'}} labelColor='#f6f6f6'/>
                    <RaisedButton label={___.wxPay} primary={true} onClick={this.pay} labelColor='#f6f6f6'/>
                </div>
                <div style={sty.ex}>
                    {___.please_consult}
                    <a href={'tel:'+tel}>{tel}</a>
                </div>
            </div>
        );
    }
}

export default PayBox;
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
import CarBrand from './_component/base/carBrand';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import HardwareSmartphone from 'material-ui/svg-icons/hardware/smartphone';
import MapsDirectionsCar from 'material-ui/svg-icons/Maps/directions-car';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
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
        textAlign:'right',
        padding:'16px 5px 5px 0'
    },
    w:{
        width:'100%'
    }
}


class App extends Component {
    getChildContext(){
        return{
            'view':thisView
        }
    }

    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.booking}/>
                <div style={sty.p}>
                    <From/>
                </div>
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
        this.data={
            sellerId:_g.sellerId,
            uid:_g.uid,
            status:0,
            status0:1,
            status1:0,
            status2:0,
            status3:0,
            name:null,
            mobile:null,
            carType:null
        }
        this.change = this.change.bind(this);
        this.changeBrand = this.changeBrand.bind(this);
        this.submit = this.submit.bind(this);
        this.mobileChange = this.mobileChange.bind(this);
    }
    
    mobileChange(val){
        let that=this;
        Wapi.booking.get(function(res){
            if(res.data){
                W.alert(___.booked);
            }else
                that.data.mobile=val;
        },{
            mobile:val
        })
    }
    change(e,val){
        this.data[e.target.name]=val;
    }
    changeBrand(val){
        this.data.carType=val;
    }
    submit(){
        let submit_data=Object.assign({},this.data);
        for(let k in submit_data){
            if(submit_data[k]==null||typeof submit_data[k]=='undefined'){
                W.alert(___.data_miss);
                return;
            }
        }
        Wapi.booking.add(function(res){
            W.alert(___.booking_success,()=>history.back());
        },submit_data);
    }
    render() {
        return (
            <div style={sty.f}>
                <div style={sty.r}>
                    <ActionAccountBox style={sty.i}/>
                    <Input name='name' floatingLabelText={___.person_name} onChange={this.change}/>
                </div>
                <div style={sty.r}>
                    <HardwareSmartphone style={sty.i}/>
                    <PhoneInput name='mobile' floatingLabelText={___.booking_phone} onChange={this.mobileChange} needExist={false}/>
                </div>
                <div style={sty.r}>
                    <MapsDirectionsCar style={sty.i}/>
                    <CarBrand onChange={this.changeBrand} style={sty.w}/>
                </div>
                <div style={sty.b}>
                    <RaisedButton label={___.submit_booking} primary={true} onClick={this.submit}/>
                </div>
            </div>
        );
    }
}
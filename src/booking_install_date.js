//预订后 选择安装时间
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
    main:{width:'90%',marginLeft:'5%',textAlign:'left',marginTop:'20px'},
    bottom_btn:{display:'block',textAlign:'center',paddingTop:'20px',paddingBottom:'20px'},
    line:{marginTop:'15px'},
    lineBottm:{marginTop:'15px',color:'#ff9900'},
    hide:{display:'none'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

const confirmView=thisView.prefetch('#confirm',3);
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    
    ReactDOM.render(<Confirm/>,confirmView);
});

let booking=null;
let ACT=null;
let submited=false;
let _installDate='';

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data={
            date:new Date(),
            time:new Date(),
        }
        this.cust_open_id='';
        this.strLine1=___.confirm_book_line1;
        this.strLine2=___.confirm_book_line2;
        this.strLine3=___.confirm_book_line3;
        this.strLine4=___.confirm_book_line4;
        this.strLine5=___.confirm_book_line5;

        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        Wapi.booking.get(res=>{ //通过bookingId获取活动id和uid
            console.log(res);
            booking=res.data;

            this.strLine1=this.strLine1.replace('name',booking.name);
            this.strLine1=this.strLine1.replace('product',booking.product&&booking.product.name);
            this.strLine2=this.strLine2.replace('payMoney',booking.payMoney?booking.payMoney.toFixed(2):'0.00');
            if(booking.selectInstallDate){
                let selected=new Date(booking.selectInstallDate);
                this.strLine5=this.strLine5.replace('time',W.dateToString(new Date(Number(selected)+1000*60*60*2)));
            }            

            let {uid,activityId,installId}=res.data;
            if(!_user){
                Wapi.serverApi.getWeixinKey(r=>{
                    let loc=encodeURIComponent(location.href);
                    W.alert(___.ask_to_login,e=>location='index.html?loginLocation='+loc+"&wx_app_id="+r.data.wxAppKey);
                },{
                    uid,
                    type:1
                });
            }
            Wapi.activity.get(r=>{
                ACT=r.data;
                this.strLine1=this.strLine1.replace('price',ACT.price.toFixed(2));
                this.strLine1=this.strLine1.replace('installationFee',ACT.installationFee.toFixed(2));
                this.strLine3=this.strLine3.replace('commission',ACT.reward?ACT.reward.toFixed(2):'0.00');
                this.forceUpdate();
            },{objectId:activityId});

        },{objectId:_g.bookingId});
        
    }
    
    dateChange(e,date){
        console.log(date);
        this.data.date=date;
        this.forceUpdate();
    }
    timeChange(e,time){
        console.log(time);
        this.data.time=time;
        this.forceUpdate();
    }
    contactCarowner(){
        location.href='tel://'+booking.userMobile;
    }
    submit(){
        if(submited){   //防止重复点击
            W.alert(___.donot_click);
            return;
        }
        submited=true;

        let date=W.dateToString(this.data.date).slice(0,10);
        let time=W.dateToString(this.data.time).slice(10);
        console.log(date+time);

        thisView.goTo('#confirm');
        
        let par={
            _objectId:_g.bookingId,
            installDate:date+time,
            confirmTime:W.dateToString(new Date()),
        }
        _installDate=date+time;
        
        Wapi.booking.update(res=>{
            console.log(res);

            Wapi.serverApi.sendWeixinByTemplate(re=>{   //发送给车主
                console.log(re);
                thisView.goTo('#Confirm');
                if(!re.status_code){
                    // W.alert({
                    //     title:___.booking_date_title,
                    //     text:___.install_time_success
                    // },e=>{W.native.close();});
                }
            },{
                openId:booking.userOpenId,   //车主的openid
                // uid:'798351359882694700',   //booking的uid
                uid:booking.uid,
                templateId:'OPENTM405760757',
                type:'0',
                link:'http://'+WiStorm.config.domain.user+'/wo365_user/order.html?intent=logout&bookingId='+_g.bookingId,
                data:{
                    "first": {//标题
                        "value": ___.bookingId+' '+_g.bookingId,
                        "color": "#173177"
                    },
                    "keyword1": {//安装时间
                        "value": par.installDate.slice(0,-3),
                        "color": "#173177"
                    },
                    "keyword2": {//预约服务
                        "value": ACT.product + ' '+___.install,
                        "color": "#173177"
                    },
                    "keyword3": {//安装网点
                        "value": _user.customer.name,
                        "color": "#173177"
                    },
                    "keyword4": {//联系电话
                        "value": _user.customer.tel,
                        "color": "#173177"
                    },
                    "keyword5": {//地址
                        "value": (_user.customer.address||_user.customer.area), 
                        "color": "#173177"
                    },
                    "remark": {
                        "value": ___.carowner_info+':'+booking.userName+'/'+booking.userMobile,
                        "color": "#173177"
                    }
                }
            });

        },par);
    }
    render() {
        return (
            <ThemeProvider>
                <div style={styles.main}>
                    <div style={{textAlign:'left'}}>
                        <div style={styles.line}>
                            {this.strLine1}
                        </div>
                        <div style={booking&&booking.payMoney ? styles.line : styles.hide}>
                            {this.strLine2}
                        </div>
                        <div style={styles.line}>
                            {this.strLine3}
                        </div>
                        <div style={styles.line}>
                            {this.strLine4}
                        </div>
                    </div>
                    <DatePicker
                        floatingLabelText={___.select_install_date}
                        defaultDate={this.data.date}
                        onChange={this.dateChange}
                        cancelLabel={___.cancel}
                        okLabel={___.ok}
                    />
                    <TimePicker
                        floatingLabelText={___.select_install_time}
                        defaultTime={this.data.time}
                        format="24hr"
                        onChange={this.timeChange}
                        cancelLabel={___.cancel}
                        okLabel={___.ok}
                    />
                    <div style={styles.bottom_btn}>
                        <RaisedButton
                            label={___.contact_carowner}
                            primary={true}
                            onClick={this.contactCarowner}
                            disabled={submited}
                        />
                        <RaisedButton
                            label={___.order_book_confirm}
                            primary={true}
                            onClick={this.submit}
                            disabled={submited}
                            style={{marginLeft:'20px'}}
                        />
                    </div>
                    <div style={styles.lineBottm}>
                        {this.strLine5}
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}


class Confirm extends Component {
    constructor(props,context){
        super(props,context);
        this.click = this.click.bind(this);
    }
    componentDidMount() {
        confirmView.addEventListener('show',e=>{
            this.forceUpdate();
        })
    }
    
    click(){
        W.native.close();
    }
    render() {
        return (
            <ThemeProvider>
            <div style={styles.main}>
                
                已回复服务预约成功通知，车主到店安装时，请注意如下事项：<br/>
                
                1、请勿擅自改变价格、额外收费、推荐其他品牌产品或同品牌非营销活动产品。<br/>
                
                2、车主如选择安装同品牌其他型号营销产品，佣金按下列标准处理：1、预订低端安装高端的佣金标准：低端产品佣金＋（高端产品佣金－低端产品佣金）x50%；2、预订高端安装低端的佣金标准：低端产品佣金。<br/>

                3、如有预付款，安装注册时平台同步划转到设备当前所属代理商／经销商企业账号，佣金也由平台自动从该企业账号划转到营销人员个人钱包，<span style={{color:'#ff9900'}}>为保证资金结算正常，设备开机后请打开智联车网查看服务商是否显示您的信息！</span><br/>
                
                <div style={styles.bottom_btn}>
                    <RaisedButton
                        label={___.ok}
                        primary={true}
                        onClick={this.click}
                    />
                </div>

                <div style={styles.lineBottm}>
                    {_installDate}前未完成安装注册，车主可以更换安装网点。
                </div>

            </div>
            </ThemeProvider>
        );
    }
}

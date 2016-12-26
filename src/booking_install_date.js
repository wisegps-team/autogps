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
    main:{width:'90%',marginLeft:'5%',textAlign:'center',marginTop:'20px'},
    bottom_btn:{display:'block',textAlign:'center',paddingTop:'20px',paddingBottom:'20px'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(e){
    if(!_user){
        location='index.html?loginLocation='+location.href;
    }
    ReactDOM.render(<App/>,thisView);
});

let booking=null;
let ACT=null;
let submited=false;

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data={
            date:new Date(),
            time:new Date(),
        }
        this.cust_open_id='';

        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        Wapi.booking.get(res=>{ //通过bookingId获取活动id和uid
            booking=res.data;
            let {uid,activityId,installId}=res.data;

            Wapi.activity.get(r=>{
                ACT=r.data;
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
    submit(){
        if(submited){   //防止重复点击
            W.alert(___.donot_click);
            return;
        }
        submited=true;

        let date=W.dateToString(this.data.date).slice(0,10);
        let time=W.dateToString(this.data.time).slice(10);
        console.log(date+time);
        
        let pay=___.not_pay;
        if(booking['payStatus']){
            if(booking['payStatus']==1)
                pay=___._deposit+'：'+booking['payMoney'];
            else if(booking['payStatus']==2)
                pay=___.all_price+'：'.booking['payMoney'];
        }
        
        let par={
            _objectId:_g.bookingId,
            installDate:date+time,
        }
        Wapi.booking.update(res=>{
            console.log(res);

            Wapi.serverApi.sendWeixinByTemplate(re=>{   //发送给车主
                console.log(re);
                if(!re.status_code){
                    W.alert({
                        title:___.booking_date_title,
                        text:___.install_time_success
                    },e=>{W.native.close();});
                }
            },{
                openId:_g.cust_open_id,   //车主的openid
                // uid:'798351359882694700',   //booking的uid
                uid:booking.uid,
                templateId:'OPENTM405760757',
                type:'0',
                link:'#',
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
        console.log('render');
        return (
            <ThemeProvider>
                <div style={styles.main}>
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
                            label={___.ok}
                            primary={true}
                            onClick={this.submit}
                            disabled={submited}
                        />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

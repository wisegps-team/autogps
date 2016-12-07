//预订后 选择安装网点
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import Wapi from './_modules/Wapi';
import {ThemeProvider} from './_theme/default';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import ToggleCheckBox from 'material-ui/svg-icons/toggle/check-box';

const styles = {
    main:{width:'90%',marginLeft:'5%'},
    bottom_btn:{display:'block',textAlign:'center',paddingTop:'20px',paddingBottom:'20px'},
    card:{margin:'0 1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card_select:{margin:'0 1em',padding:'0.5em',borderBottom:'1px solid #999999',backgroundColor:'#eeeeee'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
});

const _customer={
    area:"宝安区",
    city:"深圳市",
    contact:"李金宝",
    name:"深圳市安邦信息科技有限公司",
    objectId:781375945884962800,
    province:"广东省",
    tel:"18682020086",
    uid:"781375646592012300",
}
const _customers=[];
for(let i=5;i--;){
    let c=Object.assign({},_customer);
    c.objectId=2800+i;
    _customers.push(c);
}

let ACT=null;
let booking=null;
let submited=false;

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data={
            _objectId:_g.bookingId,
            installId:0,
            install:'',
        }
        this.installs=[];
        this.seller_open_id='';
        this.installName='';

        this.installChange = this.installChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        Wapi.booking.get(res=>{ //通过bookingId获取活动id和uid
            booking=res.data;
            let {uid,activityId}=res.data;

            Wapi.activity.get(r=>{  //
                ACT=r.data;

                Wapi.serverApi.getInstallByUid(re=>{
                    this.installs=re.data;//正式用
                    // this.installs=_customers;//测试用
                    this.forceUpdate();
                },{uid:uid})

            },{objectId:activityId});

        },{objectId:_g.bookingId});

    }
    
    installChange(data){
        this.data.installId=data.objectId;
        this.data.install=data.contact;
        this.installName=data.name;

        Wapi.serverApi.getUserOpenId(res=>{    //根据customer信息查找user的Openid
            this.seller_open_id=res.data;
            this.forceUpdate();
        },{objectId:data.uid});
        
    }
    submit(){
        console.log(this.data);
        submited=true;

        if(this.data.installId==0){
            W.alert(___.please_select_install);
            return;
        }
        this.data.openId=_g.openid;
        
        let pay=___.not_pay;
        if(booking['payStatus']){
            if(booking['payStatus']==1)
                pay=___._deposit+'：'+booking['payMoney'];
            else if(booking['payStatus']==2)
                pay=___.all_price+'：'.booking['payMoney'];
        }
        
        Wapi.booking.update(res=>{
            
            Wapi.serverApi.sendWeixinByTemplate(re=>{
                console.log(re);
                if(!re.status_code){
                    W.alert(___.sendWeixinToSeller_success.replace('xxx',this.installName));
                    
                    this.forceUpdate();
                }
            },{
                openId:this.seller_open_id,   //安装网点的openid
                // uid:'798351359882694700',   //booking的uid
                uid:booking.uid,
                templateId:'OPENTM407674335',
                type:'1',
                // link:'http://192.168.3.201:8081/booking_install_date.html?bookingId='+_g.bookingId+'&cust_open_id='+_g.openid,
                link:'http://wx.autogps.cn/autogps/booking_install_date.html?intent=logout&bookingId='+_g.bookingId+'&cust_open_id='+_g.openid,
                data:{
                    "first": {//标题
                        "value": ACT.name,
                        "color": "#173177"
                    },
                    "keyword1": {//预订时间
                        "value": booking.createdAt,    //booking的createdAt
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

        },this.data);
    }
    render() {
        console.log('render');
        let items=this.installs.map(ele=>
            <InstallShop 
                key={ele.objectId} 
                value={ele.objectId} 
                primaryText={ele.name} 
                data={ele} 
                selected={ele.objectId==this.data.installId}
                onClick={()=>this.installChange(ele)}
            />
        );
        return (
            <ThemeProvider>
                <div>
                    <h3 style={{marginLeft:'1.2em'}}>{___.please_select_install}</h3>
                    {items}
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

class InstallShop extends Component {
    constructor(props,context){
        super(props,context);
    }
    render() {
        let data=this.props.data;
        let sty=styles.card;
        let sty_icon={display:'none'};
        if(this.props.selected){
            sty=styles.card_select;
            sty_icon={float:'right'};
        }
        return (
            <div style={sty} onClick={this.props.onClick}>
                <div style={sty_icon}><ToggleCheckBox/></div>
                <div>{data.name}</div>
                <div>{data.province+' '+data.city+' '+data.area +' '+(data.address||'')}</div>
                <div>{data.contact}</div>
                <div>{data.tel}</div>
            </div>
        );
    }
}


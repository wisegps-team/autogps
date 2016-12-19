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
import ToggleCheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';

import AreaSelect from './_component/base/areaSelect';

const styles = {
    main:{width:'90%',marginLeft:'5%'},
    bottom_btn:{display:'block',textAlign:'center',paddingTop:'20px',paddingBottom:'20px'},
    card:{margin:'0 1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card_select:{margin:'0 1em',padding:'0.5em',borderBottom:'1px solid #999999',backgroundColor:'#eeeeee'},
    area:{width:'90%',marginLeft:'5%',marginBottom:'10px'},
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
        this.canSelect=true;

        this.installs=[];
        this.visibleInstalls=[];
        this.seller_open_id='';
        this.installName='';

        this.areaChange = this.areaChange.bind(this);
        this.areaSelect = this.areaSelect.bind(this);
        this.installChange = this.installChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        Wapi.booking.get(res=>{ //通过bookingId获取活动id和uid
            booking=res.data;
            if(booking.installId){
                W.alert(___.selected_install.replace('xxx',_g.bookingId),e=>{wx.closeWindow();});
                this.canSelect=false;
            }
            let {uid,activityId}=res.data;

            Wapi.activity.get(r=>{
                ACT=r.data;

                Wapi.serverApi.getInstallByUid(re=>{
                    this.installs=re.data;//正式用
                    this.visibleInstalls=re.data;
                    // this.installs=_customers;//测试用
                    this.forceUpdate();
                },{
                    uid:uid,
                    // uid:"781687274311127000"//测试用 这里的uid其实是objectId，
                },{
                    limit:999
                });

            },{objectId:activityId});

        },{objectId:_g.bookingId});

    }
    areaChange(value){
        console.log(value);
    }
    areaSelect(key,value){
        console.log(key,value);
        if(value==-1){
            this.visibleInstalls=this.installs;
        }else{
            this.visibleInstalls=this.installs.filter(ele=>ele[key]==value);
        }
        this.forceUpdate();
    }
    installChange(data){
        this.data.installId=data.objectId;
        this.data.install=data.name;
        this.installName=data.name;

        Wapi.serverApi.getUserOpenId(res=>{    //根据customer信息查找user的Openid
            this.seller_open_id=res.data;
            this.forceUpdate();
        },{objectId:data.uid});
        
    }
    submit(){
        if(!this.canSelect){
            W.alert(___.selected_install.replace('xxx',_g.bookingId));
            return;
        }
        if(this.data.installId==0){ //信息是否完整
            W.alert(___.please_select_install);
            return;
        }

        if(submited){      //防止重复点击
            W.alert(___.donot_click);
            return;
        }
        submited=true;
        console.log(this.data);

        this.data.userOpenId=_g.openid;
        
        let pay=booking.payMoney?parseFloat(booking.payMoney).toFixed(2):'0.00';
        
        // let pay=___.not_pay;
        // if(booking['payStatus']){
        //     if(booking['payStatus']==1)
        //         pay=___._deposit+' '+parseFloat(booking.payMoney).toFixed(2);
        //     else if(booking['payStatus']==2)
        //         pay=___.device_price+' '+parseFloat(booking.product.price).toFixed(2)+'，'
        //             +___.install_price+' '+parseFloat(booking.product.installationFee).toFixed(2);
        // }
        
        Wapi.booking.update(res=>{
            
            Wapi.serverApi.sendWeixinByTemplate(re=>{
                console.log(re);
                if(!re.status_code){
                    W.alert({
                        title:___.booking_install_title,
                        text:___.sendWeixinToSeller_success.replace('xxx',this.installName)
                    },e=>{wx.closeWindow();});
                }
            },{
                openId:this.seller_open_id,   //安装网点的openid
                // uid:'798351359882694700',   //booking的uid
                uid:booking.uid,
                templateId:'OPENTM408168978',
                type:'1',
                // link:'http://192.168.3.201:8081/booking_install_date.html?bookingId='+_g.bookingId+'&cust_open_id='+_g.openid,
                link:'http://wx.autogps.cn/autogps/booking_install_date.html?intent=logout&bookingId='+_g.bookingId+'&cust_open_id='+_g.openid,
                data:{
                    "first": {//标题
                        "value": ___.bookingId+'：'+_g.bookingId,
                        "color": "#173177"
                    },
                    "keyword1": {//预订时间
                        "value": W.dateToString(new Date(booking.createdAt)).slice(0,-3),    //booking的createdAt
                        "color": "#173177"
                    },
                    "keyword2": {//预订产品
                        "value": ACT.product+'/￥'+parseFloat(ACT.price).toFixed(2),
                        "color": "#173177"
                    },
                    "keyword3": {//设备款项
                        "value": pay,
                        "color": "#173177"
                    },
                    "keyword4": {//车主信息
                        "value": booking.userName+'/'+booking.userMobile,
                        "color": "#173177"
                    },
                    // "keyword5": {//预付款
                    //     "value": pay,
                    //     "color": "#173177"
                    // },
                    "remark": {
                        "value": ___.sendWeixinToInstall_remark,
                        "color": "#173177"
                    }
                }
            });

        },this.data);
    }
    render() {
        console.log('render');
        let items=this.visibleInstalls.map(ele=>
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
                    <div style={styles.area}>
                        <AreaSelect name='area' onChange={this.areaChange} selectModel={true} select={this.areaSelect}/>
                    </div>
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
        // let sty_icon={display:'none'};
        let box=<div style={{float:'right'}}><ToggleCheckBoxOutlineBlank/></div>;
        if(this.props.selected){
            sty=styles.card_select;
            // sty_icon={float:'right'};
            box=<div style={{float:'right'}}><ToggleCheckBox/></div>;
        }
        return (
            <div style={sty} onClick={this.props.onClick}>
                {/*<div style={sty_icon}><ToggleCheckBox/></div>*/}
                {box}
                <div>{data.name}</div>
                <div>{data.province+' '+data.city+' '+data.area +' '+(data.address||'')}</div>
                {/*<div>{data.contact}</div>
                <div>{data.tel}</div>*/}
            </div>
        );
    }
}


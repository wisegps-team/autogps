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
thisView.setTitle(___.service_booking);
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

let sellerTel='';
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
            selectInstallDate:'',
        }

        this.canSelectInstall=true;

        this.installs=[];
        this.visibleInstalls=[];
        this.seller_open_id='';
        this.installName='';
        this.installTel='';

        this.areaChange = this.areaChange.bind(this);
        this.areaSelect = this.areaSelect.bind(this);
        this.installChange = this.installChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        let flag=0;
        Wapi.booking.get(res=>{ //通过bookingId获取活动id和uid
            booking=res.data;
            // if(booking.installId){
            //     //W.alert(___.selected_install.replace('xxx',_g.bookingId),e=>{W.native.close();});
            //     W.alert(___.sendWeixinToSeller_success,e=>{W.native.close();});
            // }
            if(booking.selectInstallDate){
                let expire = (booking.installDate ? Number(new Date(booking.installDate)) : Number(new Date(booking.selectInstallDate))+1000*60*60*2);
                let now=Number(new Date());
                        
                if(expire>now){
                    if(booking.installDate){
                        let str=___.no_change_step4;
                        str=str.replace('time',W.dateToString(new Date(booking.installDate)));
                        W.alert(str,e=>{W.native.close();});
                    }else{
                        let str=___.no_change_step3;
                        str=str.replace('time',W.dateToString(new Date(booking.selectInstallDate)));
                        str=str.replace('install',booking.install);
                        W.alert(str,e=>{W.native.close();});
                    }
                }
            }
            
            let {uid,activityId}=res.data;

            //获取活动信息
            Wapi.activity.get(r=>{
                ACT=r.data;
                sellerTel=ACT.tel||'';
                //获取活动产品的品牌
                Wapi.product.get(res_product=>{
                    ACT.product = res_product.data.brand+' '+res_product.data.name;
                    flag++;
                    if(flag==2)this.forceUpdate();
                },{objectId:ACT.productId});

            },{objectId:activityId});

            //获取安装网点
            // Wapi.serverApi.getInstallByUid(re=>{
            //     console.log(re.data);
            //     this.installs=re.data;//正式用
            //     this.visibleInstalls=re.data;
            //     // this.installs=_customers;//测试用
            //     flag++;
            //     if(flag==2)this.forceUpdate();
            // },{
            //     uid:uid,
            //     // uid:"781687274311127000"//测试用 这里的uid其实是父级的objectId，
            // },{
            //     limit:999
            // });

            //获取安装网点改为从授权表中获取
            let parAuth={
                productId:booking.product.id,
                // actProductId:'814010097264103400',
                // actProductId:'821167117784191000',
                status:1
            };
            if(booking.product.actProductId){
                parAuth={
                    actProductId:booking.product.actProductId,
                    status:1
                };
            }
            debugger;
            Wapi.authorize.list(auths=>{
                let cids=auths.data.map(ele=>ele.applyCompanyId);
                Wapi.customer.list(custs=>{
                    console.log(custs.data);
                    this.installs=custs.data;//正式用
                    this.visibleInstalls=custs.data;
                    flag++;
                    if(flag==2)this.forceUpdate();
                },{
                    objectId:cids.join('|'),
                })
            },parAuth,{
                fields:'objectId,applyCompanyId',
                limit: -1
            });

        },{objectId:_g.bookingId});

    }
    areaChange(value){
        console.log(value);
    }
    areaSelect(key,value){
        console.log(key,value);
        
        //因为onTouchTap事件会在350ms之后再触发一次，所以会错误地触发installChange，所以设置360ms之内installChange方法不继续执行
        this.canSelectInstall=false;
        setTimeout(()=>{
            this.canSelectInstall=true;
        }, 360);

        if(value==-1){
            this.visibleInstalls=this.installs;
        }else{
            this.visibleInstalls=this.installs.filter(ele=>ele[key]==value);
        }
        this.forceUpdate();
    }
    installChange(data){
        if(!this.canSelectInstall)return;

        this.data.installId=data.objectId;
        this.data.install=data.name;
        this.installName=data.name;
        this.installTel=data.tel;

        this.forceUpdate();
        
        Wapi.serverApi.getUserOpenId(res=>{    //根据customer信息查找user的Openid
            this.seller_open_id=res.data;
            W.confirm({
                text:<div>
                    {___.confirm_install}<br/>
                    {data.name}
                </div>
            },b=>{
                if(b)this.submit();
            });
            // W.confirm(___.confirm_install.replace('xxx',data.name),b=>{
            //     if(b)this.submit();
            // });
        },{objectId:data.uid});
        
    }
    submit(){
        if(this.data.installId==0){ //信息是否完整
            W.alert(___.please_select_install);
            return;
        }

        if(submited){      //防止重复点击
            W.alert(___.donot_click);
            return;
        }
        submited=true;

        let pay=booking.payMoney?parseFloat(booking.payMoney).toFixed(2):'0.00';

        this.data.userOpenId=_g.openid;
        this.data.selectInstallDate=W.dateToString(new Date());
        W.loading(true,'发送中');
        Wapi.booking.update(res=>{//更新booking信息
            Wapi.serverApi.sendWeixinByTemplate(re=>{//发送微信推送
                console.log(re);
                //完成后退出
                W.loading();
                W.alert(___.sendWeixinToSeller_success,e=>{W.native.close();});
                // W.alert({
                //     title:___.booking_install_title,
                //     text:___.sendWeixinToSeller_success
                // },e=>{W.native.close();});
            },{
                openId:this.seller_open_id,   //安装网点的openid
                // uid:'798351359882694700',   //booking的uid
                uid:booking.uid,
                templateId:'OPENTM408168978',
                type:'1',
                // link:'http://192.168.3.201:8081/booking_install_date.html?bookingId='+_g.bookingId+'&cust_open_id='+_g.openid,
                // link:'http://'+WiStorm.config.domain.wx+'/autogps/booking_install_date.html?intent=logout&bookingId='+_g.bookingId+'&cust_open_id='+_g.openid,
                link:'http://'+WiStorm.config.domain.wx+'/autogps/order.html?intent=logout&bookingId='+_g.bookingId,
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
                        "value": ACT.brand+' '+ACT.product,
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
                        "value": ___.sendWeixinToInstall_remark2,
                        "color": "#173177"
                    }
                }
            });
            
            Wapi.comm.sendSMS(r=>{//发送语音短信
                console.log(r);
            },{
                mobile:this.installTel,
                type:0,
                content:___.booking_install_success,
                content_type:2,
            })
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
                onTouchTap={()=>this.installChange(ele)}
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
                    <div style={styles.bottom_btn}>{___.more_install.replace('xxx',sellerTel)}</div>
                    {/*<div style={styles.bottom_btn}>
                        <RaisedButton
                            label={___.ok}
                            primary={true}
                            onTouchTap={this.submit}
                            disabled={submited}
                        />
                    </div>*/}
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
        let box=<div style={{float:'right'}}><ToggleCheckBoxOutlineBlank/></div>;
        if(this.props.selected){
            sty=styles.card_select;
            box=<div style={{float:'right'}}><ToggleCheckBox/></div>;
        }
        return (
            <div style={sty} onTouchTap={this.props.onTouchTap}>
                {box}
                <div>{data.name}</div>
                {/*<div>{data.province+' '+data.city+' '+data.area +' '+(data.address||'')}</div>*/}
                <div>{data.address||data.area}</div>
            </div>
        );
    }
}


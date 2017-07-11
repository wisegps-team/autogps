/**
 * 08/03
 * 小吴
 * 管理平台的主页，主要功能是 按用户权限展示功能模块的入口
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';

import ActionEvent from 'material-ui/svg-icons/action/event';
import AvEqualizer from 'material-ui/svg-icons/av/equalizer';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ContentAdd from 'material-ui/svg-icons/content/add';

import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';
import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';
import EmployeeSearch from '../_component/employee_search';

import STORE from '../_reducers/main';
import {user_type_act,brand_act,department_act,product_act} from '../_reducers/dictionary';
import {getOpenIdKey,changeToLetter} from '../_modules/tool';

const styles={
    main:{paddingBottom:'50px'},
    card:{margin:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    input_page:{textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    line:{marginTop:'0.5em'},
    input_group:{marginTop:'0.5em',textAlign:'left'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'10px'},
    tabs:{position: 'fixed',width: '100vw',bottom: '0px'},
    a:{marginRight:'1em',color:'#009688'},
};

require('../_sass/home.scss');

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(user_type_act.get({useType:_user.customer.custTypeId}));//用户类型
    STORE.dispatch(brand_act.get({uid:_user.customer.objectId}));//品牌
    STORE.dispatch(product_act.get({uid:_user.customer.objectId}));//品牌
    STORE.dispatch(department_act.get({uid:_user.customer.objectId,type:0}));//部门
}
loadDictionary();

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('booking_list.js',2);
});
thisView.addEventListener('show',function(){
    document.title=___.seller_activity;
});



class ActivityList extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
            curActivity:null,
            activityName:'',
        }
        this.limit=20;
        this.page_no=1;
        this.total=-1;
        this.activities=[];
        this.booking=[];

        this.nextPage = this.nextPage.bind(this);
        this.share = this.share.bind(this);
    }
    componentDidMount() {
        let par={
            "group":{
                "_id":{"activityId":"$activityId"},
                "status0":{"$sum":"$status0"},
                "status1":{"$sum":"$status1"},
                "status2":{"$sum":"$status2"},
                "status3":{"$sum":"$status3"}
            },
            "sorts":"objectId",
            "uid":_user.customer.objectId,
            sellerId:_user.employee.objectId,
        }
        Wapi.booking.aggr(resAggr=>{
            this.booking=resAggr.data;
            // this.activities=this.activities.concat(activities);
            // this.forceUpdate();
            this.getData();
        },par);
    }
    getChildContext(){
        return {
            share:this.share
        };
    }
    nextPage(){
        this.page_no++;
        this.getData();
    }
    getData(){
        Wapi.activity.list(res=>{
            this.total=res.total;
            this.activities=res.data||[];
            this.activities.forEach(ele=>{
                let booking=this.booking.find(item=>item._id.activityId==ele.objectId);
                if(booking){
                    ele.status0=booking.status0;
                    ele.status1=booking.status1;
                    ele.status2=booking.status2;
                    ele.status3=booking.status3;
                }else{
                    ele.status0=0;
                    ele.status1=0;
                    ele.status2=0;
                    ele.status3=0;
                }
            });
            this.forceUpdate();
        },{
            uid:_user.customer.objectId,
            // sellerTypeId:_user.employee.departId,
            status:1,
            type:1,
        },{
            limit:this.limit,
            page_no:this.page_no,
            sorts:'-createdAt',
        });
    }
    share(data){
        if(!_user.customer.wxAppKey){
            W.alert(___.wx_server_null);
            return;
        }
        function setShare(){
            let strOpenId='';
            let idKey=getOpenIdKey();
            if(_user.authData && _user.authData[idKey]){
                strOpenId='&seller_open_id='+_user.authData[idKey];
            }
            let _sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
            Wapi.qrLink.get(res=>{//获取与当前活动和seller对应的短码，如没有则新建
                let linkUrl='';
                if(res.data){
                    linkUrl='https://t.autogps.cn/?s='+res.data.id;
                    setWxShare(linkUrl);
                }else{
                    Wapi.qrLink.add(re=>{
                        let _id=changeToLetter(re.autoId);
                        linkUrl='https://t.autogps.cn/?s='+_id;
                        Wapi.qrLink.update(json=>{
                            setWxShare(linkUrl);
                        },{
                            _objectId:re.objectId,
                            id:_id
                        })
                    },{
                        i:1,
                        act:String(data.objectId),
                        sellerId:String(_sellerId),
                        uid:String(data.uid),
                        type:3,
                        url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
                            +'&uid='+data.uid
                            +'&sellerId='+_sellerId
                            +'&activityId='+data.objectId
                            +strOpenId
                            +'&timerstamp='+Number(new Date()),
                    });
                }
            },{
                act:data.objectId,
                sellerId:_sellerId,
                uid:data.uid,
                type:3
            });
            
            function setWxShare(url){
                var op={
                    title: data.name, // 分享标题
                    desc: data.offersDesc, // 分享描述
                    link: url,
                    // link:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
                    //     +'&uid='+data.uid
                    //     +'&sellerId='+_user.employee.objectId
                    //     +'&mobile='+_user.employee.tel
                    //     +'&title='+encodeURIComponent(data.name)
                    //     +'&agent_tel='+_user.customer.tel
                    //     +'&seller_name='+encodeURIComponent(_user.employee.name)
                    //     +'&wx_app_id='+_user.customer.wxAppKey
                    //     +'&activityId='+data.objectId
                    //     +strOpenId
                    //     +'&timerstamp='+Number(new Date()),
                    imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                    success: function(){},
                    cancel: function(){}
                }
                // history.replaceState('home.html','home.html','home.html');
                let data = {};
                data.op = op;
                // data.share_url = sUrl;
                W.setCookie('share_data',JSON.stringify(data));
                top.location = WiStorm.root + "wx_share.html"
                // W.fixPath();
                // wx.onMenuShareTimeline(op);
                // wx.onMenuShareAppMessage(op);
                // setShare=null;
                // W.alert(___.share_activity);
            }
        }
        if(W.native){
            setShare();
        }
        else{
            W.toast(___.ready_activity_url);
            window.addEventListener('nativeSdkReady',setShare);
        }

        console.log('share');
        
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <div name='list' style={styles.main}>
                        <Alist 
                            max={this.total} 
                            limit={20} 
                            data={this.activities} 
                            next={this.nextPage} 
                        />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}
ActivityList.childContextTypes={
    share:React.PropTypes.func
}

let strStatus=[___.terminated,___.ongoing];
let strBoolean=[___.no,___.yes]
class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.toActivityPage = this.toActivityPage.bind(this);
        this.toCountPage = this.toCountPage.bind(this);
    }
    toActivityPage(data){
        // history.replaceState('home.html','home.html','home.html');
        // window.location=WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
        //     +'&uid='+_user.customer.objectId
        //     +'&sellerId=0&mobile='+encodeURIComponent(___.noBooking)
        //     +'&title='+encodeURIComponent(data.name)
        //     +'&agent_tel='+_user.customer.tel
        //     +'&seller_name='+encodeURIComponent(___.noBooking)
        //     +'&timerstamp='+Number(new Date());
    }
    toCountPage(page,data){
        if(page=='booking'){
            let par={
                activityId:data.objectId,
                sellerId:_user.employee?_user.employee.objectId:_user.customer.objectId,
                status:0
            }
            thisView.goTo('booking_list.js',par);
        }else{
            let par={
                activityId:data.objectId,
                status:1
            }
            thisView.goTo('booking_list.js',par);
        }
    }
    render() {
        let data=this.props.data;
        
        let items=data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <table>
                    <tbody>
                        <tr >
                            <td style={styles.td_left}>{___.activity_name}</td>
                            <td style={styles.td_right} onClick={()=>this.toActivityPage(ele)}>{ele.name}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.activity_status}</td>
                            <td style={styles.td_right}>{strStatus[ele.status]}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.start_date}</td>
                            <td style={styles.td_right}>{ele.createdAt.slice(0,10)}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{marginTop:'5px',marginLeft:'3px',fontSize:'0.8em'}}>
                    {/*<span>{___.count_booked + ele.status0}</span>
                    <span style={{marginLeft:'10px'}}>{___.count_registed + ele.status1}</span>
                    <span style={{marginLeft:'10px'}}>{___.count_paid + ele.status2}</span>*/}
                    <span style={styles.a} onClick={()=>this.toCountPage('booking',ele)}>{___.bookingNum +' '+ ele.status0}</span>
                    <span style={styles.a} onClick={()=>this.toCountPage('registe',ele)}>{___.register +' '+ ele.status1}</span>
                </div>
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.share} primary={true} onClick={()=>this.context.share(ele)} />
                </div>
            </Card>);
        return(
            <div>
                {items}
            </div>
        )
    }
}
DList.contextTypes={
    share: React.PropTypes.func
};
let Alist=AutoList(DList);

class App extends Component {
    getChildContext() {
        return {
            view:thisView
        };
    }
    go(tab){
        thisView.goTo(tab.props.value+'.js');
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <ActivityList/>
                <Tabs style={styles.tabs}>
                    <Tab
                        className='tab'
                        icon={<ActionEvent/>}
                        label={___.marketing}
                    />
                    <Tab
                        className='tab'
                        icon={<AvEqualizer/>}
                        label={___.raning}
                        value={'seller_rank'}
                        onActive={this.go}
                    />
                    <Tab
                        className='tab'
                        icon={<ActionAccountCircle/>}
                        label={___.user}
                        value={'my_account'}
                        onActive={this.go}
                    />
                </Tabs>
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};
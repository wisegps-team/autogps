/**
 * 08/03
 * 小吴
 * 管理平台的主页，主要功能是 按用户权限展示功能模块的入口
 */
"use strict";
import 'babel-polyfill';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';

import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionWork from 'material-ui/svg-icons/action/work';
import ActionPermIdentity from 'material-ui/svg-icons/action/perm-identity';
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';
import ActionRecordVoiceOver from 'material-ui/svg-icons/action/record-voice-over';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAssignmentInd from 'material-ui/svg-icons/action/assignment-ind';
import ActionTurnedInNot from 'material-ui/svg-icons/action/turned-in-not';
import ActionViewList from 'material-ui/svg-icons/action/view-list';
import ActionFace from 'material-ui/svg-icons/action/face';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import CommunicationContacts from 'material-ui/svg-icons/communication/contacts';
import ContentSort from 'material-ui/svg-icons/content/sort';
import AvFeaturedPlayList from 'material-ui/svg-icons/av/featured-play-list';
import AvRecentActors from 'material-ui/svg-icons/av/recent-actors';
import ActionPermContactCalendar from 'material-ui/svg-icons/action/perm-contact-calendar';
import ActionEvent from 'material-ui/svg-icons/action/event';
import ImageHdrStrong from 'material-ui/svg-icons/image/hdr-strong';
import HardwareDeviceHub from 'material-ui/svg-icons/hardware/device-hub';
import ActionInfoOutline from 'material-ui/svg-icons/action/info-outline';
import ActionTrendingUp from 'material-ui/svg-icons/action/trending-up';
import EditorMonetizationOn from 'material-ui/svg-icons/editor/monetization-on';
import ActionShopTwo from 'material-ui/svg-icons/action/shop-two';
import ImageFilterCenterFocus from 'material-ui/svg-icons/image/filter-center-focus';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import AvEqualizer from 'material-ui/svg-icons/av/equalizer'
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car'
import ActionViewQuilt from 'material-ui/svg-icons/action/view-quilt'
import ActionExtension from'material-ui/svg-icons/action/extension'
// import NotificationWifi from'material-ui/svg-icons/notification/wifi'

import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';
import AutoList from '../_component/base/autoList';
import {getOpenIdKey,changeToLetter} from '../_modules/tool';

import STORE from '../_reducers/main';
import {user_type_act,brand_act,department_act,product_act,role_act} from '../_reducers/dictionary';

require('../_sass/home.scss');
const styles = {
    main:{paddingTop:'0px',paddingBottom:'0px',width:'100%'},
    card:{marginTop:'15px',width:'100%',backgroundColor:'#ffffff'},//170118
    hide:{display:'none'},
    table_left:{width:window.innerWidth*0.62+'px',height:'125px',padding:'0px',backgroundColor:'#ffffff'},
    table_right:{width:window.innerWidth*0.38+'px'},
    no_act:{marginTop:'30px',width:'100%',display:'block',textAlign:'center'},
    share_page:{width:'100%',height:window.innerHeight+'px',display:'block',backgroundColor:'#ffffff',position:'fixed',top:'0px',left:'0px'},
};

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(user_type_act.get({useType:_user.customer.custTypeId}));//用户类型
    STORE.dispatch(brand_act.get({uid:_user.customer.objectId}));//品牌
    STORE.dispatch(product_act.get({uid:_user.customer.objectId}));//品牌
    STORE.dispatch(department_act.get({uid:_user.customer.objectId}));//部门
    STORE.dispatch(role_act.get({uid:_user.customer.objectId}));//角色
}
loadDictionary();

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.zhilianche);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    if(_g.loginLocation){
        thisView.goTo(_g.loginLocation+'.js');
    }
    thisView.prefetch('./myMarketing/marketing_data.js',2);
    thisView.prefetch('./myAccount/my_order.js',2);
});


const sty={
    icon:{
        height: '34px',
        width: '34px',
        fill:  '#42A5F5'
    },
    iconActive:{
        height: '34px',
        width: '34px',
        fill:  'rgb(255, 152, 0)'
    },
    tabs:{
        position: 'fixed',
        width: '100vw',
        bottom: '0px'
    },
    main:{
        marginBottom:'50px'
    },
    head:{
        width:'100%',
        height:'180px',
        display:'block',
        textAlign:'center',
        paddingTop:'20px',
        // backgroundColor:'#33ccee',
        backgroundColor:'#3c9bf9',
        color:'#ffffff'
    },
    head_pic:{
        width:'100px',
        height:'100px', 
        borderRadius:'50%'
    },
    head_links:{
        display:'table',
        width:'100%',
        marginTop:'15px'
    },
    head_link:{
        display:'table-cell',
        width:'33%',
        borderRight:'1px solid #ffffff'
    },
    head_link2:{
        display:'table-cell',
        width:'50%',
        borderRight:'1px solid #ffffff'
    }
}

function checkWallet(){
    Wapi.user.get(res=>{//检查是否有公司钱包
        if(res.status_code!=0||res.data.balance==-1){//如果没有，则用公司的objectId作为mobile和password创建一个user作为公司账户
            Wapi.user.add(re=>{
                return;
            },{
                mobile:_user.customer.objectId,
                password:_user.customer.objectId,
                objectId:_user.customer.objectId,
                account_type:2  //1为个人账户（默认），2为公司账户
            });
        }
    },{
        mobile:_user.customer.objectId,
    },{
        err:true,
    });
}
checkWallet();

const _pages=[//所有的页面
    // {   /*供应商管理 */
    //     href:'superior',
    //     name:___.superior,
    //     icon:<ActionSupervisorAccount style={sty.icon}/>
    // },
    {   /*渠道管理 */
        href:'subordinate',
        name:___.subordinate,
        icon:<ActionPermContactCalendar style={sty.icon}/>
    },
    {   /*库存管理（出入库相关信息） */
        href:'device_manage',
        name:___.device_manage,
        icon:<HardwareKeyboard style={sty.icon}/>
    },
    // {   /*产品管理(是品牌型号的管理) */
    //     href:'brand_manage',
    //     name:___.brand_manage,
    //     icon:<ActionViewList style={sty.icon}/>
    // },
    {   /*增值业务 */
        href:'activity_agent',
        name:___.activity_agent,
        icon:<ToggleStar style={sty.icon}/>
    },
    // {   /*营销产品 */
    //     href:'selling_product',
    //     name:___.selling_product,
    //     icon:<ActionShopTwo style={sty.iconActive}/>
    // },
    // {   /*营销活动链接 */
    //     href:'seller_activity',
    //     name:___.seller_activity,
    //     icon:<ActionEvent style={sty.iconActive}/>
    // },
    {   /*营销人员 */
        href:'marketing_personnel',
        name:___.marketing_personnel,
        icon:<ActionRecordVoiceOver style={sty.iconActive}/>
    },
    // {   /*二维码管理 */
    //     href:'qrcode',
    //     name:___.qrcode_manage,
    //     icon:<ImageFilterCenterFocus style={sty.iconActive}/>
    // },
    {   /*代理商，经销商的企业账户 */
        href:'financial_manage',
        name:___.financial_manage,
        icon:<EditorMonetizationOn style={sty.icon}/>
    },
    {   /*顶级用户的财务管理 */
        href:'financial_manage_top',
        name:___.financial_manage,
        icon:<EditorMonetizationOn style={sty.icon}/>
    },
    // {   /*系统设置 */
    //     href:'myAccount/system_set',
    //     name:___.system_set,
    //     icon:<ActionSettings style={sty.icon}/>
    // };
    {   /*推广统计*/
        href:'promotion_statistical',
        name:___.promotion_statistical,
        icon:<AvEqualizer style={sty.icon}/>
    },
    
];

// if(_user.customer.custTypeId==8){   //如果当前用户是经销商，则不显示【车主营销】页面
//     _user.pages=_user.pages.filter(ele=>ele.objectId!='791907964700201000');  //name!='车主营销'
// }
Wapi.customer.get(res => {
    _user.customer = res.data
    // console.log(res.data,'res')
    W.setSetting("user", _user) //每次刷新重置一下_user
    // console.log(_user.customer,'_user.customer')
},{
    objectId:_user.customer.objectId
})
console.log(_user.customer,'_user.customer')
let pages=_pages.filter(e=>_user.pages.find(p=>p.url.split('/').pop()==e.href));
// let pages=_pages;
// let
// Wapi.customer.get(res => {
    let plat = null;
    let move = null;
    let user_manage = null;
    // console.log(res)
    // if(_user.customer.custTypeId == 1 || _user.custoemr.custTypeId == 5){//品牌商代理商
    if(_user.customer.Authorize){
        _user.customer.Authorize.forEach(ele => {
            if(ele == 0){ //营销推广
                plat = 1
            }else if(ele == 3){ //扫码移车
                move = 3
            }else if(ele == 1){ //政企客户
                user_manage = 1
            }
        })
    }
    // }
    if(plat == 1|| _user.customer.custTypeId == 5 || _user.customer.custTypeId == 8){
        pages.push({
            href:'business_manage',
            name:'业务管理',
            icon:<ActionExtension style={sty.icon}/>
        })
    }
    //平台/扫码客户/扫码移车可见
    // if(_user.customer.custTypeId == 9 || _user.customer.custTypeId == 10 || move == 3){
    //     pages.push({
    //         href:'carowner_platform',
    //         name:'扫码挪车',
    //         icon:<MapsDirectionsCar style={sty.icon}/>
    //     })
    // }

    //全部可见
    pages.push({
        href:'carowner_platform',
        name:'扫码挪车',
        icon:<MapsDirectionsCar style={sty.icon}/>
    })
    if(_user.customer.custTypeId == 9){
        pages.push({
            href:'platform_manage',
            name:'平台管理',
            icon:<ActionViewQuilt style={sty.icon}/>
        })
    }
    if(user_manage == 1){
        pages.push({   /*政企客户 */
            href:'user_manage',
            name:___.user_manage,
            icon:<ActionPermIdentity style={sty.iconActive}/>
        })
    }
// },{
//     objectId:_user.customer.objectId
// })

console.log(pages)
// let set=<ModuleCard title={___.system_set} icon={<ActionSettings style={sty.icon}/>} href={'myAccount/system_set'} key={'myAccount/system_set'}/>

//推荐有礼活动列表
class ActivityList extends Component {
    constructor(props, context) {
        super(props, context);
        this.limit=20;
        this.total=-1;
        this.originalActivities=[];
        this.activities=[];
        this.booking=[];
        // this.getData = this.getData.bind(this)
    }
    componentDidMount(){
        this.getData();
    }
    getData(){
        W.loading(true);
        if(_user.employee && _user.employee.type==1){
            //兼职营销账号，显示所属公司的集团营销活动。
            let par0={
                uid:_user.employee.companyId,
                // sellerTypeId:_user.employee.departId,
                status:1,
                type:1,
            }
            Wapi.activity.list(res=>{
                this.total=res.total;
                let activities=res.data;
                
                activities.forEach(ele=>{
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
                this.originalActivities=this.originalActivities.concat(activities);
                this.activities=this.activities.concat(activities);
                W.loading();
                this.forceUpdate();
            },par0,{
                sorts:'-createdAt',
                limit:-1,
            });

        }else if(_user.customer.custTypeId==8||_user.customer.custTypeId==5){//经销商和代理商账号，显示上一级创建的渠道营销活动。

            let parents=_user.customer.parentId.join('|');
            let par1={
                uid:_user.customer.objectId + '|' + parents,
                status:1,
                type:3
            }
            Wapi.activity.list(res=>{//type=3 渠道营销
                this.total=res.total;
                let activities=res.data;
                
                activities.forEach(ele=>{
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
                    // if(_user.customer.wxAppKey){
                    //     ele.wxAppKey=_user.customer.wxAppKey;
                    //     ele.uid=_user.customer.objectId;
                    // }
                });
                this.originalActivities=this.originalActivities.concat(activities);
                this.activities=this.activities.concat(activities);
                W.loading();
                this.forceUpdate();
            },par1,{
                sorts:'-createdAt',
                limit:-1,
            });

        }else if(_user.customer.custTypeId==7){
            //车主账号，显示上两级创建的车主营销活动。
            let _this=this;
            let parents=_user.customer.parentId;
            let i=parents.length;
            parents.forEach(ele=>{//获取当前用户的所有上级id，并查找所有的上上级id
                Wapi.customer.get(re=>{
                    if(re.data){
                        parents=re.data.parentId && parents.concat(re.data.parentId);
                    }
                    i--;
                    if(i==0){//当查找玩所有上上级的时候 获取所有parents的活动
                        getIt();
                    }
                },{objectId:ele});
            });
            function getIt(){
                let strParents=parents.join('|');
                let par3={
                    uid:_user.customer.objectId + '|' + strParents,
                    status:1,
                    type:0  //type=0 车主营销的活动
                }
                Wapi.activity.list(res=>{
                    _this.total=res.total;
                    let activities=res.data;
                    
                    activities.forEach(ele=>{
                        let booking=_this.booking.find(item=>item._id.activityId==ele.objectId);
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
                        // if(_user.customer.wxAppKey){
                        //     ele.wxAppKey=_user.customer.wxAppKey;
                        //     ele.uid=_user.customer.objectId;
                        // }
                    });
                    _this.originalActivities=_this.originalActivities.concat(activities);
                    _this.activities=_this.activities.concat(activities);
                    W.loading();
                    _this.forceUpdate();
                },par3,{
                    sorts:'-createdAt',
                    limit:-1,
                });
            }
        }else{
            this.noData=true;
            W.loading();
            this.forceUpdate();
        }
    }
    render() {
        return (
            <div name='list1' style={styles.main}>
                <Alist 
                    max={this.total} 
                    limit={this.limit} 
                    data={this.activities} 
                />
                <div style={this.activities.length==0?styles.no_act:styles.hide}>
                    暂无活动
                </div>
            </div>
        );
    }
}

// const cards = [];//测试用
const cards=pages.map(e=>(<ModuleCard title={e.name} icon={e.icon} href={e.href} key={e.href}/>));


//营销平台首页如果无菜单，显示推荐有礼下面的内容
if(cards.length == 0){
    thisView.style.backgroundColor='#eeeeee';
    cards.push(<ActivityList key={'my_marketing'}/>)
}

class App extends Component {
    
    getChildContext() {
        return {
            view:thisView
        };
    }
    componentDidMount() {
        thisView.addEventListener('show',e => {
            this.forceUpdate();
        })
    }
    go(tab){
        thisView.goTo(tab.props.value+'.js');
    }
    personalInfo(){
        thisView.goTo('./myAccount/personal_info.js');
        // this.forceUpdate();
    }
    companyInfo(){
        thisView.goTo('./company_info.js');
    }
    financialManage(){
        thisView.goTo('./financial_manage.js');
    }
    bookingList(){
        let par={installId:_user.customer.objectId};
        if(_user.employee){
            let par2={sellerId:_user.employee.objectId}//员工,营销人员
            par={
                _more_params:true,
                params:[par,par2]
            };
        }else{
            if(_user.customer.custTypeId==5 || _user.customer.custTypeId==1){
                par={uid:_user.customer.objectId}
            }
        }
        // thisView.goTo('booking_list.js',par);
        thisView.goTo('./myAccount/my_order.js',par);
    }
    recommend(){
        thisView.goTo('my_marketing.js');
        // window.location='my_marketing.html';
    }
    set(){
        thisView.goTo('./myAccount/system_set.js');
    }
    wallet(){
        thisView.goTo('./myAccount/wallet.js');
    }
    render() {
        let headRight=<div style={{display:'table-cell',width:'33%'}} onClick={this.wallet}>{___.wallet}</div>
        if(typeof(_user.employee)=='undefined'){//如果是管理员，用 ‘系统设置’ 替换 ‘钱包’ 
            headRight=<div style={{display:'table-cell',width:'33%'}} onClick={this.set}>{___.set}</div>
        }
        
        return (
            <ThemeProvider>
            <div style={sty.main}>
                <div style={sty.head} >
                    <div style={{fontSize:'18px'}} onClick={this.personalInfo}>
                        <img src='../../img/head.png' style={sty.head_pic}/>
                        <div>
                            {_user.employee ? _user.employee.name : (_user.customer.contact||_user.customer.name)}
                        </div>
                    </div>
                    {
                        _user.customer.custTypeId === 10 ||_user.customer.custTypeId === 11?
                        <div style={sty.head_links}>
                            <div style={sty.head_link2} onClick={this.financialManage}>{'企业账户'}</div>
                            <div style={{display:'table-cell',width:'50%'}} onClick={this.companyInfo}>{'公司信息'}</div>
                        </div>:
                        <div style={sty.head_links}>
                            <div style={sty.head_link} onClick={this.bookingList}>{___.order}</div>
                            <div style={sty.head_link} onClick={this.recommend}>{___.recommend}</div>
                            {headRight}
                        </div>
                    }

                </div>
                <div className='main'>
                    {cards}
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};

class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.activityUrl='';
        this.state={
            iframe:false,
            isShare:false,
            reward:0
        };
        this.toActivityPage = this.toActivityPage.bind(this);
        this.activityData = this.activityData.bind(this);
        this.toggleIframe = this.toggleIframe.bind(this);
        this.sharePage = this.sharePage.bind(this);
        this.shareBack = this.shareBack.bind(this);
    }
    toActivityPage(data){
        data._seller=_user.employee?_user.employee.name:_user.customer.contact;
        data._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
        data._sellerTel=_user.employee?_user.employee.tel:_user.mobile;
        let strOpenId='';
        let idKey=getOpenIdKey();
        if(_user.authData && _user.authData[idKey]){
            strOpenId='&seller_open_id='+_user.authData[idKey];
        }

        
        Wapi.qrLink.get(res=>{//获取与[当前活动和seller]对应的短码，如没有则新建
            let linkUrl='';
            if(res.data && res.data.id){
                linkUrl='https://t.autogps.cn/?s='+res.data.id;
                // history.replaceState('home.html','home.html','home.html');
                W.fixPath();
                window.location=linkUrl;
                // console.log(linkUrl);
            }else{
                Wapi.qrLink.add(re=>{
                    let _id=changeToLetter(re.autoId);
                    linkUrl='https://t.autogps.cn/?s='+_id;
                    Wapi.qrLink.update(json=>{
                        // history.replaceState('home.html','home.html','home.html');
                        W.fixPath();
                        window.location=linkUrl;
                        // console.log(linkUrl);
                    },{
                        _objectId:re.objectId,
                        id:_id
                    })
                },{
                    i:1,
                    act:String(data.objectId),
                    sellerId:String(data._sellerId),
                    uid:String(data.uid),
                    type:3,
                    url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
                        +'&uid='+data.uid
                        +'&sellerId='+data._sellerId
                        +'&activityId='+data.objectId
                        +strOpenId
                        +'&timerstamp='+Number(new Date()),
                });
            }
        },{
            act:data.objectId,
            sellerId:data._sellerId,
            uid:data.uid,
            type:3
        });
            
    }
    share(data){
        if(!data.wxAppKey){
            W.alert(___.wx_server_null);
            return;
        }
        let that=this;
        function setShare(){
            data._seller=_user.employee?_user.employee.name:_user.customer.contact;
            data._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
            data._sellerTel=_user.employee?_user.employee.tel:_user.mobile;
            
            let strOpenId='';
            let idKey=getOpenIdKey();
            if(_user.authData && _user.authData[idKey]){
                strOpenId='&seller_open_id='+_user.authData[idKey];
            }

            Wapi.qrLink.get(res=>{//获取与当前活动和seller对应的短码，如没有则新建
                let linkUrl='';
                if(res.data && res.data.id){
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
                        });
                    },{
                        i:1,
                        act:String(data.objectId),
                        sellerId:String(data._sellerId),
                        uid:String(data.uid),
                        type:3,
                        url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
                            +'&uid='+data.uid
                            +'&sellerId='+data._sellerId
                            +'&activityId='+data.objectId
                            +strOpenId
                            +'&timerstamp='+Number(new Date()),
                    });
                }
            },{
                act:data.objectId,
                sellerId:data._sellerId,
                uid:data.uid,
                type:3
            });
            
            function setWxShare(url){
                let params={
                    id:1,
                    // qrcodeId:3,
                    marpersonId:data._sellerId,
                    maractivityId:data.objectId,
                    publiceId:W.getCookie('current_wx'),
                    marcompanyId:_user.customer.objectId,
                    maractcompanyId:data.uid,
                    martypeId:data.type,
                    pertypeId:_user.customer.objectId,
                    commission:data.count,
                    busmanageId:data.principalId||'',//需要获取
                    marproductId:data.actProductId,
                }
                if(_user.employee){
                    // let depart=STORE.getState().department.find(ele=>ele.objectId==_user.employee.departId);
                    // if(depart){
                    //     params.busmanageId=depart.adminId||'';
                    //     params.pertypeId=_user.employee.departId;
                    // }

                    Wapi.department.get(resDpt=>{
                        let depart=resDpt.data;
                        if(depart && (depart.uid==_user.customer.objectId) ){//活动创建公司的员工,集团营销人员
                            params.busmanageId=depart.adminId||'';
                            params.pertypeId=_user.employee.departId;
                        }
                        if(depart && (depart.uid!=_user.customer.objectId) ){//下级经销商的员工
                            let strMng=_user.customer.parentMng.find(ele=>ele.includes(activity.uid));
                            if(strMng){
                                params.busmanageId=strMng.split('in')[0];
                            }
                        }
                        finalShare();
                    },{objectId:_user.employee.departId});
                }else{
                    finalShare();
                }
                // console.log(params);
                function finalShare(){

                    data.par = Object.assign({},params);
                    // JSON.stringify(data.par)
                    W.setCookie('share_data',JSON.stringify(data));
                    top.location = WiStorm.root + "wx_share.html"
                    // function timelineSuccess(){
                    //     let par=Object.assign({},params);
                    //     par.type=1
                    //     Wapi.promotion.add(pro=>{
                    //         console.log(pro);
                    //     },par);
                    // }
                    // function messageSuccess(){
                    //     let par=Object.assign({},params);
                    //     par.type=0;
                    //     Wapi.promotion.add(pro=>{
                    //         console.log(pro);
                    //     },par);
                    // }

                    // var opTimeLine={
                    //     title: data.name, // 分享标题
                    //     desc: data.offersDesc, // 分享描述
                    //     link: url,
                    //     imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                    //     success: function(){
                    //         timelineSuccess();
                    //     },
                    //     cancel: function(){}
                    // }
                    // var opMessage={
                    //     title: data.name, // 分享标题
                    //     desc: data.offersDesc, // 分享描述
                    //     link: url,
                    //     imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                    //     success: function(){
                    //         messageSuccess();
                    //     },
                    //     cancel: function(){}
                    // }
                    // console.log(opTimeLine);
                    // console.log(opMessage);
                    // history.replaceState('home.html','home.html','home.html');
                    // W.fixPath();
                    // wx.onMenuShareTimeline(opTimeLine);
                    // wx.onMenuShareAppMessage(opMessage);
                    // setShare=null;
                    // that.context.share(data);
                    that.sharePage(data);
                }

            }
            
        }
        if(W.native){
            setShare();
        }
        else{
            // setShare();//测试用
            W.toast(___.ready_activity_url);
            window.addEventListener('nativeSdkReady',setShare);
        }
    }
    sharePage(activity){
        this._share_time=new Date()*1;
        this.setState({
            isShare:true,
            reward:activity.reward||0
        });
    }
    shareBack(){
        let now=new Date()*1;
        if(now-this._share_time<3000)return;//3秒后才可以关闭
        this.setState({isShare:false});
    }
    activityData(data){
        thisView.goTo('./myMarketing/marketing_data.js',data);
    }
    toggleIframe(){
        this.setState({iframe:!this.state.iframe});
    }
    render() {
        let iframe=this.state.iframe?<Iframe 
            src={this.activityUrl} 
            name='act_url' 
            close={this.toggleIframe}
        />:null;
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <div key={i} style={styles.card}>
                <table style={{borderCollapse: 'collapse'}}>
                <tbody>
                    <tr>
                        <td style={styles.table_left} onClick={()=>this.toActivityPage(ele)}>
                            {ele.imgUrl?
                            <img src={ele.imgUrl} style={{width:window.innerWidth*0.62,height:'125px',verticalAlign: 'middle'}} alt={ele.name}/>
                            :<div style={{width:window.innerWidth*0.62,textAlign:'center'}}>{ele.name}</div>}
                        </td>
                        <td style={styles.table_right}>
                            <div style={{fontSize: '12px',marginBottom: '3px', textAlign:'center'}} >
                                <div>推荐朋友预订安装</div>
                                <div>
                                    <span>奖励 </span>
                                    <span style={{color:'#ff9900'}}>{ele.reward}</span>
                                    <span> 元红包</span>
                                </div>
                                <div style={{fontSize:'8px',marginTop:'5px'}}>
                                    {'已有'+ele.status0+'位好友预订'}
                                </div>
                            </div>
                            <div style={{height:'53px',width:window.innerWidth*0.38,position:'relative'}}>
                                <div style={{textAlign:'center',position:'absolute',left:'50%'}}>
                                    <img 
                                        src='../../img/qrcode.png' 
                                        style={{width:'30px',height:'30px'}} 
                                        onClick={()=>this.activityData(ele)}
                                    />
                                    <div style={{fontSize:'8px'}}>营销资料</div>
                                </div>
                                <div style={{textAlign:'center',position:'absolute',left:'50%',marginLeft: '-50px'}}>
                                    <img 
                                        src='../../img/share.png' 
                                        style={{width:'30px',height:'30px'}} 
                                        onClick={()=>this.share(ele)}
                                    />
                                    <div style={{fontSize:'8px'}}>分享活动</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>);
        return(
            <div>
                {items}
                {iframe}
                <div style={data.length?{marginTop:'15px',width:'100%',textAlign:'center',fontSize:'12px'}:styles.hide}>
                    <p>
                        点击
                        <img src='../../img/share.png' style={{width:'20px',height:'20px'}} />
                        按提示将活动发送给朋友或分享到朋友圈，
                    </p>
                    <p>好友打开链接即可了解活动详情并咨询预订！</p>
                </div>
                
                <div style={this.state.isShare ? styles.share_page : styles.hide} onClick={this.shareBack}>
                    <SharePage reward={this.state.reward}/>
                </div>
            </div>
        )
    }
}
DList.contextTypes={
    edit: React.PropTypes.func,
    share: React.PropTypes.func
};

let Alist=AutoList(DList);

class SharePage extends Component {
    render() {
        return (
            <div style={{marginTop:(window.innerHeight-240)/2+'px'}}>
                <img src='../../img/shareTo.jpg' style={{width:'100%',display:'block'}}/>
                <br/>
                <div style={{textAlign:'center',display:'block',width:'100%'}}>
                    <div style={{width:'100px',marginLeft:(window.innerWidth-100)/2+'px',height:'30px',lineHeight:'30px',borderRadius:'4px',border:'solid 1px #ff9900',color:'#ff9900'}}>
                        返回
                    </div>
                </div>
            </div>
        );
    }
}

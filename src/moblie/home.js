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

import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';
import AutoList from '../_component/base/autoList';
import {getOpenIdKey,changeToLetter} from '../_modules/tool';

import STORE from '../_reducers/main';
import {user_type_act,brand_act,department_act,product_act,role_act} from '../_reducers/dictionary';

require('../_sass/home.scss');
const styles = {
    main:{paddingTop:'0px',paddingBottom:'0px'},
    card:{marginTop:'15px',width:'100%',backgroundColor:'#ffffff'},//170118
    hide:{display:'none'},
    table_left:{width:window.innerWidth*0.62+'px',height:'125px',padding:'0px',backgroundColor:'#ffffff'},
    table_right:{width:window.innerWidth*0.38+'px'}
};

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(user_type_act.get({useType:_user.customer.custTypeId}));//用户类型
    STORE.dispatch(brand_act.get({uid:_user.customer.objectId}));//品牌
    STORE.dispatch(product_act.get({uid:_user.customer.objectId}));//品牌
    STORE.dispatch(department_act.get({uid:_user.customer.objectId,type:0}));//部门
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
    {   /*供应商管理 */
        href:'superior',
        name:___.superior,
        icon:<ActionSupervisorAccount style={sty.icon}/>
    },
    {   /*渠道管理 */
        href:'subordinate',
        name:___.subordinate,
        icon:<ActionPermContactCalendar style={sty.icon}/>
    },
    {   /*政企客户 */
        href:'user_manage',
        name:___.user_manage,
        icon:<ActionPermIdentity style={sty.iconActive}/>
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
    {   /*营销产品 */
        href:'selling_product',
        name:___.selling_product,
        icon:<ActionShopTwo style={sty.iconActive}/>
    },
    {   /*营销活动链接 */
        href:'seller_activity',
        name:___.seller_activity,
        icon:<ActionEvent style={sty.iconActive}/>
    },
    {   /*营销人员 */
        href:'marketing_personnel',
        name:___.marketing_personnel,
        icon:<ActionRecordVoiceOver style={sty.iconActive}/>
    },
    {   /*二维码管理 */
        href:'qrcode',
        name:___.qrcode_manage,
        icon:<ImageFilterCenterFocus style={sty.iconActive}/>
    },
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
];

// if(_user.customer.custTypeId==8){   //如果当前用户是经销商，则不显示【车主营销】页面
//     _user.pages=_user.pages.filter(ele=>ele.objectId!='791907964700201000');  //name!='车主营销'
// }
let pages=_pages.filter(e=>_user.pages.find(p=>p.url.split('/').pop()==e.href));
// let pages=_pages;

let set=<ModuleCard title={___.system_set} icon={<ActionSettings style={sty.icon}/>} href={'myAccount/system_set'} key={'myAccount/system_set'}/>

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
                sellerTypeId:_user.employee.departId,
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
                {/*items*/}
                <Alist 
                    max={this.total} 
                    limit={this.limit} 
                    data={this.activities} 
                />
                <div style={this.activities.length==0?{marginTop:'30px',textAlign:'center'}:styles.hide}>
                    暂无活动
                </div>
            </div>
        );
    }
}

// const cards = [];//测试用
const cards=pages.map(e=>(<ModuleCard title={e.name} icon={e.icon} href={e.href} key={e.href}/>));
if(typeof(_user.employee)=='undefined'){//临时用系统设置菜单
    cards.push(set);
}

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
    go(tab){
        thisView.goTo(tab.props.value+'.js');
    }
    personalInfo(){
        thisView.goTo('./myAccount/personal_info.js');
    }
    recommend(){
        thisView.goTo('my_marketing.js');
    }
    wallet(){
        thisView.goTo('./myAccount/wallet.js');
    }
    render() {
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
                    <div style={sty.head_links}>
                        <div style={sty.head_link}>{___.order}</div>
                        <div style={sty.head_link} onClick={this.recommend}>{___.recommend}</div>
                        <div style={{display:'table-cell',width:'33%'}} onClick={this.wallet}>{___.wallet}</div>
                    </div>
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
            iframe:false
        };
        this.toActivityPage = this.toActivityPage.bind(this);
        this.toCountPage = this.toCountPage.bind(this);
        this.activityData = this.activityData.bind(this);
        this.toggleIframe = this.toggleIframe.bind(this);
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
                linkUrl='http://autogps.cn/?s='+res.data.id;
                history.replaceState('home.html','home.html','home.html');
                window.location=linkUrl;
                // console.log(linkUrl);
            }else{
                Wapi.qrLink.add(re=>{
                    let _id=changeToLetter(re.autoId);
                    linkUrl='http://autogps.cn/?s='+_id;
                    Wapi.qrLink.update(json=>{
                        history.replaceState('home.html','home.html','home.html');
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
    toCountPage(page,data){
        let par={
            activityId:data.objectId,
            sellerId:_user.employee?_user.employee.objectId:_user.customer.objectId,
            status:1
        }
        if(page=='booking'){
            par.status=0
        }
        thisView.goTo('booking_list.js',par);
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
                    linkUrl='http://autogps.cn/?s='+res.data.id;
                    setWxShare(linkUrl);
                }else{
                    Wapi.qrLink.add(re=>{
                        let _id=changeToLetter(re.autoId);
                        linkUrl='http://autogps.cn/?s='+_id;
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
                var op={
                    title: data.name, // 分享标题
                    desc: data.offersDesc, // 分享描述
                    link: url,
                    imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                    success: function(){},
                    cancel: function(){}
                }
                wx.onMenuShareTimeline(op);
                wx.onMenuShareAppMessage(op);
                setShare=null;
                that.context.share(data);
            }

        }
        if(W.native){
            setShare();
        }
        else{
            W.toast(___.ready_activity_url);
            window.addEventListener('nativeSdkReady',setShare);
        }
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
            </div>
        )
    }
}
DList.contextTypes={
    edit: React.PropTypes.func,
    share: React.PropTypes.func
};

let Alist=AutoList(DList);
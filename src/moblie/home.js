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

import STORE from '../_reducers/main';
import {user_type_act,brand_act,department_act,product_act,role_act} from '../_reducers/dictionary';

require('../_sass/home.scss');

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
    {
        href:'superior',
        name:___.superior,
        icon:<ActionSupervisorAccount style={sty.icon}/>
    },
    {
        href:'subordinate',
        name:___.subordinate,
        icon:<ActionPermContactCalendar style={sty.icon}/>
    },
    {
        href:'user_manage',
        name:___.user_manage,
        icon:<ActionPermIdentity style={sty.iconActive}/>
    },
    {
        href:'device_manage',
        name:___.device_manage,
        icon:<HardwareKeyboard style={sty.icon}/>
    },
    {
        href:'brand_manage',
        name:___.brand_manage,
        icon:<ActionViewList style={sty.icon}/>
    },
    {
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
    {   /*代理商，经销商的财务管理 */
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

if(_user.customer.custTypeId==8){   //如果当前用户是经销商，则不显示【车主营销】页面
    _user.pages=_user.pages.filter(ele=>ele.objectId!='791907964700201000');  //name!='车主营销'
}
let pages=_pages.filter(e=>_user.pages.find(p=>p.url.split('/').pop()==e.href));
// let pages=_pages;

let set=<ModuleCard title={___.system_set} icon={<ActionSettings style={sty.icon}/>} href={'myAccount/system_set'} key={'myAccount/system_set'}/>

const cards=pages.map(e=>(<ModuleCard title={e.name} icon={e.icon} href={e.href} key={e.href}/>));
if(typeof(_user.employee)=='undefined'){//临时用系统设置菜单
    cards.push(set);
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
                {/*<Tabs style={sty.tabs}>
                    <Tab
                        className='tab'
                        icon={<ActionHome/>}
                        label={___.home}
                    />
                    <Tab
                        className='tab'
                        icon={<ActionWork/>}
                        label={___.message}
                        value={'to_do'}
                        onActive={this.go}
                    />
                    <Tab
                        className='tab'                    
                        icon={<ActionAccountCircle/>}
                        label={___.user}
                        value={'my_account'}
                        onActive={this.go}
                    />
                </Tabs>*/}
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};


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
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});
thisView.addEventListener('show',function(){
    document.title=_user.customer.name;
});


const sty={
    icon:{
        height: '34px',
        width: '34px',
        fill:  '#42A5F5'
    },
    tabs:{
        position: 'fixed',
        width: '100vw',
        bottom: '0px'
    },
    main:{
        marginBottom:'50px'
    }
}

const _pages=[//所有的页面
    // {
    //     href:'brand_trader',
    //     name:___.brand_trader,
    //     icon:<ActionRecordVoiceOver style={sty.icon}/>
    // },
    {
        href:'superior',
        name:___.superior,
        icon:<ActionSupervisorAccount style={sty.icon}/>
    },
    // {
    //     href:'dealer_agent',
    //     name:___.agent,
    //     icon:<ActionSupervisorAccount style={sty.icon}/>
    // },
    {
        href:'subordinate',
        name:___.subordinate,
        icon:<ActionPermContactCalendar style={sty.icon}/>
    },
    {
        href:'user_manage',
        name:___.user_manage,
        icon:<ActionPermIdentity style={sty.icon}/>
    },
    {
        href:'device_manage',
        name:___.device_manage,
        icon:<HardwareKeyboard style={sty.icon}/>
    },
    {
        href:'department',
        name:___.department_manage,
        icon:<ActionTurnedInNot style={sty.icon}/>
    },
    {
        href:'employee',
        name:___.employee_manage,
        icon:<ActionAssignmentInd style={sty.icon}/>
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

    // {//原本的营销推广
    //     href:'partTime_sellers',
    //     name:___.partTime_sellers,
    //     icon:<CommunicationContacts style={sty.icon}/>
    // },
    
    {   /*角色管理链接 */
        href:'role_manage',
        name:___.role_manage,
        icon:<ActionFace style={sty.icon}/>
    },
    // {   /*注册信息链接 */
    //     href:'register_info',
    //     name:___.register_info,
    //     icon:<AvFeaturedPlayList style={sty.icon}/>
    // },
    {   /*车主营销链接 */
        href:'carowner_seller',
        name:___.carowner_seller,
        icon:<AvRecentActors style={sty.icon}/>
    },
    {   /*营销活动链接 */
        href:'seller_activity',
        name:___.seller_activity,
        icon:<ActionEvent style={sty.icon}/>
    },
    // { //营销统计
    //     href:'partTime_count',
    //     name:___.sell_count,
    //     icon:<ContentSort style={sty.icon}/>
    // },
    {   /*营销人员 */
        href:'marketing_personnel',
        name:___.marketing_personnel,
        icon:<ActionRecordVoiceOver style={sty.icon}/>
    },
    {   /*公众号配置 */
        href:'wx_config',
        name:___.config_wx,
        icon:<ImageHdrStrong style={sty.icon}/>
    },
    {   /*公司信息 */
        href:'company_info',
        name:___.company_info,
        icon:<ActionInfoOutline style={sty.icon}/>
    },
    {   /*我的营销 */
        href:'my_marketing',
        name:___.my_marketing,
        icon:<ActionTrendingUp style={sty.icon}/>
    },
];

if(_user.customer.custTypeId==8){   //如果当前用户是经销商，则不显示【车主营销】页面
    _user.pages=_user.pages.filter(ele=>ele.objectId!='791907964700201000');  //name!='车主营销'
}
let pages=_pages.filter(e=>_user.pages.find(p=>p.url.split('/').pop()==e.href));
// let pages=_pages;


const cards=pages.map(e=>(<ModuleCard title={e.name} icon={e.icon} href={e.href} key={e.href}/>));

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
            <div style={sty.main}>
                <div className='main'>
                    {cards}
                </div>
                <Tabs style={sty.tabs}>
                    <Tab
                        className='tab'
                        icon={<ActionHome/>}
                        label={___.home}
                    />
                    <Tab
                        className='tab'
                        icon={<ActionWork/>}
                        label={___.to_do}
                        value={'to_do'}
                        onActive={this.go}
                    />
                    <Tab
                        className='tab'                    
                        icon={<ActionAccountCircle/>}
                        label={___.my_account}
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


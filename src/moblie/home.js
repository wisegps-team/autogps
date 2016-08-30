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

import ActionHome from 'material-ui/svg-icons/action/home';
import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';

import STORE from '../_reducers/main';
import {user_type_act,brand_act} from '../_reducers/dictionary';

require('../_sass/home.scss');

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(user_type_act.get({creator:'<>0'}));
    STORE.dispatch(brand_act.get({uid:_user.customer.uid}));
}
loadDictionary();

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
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
    }
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
    render() {
        return (
            <ThemeProvider>
            <div>
                <div className='title'>
                    <h2>{___.app_name}</h2>
                </div>
                <div className='main'>
                    <div className='tr'>
                        <ModuleCard title={___.cust_manage} icon={<ActionSupervisorAccount style={sty.icon}/>} href='cust_manage' />
                        <ModuleCard title={___.user_manage} icon={<ActionPermIdentity style={sty.icon}/>} href='user_manage' />
                        <ModuleCard title={___.device_manage} icon={<HardwareKeyboard style={sty.icon}/>} href='device_manage' />
                    </div>
                    <div className='tr'>
                        
                    </div>
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
                        label={___.company_info}
                        value={'company_info'}
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


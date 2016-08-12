/**
 * 08/03
 * 小吴
 * 管理平台的主页，主要功能是 按用户权限展示功能模块的入口
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import ActionPermIdentity from 'material-ui/svg-icons/action/perm-identity';
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';

import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';

import STORE from '../_reducers/main';
import {user_type_act,brand_act} from '../_reducers/dictionary';


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
    title:{
        textAlign: 'center',
        padding:' 2em 0',
        background: '#2196F3',
        color: '#fff',
        textShadow: '3px 2px 3px rgba(0,0,0,.2)'
    }
}

class App extends Component {
    getChildContext() {
        return {
            view:thisView
        };
    }
    go(name){
        thisView.goTo(name+'.js');
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <div style={sty.title}>
                    <h2>{___.app_name}</h2>
                </div>
                <div style={{display:'table',width:'100%'}}>
                    <ModuleCard title={___.cust_manage} icon={<ActionSupervisorAccount style={sty.icon}/>} href='cust_manage' />
                    <ModuleCard title={___.user_manage} icon={<ActionPermIdentity style={sty.icon}/>} href='user_manage' />
                    <ModuleCard title={___.device_manage} icon={<HardwareKeyboard style={sty.icon}/>} href='device_manage' />
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};


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

import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/moduleCard';

import STORE from '../_reducers/main';
import {user_type_act} from '../_reducers/dictionary';

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(user_type_act.get({creator:'>0'},{fields:'id,name,appId,useType,userType'}));
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
                <img src="http://h5.bibibaba.cn/baba/wx/img/shop.jpg"/>
                <ModuleCard title={___.cust_manage} icon={<ActionSupervisorAccount style={sty.icon}/>} href='cust_manage' />
                <ModuleCard title={___.user_manage} icon={<ActionSupervisorAccount style={sty.icon}/>} href='user_manage' />
            </div>
            </ThemeProvider>
        );
    }
}

App.childContextTypes = {
    view: React.PropTypes.object
};


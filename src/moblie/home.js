/**
 * 08/03
 * 小吴
 * 管理平台的主页，主要功能是 按用户权限展示功能模块的入口
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {ThemeProvider} from '../_theme/default';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';

import AreaSelect from '../_component/base/areaSelect';
import SexRadio from '../_component/base/sexRadio';
import ModuleCard from '../_component/base/module_card';

injectTapEventPlugin();
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
                <AreaSelect onChange={(val)=>console.log(val)}/>
                <SexRadio onChange={(val)=>console.log(val)}/>
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



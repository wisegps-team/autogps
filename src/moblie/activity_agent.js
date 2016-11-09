/**
 * 2016-11-01
 * 顶级用户使用的增值业务
 */
"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Wapi from '../_modules/Wapi';
import {ThemeProvider} from '../_theme/default';


import RaisedButton from 'material-ui/RaisedButton';
import AppBar from '../_component/base/appBar';

import UserSearch from '../_component/user_search';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding:'10px'
    },
    w:{
        width:'100%',
        marginTop:'20px'
    }
}

// const p=[
//     //公众号管理         营销统计            注册管理           活动管理            安装网点
//     '792915075680833500|779223776712855600|793341452628398100|793341505392742400|793341563228000300',//'集团营销'
//     '792915075680833500|779223776712855600|793282011149242400',//渠道分销
//     '773357884716224500',//政企业务
//     '791907964700201000',//车主营销
// ];
const r=[
    '795551910793973800',//集团营销权限角色 0
    '795552168802390000',//渠道分销权限角色 1
    '795552269532794900',//政企业务权限角色 2
    '795552341104398300',//车主营销权限角色 3
]


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.setCust = this.setCust.bind(this);
        this.set = this.set.bind(this);
        this._data={
            custTypeId:'1|5|8'
        }
        this.setRole = this.setRole.bind(this);
    }
    
    getChildContext(){
        return{
            'view':thisView
        }
    }

    setCust(val){
        this.data=val;
    }

    setRole(i){
        let cust=this.data;
        if(cust){
            Wapi.role.get(res=>{
                if(res.data.users.includes(cust.uid)){
                    this.custUpdate(cust,i);
                }else
                    Wapi.role.update(r=>this.custUpdate(cust,i),{
                        _objectId:rid,
                        users:'+"'+cust.uid+'"'
                    });
            },{
                objectId:r[i]
            },{
                fields:'objectId,name,users'
            });
        }
    }

    custUpdate(cust,i){
        let VA=(cust.other&&cust.other.va)?cust.other.va.split(','):[];
        if(VA.includes(i.toString())){
            W.alert(___.setting_success);
            return;
        }
        VA.push(i);
        let va=VA.join(',');
        Wapi.customer.update(function(res){
            cust.other=Object.assign({},cust.other,{va});
            W.alert(___.setting_success);
        },{
            _objectId:cust.objectId,
            'other.va':va
        });
    }

    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.activity_agent}/>
                <div style={sty.p}>
                    <UserSearch onChange={this.setCust} data={this._data}/>
                    <RaisedButton label={___.group_marketing} style={sty.w} onClick={e=>this.setRole(0)} />
                    <RaisedButton label={___.distribution} style={sty.w} onClick={e=>this.setRole(1)} />
                    <RaisedButton label={___.enterprises} style={sty.w} onClick={e=>this.setRole(2)} />
                    <RaisedButton label={___.carowner_seller} style={sty.w} onClick={e=>this.setRole(3)} />
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    view:React.PropTypes.object,
}
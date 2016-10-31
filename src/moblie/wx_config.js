import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import FlatButton from 'material-ui/FlatButton';

import Input from '../_component/base/input';
import AppBar from '../_component/base/appBar';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding: '10px'
    },
    wxbox:{'padding':'10px',textAlign:'right'},
    h4:{textAlign:'left'},
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.config_wx}/>
                <div style={sty.p}>
                    <Wxbox/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

class Wxbox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            action:false
        }
        this.fromData={};
        this.config = this.config.bind(this);
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);

    }
    
    change(e,val){
        let name=e.currentTarget.name;
        this.fromData[name]=val;
    }
    save(){
        if(!this.fromData.wxAppKey){
            W.alert(___.appid_null);
            return;
        }
        if(!this.fromData.wxAppSecret){
            W.alert(___.appSecret_null);
            return;
        }
        if(!this.fromData.fileName){
            W.alert(___.wx_file_name_null);
            return;
        }
        let cust={
            _objectId:_user.customer.objectId,
            wxAppKey:this.fromData.wxAppKey,
            wxAppSecret:this.fromData.wxAppSecret
        };
        Wapi.serverApi.saveConfigFile(res=>{
            Wapi.customer.update(res=>{
                if(_user.customer.custTypeId==5)//代理商
                    W.alert({
                        title:___.your_register,
                        text:'http://user.autogps.cn/?location=%2Fwo365_user%2Fregister.html&intent=logout&needOpenId=true&wx_app_id='+cust.wxAppKey
                    });
                this.setState({action:!this.state.action});
            },cust);
        },{
            fileName:this.fromData.fileName
        })
        
    }
    config(){
        history.back();
    }
    render(){
        return (
            <div style={sty.wxbox}>
                <h4 style={sty.h4}>{___.certification}</h4>
                <h4 style={sty.h4}>{___.find_appid}</h4>
                <Input name='wxAppKey' onChange={this.change} hintText={'AppID'}/>
                <Input name='wxAppSecret' onChange={this.change} hintText={'AppSecret'}/>
                <h4 style={sty.h4}>{___.set_url}</h4>
                <h4 style={sty.h4}>{___.input_file_name}</h4>
                <Input name='fileName' onChange={this.change} hintText={___.wx_file_name}/>
                <h4 style={sty.h4}>{___.save_wx_data}</h4>
                <FlatButton label={___.cancel} onClick={this.config} primary={true}/>
                <FlatButton label={___.save} onClick={this.save} primary={true}/>
            </div>
        );
    }
}
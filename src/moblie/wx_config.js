import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Input from '../_component/base/input';
import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});
thisView.addEventListener('show',function(){
    document.title=___.config_wx;
});

const domain=[
    'user.autogps.cn',
    location.hostname
]


const sty={
    p:{
        borderBottom: '1px solid #ccc',
        paddingBottom:'1em'
    },
    pp:{
        padding:'10px'
    },
    wxbox:{'padding':'10px',textAlign:'right'},
    box:{
        display:'flex',
        flexWrap: 'wrap'
    },
    b:{
        flex:'1 0 50%'
    },
    h4:{textAlign:'left'},
    m:{
        marginTop: '10px',
        marginLeft: '10px'
    }
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            show_sonpage:false,
            type:0,
            data:null
        }
        this.showWxBox = this.showWxBox.bind(this);
        this.configSuccess = this.configSuccess.bind(this);
    }
    componentDidMount() {
        Wapi.weixin.list(res=>{
            let data=[res.data.find(e=>e.type==0),res.data.find(e=>e.type==1)];
            this.setState({data});
        },{
            uid:_user.customer.objectId
        },{
            fields:'objectId,uid,name,type,wxAppKey,wxAppSecret'
        });
    }
    

    showWxBox(i){
        let newState={
            show_sonpage:!this.state.show_sonpage,
            type:0
        }
        if(newState.show_sonpage&&i===1){
            //设置类型
            newState.type=1
        }
        this.setState(newState);
    }

    configSuccess(wx){
        //配置成功
        let data=this.state.data.concat();
        if(this.state.type==0){
            data[0]=wx;
            Wapi.customer.update(res=>{
                Wapi.device.update(res=>{//把现有的设备都改serverId
                    _user.customer.wxAppKey=wx.wxAppKey;
                    W.setSetting('user',_user);
                    W.alert(___.setting_success);
                },{
                    _uid:_user.customer.objectId,
                    serverId:_user.customer.objectId
                });
            },{
                _objectId:_user.customer.objectId,
                wxAppKey:wx.wxAppKey,
                wxAppSecret:wx.wxAppSecret
            });
            W.alert(___.wx_config_last);
        }else{
            data[1]=wx;
        }
        this.setState({data});
    }

    getUrl(type){
        let wxAppKey,wxAppSecret;
        if(type<2){//营销号
            if(this.state.data[1]){
                wxAppKey=this.state.data[1].wxAppKey;
                wxAppSecret=this.state.data[1].wxAppSecret;
            }else{
                W.alert(___.wx_seller_null);
                return;
            }
        }else{//服务号
            if(this.state.data[0]){
                wxAppKey=this.state.data[0].wxAppKey;
                wxAppSecret=this.state.data[0].wxAppSecret;
            }else{
                W.alert(___.wx_server_null);
                return;
            }
        }
        let text='';
        switch (type) {
            case 0://兼职营销账号
                text='http://'+domain[1]+'/?loginLocation=src%2Fmoblie%2Fmy_account.html&wx_app_id='+wxAppKey;
                break;
            case 1://兼职的营销管理
                text='http://'+domain[1]+'/?loginLocation=src%2Fmoblie%2FpartTime_count.html&wx_app_id='+wxAppKey;
                break;
            case 2://车主注册
                text='http://'+domain[0]+'/?location=%2Fwo365_user%2Fregister.html&intent=logout&needOpenId=true&wx_app_id='+wxAppKey;
                break;
            case 3://车主账号
                text='http://'+domain[0]+'/?loginLocation=src%2Fmoblie%2Fmy_account&wx_app_id='+wxAppKey;
                break;
            case 4://推荐有礼(未完成)
                text='http://'+domain[0]+'/?loginLocation=src%2Fmoblie%2Fmy_account&wx_app_id='+wxAppKey;
                break;
            case 5://车主主页
                text='http://'+domain[0]+'/?wx_app_id='+wxAppKey;
                break;
            case 6://服务器url
                text='http://'+domain[0]+'/user.autogps.php?wxAppKey='+wxAppKey+'&wxAppSecret='+wxAppSecret;
                W.alert({title:___.do_not_disclose,text});
                return;
            default://车主注册
                text='http://'+domain[0]+'/?location=%2Fwo365_user%2Fregister.html&intent=logout&needOpenId=true&wx_app_id='+wxAppKey;
                break;
        }
        
        W.alert(text);
    }

    goPush(i){
        if(i){//营销号

        }else{//服务号

        }
        W.alert('正在开发');
    }

    render() {
        let name1,name0;
        name1=name0=___.loading;
        if(this.state.data){
            name1=name0=___.unconfig;
            if(this.state.data.length){
                name1=this.state.data[1]?this.state.data[1].name:___.unconfig;
                name0=this.state.data[0]?this.state.data[0].name:___.unconfig;
            }
        }
        return (
            <ThemeProvider>
                <AppBar title={___.config_wx}/>
                <div style={sty.pp}>
                    <div style={sty.p}>
                        <h3>{___.wx_server+"："}
                            <small>{name0}</small>
                            <FlatButton label={___.config} onClick={e=>this.showWxBox(0)} primary={true}/>
                        </h3>
                        <div style={sty.box}>
                            <FlatButton style={sty.b} label={___.your_register} onClick={e=>this.getUrl(2)} primary={true}/>
                            <FlatButton style={sty.b} label={___.my_account_url} onClick={e=>this.getUrl(3)} primary={true}/>
                            {/*<FlatButton style={sty.b} label={___.recommend_url} onClick={e=>this.getUrl(4)} primary={true}/>*/}
                            <FlatButton style={sty.b} label={___.car_server_url} onClick={e=>this.getUrl(5)} primary={true}/>
                            <FlatButton style={sty.b} label={___.wx_server_url} onClick={e=>this.getUrl(6)} primary={true}/>
                        </div>
                        <RaisedButton label={___.wx_push_config} primary={true} style={sty.m} onClick={e=>this.goPush(0)}/>
                    </div>
                    <div style={sty.p}>
                        <h3>{___.wx_seller+"："}
                            <small>{name1}</small>
                            <FlatButton label={___.config} onClick={e=>this.showWxBox(1)} primary={true}/>
                        </h3>
                        <div style={sty.box}>
                            <FlatButton style={sty.b} label={___.my_account_url} onClick={e=>this.getUrl(0)} primary={true}/>
                            <FlatButton style={sty.b} label={___.seller_url} onClick={e=>this.getUrl(1)} primary={true}/>
                        </div>
                        <RaisedButton label={___.wx_push_config} primary={true} style={sty.m} onClick={e=>this.goPush(1)}/>
                    </div>
                </div>
                <SonPage open={this.state.show_sonpage} back={this.showWxBox}>
                    <Wxbox type={this.state.type} onSuccess={this.configSuccess}/>
                </SonPage>
            </ThemeProvider>
        );
    }
}

class Wxbox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
        }
        this.fromData={};
        this.cancel = this.cancel.bind(this);
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);
        

    }
    
    change(e,val){
        let name=e.currentTarget.name;
        this.fromData[name]=val;
    }
    save(){
        let wx=Object.assign({},this.fromData);
        wx.uid=_user.customer.objectId;
        wx.type=this.props.type;
        if(!wx.name){
            W.alert(___.wx_name_null);
            return;
        }
        if(!wx.wxAppKey){
            W.alert(___.appid_null);
            return;
        }
        if(!wx.wxAppSecret){
            W.alert(___.appSecret_null);
            return;
        }
        if(!wx.fileName){
            W.alert(___.wx_file_name_null);
            return;
        }
        
        Wapi.serverApi.saveConfigFile(res=>{
            //检查是否有配置过，有就update
            Wapi.weixin.get(_wx=>{
                if(_wx.data){
                    wx._objectId=_wx.data.objectId;
                    Wapi.weixin.update(res=>{
                        wx.objectId=_wx.data.objectId;
                        delete wx._objectId;
                        this.props.onSuccess(wx);
                        this.cancel();
                    },wx);
                }else
                    Wapi.weixin.add(res=>{
                        wx.objectId=res.objectId;
                        this.props.onSuccess(wx);
                        this.cancel();
                    },wx);
            },{
                uid:wx.uid,
                type:wx.type
            });
        },{
            fileName:this.fromData.fileName
        });
    }
    cancel(){
        history.back();
    }
    render(){
        // let set_url=___.set_url.replace('<%domain%>',domain[this.props.type]);
        let save_wx_data=___.save_wx_data.replace('<%domain%>',domain[this.props.type]);
        return (
            <div style={sty.wxbox}>
                <h4 style={sty.h4}>{___.certification}</h4>
                <Input name='name' onChange={this.change} hintText={___.wx_name}/>
                <p style={sty.h4}>{___.find_appid}</p>
                <Input name='wxAppKey' onChange={this.change} hintText={'AppId'}/>
                <Input name='wxAppSecret' onChange={this.change} hintText={'AppSecret'}/>
                <p style={sty.h4}>{___.input_file_name}</p>
                <Input name='fileName' onChange={this.change} hintText={___.wx_file_name}/>
                <p style={sty.h4}>{save_wx_data}</p>
                <FlatButton label={___.cancel} onClick={this.cancel} primary={true}/>
                <FlatButton label={___.save} onClick={this.save} primary={true}/>
            </div>
        );
    }
}
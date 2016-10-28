import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import Input from '../_component/base/input';
import AreaSelect from '../_component/base/areaSelect';
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
        this.state={
            edit:false
        }
        this.edit = this.edit.bind(this);
        this.back = this.back.bind(this);
    }
    
    edit(){
        this.setState({edit:true});
    }
    back(){
        this.setState({edit:false});
    }
    render() {
        let box=this.state.edit?(<EditBox back={this.back}/>):(<ShowBox edit={this.edit}/>);
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.company_info}/>
                <div style={sty.p}>
                    {box}
                    <Wxbox/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


class ShowBox extends Component{
    render() {
        let cust=_user.customer;
        let button=(cust.uid==_user.uid)?(<FlatButton label={___.edit} onClick={this.props.edit} primary={true} />):null;
        return (
            <Paper zDepth={1} style={sty.p}>
                <h2>{cust.name}</h2>
                <p>{___.cust_type+'：'+cust.custType}</p>
                <p>{___.person+'：'+cust.contact}</p>
                <p>{___.cellphone+'：'+cust.tel}</p>
                <address>{___.address+'：'+(cust.province||'')+(cust.city||'')+(cust.area||'')+(cust.address||'')}</address>
                <div style={{textAlign:'right',marginTop:'15px'}}>
                    {button}
                </div>
            </Paper>
        );
    }
}


class EditBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.fromData={};
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);
    }

    change(e,val){
        if(e.currentTarget){
            let name=e.currentTarget.name;
            this.fromData[name]=val;
        }else
            this.fromData['area']=e;
    }

    save(){
        let data=Object.assign({},this.fromData);
        Object.assign(data,this.fromData.area);
        data._uid=_user.uid;
        let that=this;
        Wapi.customer.update(function(res){
            delete data._uid;
            Object.assign(_user.customer,data);
            W.setSetting('user',_user);
            that.props.back();
        },data);
    }

    render() {
        let cust=_user.customer;
        let area={
            province:cust.province,
            provinceId:cust.provinceId,
            city:cust.city,
            cityId:cust.cityId,
            area:cust.area,
            areaId:cust.areaId
        }
        return (
            <Paper zDepth={1} style={sty.p}>
                <Input value={cust.name} name='name' onChange={this.change} hintText={___.name}/>
                <p>{___.cust_type+'：'+cust.custType}</p>
                <Input value={cust.contact} name='contact' onChange={this.change} hintText={___.person}/>
                <Input value={cust.tel} name='tel' onChange={this.change} hintText={___.cellphone}/>                
                <AreaSelect onChange={this.change} value={area}/>
                <Input value={cust.address} name='address' onChange={this.change} hintText={___.address}/>                                
                <div style={{textAlign:'right',marginTop:'15px'}}>
                    <FlatButton label={___.cancel} onClick={this.props.back} default={true} />                
                    <FlatButton label={___.save} onClick={this.save} primary={true} />
                </div>
            </Paper>
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
        let cust={_objectId:_user.customer.objectId};
        Object.assign(cust,this.fromData);
        Wapi.customer.update(res=>{
            if(_user.customer.custTypeId==8)//经销商
                W.alert({
                    title:___.your_register,
                    text:'http://w.wo365.net/?location=%2Fwo365_user%2Fregister.html&intent=logout&needOpenId=true&wx_app_id='+cust.wxAppKey
                });
            this.setState({action:!this.state.action});
        },cust);
    }
    config(){
        setTimeout(e=>this.setState({action:!this.state.action}),300);
    }
    render(){
        let show=[];
        if(!this.state.action)
            show.push(<FlatButton label={___.config_wx} onClick={this.config} primary={true} key='b'/>);
        else
            show=[
                <h4 style={sty.h4} key='h4'>{___.find_appid}</h4>,
                <Input name='wxAppKey' onChange={this.change} hintText={'AppID'} key='0'/>,
                <Input name='wxAppSecret' onChange={this.change} hintText={'AppSecret'} key='1'/>,
                <FlatButton label={___.cancel} onClick={this.config} primary={true}  key='2'/>,
                <FlatButton label={___.save} onClick={this.save} primary={true}  key='3'/>,
            ];
        return (
            <div style={sty.wxbox}>
                {show}
            </div>
        );
    }
}
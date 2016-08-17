"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import STORE from '../_reducers/main';
import {brand_act} from '../_reducers/dictionary';
import BrandSelect from'../_component/base/brandSelect';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view


W.native={
    scanner:{
        start:function(callback){
            setTimeout(function(){
                callback('123456');
            },100);
        }
    }
}
let isWxSdk=true;
// let isWxSdk=false;
// W.include(WiStorm.root+'/wslib/toolkit/WxSdk.js',function(){},function(){alert('can not scan')});
// window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});

thisView.addEventListener('load',function(){
    ReactDOM.render(
        <AppDeviceManage/>,thisView
    );
});

//加载各种字典数据,权限啊等等
function loadDictionary(){
    STORE.dispatch(brand_act.get({uid:_user.customer.uid}));
}
loadDictionary();


const _brand_list=[{
    id:'ID1',
    company_id:'012-ID1', 
    brand_name:'沃管车'
}];
const _product=[{
    id:'ID1',
    brand_id:'014-ID1',
    type:'W13智能终端'
}];
const _custs=[{
    uid:1,
    name:'lalala',
    provinceId:1,
    cityId:1,
    areaId:1,
    tel:1,
    treePath:1,
    parentId:1,
    dealer_id:1
}];

const styles = {
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    device_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
};


class AppDeviceManage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            intent:'',
            data:[],
        }
        this.deviceIn=this.deviceIn.bind(this);
        this.deviceOut=this.deviceOut.bind(this);
        this.toList=this.toList.bind(this);
    }

    componentDidMount(){
        this.setState({intent:_g.intent||'out'});
        console.log(_g.intent);
    }

    deviceIn(){
        console.log('device in');
        window.location='device_in.html';
        // this.setState({intent:'in'});
    }

    deviceOut(){
        console.log('device out');
        window.location='device_out.html';
        // this.setState({intent:'out'});
    }

    toList(){
        history.go(-1);
    }

    render(){
        console.log(this.state.intent)
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}} 
                        iconStyleLeft={{display:'none'}}
                    />
                    <div id='deviceIn' style={this.state.intent=='in'?styles.show:styles.hide}>
                        <DeviceIn toList={this.toList}/>
                    </div>
                    <div id='deviceOut' style={this.state.intent=='out'?styles.show:styles.hide}>
                        <DeviceOut toList={this.toList}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

class DeviceIn extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            brand:'',
            type:'',
            device_ids:[],
        }
        this.data={}
        this.brandChange=this.brandChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        this.setState({
            brand:'ID1',
            type:'ID1',
        });
    }
    brandChange(value){
        console.log(value)
        this.setState({brand:value});
    }
    typeChange(e,value){
        this.setState({type:value});
    }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){
                let arr=_this.state.device_ids;
                arr[arr.length]=res;
                _this.setState({device_ids:arr});
            });
        }
    }
    submit(){
        let ids=this.state.device_ids;
        console.log(ids);
        if(ids.length==0){
            this.props.toList();
            return;
        }
        this.props.toList();
        // let data={
        //     uid:_user.cust.uid,
        //     did:this.state.device_ids,
        //     type:1
        // }
        // let _this=this;
        // Wapi.deviceLog.add(function(res){//给当前用户的日志中添加入库信息
        //     _this.setState({
        //         brand:'',
        //         type:'',
        //         device_ids:[],
        //     })
        //     _this.props.toList();
        // },data);
        
        // for(let i=ids.length-1;i>=0;i--){
        //     Wapi.iotDevice.update(function(res){},{//给每台设备更新uid
        //         did:ids[i],
        //         uid:_user.uid
        //     });
        // }
    }
    cancel(){
        this.setState({
            brand:'ID1',
            type:'ID1',
            device_ids:[]
        });
        this.props.toList();
    }
    render(){
        return(
            <div style={styles.input_page}>
                <h3>{___.device_in}</h3>
                <div style={{width:'80%',marginLeft:'10%',textAlign:'left'}}>
                    <h4>{___.device_type}:</h4>
                    <BrandSelect onChange={this.brandChange}/>
                </div>
                <ScanGroup device_ids={this.state.device_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}

class DeviceOut extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            custs:[],
            cust_id:0,
            device_ids:[]
        }
        this.custChange=this.custChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        this.setState({
            custs:_custs,
            cust_id:0,
        })
    }
    custChange(){}
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){
                let arr=_this.state.device_ids;
                arr[arr.length]=res;
                _this.setState({device_ids:arr});
            });
        }
    }
    submit(){
        let ids=this.state.device_ids;
        console.log(ids);
        if(ids.length==0){
            this.props.toList();
            return;
        }
        this.props.toList();
        let _this=this;

        // let parData={
        //     uid:_user.cust.uid,
        //     did:this.state.device_ids,
        //     type:0
        // }
        // Wapi.deviceLog.add(function(res){//给当前用户的日志中添加出库信息
        //     _this.setState({
        //         custs:[],
        //         cust_id:0,
        //         device_ids:[]
        //     });
        // },parData);

        // let chiData={
        //     uid:this.state.cust_id,
        //     did:this.state.device_ids,
        //     type:0
        // }
        // Wapi.deviceLog.add(function(res){//给客户的日志中添加入库信息
        //     _this.setState({
        //         custs:[],
        //         cust_id:0,
        //         device_ids:[]
        //     });
        //     _this.props.toList();
        // },chiData);

        // for(let i=ids.length-1;i>=0;i--){
        //     Wapi.iotDevice.update(function(res){},{//更新所有设备的uid
        //         did:ids[i],
        //         uid:this.state.cust_id
        //     });
        // }
    }
    cancel(){
        this.setState({
            custs:_custs,
            cust_id:0,
            device_ids:[]
        });
        this.props.toList();
    }
    render(){
        let custs=this.state.custs.map(ele=><MenuItem value={ele.uid} key={ele.uid} primaryText={ele.name}/>);
        return(
            <div style={styles.input_page}>
                <h3>{___.device_out}</h3>
                <div>
                    <span>{___.cust}</span>
                    <SelectField value={this.state.custArr} onChange={this.custChange}>
                        {custs}
                    </SelectField>
                </div>
                <ScanGroup device_ids={this.state.device_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}


class ScanGroup extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let deviceItems=[];
        let device_ids=this.props.device_ids;
        let len=device_ids.length;
        for(let i=0;i<len;i++){
            deviceItems.push(
                <div key={i} style={styles.ids_box}>
                    {___.device_id} <span style={styles.device_id}>{device_ids[i]}</span>
                </div>
            )
        }
        return(
            <div>
                {deviceItems}
                <div style={styles.ids_box}><a onClick={this.props.addId} style={styles.scan_input}>{___.scan_input}</a></div>
                <RaisedButton onClick={this.props.cancel} label={___.cancel} primary={true} style={styles.btn_cancel}/>
                <RaisedButton onClick={this.props.submit} label={___.submit} primary={true}/>
            </div>
        )
    }
}

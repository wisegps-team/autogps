"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';
import DeviceLogList from '../_component/device_list';
import ProductLogList from '../_component/productlog_list';
import {reCode} from '../_modules/tool';
import UserSearch from '../_component/user_search';


const styles = {
    main:{paddingBottom:'20px'},
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    a:{width:'100%'},
    box:{position:'relative',paddingBottom:'60px',marginTop:'20px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em',marginBottom:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    w:{width:'100%',borderCollapse:'collapse'},
    to:{horizontal: 'right', vertical: 'top'},
    c:{color:'#fff'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'},
    deviceNum:{color:'#009688',position: 'absolute',right:'10px',top:'15px'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view
var curView=thisView;

var pushPage=thisView.prefetch('#push',3);
pushPage.setTitle(___.push);

var popPage=thisView.prefetch('#pop',3);
popPage.setTitle(___.pop);

var returnPage=thisView.prefetch('#return',3);
returnPage.setTitle(___.device_return);

var didsPage=thisView.prefetch('#didList',3);

thisView.setTitle(___.device_manage);
thisView.addEventListener('load',function(){
    ReactDOM.render(<AppDeviceManage/>,thisView);

    ReactDOM.render(<DeviceIn/>,pushPage);

    ReactDOM.render(<DeviceOut/>,popPage);

    ReactDOM.render(<DeviceReturn/>,returnPage);

    ReactDOM.render(<DidList/>,didsPage);
});

// 测试用
// let testNum=[500,501,502,201,202,500];
// let time=0;
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback(testNum[time].toString());
//                 time++;
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

// 正式用
let isWxSdk=false;
if(W.native)isWxSdk=true;
else
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});

let _canTouch=true;

class AppDeviceManage extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            intent:'list',
            data:[],
        }
        this.deviceIn=this.deviceIn.bind(this);
        this.deviceOut=this.deviceOut.bind(this);
        this.toList=this.toList.bind(this);
    }

    componentDidMount(){
    }

    deviceIn(){
        if(!_canTouch)return;
        _canTouch=false;
        setTimeout(function() {
            _canTouch=true;
        }, 400);
        curView=pushPage;
        thisView.goTo('#push');
    }

    deviceOut(){
        if(!_canTouch)return;
        _canTouch=false;
        setTimeout(function() {
            _canTouch=true;
        }, 400);
        curView=popPage;
        thisView.goTo('#pop');
    }

    deviceReturn(){
        if(!_canTouch)return;
        _canTouch=false;
        setTimeout(function() {
            _canTouch=true;
        }, 400);
        curView=returnPage;
        thisView.goTo('#return');
    }

    toList(){
        this.refs.list.getProduct();
        this.setState({intent:'list'});
    }

    render(){
        return(
            <ThemeProvider>
                <div>
                    <div name='list' style={styles.main}>
                        <ProductLogList 
                            ref={'list'} 
                            thisView={thisView} 
                            deviceIn={this.deviceIn}
                            deviceOut={this.deviceOut}
                            deviceReturn={this.deviceReturn}
                        />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

class ItemDevice extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let data=this.props.data;
        return(
            <div>
                <table>
                    <thead>
                        {data.type}
                    </thead>
                    <tbody style={{color:'#999999',fontSize:'0.8em'}}>
                        <tr>
                            <td style={{width:'33vw'}}>{___.inNet_num+data.inNet}</td>
                            <td style={{width:'33vw'}}>{___.register_num+data.register}</td>
                            <td style={{width:'33vw'}}>{___.onLine_num+data.onLine}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

class DeviceIn extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            brand:'',
            model:'',
            brandId:'',
            modelId:'',
            product_ids:[],
        }
        this.data={};
        this.showDids=false;

        this.init=this.init.bind(this);
        this.brandChange=this.brandChange.bind(this);
        this.addId=this.addId.bind(this);
        this.deleteId=this.deleteId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
        this.toDidList=this.toDidList.bind(this);
        this.showDidsBack=this.showDidsBack.bind(this);
    }
    componentDidMount() {
        pushPage.addEventListener('show',e=>{
            console.log('show device in');
            this.init();
        });
    }
    init(){
        this.refs.user.receiveUser(_user.customer);
        this.data={};
        this.showDids=false;

        this.state={
            brand:'',
            model:'',
            brandId:'',
            modelId:'',
            product_ids:[],
        }
    }
    brandChange(value){
        this.setState({
            brand:value.brand,
            brandId:value.brandId,
            model:value.product,
            modelId:value.productId
        });
    }
    addId(){
        let _this=this;
        let ids=_this.state.product_ids;
        if(!this.state.modelId){
            W.alert('请先选择品牌型号');
            return;
        }
        function getCode(res){//扫码，did添加到当前用户
            res=reCode(res);
            if(ids.includes(res)){//队列中已有此编号
                W.alert(___.device_repeat);
                return;
            }
            Wapi.device.get(re=>{//检查设备是否存在
                if(!re.data){//如果不存在，则完善设备信息（uid设为'0'），并将设备号存入state
                    let params={
                        did:res,
                        uid:'0',
                        
                        status: 0,
                        commType: 'GPRS',
                        commSign: '',
                        model: _this.state.model,
                        modelId: _this.state.modelId,
                        binded: false,
                    };
                    Wapi.device.add(function(res_device){
                        //添加设备信息完成,（此时设备uid均为'0')
                    },params);

                    ids[ids.length]=res;
                    _this.setState({product_ids:ids});
                    if(isWxSdk){
                        W.native.scanner.start(getCode);
                    }else{
                        W.alert(___.please_wait);
                    }
                }else if(re.data && re.data.uid=='0'){// data存在且设备不属于其他用户，将设备号存入state
                    let ids=_this.state.product_ids;
                    ids[ids.length]=res;
                    _this.setState({product_ids:ids});
                    if(isWxSdk){
                        W.native.scanner.start(getCode);
                    }else{
                        W.alert(___.please_wait);
                    }
                }else if(re.data && re.data.uid==_user.customer.objectId){// data存在且设备已属于当前用户，弹出警告，不存入state
                    W.alert(___.device_repeat_own);
                    return;
                }else if(re.data && re.data.uid!=_user.customer.objectId){// data存在且设备已属于其他用户，弹出警告，不存入state
                    W.alert(___.deivce_other_own);
                    return;
                }
                return;
            },{did:res});
        }
        if(isWxSdk){
            W.native.scanner.start(getCode);
        }else{
            W.alert(___.please_wait);
        }
    }
    deleteId(){
        let _this=this;
        let ids=_this.state.product_ids;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                res=reCode(res);
                if(ids.includes(res)){//队列中已有此编号
                    ids.splice(ids.indexOf(res),1);
                    _this.setState({product_ids:ids})
                }
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            product_ids:[]
        });
        history.back();
    }
    submit(){
        let ids=this.state.product_ids;
        if(ids.length==0){
            history.back();
            return;
        }else{
            W.loading(true,___.ining);
            let that=this;
            Wapi.device.update(res_device=>{//把设备的uid改为当前用户id
                let pushLog={
                    uid:_user.customer.objectId,
                    did:ids,
                    type:1,
                    from:'0',
                    to:_user.customer.objectId,
                    fromName:'0',
                    toName:_user.customer.name,
                    brand:this.state.brand,
                    brandId:this.state.brandId,
                    model:this.state.model,
                    modelId:this.state.modelId,
                    inCount:ids.length,
                    outCount:0,
                    status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                };
                Wapi.deviceLog.add(function(res){
                    pushLog.objectId=res.objectId;
                    W.emit(window,'device_log_add',pushLog);
                    W.loading();
                    that.cancel();
                },pushLog);
            },{
                _did:ids.join('|'),
                uid:_user.customer.objectId
            });
        }
    }
    toDidList(){
        this.showDids=true;
        this.forceUpdate();
    }
    showDidsBack(){
        this.showDids=false;
        this.forceUpdate();
    }
    render(){
        let len=this.state.product_ids.length;
        return(
            <ThemeProvider>
            <div style={styles.input_page}>
                <div style={{width:'100%',textAlign:'left'}}>
                    <UserSearch ref='user' data={emptyUser()}/>
                    <div style={{position: 'relative'}}>
                        <BrandSelect onChange={this.brandChange} style={{width: '80%'}}/>
                        <span onClick={this.toDidList} style={styles.deviceNum}>{len}</span>
                    </div>
                </div>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} deleteId={this.deleteId} cancel={this.cancel} submit={this.submit} />
                <SonPage open={this.showDids} back={this.showDidsBack}>
                    <DidList data={this.state.product_ids} show={this.showDids}/>
                </SonPage>
            </div>
            </ThemeProvider>
        )
    }
}

class DeviceOut extends Component{
    constructor(props,context){
        super(props,context);

        this.userData={parentId:_user.customer.objectId};
        this.product = null;
        this.showDids=false;
        
        this.state={
            cust_id:0,
            cust_name:'',
            product_ids:[],
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            wxAppKey:null
        }

        this.init=this.init.bind(this);
        this.custChange=this.custChange.bind(this);
        this.brandChange=this.brandChange.bind(this);
        this.addId=this.addId.bind(this);
        this.deleteId = this.deleteId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
        this.save=this.save.bind(this);
        this.toDidList=this.toDidList.bind(this);
        this.showDidsBack=this.showDidsBack.bind(this);
        
    }
    componentDidMount() {
        popPage.addEventListener('show',e=>{
            console.log('show pop page');
            this.init();
        })
    }
    init(){
        this.refs.user.clear();
        this.product=emptyProduct();
        this.showDids=false;
        
        this.setState({
            cust_id:0,
            cust_name:'',
            product_ids:[],
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            wxAppKey:null
        });
    }
    custChange(cust){
        this.setState({
            cust_id:cust.objectId,
            cust_name:cust.name,
            wxAppKey:cust.wxAppKey
        });
    }
    brandChange(value){
    }
    addId(){
        let _this=this;
        let ids=_this.state.product_ids;
        function get(res){//扫码，did添加到所选用户
            res=reCode(res);
            if(ids.includes(res)){//队列中已有此编号
                W.alert(___.device_repeat);
                return;
            }
            Wapi.device.get((dev) => {
                if(!dev.data){//无效设备
                    W.alert(___.device_invalid);
                    return;
                }
                if(dev.data.uid != _user.customer.objectId){//此设备不属于当前用户
                    W.alert(___.device_others);
                    return;
                }
                if(ids.length != 0){
                    if(dev.data.modelId != _this.product.objectId){//设备型号与之前不同
                        W.alert(___.device_type_err.replace('type',(_this.product.brand + _this.product.name)));
                        return;
                    }
                    ids=ids.concat(res);
                    _this.setState({product_ids:ids});
                    if(isWxSdk){
                        W.native.scanner.start(get);
                    }else{
                        W.alert(___.please_wait);
                    }
                }else{
                    Wapi.product.get((pro)=>{
                        _this.product = pro.data;
                        ids=ids.concat(res);
                        _this.setState({product_ids:ids});
                        if(isWxSdk){
                            W.native.scanner.start(get);
                        }else{
                            W.alert(___.please_wait);
                        }
                    },{objectId: dev.data.modelId})
                }
            },{did:res})
            
        }
        if(isWxSdk){
            W.native.scanner.start(get);
        }else{
            W.alert(___.please_wait);
        }
    }
    deleteId(){
        let _this=this;
        let ids=_this.state.product_ids;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                res=reCode(res);
                if(ids.includes(res)){//队列中已有此编号
                    ids.splice(ids.indexOf(res),1);
                    if(ids.length==0){
                        _this.product=emptyProduct();
                    }
                    _this.setState({product_ids:ids})
                }else{
                    W.alert(___.num_not_in);
                }
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
            product_ids:[]
        });
        history.back();
    }
    submit(){
        let ids=this.state.product_ids;
        if(ids.length==0){
            history.back();
            return;
        }

        if(!this.state.cust_id){
            W.alert(___.customer_null);
            return;
        }
        let dids=ids.join('|');
        let _this=this;
        W.loading(true,___.outing);

        //检查设备id
        Wapi.deviceLog.list(function(log){//检查是否有已经被出库的设备
            if(log.data&&log.data.length){
                let logs=log.data;
                logs.forEach(l=>{
                    ids=ids.filter(id=>!l.did.includes(id));
                });
                _this.setState({product_ids:ids});
                W.loading();
                W.alert(___.device_repeat_out);
                return;
            }
            Wapi.device.list(function(devs){//检查是否都是当前用户的设备
                if(!devs.data||devs.data.length!=ids.length){//都不是你的设备
                    let devices=devs.data;
                    ids=devices.map(d=>d.did);
                    _this.setState({product_ids:ids});
                    W.loading();
                    W.alert(___.deivce_not_own);
                    return;
                }
                let dev=devs.data[0];
                let MODEL={
                        brand:_this.product.brand,
                        brandId:_this.product.brandId,
                        model:_this.product.name,
                        modelId:_this.product.objectId,
                    };
                _this.save(ids,MODEL);
            },{
                did:dids,
                uid:_user.customer.objectId,
            },{limit:-1});
        },{
            did:dids,
            uid:_user.customer.objectId,
            type:0
        },{limit:-1});
    }
    save(ids,MODEL){//真正执行出库
        W.loading();
        let _this=this;
        let text=___.check_out_ok.replace('%d',ids.length.toString());
        let device={
            _did:ids.join('|'),
            uid:this.state.cust_id,
        }
        if(this.state.wxAppKey)device.serverId=device.uid
        W.alert(text,()=>{
            W.loading(true,___.outing);
            Wapi.device.update(function(res_device){//把设备的uid改为分配到的客户的id
                let popLog={//出库
                    uid:_user.customer.objectId,
                    did:ids,
                    type:0,
                    from:_user.customer.objectId,
                    fromName:_user.customer.name,
                    to:_this.state.cust_id,
                    toName:_this.state.cust_name,
                    inCount:0,
                    outCount:ids.length,
                    status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                };
                let pushLog={//下级的入库
                    uid:_this.state.cust_id,
                    did:ids,
                    type:1,
                    from:_user.customer.objectId,
                    fromName:_user.customer.name,
                    to:_this.state.cust_id,
                    toName:_this.state.cust_name,
                    inCount:ids.length,
                    outCount:0,
                    status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
                };
                Object.assign(popLog,MODEL);
                Object.assign(pushLog,MODEL);
                Wapi.deviceLog.add(function(res){//给上一级添加出库信息
                    Wapi.deviceLog.add(function(res_log){//给下一级添加入库信息
                        popLog.objectId=res.objectId;
                        W.emit(window,'device_log_add',popLog);
                        W.loading();
                        W.alert(___.out_success,_this.cancel);
                    },pushLog);
                },popLog);
            },device);
        });
    }
    toDidList(){
        this.showDids=true;
        this.forceUpdate();
    }
    showDidsBack(){
        this.showDids=false;
        this.forceUpdate();
    }
    render(){
        let len = this.state.product_ids.length;
        return(
            <ThemeProvider>
            <div style={styles.input_page}>
                <UserSearch ref='user' onChange={this.custChange} data={{parentId:_user.customer.objectId}}/>
                <div style={{width:'100%',textAlign:'left'}}>
                    <div style={{position: 'relative'}}>
                        <BrandSelect product={this.product} onChange={this.brandChange} style={{width: '80%'}}/>
                        <span onClick={this.toDidList} style={styles.deviceNum}>{len}</span>
                    </div>
                </div>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} deleteId={this.deleteId} cancel={this.cancel} submit={this.submit} />
                <SonPage open={this.showDids} back={this.showDidsBack}>
                    <DidList data={this.state.product_ids} show={this.showDids}/>
                </SonPage>
            </div>
            </ThemeProvider>
        )
    }
}

class DeviceReturn extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            product_ids:[]
        }
        this.product = null;
        this.showDids=false;
        
        this.inLog={};
        this.outLog={};

        this.init=this.init.bind(this);
        this.custChange=this.custChange.bind(this);
        this.brandChange=this.brandChange.bind(this);
        this.addId=this.addId.bind(this);
        this.deleteId = this.deleteId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
        this.toDidList=this.toDidList.bind(this);
        this.showDidsBack=this.showDidsBack.bind(this);
        
    }
    componentDidMount() {
        returnPage.addEventListener('show',e=>{
            console.log('show return page');
            this.init();
        })
    }
    init(){
        this.product = emptyProduct();
        this.showDids=false;
        
        this.refs.user.clear();

        this.inLog={};
        this.outLog={};
        
        this.setState({
            product_ids:[]
        });
    }
    componentDidUpdate(prevProps, prevState) {
    }
    
    custChange(cust){}
    brandChange(value){}

    addId(){
        let _this=this;
        let ids=_this.state.product_ids;
        function get(res){//扫码，did添加到所选用户
            res=reCode(res);
            if(ids.includes(res)){//队列中已有此编号
                W.alert(___.device_repeat);
                return;
            }
            Wapi.device.get((dev) => {
                if(!dev.data){//无效设备
                    W.alert(___.device_invalid);
                    return;
                }
                if(dev.data.uid != _user.customer.objectId){//不属于当前用户
                    W.alert(___.device_others);
                    return;
                }

                if(ids.length != 0){
                    if(dev.data.modelId != _this.product.objectId){//设备型号不同
                        W.alert(___.device_type_err.replace('type',(_this.product.brand + _this.product.name)));
                        return;
                    }
                    if(!_this.inLog.did.includes(res)){//设备不是同一批
                        W.alert(___.device_not_batch);
                        return;
                    }
                    ids=ids.concat(res);
                    _this.setState({product_ids:ids});
                }else{
                    Wapi.deviceLog.list(logs=>{
                        if(!logs.data){
                            W.alert(___.device_no_log);
                            return;
                        }
                        let inLog=logs.data.find(ele=>ele.type==1);
                        let outLog=logs.data.find(ele=>ele.type==0);
                        _this.inLog=inLog;
                        _this.outLog=outLog;
                        _this.product={
                            brand:inLog.brand,
                            brandId:inLog.brandId,
                            name:inLog.model,
                            objectId:inLog.modelId
                        };
                        _this.refs.user.receiveUser({
                            objectId:inLog.from,
                            name:inLog.fromName
                        });
                        ids=ids.concat(res);
                        _this.setState({product_ids:ids});
                    },{
                        did:res,
                        to:_user.customer.objectId
                    });
                }

            },{did:res})
            
        }
        if(isWxSdk){
            W.native.scanner.start(get);
        }else{
            W.alert(___.please_wait);
        }
    }
    deleteId(){
        let _this=this;
        let ids=_this.state.product_ids;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                res=reCode(res);
                if(ids.includes(res)){//队列中已有此编号
                    ids.splice(ids.indexOf(res),1);
                    if(ids.length==0){
                        _this.product=emptyProduct();
                        _this.refs.user.clear();
                    }
                    _this.setState({product_ids:ids})
                }else{//队列中没有此编号
                    W.alert(___.num_not_in);
                    return;
                }
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        history.back();
    }
    submit(){
        let ids=this.state.product_ids;
        if(ids.length==0){
            history.back();
            return;
        }

        let newDid=this.inLog.did.filter(ele=>!ids.includes(ele));
        let newCount=this.inLog.did.length-ids.length;
        W.loading(true);
        let flag=0;
        
        Wapi.device.update(res=>{//更改设备归属
            checkSuccess(++flag);
        },{
            _did:ids.join('|'),
            uid:this.inLog.from
        });
        
        if(newCount==0){
            Wapi.deviceLog.delete(res=>{//删除设备来源的出库记录
                checkSuccess(++flag);
            },{
                objectId:this.outLog.objectId,
            });
            
            Wapi.deviceLog.delete(res=>{//删除当前用户的入库记录
                checkSuccess(++flag);
            },{
                objectId:this.inLog.objectId,
            });
        }else{
            Wapi.deviceLog.update(res=>{//更改设备来源的出库记录
                checkSuccess(++flag);
            },{
                _objectId:this.outLog.objectId,
                did:newDid,
                outCount:newCount
            });
            
            Wapi.deviceLog.update(res=>{//更改当前用户的入库记录
                checkSuccess(++flag);
            },{
                _objectId:this.inLog.objectId,
                did:newDid,
                inCount:newCount
            });
        }
        
        let _this=this;
        function checkSuccess(flag){
            if(flag!=3)return;
            W.loading();
            _this.cancel();
        }
    }

    toDidList(){
        this.showDids=true;
        this.forceUpdate();
    }
    showDidsBack(){
        this.showDids=false;
        this.forceUpdate();
    }
    render(){
        let len = this.state.product_ids.length;
        return(
            <ThemeProvider>
            <div style={styles.input_page}>
                <UserSearch ref='user' data={emptyUser()}/>
                <div style={{width:'100%',textAlign:'left'}}>
                    <div style={{position: 'relative'}}>
                        <BrandSelect product={this.product} onChange={this.brandChange} style={{width: '80%'}}/>
                        <span onClick={this.toDidList} style={styles.deviceNum}>{len}</span>
                    </div>
                </div>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} deleteId={this.deleteId} cancel={this.cancel} submit={this.submit} />
                <SonPage open={this.showDids} back={this.showDidsBack}>
                    <DidList data={this.state.product_ids} show={this.showDids}/>
                </SonPage>
            </div>
            </ThemeProvider>
        )
    }
}


class ScanGroup extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={styles.box}>
                <div style={styles.a}>
                    <div style={{overflow:'hidden'}}>
                        <RaisedButton onClick={this.props.deleteId} label="扫码减少" primary={true} style={{float:'left',width:'45%'}}/>
                        <RaisedButton onClick={this.props.addId} label="扫码增加" primary={true} style={{float:'right',width: '45%'}}/>
                    </div>
                    <div style={{marginTop:'20px'}}>
                        <RaisedButton onClick={this.props.submit} label={___.ok} secondary={true} fullWidth={true}/>
                    </div>
                </div>
            </div>
        )
    }
}

class DidList extends Component {
    constructor(props,context){
        super(props,context);
        this.dids=[];
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.show){
            this.dids=nextProps.data;
            this.forceUpdate();
        }
    }
    
    render() {
        let items=this.dids.map((ele,i)=><p key={i}>{ele}</p>);
        return (
            <div>
                <div style={{position:'fixed',left:'1em',top:'1em'}}>IMEI:</div>
                {items}
            </div>
        );
    }
}

function emptyProduct(){
    return{
        brand:'',
        brandId:1,
        name:'',
        objectId:1
    }
}

function emptyUser(){
    return{
        // objectId:'',
        // name:''
    }
}
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

//测试用
// let testNum=10;
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback(testNum.toString());
//                 testNum++;
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

let isWxSdk=false;
if(W.native)isWxSdk=true;
else
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});

thisView.addEventListener('load',function(){
    ReactDOM.render(
        <AppDeviceManage/>,thisView);
});

const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em',marginBottom:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    w:{width:'100%'},
};

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
        Wapi.deviceTotal.list(res=>{
            if(res.data.length>0)
                this.setState({devices:res.data});
        },{uid:_user.customer.objectId});
    }

    deviceIn(){
        history.replaceState('home','home','home.html');
        this.setState({intent:'in'});
    }

    deviceOut(){
        history.replaceState('home','home','home.html');
        this.setState({intent:'out'});
    }

    toList(){
        this.refs.list.getProduct();
        this.setState({intent:'list'});
    }

    render(){
        let isBrandSeller=false;
        if(_user.customer.custTypeId==0||_user.customer.custTypeId==1)isBrandSeller=true;
        let items=this.state.data.map((ele,i)=><ListItem key={i}  style={styles.MenuItem} children={<ItemDevice key={i} data={ele}/>}/>);
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}} 
                        iconElementRight={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                <MenuItem style={isBrandSeller?{}:{display:'none'}} primaryText={___.push} onTouchTap={this.deviceIn}/>
                                <MenuItem primaryText={___.pop} onTouchTap={this.deviceOut}/>
                            </IconMenu>
                        }
                    />
                    <div name='list' style={styles.main}>
                        <ProductLogList ref={'list'} isBrandSeller={isBrandSeller}/>
                    </div>

                    <SonPage title={___.push} open={this.state.intent=='in'} back={this.toList}>
                        <DeviceIn toList={this.toList}/>
                    </SonPage>
                    <SonPage title={___.pop} open={this.state.intent=='out'} back={this.toList}>
                        <DeviceOut toList={this.toList}/>
                    </SonPage>
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
            // brands:[],
            // types:[],
            brand:'',
            model:'',
            brandId:'',
            modelId:'',
            product_ids:[],
        }
        this.data={}
        this.brandChange=this.brandChange.bind(this);
        // this.typeChange=this.typeChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        this.setState({
            // brands:[],
            // types:[],
            brand:'',
            model:'',
        });
    }
    brandChange(value){
        this.setState({
            brand:value.brand,
            brandId:value.brandId,
            model:value.product,
            modelId:value.productId
        });
    }
    // typeChange(e,value){
    //     this.setState({model:value});
    // }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                res=reCode(res);
                let arr=_this.state.product_ids;
                arr[arr.length]=res;
                _this.setState({product_ids:arr});
                
                let params={
                    did:res,
                    uid:_user.customer.objectId,
                    
                    status: 0,
                    commType: 'GPRS',
                    commSign: '',
                    model: _this.state.model,
                    modelId: _this.state.modelId,
                    binded: false,
                };
                Wapi.device.add(function(res_device){
                    //添加设备信息完成
                },params);
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            // brands:[],
            // types:[],
            brand:'',
            model:'',
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
            },pushLog);

            this.cancel();
        }
    }

    render(){
        console.log('render device in');
        // let brands=this.state.brands.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.brand_name}/>);
        // let types=this.state.types.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.type}/>);
        return(
            <div style={styles.input_page}>
                <h3>{___.device_in}</h3>
                <div style={{width:'80%',marginLeft:'10%',textAlign:'left'}}>
                    <h4>{___.device_type}:</h4>
                    <BrandSelect onChange={this.brandChange}/>
                </div>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}

class DeviceOut extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            // custs:[],
            cust_id:0,
            cust_name:'',
            product_ids:[],
            brand:'',
            brandId:'',
            model:'',
            modelId:'',
        }
        this.custChange=this.custChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        // Wapi.customer.list(res=>{
        //     this.setState({
        //         custs:res.data,
        //         cust_id:0,
        //     })
        // },{
        //     parentId:_user.customer.objectId,
        // });
    }
    custChange(cust){
        this.setState({
            cust_id:cust.objectId,
            cust_name:cust.name,
        });
    }
    addId(){
        let _this=this;
        function get(res){//扫码，did添加到所选用户
            res=reCode(res);
            let arr=_this.state.product_ids;
            Wapi.device.get(re=>{
                if(re.data){
                    if(_this.state.brand==''){//如果品牌为空，说明是当前第一次扫描，需要查找品牌和产品型号存入state
                        let products=STORE.getState().product;
                        let curProduct=products.find(ele=>ele.name==re.data.model);
                        _this.setState({
                            brand:curProduct.brand,
                            brandId:curProduct.brandId,
                            model:curProduct.name,
                            modelId:curProduct.objectId,
                        });
                    }

                    let product_ids=arr.concat(res);
                    _this.setState({
                        product_ids:product_ids,
                    });
                    W.native.scanner.start(get);
                }else
                    W.alert(___.did_error,()=>W.native.scanner.start(get));
            },{
                did:res,
                uid:_user.customer.objectId
            });
        }
        if(isWxSdk){
            W.native.scanner.start(get);
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            cust_id:0,
            cust_name:'',
            product_ids:[]
        });
        // this.props.toList();
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
        }
        let _this=this;
        Wapi.device.update(function(res_device){
            let popLog={
                uid:_user.customer.objectId,
                did:ids,
                type:0,
                from:_user.customer.objectId,
                fromName:_user.customer.name,
                to:_this.state.cust_id,
                toName:_this.state.cust_name,
                brand:_this.state.brand,
                brandId:_this.state.brandId,
                model:_this.state.model,
                modelId:_this.state.modelId,
                inCount:0,
                outCount:ids.length,
                status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
            };
            Wapi.deviceLog.add(function(res){//给上一级添加出库信息
                popLog.objectId=res.objectId;
                W.emit(window,'device_log_add',popLog);
                W.alert(___.out_success,_this.cancel);
            },popLog);
            
            let pushLog={
                uid:_this.state.cust_id,
                did:ids,
                type:1,
                from:_user.customer.objectId,
                fromName:_user.customer.name,
                to:_this.state.cust_id,
                toName:_this.state.cust_name,
                brand:_this.state.brand,
                brandId:_this.state.brandId,
                model:_this.state.model,
                modelId:_this.state.modelId,
                inCount:ids.length,
                outCount:0,
                status:1,//状态为1，表示 已发货待签收，发货流程未完整之前暂定为1
            };
            Wapi.deviceLog.add(function(res_log){
                //给下一级添加入库信息
            },pushLog);
        },{
            _did:ids.join('|'),
            uid:_this.state.cust_id,
        });
    }
    render(){
        console.log('render device out');
        // let custItems=this.state.custs.map(ele=><MenuItem value={ele.objectId} key={ele.objectId} primaryText={ele.name}/>);
        
        return(
            <div style={styles.input_page}>
                <h3>{___.device_out}</h3>
                <table style={styles.w}>
                    <tbody>
                        <tr>
                            <td style={{whiteSpace:'nowrap',paddingTop:'14px'}}>{___.cust}</td>
                            <td>
                                <UserSearch onChange={this.custChange} data={{parentId:_user.customer.objectId}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}


class ScanGroup extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let productItems=[];
        let product_ids=this.props.product_ids;
        let len=product_ids.length;
        for(let i=0;i<len;i++){
            productItems.push(
                <div key={i} style={styles.ids_box}>
                    {___.device_id} <span style={styles.product_id}>{product_ids[i]}</span>
                </div>
            )
        }
        return(
            <div>
                {productItems}
                <div style={styles.ids_box}>
                    <div>{___.now_count+productItems.length}</div>
                    <a onClick={this.props.addId} style={styles.a}>{___.scan_input}</a>
                </div>
                <RaisedButton onClick={this.props.submit} label={___.ok} primary={true}/>
            </div>
        )
    }
}
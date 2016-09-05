"use strict";
import React from 'react';
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
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

// 测试用
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback('696502000007363');
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

let isWxSdk=false;
// W.include(WiStorm.root+'/wslib/toolkit/WxSdk.js',function(){},function(){alert('can not scan')});
if(W.native)isWxSdk=true;
else
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});

thisView.addEventListener('load',function(){
    ReactDOM.render(
        <AppDeviceManage/>,thisView);
});

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
}]

const _data={
    type:1,
    inNet:88,
    register:77,
    onLine:66,
};
const _datas=[];
for(let i=0;i<10;i++){
    let data=Object.assign({},_data);
    data.type=i;
    _datas.push(data);
}

const styles = {
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em',marginBottom:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
};


let _device={
    model:'w13',
    did:'123456',
    activedIn:'2016-08-15',
    carNum:'粤B23333',
    bindDate:'2016-08-16',
    status:0,
}
let _devices=[];
for(let i=0;i<20;i++){
    let device=Object.assign({},_device);
    device.did+=i;
    _devices[i]=device;
}
class AppDeviceManage extends React.Component{
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
        },{custId:_user.customer.objectId});
        // this.setState({data:_datas});
    }

    deviceIn(){
        console.log('device in');
        history.replaceState('home','home','home.html');
        this.setState({intent:'in'});
    }

    deviceOut(){
        console.log('device out');
        history.replaceState('home','home','home.html');
        this.setState({intent:'out'});
    }

    toList(){
        this.setState({intent:'list'});
    }

    render(){
        let isBrandSeller=false;
        if(_user.customer.custTypeId==0||_user.customer.custTypeId==1)isBrandSeller=true;
        console.log(isBrandSeller);
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
                                <MenuItem style={isBrandSeller?{}:{display:'none'}} primaryText={___.import} onClick={this.deviceIn}/>
                                <MenuItem primaryText={___.distribute} onClick={this.deviceOut}/>
                            </IconMenu>
                        }
                    />
                    <div id='list' style={styles.show}>
                        <List>
                            {items}
                        </List>
                    </div>

                    <SonPage open={this.state.intent=='in'} back={this.toList}>
                        <DeviceIn toList={this.toList}/>
                    </SonPage>
                    <SonPage open={this.state.intent=='out'} back={this.toList}>
                        <DeviceOut toList={this.toList}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}

class ItemDevice extends React.Component{
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

class DeviceIn extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            brands:[],
            types:[],
            brand:'',
            type:'',
            brandId:'',
            typeId:'',
            product_ids:[],
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
            brands:_brand_list,
            types:_product,
            brand:'ID1',
            type:'ID1',
        });
    }
    brandChange(value){
        console.log(value)
        this.setState({brand:value.brand,brandId:value.brandId,type:value.product,typeId:value.productId});
    }
    typeChange(e,value){
        this.setState({type:value});
    }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到当前用户
                let arr=_this.state.product_ids;
                arr[arr.length]=res;
                _this.setState({product_ids:arr});
                
                Wapi.device.add(function(res_device){
                    Wapi.deviceLog.add(function(res_log){
                        
                    },{
                        uid:_user.customer.objectId,
                        did:res,
                        type:1,
                    });
                },{
                    did:res,
                    uid:_user.customer.objectId,
                    
                    status: 0,
                    commType: 'GPRS',
                    commSign: '',
                    model: _this.state.type,
                    modelId: _this.state.typeId,
                    binded: false,
                });
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            brands:_brand_list,
            types:_product,
            brand:'ID1',
            type:'ID1',
            product_ids:[]
        });
        this.props.toList();
    }
    submit(){
        let ids=this.state.product_ids;
        console.log(ids);
        if(ids.length==0){
            this.props.toList();
            return;
        }
        this.cancel();
    }

    render(){
        console.log('render device in')
        let brands=this.state.brands.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.brand_name}/>);
        let types=this.state.types.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.type}/>);
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

class DeviceOut extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            custs:[],
            cust_id:0,
            product_ids:[]
        }
        this.custChange=this.custChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        Wapi.customer.list(res=>{
            this.setState({
                custs:res.data,
                cust_id:0,
            })
        },{
            parentId:_user.customer.objectId,
        });
    }
    custChange(e,value,sth){
        this.setState({cust_id:sth});
    }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){//扫码，did添加到所选用户
                let arr=_this.state.product_ids;
                arr[arr.length]=res;
                _this.setState({product_ids:arr});
                
                Wapi.device.update(function(res_device){
                    Wapi.deviceLog.add(function(res_log){
                        
                    },{
                        did:res,
                        uid:_this.state.cust_id,
                        type:1
                    });
                },{
                    _did:res,
                    uid:_this.state.cust_id,
                    
                    status: 0,
                    commType: 'GPRS',
                    commSign: '',
                    model: 'T11',
                    binded: false,
                });
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            custs:[],
            cust_id:0,
            product_ids:[]
        });
        this.props.toList();
    }
    submit(){
        let ids=this.state.product_ids;
        console.log(ids);
        if(ids.length==0){
            this.props.toList();
            return;
        }
        this.cancel();
    }
    render(){
        console.log('render device out')
        let custItems=this.state.custs.map(ele=><MenuItem value={ele.objectId} key={ele.objectId} primaryText={ele.name}/>);
        
        return(
            <div style={styles.input_page}>
                <h3>{___.device_out}</h3>
                <div>
                    <span>{___.cust}</span>
                    <SelectField value={this.state.cust_id} onChange={this.custChange}>
                        {custItems}
                    </SelectField>
                </div>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}


class ScanGroup extends React.Component{
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
                    <a onClick={this.props.addId} style={styles.scan_input}>{___.scan_input}</a>
                </div>
                <RaisedButton onClick={this.props.submit} label={___.ok} primary={true}/>
            </div>
        )
    }
}

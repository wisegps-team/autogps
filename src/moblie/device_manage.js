"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
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


var thisView=window.LAUNCHER.getView();//第一句必然是获取view


// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback('123456');
//             },100);
//         }
//     }
// }
// let isWxSdk=true;
let isWxSdk=false;
W.include(WiStorm.root+'/wslib/toolkit/WxSdk.js',function(){},function(){alert('can not scan')});
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
    woGuanChe:22,
    zhangWoChe:33,
};
const _datas=[];
for(let i=0;i<10;i++){
    let data=Object.assign({},_data);
    data.type=i;
    _datas.push(data);
}

const styles = {
    MenuItem:{
        //  borderBottom:'solid 1px #cccccc'
    },
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
};


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
        this.setState({data:_datas});
    }

    deviceIn(){
        console.log('device in');
        this.setState({intent:'in'});
    }

    deviceOut(){
        console.log('device out');
        this.setState({intent:'out'});
    }

    toList(){
        this.setState({intent:'list'});
    }

    render(){
        let items=this.state.data.map((ele,i)=><ListItem key={i}  style={styles.MenuItem} children={<ItemDevice key={i} data={ele}/>}/>);
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}} 
                        iconStyleLeft={{display:'none'}}
                        iconElementRight={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                <MenuItem primaryText={___.import} onClick={this.deviceIn}/>
                                <MenuItem primaryText={___.distribute} onClick={this.deviceOut}/>
                            </IconMenu>
                        }
                    />
                    <div id='list' style={this.state.intent=='list'?styles.show:styles.hide}>
                        <List>
                            {items}
                        </List>
                    </div>
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
                        {'W1'+data.type+'智能终端'}
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
        this.setState({brand:value});
    }
    typeChange(e,value){
        this.setState({type:value});
    }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(res){
                let arr=_this.state.product_ids;
                arr[arr.length]=res;
                _this.setState({product_ids:arr});
            });
        }
    }
    submit(){
        let ids=this.state.product_ids;
        console.log(ids);
        if(ids.length==0){
            this.props.toList();
            return;
        }
        this.props.toList();
        // let data={
        //     uid:_user.cust.uid,
        //     did:this.state.product_ids,
        //     type:1
        // }
        // let _this=this;
        // Wapi.deviceLog.add(function(res){
        //     _this.setState({
        //         brands:[],
        //         types:[],
        //         brand:'',
        //         type:'',
        //         product_ids:[],
        //     })
        //     _this.props.toList();
        // },data);
        // for(let i=ids.length-1;i>=0;i--){
        //     Wapi.iotDevice.update(function(res){},{
        //         did:ids[i],
        //         uid:_user.uid
        //     });
        // }
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
    render(){
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
                let arr=_this.state.product_ids;
                arr[arr.length]=res;
                _this.setState({product_ids:arr});
            });
        }
    }
    submit(){
        let ids=this.state.product_ids;
        console.log(ids);
        if(ids.length==0){
            this.props.toList();
            return;
        }
        this.props.toList();
        // let data={
        //     uid:_user.cust.uid,
        //     did:this.state.product_ids,
        //     type:1
        // }
        // let _this=this;
        // Wapi.deviceLog.add(function(res){
        //     _this.setState({
        //         custs:[],
        //         cust_id:0,
        //         product_ids:[]
        //     });
        //     _this.props.toList();
        // },data);
        // for(let i=ids.length-1;i>=0;i--){
        //     Wapi.iotDevice.update(function(res){},{
        //         did:ids[i],
        //         uid:this.state.cust_id
        //     });
        // }
    }
    cancel(){
        this.setState({
            custs:_custs,
            cust_id:0,
            product_ids:[]
        });
        this.props.toList();
    }
    render(){
        let custs=this.state.custs.map(ele=><MenuItem value={ele.uid} key={ele.uid} primaryText={ele.name}/>);
        return(
            <div style={styles.input_page}>
                <p>{___.device_out}</p>
                <div>
                    <span>{___.cust}</span>
                    <SelectField value={this.state.custArr} onChange={this.custChange}>
                        {custs}
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
                <div style={styles.ids_box}><a onClick={this.props.addId} style={styles.scan_input}>{___.scan_input}</a></div>
                <RaisedButton onClick={this.props.cancel} label={___.cancel} primary={true} style={styles.btn_cancel}/>
                <RaisedButton onClick={this.props.submit} label={___.submit} primary={true}/>
            </div>
        )
    }
}


<<<<<<< HEAD
const APP=connect(function select(state) {
    let sta={};
    Object.assign(sta,state);
    return sta;
})(AppDeviceManage);
=======
// const APP=connect(function select(state) {
//     let sta={};
//     Object.assign(sta,state);
//     return sta;
// })(AppDeviceManage);

>>>>>>> 5edcbaae2f55fec7efd1d04d2488055b197b4d9b

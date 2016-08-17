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
            data:[],
        }
        this.deviceIn=this.deviceIn.bind(this);
        this.deviceOut=this.deviceOut.bind(this);
    }

    componentDidMount(){
        this.setState({data:this.props.data||_datas});
    }

    deviceIn(){
        console.log('device in');
        window.location='device_act.html?intent=in';
    }

    deviceOut(){
        console.log('device out');
        window.location='device_act.html?intent=out';
    }

    render(){
        let isBrandSeller=false;
        if(_user.customer.custTypeId==0||_user.customer.custTypeId==1)isBrandSeller=true;
        console.log(isBrandSeller);
        let items=this.state.data.map((ele,i)=><ListItem key={i} children={<ItemDevice key={i} data={ele}/>}/>);
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
                                <MenuItem style={isBrandSeller?{}:{display:'none'}} primaryText={___.import} onClick={this.deviceIn}/>
                                <MenuItem primaryText={___.distribute} onClick={this.deviceOut}/>
                            </IconMenu>
                        }
                    />
                    <List style={{paddingTop:'50px'}}>
                        {items}
                    </List>
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

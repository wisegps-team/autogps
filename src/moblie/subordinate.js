/**
 * 11/01
 * 小吴
 * 渠道管理，主要功能是 展示下级（代理商和经销商）的统计信息，弹出邀约链接
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import AppBar from '../_component/base/appBar';
import {CustListHC,cust_item_sty} from '../_component/cust_list';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


class App extends Component{
    constructor(props, context) {
        super(props, context);
        this._data={
            parentId:_user.customer.objectId,
            custTypeId:'5|8'
        };
    }
    getChildContext(){
        return{
            'VIEW':thisView
        }
    }
    tip(){
        if(W.native)
            W.alert({
                title:___.invitation_url,
                text:___.prompt_share
            });
        else{
            W.toast(___.ready_url);
            window.addEventListener('nativeSdkReady',function(){
                W.alert({
                    title:___.invitation_url,
                    text:___.prompt_share
                });
            });
        }
    }
    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.subordinate} iconElementRight={<IconButton onClick={this.tip}><ContentAdd/></IconButton>}/>
                <CustList data={this._data}/>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    VIEW:React.PropTypes.object,
}

const _strVa=[___.group_marketing,___.distribution,___.enterprises,___.carowner_seller];
class UserItem extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            data:props.data
        }
        this.operation = this.operation.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data:nextProps.data});
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.data!==this.props.data);
    }
    
    operation(index){
        switch(index){
            case 0://编辑
                break;
            case 1://详情
                break;
            case 2://删除
                let that=this;
                W.confirm(___.confirm_delete,function(b){
                    if(b)Wapi.customer.update(res=>that.context.delete(that.props.data.objectId),{
                            _objectId:that.props.data.objectId,
                            parentId:'-"'+_user.customer.objectId+'"'
                        });
                });
                break;
            case 3://业务统计
                this.context.showCount(this.props.data,'pop');
                break;
            case 4://开启/关闭车主营销
                let arrVa=[];
                if(this.props.data.other && this.props.data.other.va){
                    let strVa=this.props.data.other.va;
                    arrVa=strVa.split(',');
                }
                let add=(arrVa.includes('3'))?false:true;
                setRole(this.props.data,e=>{
                    this.forceUpdate();
                    W.alert(___.setting_success);
                },add);
                
                break;
            case 5://设置安装网点
                let isInstall=Number(!this.props.data.isInstall);
                Wapi.customer.update(res=>{
                    this.props.data.isInstall=isInstall;
                    this.forceUpdate();
                    W.alert(___.setting_success);
                },{
                    _objectId:this.props.data.objectId,
                    'isInstall':isInstall
                });
                break;
            default:
                break;
        }
    }
    render() {
        if(!this.props.data.custType){
            let types=STORE.getState().custType;
            let type=types.find(type=>this.props.data.custTypeId==type.id);
            this.props.data.custType=type?type.name:this.props.data.custType;
        }
        let tr=(<div style={cust_item_sty.tab}>
                <span style={cust_item_sty.td}>{this.props.data.contact}</span>
                <span style={cust_item_sty.td}>{this.props.data.tel}</span>
            </div>);

        let arrVa=(this.props.data.other&&this.props.data.other.va) ? this.props.data.other.va.split(',') : [];
        let strVa=___.no_added_service;
        if(arrVa.length!=0){
            strVa=arrVa.map(ele=>_strVa[ele]).join(' ');
        }
        if(this.props.data.isInstall){
            if(strVa==___.no_added_service){
                strVa=___.install_shop;
            }else{
                strVa=strVa+' '+___.install_shop;
            }
        }
        let openCS={//open_carowner_seller 开启车主营销，对应其上级应当已开启车主营销
            canOpen:_user.customer.other && _user.customer.other.va && _user.customer.other.va.includes('3'),
            isOpened:arrVa.includes('3'),
        }
        let setIS={//set_install_shop 设置安装网点,对应其上级已开启集团营销
            canSet:_user.customer.other && _user.customer.other.va && _user.customer.other.va.includes('0'),
            isSetted:this.props.data.isInstall,
        }
        
        let title=(<span>
            {this.props.data.name}
            <small style={cust_item_sty.sm}>{this.props.data.custType}</small>
            <small style={cust_item_sty.sm}>{strVa}</small>
            <small style={cust_item_sty.sm}>{this.props.data.province+this.props.data.city+this.props.data.area}</small>
        </span>);
        return (
            <ListItem
                rightIcon={<RightIconMenu openCS={openCS} setIS={setIS} onClick={this.operation}/>}
                primaryText={title}
                secondaryText={tr}
                style={cust_item_sty.item}
            />
        );
    }
}
UserItem.contextTypes ={
    VIEW:React.PropTypes.object,
    delete:React.PropTypes.func,
    showCount:React.PropTypes.func,
}

class RightIconMenu extends Component{    
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.openCS.isOpened==this.props.openCS.isOpened && nextProps.setIS.isSetted==this.props.setIS.isSetted){
            return false;
        }else{
            return true;
        }
    }
    render() {
        let styOpenCS=this.props.openCS.canOpen ? null : {display:'none'};
        let strOpenCS=this.props.openCS.isOpened ? ___.close_carowner_seller : ___.open_carowner_seller;
        let stySetIS=this.props.setIS.canSet ? null : {display:'none'};
        let strSetIS=this.props.setIS.isSetted ? ___.cancel_install_shop : ___.set_install_shop;
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                style={{
                    height: '48px',
                    width: '48px',
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    bottom: '0px',
                    margin: 'auto'
                }}
            >
                <MenuItem onTouchTap={()=>this.props.onClick(3)}>{___.business_statistics}</MenuItem>
                <MenuItem style={styOpenCS} onClick={()=>this.props.onClick(4)}>{strOpenCS}</MenuItem>
                <MenuItem style={stySetIS} onClick={()=>this.props.onClick(5)}>{strSetIS}</MenuItem>
            </IconMenu>
        );
    }
}

let CustList=CustListHC(UserItem);


function setShare(){
    let custType=(_user.customer.custTypeId==1)?5:8;
    var op={
        title: ___.invitation_url, // 分享标题
        desc: _user.customer.name, // 分享描述
        link: location.origin+'/?intent=logout&register=true&parentId='+_user.customer.objectId+'&custType='+custType+'&name='+encodeURIComponent(_user.customer.name), // 分享链接
        imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
        success: function(){},
        cancel: function(){}
    }
    wx.onMenuShareTimeline(op);
    wx.onMenuShareAppMessage(op);
    setShare=null;
}

if(W.native)
    setShare()
else
    window.addEventListener('nativeSdkReady',setShare);




function setRole(cust,callback,add){
    let rid='795552341104398300';
    let i='3';
    let a=add?'+':'-';
    Wapi.role.get(res=>{
        if(add==res.data.users.includes(cust.uid)){
            custUpdate(cust,i,callback,add);
        }else
            Wapi.role.update(r=>custUpdate(cust,i,callback,add),{
                _objectId:rid,
                users:a+'"'+cust.uid+'"'
            });
    },{
        objectId:rid
    },{
        fields:'objectId,name,users'
    });
}

function custUpdate(cust,i,callback,add){
    let VA=(cust.other&&cust.other.va)?cust.other.va.split(','):[];
    if(add==VA.includes(i.toString())){
        callback();
        return;
    }
    if(add)
        VA.push(i);
    else
        VA=VA.filter(v=>v!=i);
    let va=VA.join(',');
    Wapi.customer.update(function(res){
        cust.other=Object.assign({},cust.other,{va});
        callback();
    },{
        _objectId:cust.objectId,
        'other.va':va
    });
}
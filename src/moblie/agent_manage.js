/**
 * 09/09
 * 小吴
 * 代理商管理，主要功能是 展示代理商的统计信息，弹出邀约链接
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
            custTypeId:'5'
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
                <AppBar iconElementRight={<IconButton onClick={this.tip}><ContentAdd/></IconButton>}/>
                <CustList data={this._data}/>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    VIEW:React.PropTypes.object,
}

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
        }
    }
    render() {
        if(!this.props.data.custType){
            let types=STORE.getState().custType;
            let type=types.find(type=>this.props.data.custTypeId==type.id);
            this.props.data.custType=type?type.name:this.props.data.custType;
        }
        let tr=(<div style={cust_item_sty.tab}>
                <span style={cust_item_sty.td}>{this.props.data.custType}</span>
                <span style={cust_item_sty.td}>{this.props.data.contact}</span>
                <span style={cust_item_sty.td}>{this.props.data.tel}</span>
            </div>);
        let title=(<span>
            {this.props.data.name}
            <small style={cust_item_sty.sm}>{this.props.data.province+this.props.data.city+this.props.data.area}</small>
        </span>);
        return (
            <ListItem
                rightIcon={<RightIconMenu onClick={this.operation}/>}
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
        return false;
    }
    
    render() {
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
                <MenuItem onTouchTap={()=>this.props.onClick(2)}>{___.delete}</MenuItem>
            </IconMenu>
        );
    }
}

let CustList=CustListHC(UserItem);


function setShare(){
    var op={
        title: ___.invitation_url, // 分享标题
        desc: _user.customer.name, // 分享描述
        link: location.origin+'/?intent=logout&register=true&parentId='+_user.customer.objectId+'&custType=5&name='+encodeURIComponent(_user.customer.name), // 分享链接
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
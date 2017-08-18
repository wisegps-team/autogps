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
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import AppBar from '../_component/base/appBar';
import QrImg from '../_component/base/qrImg';
import SonPage from '../_component/base/sonPage';
import {CustListHC,cust_item_sty} from '../_component/cust_list';
import {changeToLetter} from '../_modules/tool';

import ImageAdjust from 'material-ui/svg-icons/image/adjust'



const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.subordinate);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

// let sUrl='Gy';//测试用

let sUrl='';
let qrLinkData={
    uid:_user.customer.objectId,
    type:4,
    i:0
};
let wx_app_id=W.getCookie('current_wx');
let data=Object.assign({},qrLinkData);
let custType=(_user.customer.custTypeId==1)?5:8;
data.url=location.origin+'/?register=true&parentId='+_user.customer.objectId+'&custType='+custType+'&name='+encodeURIComponent(_user.customer.name)+'&wx_app_id='+WiStorm.config.wx_app_id;
if(_user.employee){
    data.url=data.url+'&managerId='+_user.employee.objectId;
}
Wapi.qrLink.add(res=>{
    Wapi.qrLink.get(r=>{
        let id=changeToLetter(r.data.i);
        setUrl(id);
        Wapi.qrLink.update(null,{
            _objectId:res.objectId,
            id
        });
    },{objectId:res.objectId});
},data);

//20170322，改：直接新建，不判断以前是否分享过，因为要使用营销人员分享
// Wapi.qrLink.get(function(res) {
//     let wx_app_id=W.getCookie('current_wx');
//     if(res.data && res.data.url.includes(wx_app_id)){//如果以前有过分享且公众号为当前公众号，直接设置分享链接，
//         setUrl(res.data.id);
//     }else{
//         let data=Object.assign({},qrLinkData);
//         data.i=0;
//         let custType=(_user.customer.custTypeId==1)?5:8;
//         data.url=location.origin+'/?register=true&parentId='+_user.customer.objectId+'&custType='+custType+'&name='+encodeURIComponent(_user.customer.name)+'&wx_app_id='+wx_app_id;
//         if(_user.employee){
//             data.url=data.url+'&managerId='+_user.employee.objectId;
//         }
//         Wapi.qrLink.add(res=>{
//             Wapi.qrLink.get(r=>{
//                 let id=changeToLetter(r.data.i);
//                 setUrl(id);
//                 Wapi.qrLink.update(null,{
//                     _objectId:res.objectId,
//                     id
//                 });
//             },{objectId:res.objectId});
//         },data);
//     }
// },qrLinkData);

function setUrl(id){
    sUrl='https://t.autogps.cn/?s='+id;
    W.emit(thisView,'sUrlIsReady');//触发事件
}

function askSetShare() {
    if(sUrl){
        setShare();
    }else{
        thisView.addEventListener('sUrlIsReady',setShare);
    }
}

function setShare(){
    let name=_user.employee?_user.employee.name:_user.customer.contact;
    var op={
        title: name+'的'+___.invite_regist, // xxx的邀约注册
        desc: _user.customer.name, // 分享描述
        link: sUrl, // 分享链接
        imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
        success: function(){},
        cancel: function(){}
    }
    // // history.replaceState('home.html','home.html','home.html');
    // W.fixPath();
    // wx.onMenuShareTimeline(op);
    // wx.onMenuShareAppMessage(op);

    let data = {};
    data.op = op;
    // data.share_url = sUrl;
    W.setCookie('share_data',JSON.stringify(data));
    top.location = WiStorm.root + "wx_share.html"
    // W.emit(thisView,'setShareOver');
}


let _managers=[];
class App extends Component{
    constructor(props, context) {
        super(props, context);
        this._data={
            parentId:_user.customer.objectId,
            custTypeId:'5|8',
            appId:WiStorm.config.objectId
        };
        if(_user.employee){
            this._data.parentMng=_user.employee.objectId+'in'+_user.customer.objectId;
        }
        this.state={
            active:0
        };

        this.showManager=false;
        this.cust={};
        this.changeManager = this.changeManager.bind(this);
        this.managerBack = this.managerBack.bind(this);

        this.showQr = this.showQr.bind(this);
        this.hideQr = this.hideQr.bind(this);
        
    }
    getChildContext(){
        return{
            'VIEW':thisView,
            changeManager:this.changeManager
        }
    }
    componentDidMount() {
        // var dd = new Set([1,3,4])
        // console.log(dd,'dd')
        // Wapi.employee.list(res=>{
        //     _managers=res.data;
        //     console.log(res.data,'sum customer manager data')
        //     W.emit(window,'cust_list_update',this._data);
        // },{companyId:_user.customer.objectId,type:'<>1',isQuit:false})

        var that = this;
        Wapi.page.get(res => {
            let op = []
            res.data.ACL.forEach(ele => {
                op.push(ele.replace('role:', ''));

            })
            Wapi.role.list(re => {
                let obj = [];
                re.data.forEach(ele => {
                    obj.push(ele.objectId)
                })
                Wapi.employee.list(ress => {
                    // console.log(ress.data)
                    _managers=ress.data;
                    console.log(ress.data,'sum customer manager data')
                    W.emit(window,'cust_list_update',that._data);
                },{
                    roleId:obj.join('|'),
                    companyId:_user.customer.objectId
                })
            },{
                objectId:op.join('|'),
                uid:_user.customer.objectId
            })
        },{
            name:'集团营销'
        },{
            fields:'ACL'
        })

    }
    changeManager(cust){
        console.log(cust,'test changemanager button')
        this.cust=cust;
        this.showManager=true;
        this.forceUpdate();
    }
    managerBack(){
        this.showManager=false;
        this.forceUpdate();
    }
    showQr(){
        this.setState({active:1});
        this._timeout=false;
        setTimeout(e=>this._timeout=true,500);
        thisView.setTitle(___.scan_regist);
    }
    hideQr(){
        if(this._timeout){
            this.setState({active:0});
            thisView.setTitle(___.subordinate);
        }
    }
    render() {
        let show=this.state.active==1;
        let dis=show?{display:'none'}:null;
        console.log(this._data,'custList data')
        return (
            <ThemeProvider>
                <div style={dis}>
                    <CustList data={this._data} add={this.showQr}/>
                </div>
                <QrBox show={show} hide={this.hideQr}/>
                <SonPage open={this.showManager} back={this.managerBack}>
                    <Manager data={this.cust}/>
                </SonPage>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    VIEW:React.PropTypes.object,
    changeManager:React.PropTypes.func
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
            // case 4://开启/关闭车主营销 //20170223去掉此功能
            //     let arrVa=[];
            //     if(this.props.data.other && this.props.data.other.va){
            //         let strVa=this.props.data.other.va;
            //         arrVa=strVa.split(',');
            //     }
            //     let add=(arrVa.includes('3'))?false:true;
            //     setRole(this.props.data,e=>{
            //         this.forceUpdate();
            //         W.alert(___.setting_success);
            //     },add);
                
            //     break;
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
            case 6://更改业务经理
                this.context.changeManager(this.props.data);
                break;
            default:
                break;
        }
    }
    render() {
        // console.log(this.state.data,'what is useritem data')
        // console.log(STORE,'what is store')
        if(!this.props.data.custType){
            // console.log(STORE,'')
            let types=STORE.getState().custType;
            let type=types.find(type=>this.props.data.custTypeId==type.id);
            this.props.data.custType=type?type.name:this.props.data.custType;
        }
        /*let tr=(<div style={cust_item_sty.tab}>
                <span style={cust_item_sty.td}>{this.props.data.contact}</span>
                <span style={cust_item_sty.td}>{this.props.data.tel}</span>
            </div>);*/
        let manager={name:___.no_select};
        if(_managers.length && this.props.data.parentMng && this.props.data.parentMng.length){
            let str=this.props.data.parentMng.find(ele=>ele.includes(_user.customer.objectId));
            if(str){
                let managerId = str.split('in')[0];
                // console.log(managerId,_managers)
                manager=_managers.find(ele=>ele.objectId==managerId);
                if(!manager){
                    manager={name:___.no_select}
                }
                // console.log(manager,'manager')
            }
        }
        // console.log(manager,'manager')
        let tr=(<div style={cust_item_sty.tab}>
                <span style={{marginRight:'30px'}}>{___.business_namager}</span>
                <span>{manager.name}</span>
            </div>);

        let arrVa=(this.props.data.other&&this.props.data.other.va) ? this.props.data.other.va.split(',') : [];
        let strVa=___.no_added_service;
        if(arrVa.length!=0){
            strVa=arrVa.map(ele=>_strVa[ele]).join(' ');
        }
        let openCS={//open_carowner_seller 开启车主营销，对应其上级应当已开启车主营销
            canOpen:_user.customer.other && _user.customer.other.va && _user.customer.other.va.includes('3'),
            isOpened:arrVa.includes('3'),
        }
        let setIS={//set_install_shop 设置安装网点,对应其上级已开启集团营销
            canSet:_user.customer.other && _user.customer.other.va && _user.customer.other.va.includes('0'),
            isSetted:this.props.data.isInstall,
        }
        
        let cType=this.props.data.custType;
        if(this.props.data.custTypeId==8 && this.props.data.isInstall==0){
            cType=___.service_provider;
        }
        let strContact=(this.props.data.contact||'')+' '+(this.props.data.tel||'');
        let strAddress=(this.props.data.province+this.props.data.city+this.props.data.area) || ' ';
        // let title=(<span>
            // {this.props.data.name}
            // <small style={cust_item_sty.sm}>{cType+' '+strContact}</small>
            // <small style={cust_item_sty.sm}>{strVa}</small>
            // <small style={cust_item_sty.sm}>{strAddress}</small>
        // </span>);
        
        let title = (
            <div style={{position:'relative',paddingLeft:65}}>
                <div style={{position:'absolute',width:60,height:'100%',left:0,top:0}}>
                    <img src="../../img/head.png" style={{width:'100%',height:'100%'}}/>
                </div>
                <span style={{display:'block',width:'175px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{this.props.data.name}</span>
                <small style={cust_item_sty.sm}>{cType+' '+strContact}</small>
                <small style={cust_item_sty.sm}>{strVa}</small>
                <small style={cust_item_sty.sm}>{strAddress}</small>
                <div style={{position:'absolute',right:'-15px',top:0,fontSize:'12px',height:20,lineHeight:'20px',color:'#2196f3'}}>
                    <ImageAdjust style={{width:12,height:12,position:'relative',top:1}} color='#2196f3'/>
                    <span style={{paddingLeft:3}}>{manager.name}</span>
                </div>
            </div>
        )

        return (
            // <ListItem
            //     rightIcon={<RightIconMenu openCS={openCS} setIS={setIS} onClick={this.operation}/>}
            //     primaryText={title}
            //     secondaryText={tr}
            //     style={cust_item_sty.item}
            // />
            <ListItem
                rightIcon={<RightIconMenu openCS={openCS} setIS={setIS} onClick={this.operation}/>}
                primaryText={title}
                style={cust_item_sty.item}
            />
        );
    }
}
UserItem.contextTypes ={
    VIEW:React.PropTypes.object,
    delete:React.PropTypes.func,
    showCount:React.PropTypes.func,
    changeManager:React.PropTypes.func
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
        // let styOpenCS=_user.customer.custTypeId==1 ? null : {display:'none'};//开启车主营销 菜单是否显示 仅品牌商(custTypeId==1)显示 //20170223去掉此功能
        // let strOpenCS=this.props.openCS.isOpened ? ___.close_carowner_seller : ___.open_carowner_seller;//开启车主营销显示字符 [关闭/开启]车主营销
        let stySetIS=this.props.setIS.canSet ? null : {display:'none'};//设置经销商 菜单是否显示
        let strSetIS=this.props.setIS.isSetted ? ___.cancel_install_shop : ___.set_install_shop;//设置经销商菜单字符 [取消/设置]经销商
        let menu=[
            // <MenuItem key={0} onTouchTap={()=>this.props.onClick(3)}>{___.business_statistics}</MenuItem>,
            <MenuItem key={1} onTouchTap={()=>this.props.onClick(6)}>{___.change_manager}</MenuItem>,
            // <MenuItem style={styOpenCS} onTouchTap={()=>this.props.onClick(4)}>{strOpenCS}</MenuItem>,
            // <MenuItem key={2} style={stySetIS} onTouchTap={()=>this.props.onClick(5)}>{strSetIS}</MenuItem>,
        ];
        // let showMenu=[menu[0],menu[1],menu[2]];
        let showMenu=[menu[0]]
        if(_user.employee){
            // showMenu=[menu[0]];
            showMenu=[];
        }
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
                {showMenu}
            </IconMenu>
        );
    }
}

let CustList=CustListHC(UserItem);

class QrBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            active:0,
            url:sUrl
        }

        this.hide = this.hide.bind(this);
    }
    componentDidMount() {
        if(!this.state.url){
            thisView.addEventListener('sUrlIsReady',e=>this.setState({url:sUrl}));
        }
        thisView.addEventListener('setShareOver',e=>{
            this.setState({active:1});
            this._timeout=false;
            setTimeout(e=>{this._timeout=true},500);
            thisView.setTitle(___.invite_regist);     
        });
    }

    tip(e){
        e.stopPropagation();
        if(W.native)
            askSetShare();
        else{
            // askSetShare(); //测试
            W.toast(___.ready_url);
            window.addEventListener('nativeSdkReady',askSetShare);
        }
    }
    hide(e){
        e.stopPropagation();
        if(this._timeout){
            this.setState({active:0});
            thisView.setTitle(___.scan_regist);            
        }  
    }
    render() {
        let dis=this.props.show?{}:{display:'none'};
        dis.textAlign='center';
        let qrSty={display:'inline-block',marginTop:(window.innerHeight-50-128-100)/2+'px'};
        let btnSty={position:'fixed',bottom:'50px',textAlign:'center',display:'block',width:'100%'};
        let imgSty={textAlign:'center',backgroundColor:'#f7f7f7',minHeight:'100vh' ,background:'url(../../img/device.jpg) no-repeat',backgroundSize:'100% 50%'};
        if(this.state.active)imgSty.display='none';
        return (
            <div style={dis}>
                <div style={imgSty}>
                    <div style={qrSty}>
                        <h4>{_user.customer.name}</h4>
                        {/* <div>{___.subordinate_register}</div> */}
                        <QrImg data={this.state.url} style={{display:'inline-block',padding:10,backgroundColor:'#fff'}}/>
                        <div style={{marginTop:5}}>{'无需加好友，扫码注册渠道账号！'}</div>
                    </div>
                    <br/>
                    {/*<span style={{color:'#ccc'}}>{___.touch_back}</span><br/><br/>*/}
                    <div style={btnSty}>
                        <RaisedButton label={___.return} onClick={this.props.hide} secondary={true} style={{marginRight:'10px'}}/>
                        <RaisedButton label={___.invite_regist} onClick={this.tip} primary={true}/>
                    </div>
                </div>
                <SharePage show={this.state.active} hide={this.hide}/>
            </div>
        );
    }
}
class SharePage extends Component {
    render() {
        let sty={width:'90%',marginLeft:'5%',marginTop:(window.innerHeight-280)/2+'px',display:'none'};
        let styReturn={width:'100px',height:'30px',marginLeft:(window.innerWidth*0.9-100)/2+'px',marginTop:'30px',lineHeight:'30px',borderRadius:'4px',border:'solid 1px #ff9900',color:'#ff9900'};
        if(this.props.show)sty.display='block';
        return (
            <div style={sty}>
                {___.share_page}<br/>
                {___.can_regist}
                <img src='../../img/shareTo.jpg' style={{width:'100%'}}/>
                {/*<span style={{color:'#ccc'}}>{___.touch_back}</span>*/}
                <div onClick={this.props.hide} style={styReturn}>
                    {___.return}
                </div>
            </div>
        );
    }
}

class Manager extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            data:[]
        }
        this.objectId;
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        
    }
    componentDidMount(){
        this.setState({data:_managers})
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data:_managers});
        if(nextProps.data&&nextProps.data.parentMng&&nextProps.data.parentMng.length){
            let str=nextProps.data.parentMng.find(ele=>ele.includes(_user.customer.objectId));
            if(str){
                this.objectId = str.split('in')[0];
            }
        }
    }
    
    check(e){
        this.objectId = e.target.value;
    }
    submit(){
        var objectId = String(_user.customer.objectId);
        let manage = String(this.objectId);
        let strMng=manage+'in'+objectId;
        
        let Mng=this.props.data.parentMng.filter(ele=>!ele.includes(objectId));
        Mng.push(manage+'in'+objectId);

        Wapi.customer.update(res =>{
            W.emit(window,'cust_list_update',{});
            history.back();
        },{
            _objectId:this.props.data.objectId,
            parentMng: Mng
        })
    }
    render() {
        const items = this.state.data.map((ele,index) =>{
            return(<RadioButton
                    key={index}
                    value={ele.objectId.toString()}
                    label={ele.name}
                    style={{marginBottom: 16}}
                />)  
        })
        return (
            <ThemeProvider>
                <div style={{padding:20}}>
                    <div style={{marginBottom:20}}>业务经理</div>
                    <RadioButtonGroup name="shipSpeed" onChange={this.check} valueSelected={this.objectId}>
                       {items} 
                    </RadioButtonGroup>
                    <div style={{width:'100%',display:'block',textAlign:'center',paddingTop:'5px'}}>
                        <RaisedButton label={___.ok} primary={true} onClick={this.submit} />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

//没用
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
//没用
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
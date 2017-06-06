import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '../_theme/default';

import DropDownMenu from 'material-ui/DropDownMenu';
import { Menu, MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField'
import AutoList from '../_component/base/autoList';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { blue500 } from 'material-ui/styles/colors';
import Input from '../_component/base/input';
import SocialPeople from 'material-ui/svg-icons/social/people'
import QrImg from '../_component/base/qrImg';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';

import SonPage from '../_component/base/sonPage';
import { getOpenIdKey, changeToLetter } from '../_modules/tool';

const thisView = window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("扫码挪车");
thisView.addEventListener('load', function () {
    ReactDOM.render(<App />, thisView);
    // let qrView=thisView.prefetch('#qrlist',3);
    // ReactDOM.render(<ShowCar/>,qrView);
    // qrView.setTitle('一物一码');
});

const domain = [
    WiStorm.config.domain.user,
    location.hostname
]

const sty = {
    h4: { textAlign: 'left', wordBreak: 'break-all' },
    wxbox: { padding: '10px', textAlign: 'left', background: '#f7f7f7', height: '100%' },
    title: {fontSize: '16px', fontWeight: 'bold', padding: '5px'},
    subtitle: {fontSize: '14px', fontWeight: 'bold', padding: '5px'},
    content: {fontSize: '14px', padding: '2px', color: '#666', wordBreak: 'break-all'},
    buttonbar: {textAlign: 'center'},
    input: {top: '-4px', height: '40px', fontSize: '14px'},
    inputContent: {fontSize: '14px', padding: '0px 2px 0px 2px'},
    highlight: {color: blue500}
}

let sUrl=''; //客户
let sUrl2='';//代理
function AddRegisterQrLink(custType,type,callback){
    let qrLinkData={
        uid:_user.customer.objectId,
        type:4,
        i:0
    };
    let data=Object.assign({},qrLinkData);
    data.url=location.origin+'/?intent=logout&register=true&parentId='+_user.customer.objectId+'&custType='+custType+'&name='+encodeURIComponent(_user.customer.name)+'&wx_app_id='+WiStorm.config.wx_app_id;
    if(type === 2){
        data.url = data.url + '&Authorize=3';
    }
    Wapi.qrLink.add(res=>{
        console.log(res,'AddRegisterQrLink')
        Wapi.qrLink.get(r=>{
            let id=changeToLetter(r.data.i);
            setUrl(id, type);
            Wapi.qrLink.update(res => {
                callback(id);
            },{
                _objectId:res.objectId,
                id
            });
        },{objectId:res.objectId});
    },data);
}

function setUrl(id, type){
    if(type === 2){
        sUrl2 = 'http://autogps.cn/?s='+id;
    }else{
        sUrl='http://autogps.cn/?s='+id;
    }
    // sUrl='http://h5test.bibibaba.cn/url.php?s='+id;
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
    // history.replaceState(WiStorm.config.home_url,WiStorm.config.home_url,WiStorm.config.home_url);
    W.fixPath();
    wx.onMenuShareTimeline(op);
    wx.onMenuShareAppMessage(op);
    W.emit(thisView,'setShareOver');
}

class App extends Component {
    constructor(props, context) {
        super(props, context)
        var type = _user.customer.custTypeId == 9 ? 2: (_user.customer.custTypeId === 10 && _user.customer.Authorize.indexOf('3') > -1) ? 3:0;
        this.state = {
            type: type,
            show_sonpage: false,
            data: null,
            showCar: false,
            showQr: false,
            showCarManager: false,
            qrLink: {},
            qrUrl: ''
        }
        this.typeChange = this.typeChange.bind(this);
        this.showWxBox = this.showWxBox.bind(this);
        this.goPush = this.goPush.bind(this);
        this.configSuccess = this.configSuccess.bind(this);
        this.showCar = this.showCar.bind(this);
        this._showQr = this._showQr.bind(this);
        this.hideCar = this.hideCar.bind(this);
        this.showQr = this.showQr.bind(this);
        this.hideQr = this.hideQr.bind(this);    
        this.showCarManager = this.showCarManager.bind(this);
        this.hideCarManager = this.hideCarManager.bind(this); 
        this.click = this.click.bind(this);    
    }
    componentDidMount() {
        Wapi.weixin.list(res => {
            this.setState({ data: res.data })
        }, {
                uid: _user.customer.objectId,
                type: 0
            }, {
                fields: 'objectId,uid,name,type,wxAppKey,wxAppSecret,menu,fileName'
            })

        // 产生注册短链
        let custType = 10;
        let that = this;
        // 产生客户和代理的注册短链
        AddRegisterQrLink(custType, 2, function(id){});  
        AddRegisterQrLink(custType, 3, function(id){});           
    }

    typeChange(e, i, v) {
        this.setState({ type: v })
    }
    showWxBox(i) {
        let newState = {
            show_sonpage: !this.state.show_sonpage,
            type: 0
        }
        if (newState.show_sonpage && i === 1) {
            //设置类型
            newState.type = 1
        }
        this.setState(newState);
        this.forceUpdate()
        console.log('配置')
    }
    configSuccess(wx) {
        // debugger;
        // Wapi.qrLink.list(qr => {
        //     if (qr.data.length) {
        //         let data = [];
        //         qr.data.forEach(ele => { data.push(ele.objectId) })
        //         Wapi.qrLink.delete(up => {
        //             AddQrLink(wx.wxAppKey, op => {
        //                 console.log(op)
        //                 this.setState({ qrLink: op })
        //             })
        //         }, {
        //                 objectId: data.join('|')
        //             })
        //     }
        // }, {
        //         uid: _user.customer.objectId,
        //         type: 2
        //     })
        // console.log(wx, 'wx')
        // let data = this.state.data.concat();
        // if (this.state.type == 0) {
        //     data[0] = wx;
        //     // debugger;
        //     Wapi.customer.update(res => {
        //         // Wapi.device.update(res=>{//把现有的设备都改serverId
        //         _user.customer.wxAppKey = wx.wxAppKey;
        //         W.setSetting('user', _user);
        //         // W.alert(___.setting_success);
        //         this.goPush(0)
        //         // },{
        //         //     _uid:_user.customer.objectId,
        //         //     serverId:_user.customer.objectId
        //         // });
        //     }, {
        //             _objectId: _user.customer.objectId,
        //             wxAppKey: wx.wxAppKey,
        //             wxAppSecret: wx.wxAppSecret
        //         });

        // }
        // this.setState({ data });
        Wapi.weixin.list(res => {
            this.setState({ data: res.data })
        }, {
                uid: _user.customer.objectId,
                type: 0
            }, {
                fields: 'objectId,uid,name,type,wxAppKey,wxAppSecret,menu,fileName'
            })        
        this.forceUpdate();
    }
    goPush(i) {
        // debugger;
        let wx = this.state.data ? this.state.data[i] : null
        if (!wx) {
            W.alert(i ? ___.wx_server_null : ___.wx_seller_null);
        }
        debugger;
        W.confirm(___.have_template, res => {
            if (!res) {
                W.alert(___.wait_for_template);
                return;
            }
            W.loading(true, ___.setting_template);
            debugger;
            Wapi.serverApi.setWxTemplate(function (res) {
                W.loading(false);
                if (res.status_code || res.errcode) {
                    W.alert((res.errmsg || res.err_msg) + '，' + ___.error['000']);
                    return;
                }
                // W.alert(___.setting_success, ()=>{history.back()});
                W.alert(___.setting_success)
            }, {
                    wxAppKey: wx.wxAppKey
                });
        })

    }
    click(i){
        if(i === 0){
            this.showWxBox(0);
        }else if(i === 1){
            W.alert('该功能正在开发中...');
        }else if(i === 2){
            this.showCarManager();
        }
    }
    showCar() {
        this.setState({ showCar: true })
        this.forceUpdate()
    }
    hideCar() {
        this.setState({ showCar: false })
        this.forceUpdate()
    }
    showCarManager() {
        this.setState({ showCarManager: true })
        this.forceUpdate()
    }
    hideCarManager() {
        this.setState({ showCarManager: false })
        this.forceUpdate()
    }
    _showQr(){
        this.setState({type: 3});
        this.showQr();
    }
    //显示邀约注册二维码
    showQr(){
        // let custType = 10;
        // let that = this;
        // AddRegisterQrLink(custType, function(id){
        //     let sUrl='http://autogps.cn/?s='+id;
            // that.setState({qrUrl: sUrl});
            W.alert(this.state.type === 2 ? '代理注册链接：' + sUrl2: '客户注册链接：' + sUrl);
            // that.setState({showQr: true});
            // that.forceUpdate()
        // });
        // this._timeout=false;
        // setTimeout(e=>this._timeout=true,500);
        // thisView.setTitle(___.scan_regist);
    }
    //隐藏邀约注册
    hideQr(){
        // if(this._timeout){
        //     this.setState({showQr: false});
        //     thisView.setTitle("代理授权");
        // }
        this.setState({showQr: false});
        this.forceUpdate()
    }    
    render() {
        console.log(this.state.data, 'this.state.data')
        return (
            <ThemeProvider style={{ background: '#f7f7f7', minHeight: '100vh' }}>
                <div style={{ paddingLeft: '10px' }}>
                    {
                        _user.customer.custTypeId == 9 ?
                        <DropDownMenu value={this.state.type} onChange={this.typeChange} underlineStyle={{ borderTop: 0 }} labelStyle={{ padding: '0 20px 0 6px', lineHeight: '48px' }} iconStyle={{ top: 14, right: -2 }}>
                            <MenuItem value={0} primaryText="平台总揽" /> 
                            <MenuItem value={2} primaryText="代理授权" />
                            <MenuItem value={3} primaryText="客户管理" />
                        </DropDownMenu>:
                        _user.customer.custTypeId === 10 && _user.customer.Authorize.indexOf('3') > -1 ?
                        <DropDownMenu value={this.state.type} onChange={this.typeChange} underlineStyle={{ borderTop: 0 }} labelStyle={{ padding: '0 20px 0 6px', lineHeight: '48px' }} iconStyle={{ top: 14, right: -2 }}>
                            <MenuItem value={3} primaryText="客户管理" />                         
                        </DropDownMenu>:      
                        <DropDownMenu value={this.state.type} onChange={this.typeChange} underlineStyle={{ borderTop: 0 }} labelStyle={{ padding: '0 20px 0 6px', lineHeight: '48px' }} iconStyle={{ top: 14, right: -2 }}>
                            <MenuItem value={0} primaryText="平台总揽" /> 
                            {/*<MenuItem value={1} primaryText="挪车贴管理" />*/}
                        </DropDownMenu>
                    }
                    {
                        this.state.type === 0 ? <RightIconMenu onClick={this.click}/>:                            
                        this.state.type === 2 ? <IconButton style={{ float: 'right' }} onClick={this.showQr}><ContentAdd color={blue500} /></IconButton>:
                        this.state.type === 3 ? <IconButton style={{ float: 'right' }} onClick={this.showQr}><ContentAdd color={blue500} /></IconButton>:null  
                    }
                    {/*<span style={{float:'right',color:'#2196f3',display:'inline-block',width:48,lineHeight:'48px',textAlign:'center'}}>{'配置'}</span>*/}
                </div>
                <div>
                    {
                        this.state.type === 0 ? <WxList data={this.state.data} showQr={this._showQr} />:
                        this.state.type === 2 ? <AuthorizeList />: 
                        this.state.type === 3 ? <MoveCarList />: null
                    }
                </div>
                <SonPage open={this.state.show_sonpage} back={this.showWxBox}>
                    <Wxbox type={this.state.type} data={this.state.data} onSuccess={this.configSuccess} />
                </SonPage>
                <SonPage open={this.state.showCar} back={this.hideCar}>
                    <MoveCar />
                </SonPage>
                <SonPage open={this.state.showCarManager} back={this.hideCarManager}>
                    <CarManager data={this.state.data} qr={this.state.qrLink} />
                </SonPage>
                {/*邀约注册*/}
                <SonPage open={this.state.showQr} back={this.hideQr}>
                    <QrBox show={this.state.showQr} hide={this.hideQr} actionType={this.state.type} url={this.state.qrUrl}/>
                </SonPage>  
            </ThemeProvider>
        );
    }
}


//公众号
class WxList extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: props.data,
            user: 0
        }
        this.getUrl = this.getUrl.bind(this);
        this.showQr = this.showQr.bind(this);
    }
    showQr(){
        this.props.showQr();
    }
    componentDidMount() {
        Wapi.weixin.get(res => {
            if (res.data) {
                Wapi.serverApi.getWeixinUser((json) => {
                    // debugger;
                    if (json.list) {
                         if (json.list.length) {
                            let subscribe = json.list[0].cumulate_user;
                            this.setState({ user: subscribe });
                            // 更新客户表中的关注数，以便系统管理员及代理商可以进行统计
                            Wapi.customer.update(res => {
                                console.log(res, 'update customer subscribe');
                            }, {
                                _objectId: _user.customer.objectId,
                                subscribe: subscribe
                            })
                        }
                    }
                }, {
                        wxAppKey: res.data.wxAppKey
                    })
            }
        }, {
                uid: _user.customer.objectId,
                type: 0
            }, {
                fields: 'objectId,uid,name,type,wxAppKey,wxAppSecret,menu'
            })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({ user: null })
            this.setState({ data: nextProps.data })
            // console.log(nextProps.data[0].wxAppKey)
            if (nextProps.data[0]) {
                Wapi.serverApi.getWeixinUser((json) => {
                    // debugger;
                    // console.log(json)
                    if (json.list) {
                        if (json.list.length) {
                            let subscribe = json.list[0].cumulate_user;
                            this.setState({ user: subscribe });
                            // 更新客户表中的关注数，以便系统管理员及代理商可以进行统计
                            Wapi.customer.update(res => {
                                console.log(res, 'update customer subscribe');
                            }, {
                                _objectId: _user.customer.objectId,
                                subscribe: subscribe
                            })
                        }
                    }
                }, {
                        wxAppKey: nextProps.data[0].wxAppKey
                    })
            }
        }
    }
    getUrl(i) {
        let wxAppKey = this.state.data[0].wxAppKey;
        let context = '将车主服务链接配置到公众号<%wx%>的自定义菜单里，既能通过为车主提供刚需服务增加公众号的活跃度，还能借助平台服务和本地汽车后市场服务商建立互惠共赢的合作。'.replace('<%wx%>', this.state.data[0].name)

        let text = ''
        if (i == -1) {
            text = 'http://' + domain[1] + '/?wx_app_id=' + wxAppKey
        }
        W.alert(text + ' ' + context)

    }
    render() {
        console.log(this.state.data, 'state.data')
        console.log(this.props.data, 'data')
        // conso
        if(this.state.data){
            let name = this.state.data.map((ele, index) => (<span key={index} style={{ display: 'inline-block', lineHeight: '48px', paddingLeft: '10px' }}>{ele.name}</span>))
        }
        // console.log(name,'name')
        return (
            <div style={{ background: '#fff' }}>
                {
                    this.state.data ?(this.state.data.length ?
                        <div><UserTotal /></div>
                        :
                        (_user.customer.custTypeId === 5 || _user.customer.custTypeId === 10 || _user.customer.custTypeId === 9 ?
                        <div style={{ padding: '0px 10px 0px 10px', minHeight: 44}}>
                            <div style={{padding: 11, fontSize: 14, lineHeight: '30px'}}>使用扫码挪车前请在平台总览》右上角菜单中先配置公众号，认证公众号和开通模版消息需要几天时间，可先了解如何制作挪车贴后根据需要在挪车贴管理页面生成相应二维码后委托第三方设计印刷。</div>
                        </div>
                        :null)):null
                }
            </div>
        );
    }
}

//挪车卡管理
class CarManager extends Component {
    constructor(props, context) {
        super(props, context)
        this._data = {//筛选条件
            uid: _user.customer.objectId,
            type: 2
        };
        this.op = {//控制排序字段与页数
            page: 'objectId',
            sorts: 'objectId',
            page_no: 1
        };
        this.state = {
            total: 0,
            data: null,
            type1: null,
            type2: null,
            qrdata: [],
            noneWx: null
        };
        this.goList = this.goList.bind(this);
        this.goNormalList = this.goNormalList.bind(this);
        this.added = this.added.bind(this);
    }
    componentDidMount() {
        Wapi.qrDistribution.list(res => this.setState(res), this._data);
        window.addEventListener('addOneQr', this.added);
        let sUrl = '';
        Wapi.weixin.get(wx => {
            if (wx.data) {
                let wxAppKey = wx.data.wxAppKey
                AddQrLink(wxAppKey, (op) => {
                    console.log(op, 'op')
                    // debugger;
                    if (op.type1) {
                        this.setState({ type1: op.type1 })
                        this.setState({ type2: op.type2 })
                    } else {
                        this.setState({ qrdata: op })
                    }
                })
                this.setState({ noneWx: 0 })
            } else {
                console.log(1)
                this.setState({ noneWx: 1 })
            }
        }, {
                uid: _user.customer.objectId,
                type: 0
            })
    }
    componentWillUnmount() {
        window.removeEventListener('addOneQr', this.added);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.data.length) {
            this.setState({ noneWx: 0 })
            // console.log(nextProps.data,'dd')
        }
        if (nextProps && nextProps.qr) {
            if (nextProps.qr.length && nextProps.qr.type1) {
                this.setState({ type1: nextProps.qr.type1 })
                this.setState({ type2: nextProps.qr.type2 })
            }

        }
    }
    goList() {
        thisView.goTo('one_qr.js')
    }
    goNormalList() {
        thisView.goTo('normal_qr.js')
    }
    added(e) {//添加了一个
        let item = e.params;
        this.setState({
            total: this.state.total + 1,
            data: this.state.data.concat([item])
        });
    }
    render() {
        console.log(this.state.noneWx, 'noneWx')
        let type1, type2;
        console.log(this.state.qrdata, 'qrdata')
        if (this.state.qrdata.length) {
            // //    console.log(this.state.qrdata[0].url)
            let surl = 'http://autogps.cn/?s='
            this.state.qrdata.forEach(ele => {
                ele.url.split('&').forEach(el => {
                    if (el == "type=1") {
                        type1 = surl + ele.id
                    } else if (el == "type=2") {
                        type2 = surl + ele.id
                    }
                })
            })

        } else {
            type1 = this.state.type1;
            type2 = this.state.type2
        }
        // console.log(type1,type2,this.data,'type1','type2')
        console.log(this.state.data)
        let all = 0
        if (this.state.data) {
            this.state.data.forEach(ele => {
                all += ele.num;
            })
        }
        let width = (window.screen.width - 20) / 3 + 'px'
        return (
            <div style={{ backgroundColor: '#f7f7f7', height: '100%'}}>
                {
                    this.state.noneWx === null ? null:
                    this.state.noneWx === 0 ?
                        <div>
                            <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', backgroundColor: '#f7f7f7' }}>
                                <div style={{ marginBottom: '1em' }}>
                                    {/*{this.props.data.name}*/}
                                    {'一物一码'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    <span style={{ display: 'inline-block', width: width }}>
                                        {/*<span >{"号码" + '：'}</span>*/}
                                        <a onClick={this.goList} style={{ color: '#1a8cff', marginRight: '2em' }}>{'挪车二维码'}</a>
                                    </span>
                                    <span style={{ display: 'inline-block', width: width }}>{'绑定' + '：' + (_user.customer.onecar_bind || 0)}</span>
                                    <span style={{ display: 'inline-block', width: width }}>{'挪车' + '：' + (_user.customer.onecar_move || 0)}</span>
                                </div>
                            </div>
                            <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', background: '#fff' }}>
                                <div style={{ marginBottom: '1em' }}>
                                    {'普通挪车'}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    <span style={{ display: 'inline-block', width: width }}>
                                        <a onClick={this.goNormalList} style={{ color: '#1a8cff', marginRight: '2em' }}>{'挪车二维码'}</a>
                                    </span>
                                    <span style={{ display: 'inline-block', width: width }}>{'绑定' + '：' + (_user.customer.car_bind || 0)}</span>
                                    <span style={{ display: 'inline-block', width: width }}>{'挪车' + '：' + (_user.customer.car_move || 0)}</span>
                                </div>
                                {/*<div style={{ fontSize: '12px', color: '#666' }}>
                                    <span style={{ display: 'block', lineHeight: '20px' }}>{'车主绑定车辆链接' + '：' + type1}</span>
                                    <span style={{ display: 'block', lineHeight: '20px' }}>{'他人呼叫车主链接' + '：' + type2}</span>
                                </div>*/}
                            </div>
                            <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', background: '#fff', fontSize: 12 }}>
                                {/*<p style={{ textIndent: '2em', marginTop: 0 }}>{'制作一物一码挪车贴，点击＋根据印刷数量创建挪车贴号段后生成二维码，制作普通挪车卡，使用车主绑定车辆链接和他人呼叫车主链接生成二维码。 '}</p>*/}
                                <p style={{ textIndent: '2em',  marginTop: 0, marginBottom: 0 }}>{'资费标准：绑定时产生一条验证码短信，按0.10元收取，挪车时产生一条验证码短信和一条车主语音通知短信，按0.20元收取，在次日统一结算并从企业账号自动扣款，如帐户余额不足，将暂停使用挪车功能。'}</p>
                            </div>
                        </div>
                        :
                        <div style={{ padding: '0px 10px 0px 10px', minHeight: 44, backgroundColor: '#f7f7f7'}}>
                            <div style={{padding: 11, fontSize: 14, lineHeight: '30px'}}>使用扫码挪车前请在平台总览》右上角菜单中先配置公众号，认证公众号和开通模版消息需要几天时间，可先了解如何制作挪车贴后根据需要在挪车贴管理页面生成相应二维码后委托第三方设计印刷。</div>
                        </div>
                }
            </div>

        )
    }
}

function AddQrLink(wxAppKey, callback) {
    let qrLinkData = {
        uid: _user.customer.objectId,
        type: 2,
        i: 0,
        id: _user.customer.objectId + 'A',
        url: 'http://' + WiStorm.config.domain.user + '/wo365_user' + '/movecar.html?intent=logout'
        + '&needOpenId=' + true
        + '&creator=' + _user.customer.objectId
        + '&type=' + 1
        + '&wx_app_id=' + wxAppKey
    };
    let qrLinkData2 = {
        uid: _user.customer.objectId,
        type: 2,
        i: 0,
        id: _user.customer.objectId + 'B',
        url: 'http://' + WiStorm.config.domain.user + '/wo365_user' + '/movecar.html?intent=logout'
        + '&needOpenId=' + true
        + '&creator=' + _user.customer.objectId
        + '&type=' + 2
        + '&wx_app_id=' + wxAppKey
    }
    let op = {};
    Wapi.qrLink.list(res => {
        // op.data = res.data
        if (!res.data.length) {
            Wapi.qrLink.add(res => {
                Wapi.qrLink.get(r => {
                    let type1 = 'http://autogps.cn/?s=' + r.data.id;
                    op.type1 = type1
                    Wapi.qrLink.add(re => {
                        Wapi.qrLink.get(rs => {
                            let type2 = 'http://autogps.cn/?s=' + rs.data.id;
                            op.type2 = type2
                            callback(op);
                        }, { objectId: re.objectId });
                    }, qrLinkData2);
                }, { objectId: res.objectId });
            }, qrLinkData);
        } else {
            callback(res.data)
        }
    }, {
            uid: _user.customer.objectId,
            type: 2
        })
}


//公众号配置
class Wxbox extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            step: 1,
            data: props.data,
            name: null,
            appkey: null,
            appSecret: null,
            fileName: null
        }
        this.fromData = {};
        this.cancel = this.cancel.bind(this)
        this.change = this.change.bind(this)
        this.prevStep = this.prevStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.goLast = this.goLast.bind(this)
        this.save = this.save.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.data && nextProps.data.length) {
            // this.setState({data:nextProps.data})
            this.setState({ name: nextProps.data[0].name })
            this.setState({ appkey: nextProps.data[0].wxAppKey })
            this.setState({ appSecret: nextProps.data[0].wxAppSecret })
            this.setState({ fileName: nextProps.data[0].fileName })
            this.fromData = {
                name: nextProps.data[0].name,
                wxAppKey: nextProps.data[0].wxAppKey,
                wxAppSecret: nextProps.data[0].wxAppSecret,
                fileName: nextProps.data[0].fileName
            }
        }
    }
    change(e, val) {
        let name = e.currentTarget.name;
        if (name == 'name') {
            this.setState({ name: val })
        } else if (name == 'wxAppKey') {
            this.setState({ appkey: val })
        } else if (name == 'wxAppSecret') {
            this.setState({ appSecret: val })
        } else if (name == 'fileName') {
            this.setState({ fileName: val })
        }
        // let name = e.currentTarget.name;
        this.fromData[name] = val;
        this.forceUpdate();
    }
    goLast() {
        W.loading(false);
        // W.alert('保存公众号设置成功，进入下一步');
        this.setState({step: ++this.state.step});
        // history.back();
    }
    cancel() {
        this.setState({step: 1});
        history.back();
    }
    prevStep() {
        if(this.state.step === 1){
            return;
        }
        this.setState({step: --this.state.step});
    }
    nextStep() {
        if(this.state.step === 2){
            this.save();
            return;
        }
        this.setState({step: ++this.state.step});    
    }
    save() {
        let wx = Object.assign({}, this.fromData);
        // console.log(wx,'获得输入的值')
        wx.uid = _user.customer.objectId;
        wx.type = this.props.type;
        if (!wx.name) {
            W.alert(___.wx_name_null);
            return;
        }
        if (!wx.wxAppKey) {
            W.alert(___.appid_null);
            return;
        }
        if (!wx.wxAppSecret) {
            W.alert(___.appSecret_null);
            return;
        }
        if (!wx.fileName) {
            W.alert(___.wx_file_name_null);
            return
        }
        var that = this;
        W.loading(true,'保存中...')
        Wapi.weixin.get(_wx => {
            if (_wx.data && _wx.data.uid != _user.customer.objectId) {
                W.loading(false);
                W.alert(___.wxApp_used);
                return
            }
            // history.back()
            Wapi.serverApi.saveConfigFile(res => {
                //检查是否有配置过，有就update,没有就add
                Wapi.weixin.get(_wxin => {
                    if (_wxin.data) {
                        wx._objectId = _wxin.data.objectId;
                        Wapi.weixin.update(res => {
                            wx.objectId = _wxin.data.objectId
                            delete wx._objectId;
                            that.props.onSuccess(wx);
                            that.goLast();
                            // debugger;
                        }, wx)
                    } else {
                        Wapi.weixin.add(res => {
                            wx.objectId = res.objectId;
                            that.props.onSuccess(wx);
                            that.goLast();
                        }, wx)
                    }
                }, {
                        uid: wx.uid,
                        type: wx.type
                    })
            }, {
                    fileName: this.fromData.fileName
                })
        }, {
                wxAppKey: wx.wxAppKey
            })
    }
    render() {
        console.log(this.state.data, 'data')

        let wxAppKey, wxAppSecret, name, fileName;
        name = this.state.name;
        wxAppKey = this.state.appkey;
        wxAppSecret = this.state.appSecret
        fileName = this.state.fileName

        // console.log(this.props.type,'type')
        let save_wx_data = ___.save_wx_data.replace('<%domain%>', domain[this.props.type])
        // let text =""
        let text = 'http://' + domain[0] + '/user.autogps.php?wxAppKey=' + wxAppKey + '&wxAppSecret=' + wxAppSecret;

        return (
            <div style={sty.wxbox}>
                {
                    this.state.step === 1 ? 
                    <div>
                        <span style={sty.title}>第一步、申请服务号并认证</span>
                        <p style={sty.content}>申请<b>微信服务号</b>，进行微信认证并开通模板消息后进行下一步。</p>
                        <p style={sty.subtitle}>为何要申请及认证微信服务号？</p>
                        <p style={sty.content}>平台需通过模板消息推送挪车通知和回复，而模板消息只对认证的微信服务号开放。</p>
                        <p style={sty.subtitle}>如何开通模板消息？</p>
                        <p style={sty.content}>登录公众号，打开左边菜单栏》功能》添加功能插件，选择“模板消息”，申请开通模板消息功能，主营行业选择<b>IT科技／互联网|电子商务</b>，副营行业选择<b>交通工具／汽车相关</b>。</p>   
                        <div style={sty.buttonbar}>  
                            {/*<FlatButton label={'上一步'} onClick={this.prevStep} primary={true} /> */}
                            <FlatButton label={'下一步'} onClick={this.nextStep} primary={true} />       
                        </div>   
                    </div>:
                    this.state.step === 2 ?
                    <div>
                        <span style={sty.title}>第二步、设置AppID和AppSecret</span>
                        <p style={sty.inputContent}>
                            <Input style={sty.input} inputStyle={sty.input} name='name' onChange={this.change} hintText={name ? name : ___.wx_name} value={name} />
                        </p>
                        <p style={sty.subtitle}>{___.find_appid}</p>
                        <p style={sty.inputContent}>
                            <Input style={sty.input} inputStyle={sty.input} name='wxAppKey' onChange={this.change} hintText={wxAppKey ? wxAppKey : 'AppId'} value={wxAppKey} />
                            <Input style={sty.input} inputStyle={sty.input} name='wxAppSecret' onChange={this.change} hintText={wxAppSecret ? wxAppSecret : 'AppSecret'} value={wxAppSecret} />
                        </p>
                        <p style={sty.subtitle}>{___.input_file_name}</p>
                        <p style={sty.inputContent}>
                            <Input style={sty.input} inputStyle={sty.input} name='fileName' onChange={this.change} hintText={___.wx_file_name} value={fileName} />  
                        </p>
                        <div style={sty.buttonbar}>  
                            <FlatButton label={'上一步'} onClick={this.prevStep} primary={true} /> 
                            <FlatButton label={'下一步'} onClick={this.nextStep} primary={true} />       
                        </div>   
                    </div>:
                    this.state.step === 3 ?
                    <div>
                        <span style={sty.title}>第三步、配置公众号</span>
                        <p style={sty.subtitle}>打开左边菜单栏》设置》公众号设置》功能设置》网页授权域名》设置</p>
                        <p style={sty.content}>授权回调页面域名设置为<span style={sty.highlight}>{domain[this.props.type]}</span></p>
                        <p style={sty.subtitle}>打开左边菜单栏》开发》基本配置，启用服务器配置</p>
                        <p style={sty.content}>URL填入<span style={sty.highlight}>{text}&nbsp;&nbsp;<a style={{color: blue500}} className="copyToClip" data-clipboard-text={text}>复制</a></span></p>
                        <p style={sty.content}>Token填入<span style={sty.highlight}>baba</span></p>
                        <p style={sty.content}>随机生成EncodingAESKey</p>
                        <p style={sty.content}>消息加解密方式选择<span style={sty.highlight}>明文模式</span></p>
                        <div style={sty.buttonbar}>  
                            <FlatButton label={'上一步'} onClick={this.prevStep} primary={true} /> 
                            <FlatButton label={'退出'} onClick={this.cancel} primary={true} />       
                        </div>   
                    </div>: 
                    this.state.step === 4 ?
                    <div>
                        <span style={sty.title}>最后一步、自定义菜单</span>
                        <div style={sty.buttonbar}>  
                            <FlatButton label={'上一步'} onClick={this.prevStep} primary={true} /> 
                            <FlatButton label={'下一步'} onClick={this.nextStep} primary={true} />       
                        </div>   
                    </div>: null                                                           
                }
                {/*<h4 style={sty.h4}>{___.certification}</h4>
                <Input name='name' onChange={this.change} hintText={name ? name : ___.wx_name} value={name} />
                <p style={sty.h4}>{___.find_appid}</p>
                <Input name='wxAppKey' onChange={this.change} hintText={wxAppKey ? wxAppKey : 'AppId'} value={wxAppKey} />
                <Input name='wxAppSecret' onChange={this.change} hintText={wxAppSecret ? wxAppSecret : 'AppSecret'} value={wxAppSecret} />
                <p style={sty.h4}>{___.input_file_name}</p>
                <Input name='fileName' onChange={this.change} hintText={___.wx_file_name} value={fileName} />
                <p style={sty.h4}>{save_wx_data}</p>
                <p style={sty.h4}>{'4、' + ___.wx_config_last + text}</p>
                <FlatButton label={___.cancel} onClick={() => { history.back() }} primary={true} />
                <FlatButton label={___.save} onClick={this.save} primary={true} />*/}
            </div>
        )
    }
}

//创建一物一码挪车贴
class MoveCar extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            type: 2,
            name: '',
            num: '',
        }
        // this.typeChange = this.typeChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.numChange = this.numChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    nameChange(e, value) {
        this.setState({ name: value });
        console.log(value)
    }
    numChange(e, value) {
        this.setState({ num: value });
        console.log(value)
    }
    submit() {
        if (!this.state.name || this.state.name == '') {
            W.alert('请输入名称');
            return;
        }
        if (!this.state.num || this.state.num == '') {
            W.alert('请输入印刷数量');
            return;
        }
        let num = parseInt(this.state.num);
        // console.log(num!=this.state.num)
        if ((this.state.num != num)) {
            W.alert('请输入正确的数量');
            return;
        }
        if (isNaN(num)) {
            W.alert('请输入正确的数量');
            return;
        }
        let data = Object.assign({}, this.state);
        data.num = num;
        data.uid = _user.customer.objectId; //创建者uid
        Wapi.qrDistribution.list(res => {//获取最后一条记录的最大值
            let min = res.data.length ? res.data[0].max + 1 : 0;
            data.min = min;
            data.max = min + data.num - 1;
            Wapi.qrDistribution.add(res => {
                data.objectId = res.objectId;
                W.emit(window, 'addOneQr', data);
                history.back();
                this.setState({
                    name: '',
                    num: ''
                });
            }, data);
        }, {
                objectId: '>0'
            }, {
                sorts: '-objectId',
                page: 'objectId',
                limit: 1
            });
    }
    render() {
        return (
            <div style={{ background: '#f7f7f7', minHeight: '100vh', paddingTop: 20 }}>
                <div style={{ background: '#fff' }}>
                    <TextField
                        hintText="名称"
                        value={this.state.name}
                        onChange={this.nameChange}
                        style={{ width: '100%' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ padding: '0px 0px 0px 10px' }}
                        underlineStyle={{ bottom: 0, borderBottomColor: '#f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                    <TextField
                        hintText="印刷数量"
                        value={this.state.num}
                        onChange={this.numChange}
                        style={{ width: '100%' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ padding: '0px 0px 0px 10px' }}
                        underlineStyle={{ bottom: '0px', borderBottomColor: '#f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <RaisedButton label="创建" primary={true} onClick={this.submit} />
                </div>
            </div>
        )
    }
}

//业务授权公司列表
class AuthorizeList extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            type: 0,
            data: null,
            showAuth: 0
        }
        this.showAuth = this.showAuth.bind(this);
        this.backAuth = this.backAuth.bind(this);
    }
    componentDidMount() {
        // this.setState({ type: 4 })
        // Wapi.authorize.list(res => {
        //     console.log(res.data, 'res.data')
        //     this.setState({ data: res.data })
        // }, {
        //     authorizeType: '3',
        //     actProductId: 4,
        // })
        this.setState({ type: 4 });
        W.loading('加载中...');
        Wapi.customer.list(res => {
            let ids = [];
            res.data.map(function(e, i){
                ids.push(e.objectId);
            });

            let par={
                "group":{
                    "_id":{"parentId":"$parentId"},
                    "count":{"$sum":1},
                    "onecar_bind":{"$sum":"$onecar_bind"},
                    "onecar_move":{"$sum":"$onecar_move"},
                    "car_bind":{"$sum":"$car_bind"},
                    "car_move":{"$sum":"$car_move"}
                },
                "sorts":"parentId",
                parentId: ids.join('|'),
                custTypeId: 10
            }
            Wapi.customer.aggr(total=>{
                console.log(total,'get customer car move total begin');
                res.data.map(function(e, i){
                    for(let i = 0; i < total.data.length; i++){
                        if(total.data[i]._id.parentId.indexOf(e.objectId.toString()) > -1){
                            e.count = total.data[i].count;
                            e.bind_num = total.data[i].car_bind + total.data[i].onecar_bind;
                            e.move_num = total.data[i].car_move + total.data[i].onecar_move;
                            break;
                        }
                    }
                });
                this.setState({ data: res.data });
                W.loading(false);
                console.log(res.data, 'get customer car move total end.');
            },par);            
        }, {
            parentId: _user.customer.objectId,
            custTypeId: 10,
            Authorize: '3'
        }, {
            sorts: '-createdAt',
            page: '-createdAt',
            limit: -1
        })
    }
    showAuth(e, i, v) {
        this.setState({ showAuth: v })
    }
    backAuth() {
        this.setState({ showAuth: 0 })
    }
    render() {
        // console.log(this.state.showAuth,'hhhhh')
        // console.log(this.state.data,'获取到的授权表中业务类型')
        return (
            <div style={{ background: '#f7f7f7', minHeight: '100%' }}>
                {/*<span style={{ display: 'inline-block', lineHeight: '48px', paddingLeft: '16px' }}>扫码挪车</span>
                <DropDownMenu value={this.state.showAuth} onChange={this.showAuth} underlineStyle={{ borderTop: 0 }} style={{ float: 'right' }} labelStyle={{ padding: '0 20px 0 6px', lineHeight: '48px' }} iconStyle={{ top: 14, right: -2 }}>
                    <MenuItem value={0} primaryText="已授权" />
                    <MenuItem value={1} primaryText="新增授权" />
                </DropDownMenu>*/}
                <div>
                    <Authorized
                        data={this.state.data}
                        type={this.state.type}
                        back={this.backAuth}
                    />
                </div>
            </div>
        )
    }
}
//已授权
class Authorized extends Component {
    constructor(props, context) {
        super(props, context)
        this.check = this.check.bind(this);
        this.search = this.search.bind(this);
        this.submit = this.submit.bind(this);
        this.searchKey = '';
        this.data = [];
        this.obj = [];
    }
    check(e, val) {
        if (val) {
            this.data.push(JSON.parse(e.target.value))
        } else {
            let dele = null;
            this.data.forEach((ele, index) => {
                if (ele.objectId == JSON.parse(e.target.value).objectId) {
                    dele = index;
                }
            })
            console.log(dele);
            this.data.splice(dele, 1)
            // this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data, 'data')
        // console.log(JSON.parse(e.target.value),'dd')
    }
   search(e, val) {
        // this.data=val;
        // this._data.name = "^" + val
        console.log(e,val,'search vehicle');
        // Wapi.customer.list(res => {
        //     console.log(res.data, 'res');
        //     this.setState({ search: res.data });
        // }, this._data)
        this.searchKey = val;
        this.forceUpdate();
    }
    submit() {
        let custobj = [];
        let auobj = [];
        let that = this;
        // let type = ['营销推广','政企业务','平台运营','扫码移车']
        W.confirm(___.confirm_remove_authorize,function(b){
        	if(b){
                that.data.forEach(ele => {
                    custobj.push(ele.applyCompanyId);
                    auobj.push(ele.objectId);
                })
                Wapi.authorize.update(res => {
                    // console.log(res,'ddddfdfdfd')
                    // history.back();
                    Wapi.customer.update(res => {
                        // history.back();
                        // this.props.back()
                        Wapi.authorize.list(res => {
                            console.log(res.data, 'refresh authorize list.')
                            that.props.data = res.data;
                            that.forceUpdate();
                        }, {
                            authorizeType: 3,
                            actProductId: 4,
                        })
                    }, {
                            _objectId: custobj.join('|'),
                            Authorize: '-3'
                        })
                }, { _objectId: auobj.join('|'), status: 2 })
        	}
        });
    }
    render() {
        console.log(this.props.data, 'ddff')
        let dataLength = [];
        let Item = null;
        if(this.props.data){
            Item = this.props.data.map((ele, index) => {
                dataLength.push(ele)
                if (this.searchKey === '' || ele.name.indexOf(this.searchKey) > -1) {
                    return (
                        <div>
                            <div style={{ borderBottom: '0px solid #f7f7f7', background: '#fff', padding: 10 }}>
                                {ele.name}
                            </div>
                            <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px 10px', background: '#fff' }}>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    <span style={{ display: 'inline-block', width: '33%' }}>{'客户' + '：' + (ele.count || 0)}</span>
                                    <span style={{ display: 'inline-block', width: '33%' }}>{'绑定' + '：' + (ele.bind_num || 0)}</span>
                                    <span style={{ display: 'inline-block', width: '33%' }}>{'挪车' + '：' + (ele.move_num || 0)}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }
        // console.log(Item.length)
        return (
            <div>
                <TextField
                    hintText={___.search}
                    onChange={this.search}
                    style={{ width: '100%', background: '#fff' }}
                    hintStyle={{ paddingLeft: 10 }}
                    inputStyle={{ padding: '0px 10px 0px 10px' }}
                    underlineStyle={{ bottom: '0px', borderBottomColor: '#f7f7f7' }}
                    underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                />
                {Item}
                <div style={{ fontSize:'14px', width: '100%', textAlign: 'center', marginTop: '20px' }}>
                    {!this.props.data ? null: (dataLength.length > 0 ? null : <MenuItem primaryText='点击右上角+创建扫码挪车代理商' style={{ background: '#fff', fontSize:'14px',  }} />)}
                </div>
            </div>
        );
    }
}
//新增授权
class Authorizing extends Component {
    constructor(props, context) {
        super(props, context)
        this._data = {
            custTypeId: '1|5',
            appId: WiStorm.config.objectId
        }
        this.state = {
            company: [],
            total: 0,
            search: [],
            addAuthorize: []
        }
        this.page = 1;
        this.search = this.search.bind(this);
        this.submit = this.submit.bind(this);
        this.addAuthorize = [];
    }
    componentDidMount() {
        Wapi.customer.list(res => {
            this.setState({ company: res.data });
            this.setState({ total: res.total })
        }, this._data, { page_no: this.page })

        window.addEventListener('addAutho', e => {
            this.addAuthorize = e.params
        })


    }
    search(e, val) {
        // this.data=val;
        this._data.name = "^" + val
        // console.log(e,val,'dd')
        Wapi.customer.list(res => {
            console.log(res.data, 'res');
            this.setState({ search: res.data });
        }, this._data)
    }
    loadNextPage() {
        let arr = this.state.company;
        this.page++;
        Wapi.customer.list(res => {
            this.setState({ company: arr.concat(res.data) });
        }, this._data, {
                page_no: this.page
            });
    }

    submit() {
        console.log(2)
        // this.watch()
        console.log(this.addAuthorize, '授权')
        var create_json = {
            data: []
        };
        let getdata = this.addAuthorize;
        // let data = [];
        let auData = [];//存储已经存在在授权表但已暂停授权
        this.props.data.forEach(ele => {
            if (ele.status == 2) {
                // console.log(ele,'elelee')
                this.addAuthorize.forEach(e => {
                    if (ele.applyCompanyId == e.objectId) {
                        // console.log(e,'eeeeeeeee')
                        getdata.splice(getdata.indexOf(e), 1)
                        // console.log()
                        // data.concat(this.addAuthorize.splice(getdata.indexOf(e),1))
                        // data.push(e)
                        auData.push(ele)
                    }
                })
            }
        })

        // console.log(data,'customer信息')
        console.log(auData, 'auData')
        getdata.map(ele => {
            var op = {
                actProductId: this.props.type,
                applyCompanyId: ele.objectId,
                applyCompanyName: encodeURIComponent(ele.name),
                applyUserName: encodeURIComponent(ele.contact),
                authorizeType: 3,
                status: 1
            }
            create_json.data.push(op)
        })
        console.log(create_json, 'addcreate')
        // let type = ['营销推广','政企业务','平台运营','扫码移车']
        if (auData.length > 0) {
            let obj = [];
            let auobj = [];
            // data.forEach(ele => {
            //     obj.push(ele.objectId)
            // })
            auData.forEach(ele => {
                auobj.push(ele.objectId);
                obj.push(ele.applyCompanyId)
            })
            console.log(obj, 'obje')
            Wapi.authorize.update(res => {
                // history.back();
                Wapi.customer.update(res => {
                    this.props.back()
                    history.back();
                }, {
                        _objectId: obj.join('|'),
                        Authorize: '+' + (this.props.type - 1) + ''
                    })
            }, { _objectId: auobj.join('|'), status: 1 })
        }
        if (this.addAuthorize.length) {
            let cpdata = [];
            this.addAuthorize.forEach(ele => {
                cpdata.push(ele.objectId)
            })

            Wapi.authorize.addBatch(res => {
                // history.back();
                Wapi.customer.update(res => {
                    this.props.back()
                    history.back();
                }, {
                        _objectId: cpdata.join('|'),
                        Authorize: '+' + (this.props.type - 1) + ''
                    })
            }, create_json)
        }

    }
    render() {
        // console.log(this.state.company,'当前的品牌/代理')
        // console.log(this.state.search,'搜索的品/代')
        console.log(this.props.type, '授权类型')
        // console.log(this.props.data,'ddffss')
        console.log(this.addAuthorize, '授权')
        let listDis = {};
        let searchList = null;

        let addCompany = this.state.company
        // if(this.state.search.length){

        // }
        // 筛选authorize表中是否有公司已授权
        this.props.data.forEach(ele => {
            if (ele.status == 1) {
                addCompany.forEach((eles, index) => {
                    if (eles.objectId == ele.applyCompanyId) {
                        addCompany.splice(index, 1)
                    }
                })
            }
        })
        // console.log(addCompany,'筛选过后')
        if (this.state.search.length) {
            let searchComp = this.state.search
            this.props.data.forEach(ele => {
                if (ele.status == 1) {
                    searchComp.forEach((eles, index) => {
                        if (eles.objectId == ele.applyCompanyId) {
                            searchComp.splice(index, 1)
                        }
                    })
                }
            })
            searchList = <NoAuItem data={searchComp} />;
            listDis.display = 'none';
        }
        return (
            <div >
                <div style={{ background: '#fff' }}>
                    <TextField
                        hintText={___.search}
                        onChange={this.search}
                        style={{ width: '100%', background: '#fff' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ paddingLeft: 10 }}
                        underlineStyle={{ bottom: '0px', borderBottomColor: '#f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                    <div style={listDis}>
                        <NoAulist
                            max={this.state.total}
                            limit={20}
                            data={addCompany}
                            next={this.loadNextPage}
                        />
                    </div>
                    {searchList}
                </div>
                <div style={{ width: '100%', textAlign: 'center', marginTop: '20px', paddingBottom: 20 }}>
                    <RaisedButton label="确认授权" onClick={this.submit} secondary={true} />
                </div>
            </div>
        );
    }
}

class NoAuItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: props.data
        }
        this.check = this.check.bind(this);
        this.data = [];
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data })
    }
    check(e, val) {
        if (val) {
            this.data.push(JSON.parse(e.target.value))
        } else {
            let dele = null;
            this.data.forEach((ele, index) => {
                if (ele.objectId == JSON.parse(e.target.value).objectId) {
                    dele = index;
                }
            })
            console.log(dele);
            this.data.splice(dele, 1)
            // this.data.splice(this.data.indexOf(JSON.parse(e.target.value),1))
        }
        console.log(this.data, 'data')
        W.emit(window, 'addAutho', this.data)
    }
    render() {
        // console.log(this.state.data,'thi.pfr.d')
        let items = this.state.data.map((ele, index) => {
            // let data = [];
            // data.push(ele)
            return (<MenuItem
                rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{ float: 'right' }} />}
                primaryText={ele.name}
                key={index}
                value={ele}
                style={{ borderBottom: '1px solid #f7f7f7', background: '#fff' }}
            />)
        });
        return (
            <div >
                {items}
            </div>
        )
    }
}
let NoAulist = AutoList(NoAuItem);

// 邀约注册
class QrBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            active:0,
            actionType: props.actionType,
            url:props.url
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
        let imgSty={};
        if(this.state.active)imgSty.display='none';
        return (
            <div style={dis}>
                <div style={imgSty}>
                    <div style={qrSty}>
                        <h4>{_user.customer.name}</h4>
                        <div>{this.props.actionType === 2?'印刷合作伙伴注册':'扫码挪车客户注册'}</div>
                        <QrImg data={this.state.url} style={{display:'inline-block',marginTop:'10%'}}/>
                    </div>
                    <br/>
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
//分享页面
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

class MoveCarList extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            type:0,
            active:0,
            custType:1,
            data:null,
            total:0
        }
        // this.change = this.change.bind(this);
        this._data = {
            parentId:_user.customer.objectId
        }
        this.loadNextPage = this.loadNextPage.bind(this)
        this.showQr = this.showQr.bind(this);
        this.hideQr = this.hideQr.bind(this);
        this.search = this.search.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
        this.page = 1;
        this.searchKey = '';
        
    }
     componentDidMount(){
        Wapi.customer.list(res => {
            console.log(res,'res.data')
            this.setState({data:res.data})
            // this.setState({data:res.data});
            this.setState({total:res.total})
            console.log(res)
        },this._data, {
            sorts: '-createdAt',
            page: '-createdAt',
            limit: -1
        })
    }
    loadNextPage(){
        let arr=this.state.data;
        this.page++;
        Wapi.customer.list(res=>{
            this.setState({data:arr.concat(res.data)});
        },this._data,{
            page_no:this.page
        });
    }
    search(e, val) {
        console.log(e,val,'search customer');
        this.searchKey = val;
        this.forceUpdate();
    }
    //显示邀约注册二维码
    showQr(){
        this.setState({active:1});
        this._timeout=false;
        setTimeout(e=>this._timeout=true,500);
    }
    //隐藏邀约注册
    hideQr(){
        if(this._timeout){
            this.setState({active:0});
            // thisView.setTitle("平台管理");
        }
    } 

    goToRegister(i){
        if(i==0){
            console.log('注册客户')
            this.setState({custType:1})
            AddRegisterQrLink(10,()=>{
                this.showQr();
            })
       }
    }
    render(){
         let show=this.state.active==1;
         console.log(this.state.data);
         let item = null;
         let that = this;
         if(this.state.data){
            item = this.state.data.filter(function(ele){
                return (!ele.Authorize || (ele.custTypeId === 10 && ele.Authorize.indexOf('3') === -1) || (ele.custTypeId !== 10 && ele.Authorize.indexOf('3') > -1))
                 && (that.searchKey === '' || ele.name.indexOf(that.searchKey) > -1)
            });
            item = item.map((ele,index) => {
                // 无代理商授权为普通客户，或者有代理授权的品牌商，代理商，服务商
                return(<Item key={index} data={ele}/>)
            })
         }
        return (
            <ThemeProvider style={{minHeight:'100vh',background:'#f7f7f7'}}>
                <div style={show?{display:'none'}:{display:'block',background:'#f7f7f7',minHeight:'100vh'}}>
                    <TextField
                        hintText={___.search}
                        onChange={this.search}
                        style={{ width: '100%', background: '#fff' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ padding: '0px 10px 0px 10px' }}
                        underlineStyle={{ bottom: '0px', borderBottomColor: '#f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                    {
                        !this.state.data?null:
                        (item&&item.length>0)?item:
                        <div style={{fontSize:'14px',background:'#fff',textAlign:'center',lineHeight:'44px'}}>{'点击右上角+创建扫码挪车客户'}</div>
                    }
                </div>
            </ThemeProvider>
        )
    }
}

class Item extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            data:props.data
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.data})
    }

    render(){
        // console.log(this.props.data,'skycjsd')
        // console.log(this.state.data,'hello')
        let item = null;
        let width = (window.screen.width-32)/3+'px'
        let name = this.state.data.name;
        let custTypeId = this.state.data.custTypeId;
        let custType = this.state.data.custType;
        let subscribe = this.state.data.subscribe||0;
        let bind_num = (this.state.data.car_bind + this.state.data.onecar_bind)||0;
        let move_num = (this.state.data.car_move + this.state.data.onecar_move)||0
        return(
            <div>
               <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px 10px',background:'#fff'}}>
                    <div style={{marginBottom:'1em'}}>
                        <span>
                            {
                                name
                            }
                        </span>
                        <span style={{paddingLeft: 5, fontSize: 12}}>
                            {
                                custTypeId === 1 || custTypeId === 5 || custTypeId === 8 ? '(' + custType + ')': ''
                            }
                        </span>
                    </div>
                    <div style={{fontSize:'12px',color:'#666'}}>
                        <span style={{display:'inline-block',width:width}}>{'关注'+'：'+(subscribe||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'绑定'+'：'+(bind_num||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'挪车'+'：'+(move_num||0)}</span>
                    </div>
                </div>
            </div>
        )
    }
}

class UserTotal extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            subscribe:null,
            bind_num:null,
            move_num:null
        }
        Wapi.customer.get(res => {
            console.log(res,'get user car move total')
            this.setState({subscribe:res.data.subscribe || 0})
            this.setState({bind_num:(res.data.onecar_bind||0)+(res.data.car_bind||0)})
            this.setState({move_num:(res.data.onecar_move||0)+(res.data.car_move||0)})
        },{
            objectId:_user.customer.objectId,
        })
    }
    componentWillReceiveProps(nextProps){
    }

    render(){
        let item = null;
        let width = (window.screen.width-32)/3+'px'
        let subscribe = this.state.subscribe;
        let bind_num = this.state.bind_num;
        let move_num = this.state.move_num
        return(
            subscribe !== null ?
            <div>
               <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px 16px',background:'#fff'}}>
                    <div style={{fontSize:'12px',color:'#666'}}>
                        <span style={{display:'inline-block',width:width}}>{'关注'+'：'+(subscribe||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'绑定'+'：'+(bind_num||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'挪车'+'：'+(move_num||0)}</span>
                    </div>
                </div>
            </div>:
            null
        )
    }
}

class CustomerTotal extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            count:null,
            bind_num:null,
            move_num:null
        }
        let par={
            "group":{
                "_id":{"parentId":"$parentId"},
                "count":{"$sum":1},
                "onecar_bind":{"$sum":"$onecar_bind"},
                "onecar_move":{"$sum":"$onecar_move"},
                "car_bind":{"$sum":"$car_bind"},
                "car_move":{"$sum":"$car_move"}
            },
            "sorts":"parentId",
            parentId:this.props.parentId || _user.customer.objectId,
        }
        Wapi.customer.aggr(res=>{
            console.log(res,'get customer car move total')
            this.setState({count:res.data.count || 0})
            this.setState({bind_num:(res.data.onecar_bind||0)+(res.data.car_bind||0)})
            this.setState({move_num:(res.data.onecar_move||0)+(res.data.car_move||0)})           
        },par);
    }
    componentWillReceiveProps(nextProps){

    }

    render(){
        let item = null;
        let width = (window.screen.width-32)/3+'px'
        let count = this.state.count;
        let bind_num = this.state.bind_num;
        let move_num = this.state.move_num
        return(
            count !== null ? 
            <div>
               <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px 16px',background:'#fff'}}>
                    <div style={{fontSize:'12px',color:'#666'}}>
                        <span style={{display:'inline-block',width:width}}>{'客户'+'：'+(count||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'绑定'+'：'+(bind_num||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'挪车'+'：'+(move_num||0)}</span>
                    </div>
                </div>
            </div>:
            null
        )
    }
}

class RightIconMenu extends Component{    
    render() {
        let item=[
            <MenuItem key={0} onTouchTap={()=>this.props.onClick(0)}>配置公众号</MenuItem>,
            <MenuItem key={2} onTouchTap={()=>this.props.onClick(2)}>挪车贴管理</MenuItem>,
            <MenuItem key={1} onTouchTap={()=>this.props.onClick(1)}>自定义菜单</MenuItem>
        ];
        let items=item;
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton style={{
                        width: 'auto',
                        height: 'auto',
                        padding: '11px 11px 0px 0px'
                    }}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                style={{
                    float: 'right'
                }}
            >
                {items}
            </IconMenu>
        );
    }
}
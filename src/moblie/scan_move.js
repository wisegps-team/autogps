import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';

import {changeToLetter} from '../_modules/tool';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import DropDownMenu from 'material-ui/DropDownMenu'
import {Menu, MenuItem} from 'material-ui/Menu'
import Checkbox from 'material-ui/Checkbox'
import RaisedButton from 'material-ui/RaisedButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import {blue500} from 'material-ui/styles/colors';
import QrImg from '../_component/base/qrImg';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("扫码移车");
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

});

let sUrl='';

function AddQrLink(custT,callback){
    let qrLinkData={
        uid:_user.customer.objectId,
        type:4,
        i:0
    };
    // let wx_app_id=W.getCookie('current_wx');
    let data=Object.assign({},qrLinkData);
    let custType = custT;
    data.url=location.origin+'/?register=true&parentId='+_user.customer.objectId+'&custType='+custType+'&name='+encodeURIComponent(_user.customer.name)+'&wx_app_id='+WiStorm.config.wx_app_id;
    // if(_user.employee){
    //     data.url=data.url+'&managerId='+_user.employee.objectId;
    // }
    Wapi.qrLink.add(res=>{
        console.log(res,'zhuclianjie')
        Wapi.qrLink.get(r=>{
            let id=changeToLetter(r.data.i);
            setUrl(id);
            Wapi.qrLink.update(res => {
                callback()
            },{
                _objectId:res.objectId,
                id
            });
        },{objectId:res.objectId});
    },data);
}


function setUrl(id){
    sUrl='http://autogps.cn/?s='+id;
    //测试用
    // sUrl='http://h5test.bibibaba.cn/url.php?s='+id
    W.emit(thisView,'sUrlIsReady');//触发事件
}

//
function askSetShare() {
    if(sUrl){
        setShare();
    }else{
        thisView.addEventListener('sUrlIsReady',setShare);
    }
}

//分享
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
    // history.replaceState('home.html','home.html','home.html');
    W.fixPath();
    wx.onMenuShareTimeline(op);
    wx.onMenuShareAppMessage(op);
    W.emit(thisView,'setShareOver');
}

class App extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            type:0,
            active:0,
            custType:1,
            data:[],
            total:0
        }
        // this.change = this.change.bind(this);
        this._data = {
            parentId:_user.customer.objectId,
            custTypeId:10
        }
        this.loadNextPage = this.loadNextPage.bind(this)
        this.showQr = this.showQr.bind(this);
        this.hideQr = this.hideQr.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
        this.page = 1;
        
    }
     componentDidMount(){
        Wapi.customer.list(res => {
            console.log(res,'res.data')
            this.setState({data:res.data})
            // this.setState({data:res.data});
            this.setState({total:res.total})
            console.log(res)
        },this._data,{
            page_no:this.page
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
            AddQrLink(10,()=>{
                this.showQr();
            })
       }
    }
    render(){
         let show=this.state.active==1;
         console.log(this.state.data)
         let item = this.state.data.map((ele,index) => {
             return(<Item key={index} data={ele}/>)
         })
        return (
            <ThemeProvider style={{minHeight:'100vh',background:'#f7f7f7'}}>
                <div style={show?{display:'none'}:{display:'block',background:'#f7f7f7',minHeight:'100vh'}}>
                    {/*<PrintC Reg={this.goToRegister}/>*/}
                    <div style={{height:46}}>
                        <IconButton style={{float:'right'}} onClick={() => {this.goToRegister(0)}}><ContentAdd color={blue500}/></IconButton>
                    </div>
                    {item.length?item:<div style={{background:'#fff',textAlign:'center',lineHeight:'44px'}}>{'暂无客户点击右上角邀约注册客户'}</div>}
                </div>
                {/*邀约注册*/}
                <QrBox show={show} hide={this.hideQr} custType={this.state.custType}/>
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
        let bind_num = this.state.bind_num||0;
        let move_num = this.state.move_num||0
        return(
            <div>
               <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px 16px',background:'#fff'}}>
                    <div style={{marginBottom:'1em'}}>
                        <span>{name}</span>
                    </div>
                    <div style={{fontSize:'12px',color:'#666'}}>
                        <span style={{display:'inline-block',width:width}}>{'启用'+'：'+'0'}</span>
                        <span style={{display:'inline-block',width:width}}>{'绑定统计'+'：'+(bind_num||0)}</span>
                        <span style={{display:'inline-block',width:width}}>{'挪车次数'+'：'+(move_num||0)}</span>
                    </div>
                </div>
            </div>
        )
    }
}

// 邀约注册
class QrBox extends Component {
    constructor(props,context){
        super(props, context);
        this.state = {
            active: 0,
            url: sUrl,
            custType: props.custType
        }
        this.hide = this.hide.bind(this);
    }
    
    componentDidMount(){
        if(!this.state.url){
            thisView.addEventListener('sUrlIsReady', e=>this.setState({url:sUrl}));
        }
        thisView.addEventListener('setShareOver', e=>{
            this.setState({active:1})
            this._timeout = false;
            setTimeout(e => {this._timeout = true}, 500);
            thisView.setTitle(___.invite_regist);
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.custType){
            this.setState({custType:nextProps.custType})
        }
    }
    tip(e){
        e.stopPropagation();
        if(W.native){
            askSetShare();
        }else{
            W.toast(___.ready_url);
            window.addEventListener('nativeSdkReady', askSetShare)
        }
    }
    hide(e){
        e.stopPropagation();
        if(this._timeout){
            this.setState({active:0});
            thisView.setTitle(___.scan_regist);
        }
    }
    render(){
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
                        <div>{this.state.custType == 2?'服务商注册':'客户注册'}</div>
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
    render(){
        let sty={width:'90%',marginLeft:'5%',marginTop:(window.innerHeight-280)/2+'px',display:'none'};
        let styReturn={width:'100px',height:'30px',marginLeft:(window.innerWidth*0.9-100)/2+'px',marginTop:'30px',lineHeight:'30px',borderRadius:'4px',border:'solid 1px #ff9900',color:'#ff9900'};
        if(this.props.show)sty.display='block';
        return (
            <div style={sty}>
                {___.share_page}<br />
                {___.can_regist}
                <img src='../../img/shareTo.jpg' style={{width:'100%'}} />
                <div onClick={this.props.hide} style={styReturn}>
                    {___.return}
                </div>
            </div>
        );
    }
}
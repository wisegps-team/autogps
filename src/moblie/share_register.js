/**
 * 分享注册页
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import RaisedButton from 'material-ui/RaisedButton';
import QrImg from '../_component/base/qrImg';
import {changeToLetter} from '../_modules/tool';

const thisView=window.LAUNCHER.getView();
thisView.setTitle(___.invite_regist);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:false
        }
        this.data=setJson('');
        this.qrHide=false;
        this.showQr = this.showQr.bind(this);
        this.hideQr = this.hideQr.bind(this);
        this.askSetShare = this.askSetShare.bind(this);
    }

    componentDidMount() {
        thisView.addEventListener('show',this.showQr);
    }
    componentWillUnmount() {
        thisView.removeEventListener('show',this.showQr);
    }
    showQr(e){
        W.loading(true);

        let newData=setJson(e.params);
        
        if(this.data.sUrl && isEqual(newData.params,this.data.params)){
            W.loading(false);
            this.qrHide=false;
            this.forceUpdate();
            return;
        }

        this.data=newData;

        let qrLinkData={
            url:this.data.url,
            type:5,
            uid:_user.customer.objectId,
            i:0
        }
        Wapi.qrLink.add(res=>{
            Wapi.qrLink.get(r=>{
                let id=changeToLetter(r.data.i);
                this.data.sUrl='http://autogps.cn/?s='+id;
                Wapi.qrLink.update(()=>{
                    W.loading(false);
                    this.qrHide=false;
                    this.forceUpdate();
                },{
                    _objectId:res.objectId,
                    id:id
                });
            },{objectId:res.objectId});
        },qrLinkData);
        
    }
    hideQr(e){
        e.stopPropagation();
        this.qrHide=true;
        // this.forceUpdate();
        this.askSetShare();
    }
    back(){
        history.back();
    }
    askSetShare(e){
        if(W.native)
            this.setShare();
        else{
            this.setState({show:false});
            window.addEventListener('nativeSdkReady',e=>this.setShare());
        }
    }
    
    setShare(){
        let name=_user.employee?_user.employee.name:_user.customer.contact;
        var op={
            title: name+'的'+___.invite_regist, // xxx的邀约注册
            desc: _user.customer.name, // 分享描述
            link: this.data.sUrl, // 分享链接
            imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
            success: function(){},
            cancel: function(){}
        }
        history.replaceState('home.html','home.html','home.html');
        wx.onMenuShareTimeline(op);
        wx.onMenuShareAppMessage(op);
        this.setState({show:true});
    }

    render() {
        let sty=this.qrHide?{width:'90%',marginLeft:'5%',marginTop:'20px'}:{display:'none'};
        let main=this.state.show?[
            ___.share_page,
            <br/>,
            ___.can_regist,
            <img src='../../img/shareTo.jpg' style={{width:'100%'}}/>
        ]:(
            <h3 style={{textAlign:'center'}}>{___.preparing_share}</h3>
        );
        return (
            <ThemeProvider>
                <div>
                    <div style={sty} >
                        {main}
                    </div>
                    <QrPage data={this.data} back={this.back} tip={this.hideQr} style={this.qrHide?{display:'none'}:{}}/>
                </div>
            </ThemeProvider>
        );
    }
}

class QrPage extends Component {    
    render() {
        let data=this.props.data;
        let des=data.params.departId==0?___.employee_register:___.marketing_personnel_register;
        
        let sty=Object.assign({width:'100%',height:'100%',textAlign:'center'},this.props.style);
        let qrSty={display:'inline-block',marginTop:(window.innerHeight-50-128-100)/2+'px'};
        let btnSty={position:'fixed',bottom:'50px',textAlign:'center',display:'block',width:'100%'};
        
        return (
            <div style={sty} >
                <div style={qrSty}>
                    <h4>{data.params.name}</h4>
                    <div>{des}</div>
                    <QrImg data={data.sUrl} style={{display:'inline-block',marginTop:'10%'}}/>
                </div>
                <br/>
                <div style={btnSty}>
                    <RaisedButton label={___.return} onClick={this.props.back} secondary={true} style={{marginRight:'10px'}}/>
                    <RaisedButton label={___.invite_regist} onClick={this.props.tip} primary={true}/>
                </div>
            </div>
        );
    }
}

function setJson(url){
    let data={
        url:'',
        sUrl:'',
        html:'',
        params:{
            'name':'',
            'departId':'0',
        }
    };
    if(url==''){
        return data;
    }

    data.url=url;

    data.html=url.split('?')[0];

    let strParams=url.split('?')[1];
    let arr = strParams.split('&').map(function(ele){ return ele.split('=')});
    let obj = {};
    for(let i=0;i<arr.length;i++){
        let key = arr[i][0];
        let value = arr[i][1];
        obj[key] = value;
    }
    data.params=obj;
    
    return data;
}

function isEqual(x,y){
    for(var p in x){
        if(!y.hasOwnProperty(p)){
            return false;
        }
        if(x[p]!=y[p]){
            return false;
        }
    }
    for(var q in y){
        if(!x.hasOwnProperty(q)){
            return false;
        }
    }
    return true;
}

export default App;
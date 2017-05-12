import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import DropDownMenu from 'material-ui/DropDownMenu';
import {Menu, MenuItem} from 'material-ui/Menu';
import TextField from 'material-ui/TextField'
import AutoList from '../_component/base/autoList';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {blue500} from 'material-ui/styles/colors';
import Input from '../_component/base/input';
import SocialPeople from 'material-ui/svg-icons/social/people'

import SonPage from '../_component/base/sonPage';
import {getOpenIdKey,changeToLetter} from '../_modules/tool';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("扫码移车");
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

    // let qrView=thisView.prefetch('#qrlist',3);
    // ReactDOM.render(<ShowCar/>,qrView);
    // qrView.setTitle('一物一码');
});

const domain = [
    WiStorm.config.domain.user,
    location.hostname
]

const sty={
    h4:{textAlign:'left',wordBreak:'break-all'},
    wxbox:{'padding':'10px',textAlign:'right',background:'#f7f7f7'},
}

class App extends Component {
    constructor(props,context){
        super(props,context)
        this.state ={
            type:0,
            show_sonpage:false,
            data:[],
            showCar:false,
            qrLink:{}
        }
        this.typeChange = this.typeChange.bind(this);
        this.showWxBox = this.showWxBox.bind(this);
        this.goPush = this.goPush.bind(this);
        this.configSuccess = this.configSuccess.bind(this);
        this.showCar = this.showCar.bind(this);
        this.hideCar = this.hideCar.bind(this);
        
    }
    componentDidMount() {
        Wapi.weixin.list(res => {
            this.setState({data:res.data})
        },{
            uid:_user.customer.objectId,
            type:0
        },{
            fields:'objectId,uid,name,type,wxAppKey,wxAppSecret,menu'
        })
    }
    
    typeChange(e,i,v){
        this.setState({type:v})
    }
    showWxBox(i){
        let newState={
            show_sonpage:!this.state.show_sonpage,
            type:0
        }
        if(newState.show_sonpage&&i===1){
            //设置类型
            newState.type=1
        }
        this.setState(newState);
        this.forceUpdate()
        console.log('配置')
    }
    configSuccess(wx){
        // debugger;
        Wapi.qrLink.list(qr => {
            if(qr.data.length){
                let data = [];
                qr.data.forEach(ele => {data.push(ele.objectId)})
                Wapi.qrLink.delete(up => {
                    AddQrLink(wx.wxAppKey,op => {
                        console.log(op)
                        this.setState({qrLink:op})
                    })
                },{
                    objectId:data.join('|')
                })
            }
        },{
            uid:_user.customer.objectId,
            type:2
        })
        console.log(wx,'wx')
        let data = this.state.data.concat();
        if(this.state.type == 0){
            data[0] = wx;
            // debugger;
            Wapi.customer.update(res=>{
                // Wapi.device.update(res=>{//把现有的设备都改serverId
                    _user.customer.wxAppKey=wx.wxAppKey;
                    W.setSetting('user',_user);
                    // W.alert(___.setting_success);
                    this.goPush(0)
                // },{
                //     _uid:_user.customer.objectId,
                //     serverId:_user.customer.objectId
                // });
            },{
                _objectId:_user.customer.objectId,
                wxAppKey:wx.wxAppKey,
                wxAppSecret:wx.wxAppSecret
            });
            
        }
        this.setState({data});
    }
    goPush(i){
        // debugger;
        let wx = this.state.data?this.state.data[i]:null
        if(!wx){
            W.alert(i?___.wx_server_null:___.wx_seller_null); 
        }
        debugger;
        W.confirm(___.have_template,res => {
            if(!res){
                W.alert(___.wait_for_template);
                return;
            }
            W.loading(true,___.setting_template);
            debugger;
            Wapi.serverApi.setWxTemplate(function(res){
                W.loading(false);
                if(res.status_code||res.errcode){
                    W.alert((res.errmsg||res.err_msg)+'，'+___.error['000']);
                    return;
                }
                // W.alert(___.setting_success, ()=>{history.back()});
                W.alert(___.setting_success)
            },{
                wxAppKey:wx.wxAppKey
            });
        })

    }
    showCar(){
        this.setState({showCar:true})
        this.forceUpdate()
    }
    hideCar(){
        this.setState({showCar:false})
        this.forceUpdate()
    }
    render() {
        console.log(this.state.data,'this.state.data')
        return (
            <ThemeProvider style={{background:'#f7f7f7',minHeight:'100vh'}}>
                <div style={{paddingLeft:'10px'}}>
                    <DropDownMenu value={this.state.type} onChange={this.typeChange} underlineStyle={{borderTop:0}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                        <MenuItem value={0} primaryText="公众号管理" />
                        <MenuItem value={1} primaryText="挪车卡管理" />
                    </DropDownMenu>
                    {
                        this.state.type ?
                        this.state.data.length?<IconButton style={{float:'right'}} onClick={this.showCar}><ContentAdd color={blue500}/></IconButton>:null
                        :
                        <FlatButton label={___.config} style={{float:'right',height:48,minWidth:48,lineHeight:'48px',textAlign:'right'}} onClick={()=>this.showWxBox(0)} primary={true}/>
                    }
                    {/*<span style={{float:'right',color:'#2196f3',display:'inline-block',width:48,lineHeight:'48px',textAlign:'center'}}>{'配置'}</span>*/}
                </div>
                <div>
                    {
                        this.state.type ? <CarManager data={this.state.data} qr={this.state.qrLink}/>:<WxList data={this.state.data}/>

                    }
                </div>
                <SonPage open={this.state.show_sonpage} back={this.showWxBox}>
                    <Wxbox type={this.state.type} data={this.state.data} onSuccess={this.configSuccess}/>
                </SonPage>
                <SonPage open={this.state.showCar} back={this.hideCar}>
                   <MoveCar />
                </SonPage>
            </ThemeProvider>
        );
    }
}


//公众号
class WxList extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            data:props.data,
            user:0   
        }
        this.getUrl = this.getUrl.bind(this);
    }
    componentDidMount(){
        Wapi.weixin.get(res => {
            if(res.data){
                Wapi.serverApi.getWeixinUser((json)=>{
                    // debugger;
                    if(json.list){
                        this.setState({user:json.list[0].cumulate_user})
                    }
                },{
                    wxAppKey:res.data.wxAppKey
                })
            }
        },{
            uid:_user.customer.objectId,
            type:0
        },{
            fields:'objectId,uid,name,type,wxAppKey,wxAppSecret,menu'
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps){
            this.setState({user:null})
            this.setState({data:nextProps.data})
            // console.log(nextProps.data[0].wxAppKey)
            if(nextProps.data[0]){
                Wapi.serverApi.getWeixinUser((json)=>{
                    // debugger;
                    // console.log(json)
                    if(json.list){
                        if(json.list.length){
                            this.setState({user:json.list[0].cumulate_user})
                        }
                    }
                },{
                    wxAppKey:nextProps.data[0].wxAppKey
                })
            }
        }
    }
    getUrl(i){
        let wxAppKey = this.state.data[0].wxAppKey;
        let context = '将车主服务链接配置到公众号<%wx%>的自定义菜单里，既能通过为车主提供刚需服务增加公众号的活跃度，还能借助平台服务和本地汽车后市场服务商建立互惠共赢的合作。'.replace('<%wx%>',this.state.data[0].name)
        
        let text=''
        if(i == -1){
            text='http://'+domain[1]+'/?wx_app_id='+wxAppKey
        }
        W.alert(text+' '+context)

    }
    render() {
        console.log(this.state.data,'state.data')
        console.log(this.props.data,'data')
        // conso
        let name = this.state.data.map((ele,index) => (<span key={index} style={{display:'inline-block',lineHeight:'48px',paddingLeft:'10px'}}>{ele.name}</span>))
        // console.log(name,'name')
        return (
            <div style={{background:'#fff'}}>
                {
                    this.state.data.length ?
                    <div>
                        {name}
                        <FlatButton label={'车主服务'} labelStyle={{fontSize:16}} style={{height:48,lineHeight:'48px',float:'right'}} primary={true} onClick={e=>this.getUrl(-1)}/>
                        <div style={{padding:'30px 0',height:'auto',background:'#90c392',textAlign:'center',position:'relative',color:'#fff'}}>
                            {/*<SocialPeople style={{display:'inline-block',fill:'rgba(255,255,255,1)',color:'#fff',height:48,lineHeight:'48px'}}/><span style={{display:'inline-block',color:'#fff',height:48,lineHeight:'48px'}}>12</span>*/}
                            <span style={{display:'block',fontSize:'20px'}}><SocialPeople color="#fff" style={{position:'relative',top:5}}/>{this.state.user?this.state.user:0}</span>
                            <span style={{display:'block'}}>{'总用户数'}</span>
                        </div>
                    </div>
                    :
                    <div style={{padding:'10px'}}>
                        <h4 style={sty.h4}>{'公众号配置前必须先认证并开通模版消息！'}</h4>
                        <h4 style={sty.h4}>{'如何开通模版消息？'}</h4>
                        <p style={sty.h4}>{'请登录公众号首页，在左侧“功能”菜单栏中点击“添加功能插件”，从中选择“模板消息”，申请开通模板消息功能，主营行业必须选择IT科技／互联网|电子商务，副营行业必须选择交通工具／汽车相关。'}</p>
                    </div>
                }
            </div>
        );
    }
}

//挪车卡管理
class CarManager extends Component {
    constructor(props,context){
        super(props,context)
         this._data={//筛选条件
            uid:_user.customer.objectId,
            type:2
        };
        this.op={//控制排序字段与页数
            page:'objectId',
            sorts:'objectId',
            page_no:1
        };
        this.state={
            total:0,
            data:null,
            type1:null,
            type2:null,
            qrdata:[],
            noneWx:0
        };
        this.goList = this.goList.bind(this);
        this.added = this.added.bind(this);
    }
    componentDidMount() {
        Wapi.qrDistribution.list(res=>this.setState(res),this._data);
        window.addEventListener('addOneQr',this.added); 
        let sUrl='';
        Wapi.weixin.get(wx =>{
            if(wx.data){
                let wxAppKey = wx.data.wxAppKey
                AddQrLink(wxAppKey,(op)=> {
                    console.log(op,'op')
                    debugger;
                    if(op.type1){
                        this.setState({type1:op.type1})
                        this.setState({type2:op.type2})
                    }else{
                        this.setState({qrdata:op})
                    }
                })
                this.setState({noneWx:0})
            }else{
                console.log(1)
                this.setState({noneWx:1})
            }
        },{
            uid:_user.customer.objectId,
            type:0
        })
    }
    componentWillUnmount() {
        window.removeEventListener('addOneQr',this.added);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.data.length){
            this.setState({noneWx:0})
            // console.log(nextProps.data,'dd')
        }
        if(nextProps&&nextProps.qr){
            if(nextProps.qr.length&&nextProps.qr.type1){
                this.setState({type1:nextProps.qr.type1})
                this.setState({type2:nextProps.qr.type2})
            }
            
        }
    }
    goList(){
        thisView.goTo('one_qr.js',this.state.data)
    }
    added(e){//添加了一个
        let item=e.params;
        this.setState({
            total:this.state.total+1,
            data:this.state.data.concat([item])
        });
    }
    render(){
        console.log(this.state.noneWx,'noneWx')
        let type1,type2;
        console.log(this.state.qrdata,'qrdata')
        if(this.state.qrdata.length){
        // //    console.log(this.state.qrdata[0].url)
            let surl = 'http://autogps.cn/?s='
            this.state.qrdata.forEach(ele => {
                ele.url.split('&').forEach(el => {
                    if(el == "type=1"){
                        type1 = surl+ele.id
                    }else if(el == "type=2"){
                        type2 = surl+ele.id
                    }
                })
            })
                 
        }else {
            type1 = this.state.type1;
            type2 = this.state.type2
        }
        // console.log(type1,type2,this.data,'type1','type2')
        console.log(this.state.data)
        let all = 0
        if(this.state.data){
            this.state.data.forEach(ele => {
                all += ele.num;
            })
        }
        let width = (window.screen.width-20)/3+'px'
        return (
            <div>
                {
                    !this.state.noneWx?
                    <div>
                        <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px',background:'#fff'}}>
                            <div style={{marginBottom:'1em'}}>
                                {/*{this.props.data.name}*/}
                                {'一物一码挪车贴'}
                            </div>
                            <div style={{fontSize:'12px',color:'#666'}}>
                                <span style={{display:'inline-block',width:width}}>
                                    <span >{"号码"+'：'}</span>
                                    <a onClick={this.goList} style={{color: '#1a8cff',marginRight:'2em'}}>{all}</a>
                                </span>
                                <span style={{display:'inline-block',width:width}}>{'绑定统计'+'：'+(_user.customer.onecar_bind||0)}</span>
                                <span style={{display:'inline-block',width:width}}>{'挪车次数'+'：'+(_user.customer.onecar_move||0)}</span>
                            </div>
                        </div>
                        <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px',background:'#fff'}}>
                            <div style={{marginBottom:'1em'}}>
                                {/*{this.props.data.name}*/}
                                <span style={{display:'inline-block',width:width}}>{'普通挪车卡 '}</span>
                                <span style={{fontSize:'12px',color:'#666',display:'inline-block',width:width}}>{'绑定统计'+'：'+(_user.customer.car_bind||0)}</span>
                                <span style={{fontSize:'12px',color:'#666',display:'inline-block',width:width}}>{'挪车次数'+'：'+(_user.customer.car_move||0)}</span>
                            </div>
                            <div style={{fontSize:'12px',color:'#666'}}>
                                <span style={{display:'block',lineHeight:'20px'}}>{'车主绑定车辆链接'+'：'+type1}</span>
                                <span style={{display:'block',lineHeight:'20px'}}>{'他人呼叫车主链接'+'：'+type2}</span>
                            </div>
                        </div>
                        <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px',background:'#fff',fontSize:12}}>
                            <p style={{textIndent:'2em',marginTop:0}}>{'制作一物一码挪车贴，点击＋根据印刷数量创建挪车贴号段后生成二维码，制作普通挪车卡，使用车主绑定车辆链接和他人呼叫车主链接生成二维码。 '}</p>
                            <p style={{textIndent:'2em',marginBottom:0}}>{'资费标准：绑定时产生一条验证码短信，按0.10元收取，挪车时产生一条验证码短信和一条车主语音通知短信，按0.20元收取，在次日统一结算并从企业账号自动扣款，如帐户余额不足，将暂停使用挪车功能。'}</p>
                        </div>
                    </div>
                :
                    <div style={{padding:'10px',background:'#fff'}}>
                        <h4 style={{textAlign:'center',wordBreak:'break-all'}}>{'请先配置公众号'}</h4>
                    </div>
                }
            </div>
                
        )
    }
}

function AddQrLink(wxAppKey,callback){
    let qrLinkData={
            uid:_user.customer.objectId,
            type:2,
            i:0,
            id:_user.customer.objectId+'A',
            url: 'http://'+WiStorm.config.domain.user+'/wo365_user'+'/movecar.html?intent=logout'
                +'&needOpenId='+true
                +'&creator='+_user.customer.objectId
                +'&type='+1
                +'&wx_app_id='+wxAppKey
        };
        let qrLinkData2 = {
            uid:_user.customer.objectId,
            type:2,
            i:0,
            id:_user.customer.objectId+'B',
            url: 'http://'+WiStorm.config.domain.user+'/wo365_user'+'/movecar.html?intent=logout'
                +'&needOpenId='+true
                +'&creator='+_user.customer.objectId
                +'&type='+2
                +'&wx_app_id='+wxAppKey
        }
    let op = {};
    Wapi.qrLink.list(res => {
        // op.data = res.data
        if(!res.data.length){
            Wapi.qrLink.add(res=>{
                Wapi.qrLink.get(r=>{
                    let type1='http://autogps.cn/?s='+r.data.id;
                    op.type1=type1
                    Wapi.qrLink.add(re=>{
                        Wapi.qrLink.get(rs=>{
                            let type2='http://autogps.cn/?s='+rs.data.id;
                            op.type2=type2
                            callback(op);
                        },{objectId:re.objectId});
                    },qrLinkData2);
                },{objectId:res.objectId});
            },qrLinkData);
        }else{
            callback(res.data)
        }
    },{
        uid:_user.customer.objectId,
        type:2
    })
}


//公众号配置
class Wxbox extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            data:props.data,
            name:null,
            appkey:null,
            appSecret:null,
            fileName:null
        }
        this.fromData = {};
        this.cancel = this.cancel.bind(this)
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.data&&nextProps.data.length){
            // this.setState({data:nextProps.data})
            this.setState({name:nextProps.data[0].name})
            this.setState({appkey:nextProps.data[0].wxAppKey})
            this.setState({appSecret:nextProps.data[0].wxAppSecret})    
            this.setState({fileName:nextProps.data[0].fileName})    
            this.fromData = {
                name:nextProps.data[0].name,
                wxAppKey:nextProps.data[0].wxAppKey,
                wxAppSecret:nextProps.data[0].wxAppSecret,
                fileName:nextProps.data[0].fileName
            }    
        }
    }
    change(e,val){
        let name = e.currentTarget.name;
        if(name == 'name'){
            this.setState({name:val})
        }else if(name == 'wxAppKey'){
            this.setState({appkey:val})
        }else if(name == 'wxAppSecret'){
            this.setState({appSecret:val})
        }else if(name == 'fileName'){
            this.setState({fileName:val})
        }
        // let name = e.currentTarget.name;
        this.fromData[name] = val;
        this.forceUpdate();
    }
    cancel(){
        W.loading(false)
        // history.back();
    }
    save(){
        let wx = Object.assign({},this.fromData);
        // console.log(wx,'获得输入的值')
        wx.uid = _user.customer.objectId;
        wx.type = this.props.type;
        if(!wx.name){
            W.alert(___.wx_name_null);
            return;
        }
        if(!wx.wxAppKey){
            W.alert(___.appid_null);
            return;
        }
        if(!wx.wxAppSecret){
            W.alert(___.appSecret_null);
            return;
        }
        if(!wx.fileName){
            W.alert(___.wx_file_name_null);
            return
        }
        W.loading(true,___.config_wx)
        Wapi.weixin.get(_wx => {
            if(_wx.data&&_wx.data.uid!=_user.customer.objectId){
                W.loading(false);
                W.alert(___.wxApp_used);
                return
            }
            history.back()
            Wapi.serverApi.saveConfigFile(res => {
                //检查是否有配置过，有就update,没有就add
                Wapi.weixin.get(_wxin => {
                    if(_wxin.data){
                        wx._objectId = _wxin.data.objectId;
                        Wapi.weixin.update(res => {
                            wx.objectId = _wxin.data.objectId
                            delete wx._objectId;
                            this.props.onSuccess(wx);
                            this.cancel();
                            // debugger;
                        },wx)
                    }else {
                        Wapi.weixin.add(res => {
                            wx.objectId = res.objectId;
                            this.props.onSuceess(wx);
                            this.cancel()
                        },wx)
                    }
                },{
                    uid:wx.uid,
                    type:wx.type
                })
            },{
                fileName:this.fromData.fileName
            })
        },{
            wxAppKey:wx.wxAppKey
        })
    }
    render(){
        console.log(this.state.data,'data')

        let wxAppKey,wxAppSecret,name,fileName;
        name = this.state.name;
        wxAppKey = this.state.appkey;
        wxAppSecret = this.state.appSecret
        fileName = this.state.fileName
       
        // console.log(this.props.type,'type')
        let save_wx_data = ___.save_wx_data.replace('<%domain%>',domain[this.props.type])
        // let text =""
        let text='http://'+domain[0]+'/user.autogps.php?wxAppKey='+wxAppKey+'&wxAppSecret='+wxAppSecret;
        
        return(
            <div style={sty.wxbox}>
                <h4 style={sty.h4}>{___.certification}</h4>
                <Input name='name' onChange={this.change} hintText={name?name:___.wx_name} value={name}/>
                <p style={sty.h4}>{___.find_appid}</p>
                <Input name='wxAppKey' onChange={this.change} hintText={wxAppKey?wxAppKey:'AppId'} value={wxAppKey}/>
                <Input name='wxAppSecret' onChange={this.change} hintText={wxAppSecret?wxAppSecret:'AppSecret'} value={wxAppSecret}/>
                <p style={sty.h4}>{___.input_file_name}</p>
                <Input name='fileName' onChange={this.change} hintText={___.wx_file_name} value={fileName}/>
                <p style={sty.h4}>{save_wx_data}</p>
                <p style={sty.h4}>{'4、'+___.wx_config_last+text}</p>
                <FlatButton label={___.cancel} onClick={()=>{history.back()}} primary={true}/>
                <FlatButton label={___.save} onClick={this.save} primary={true}/>
            </div>
        )
    }
}
//创建一物一码挪车贴
class MoveCar extends Component {
    constructor(props,context){
        super(props,context)
        this.state={
            type:2,
            name:'',
            num:0,
        }
        // this.typeChange = this.typeChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.numChange = this.numChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    nameChange(e,value){
        this.setState({name:value});
        console.log(value)
    }
    numChange(e,value){
        this.setState({num:value});
        console.log(value)
    }
    submit(){
        if(!this.state.name||this.state.name==''){
            W.alert('请输入名称');
            return;
        }
        if(!this.state.num||this.state.num==''){
            W.alert('请输入印刷数量');
            return;
        }
        let num=parseInt(this.state.num);
        // console.log(num!=this.state.num)
        if((this.state.num != num)){
            W.alert('请输入正确的数量');
            return;
        }
        if(isNaN(num)){
            W.alert('请输入正确的数量');
            return;
        }
        let data=Object.assign({},this.state);
        data.num=num;
        data.uid=_user.customer.objectId; //创建者uid
        Wapi.qrDistribution.list(res=>{//获取最后一条记录的最大值
            let min=res.data.length?res.data[0].max+1:0;
            data.min=min;
            data.max=min+data.num-1;
            Wapi.qrDistribution.add(res=>{
                data.objectId=res.objectId;
                W.emit(window,'addOneQr',data);
                history.back();
                this.setState({
                    name:'',
                    num:''
                });
            },data);
        },{
            objectId:'>0'
        },{
            sorts:'-objectId',
            page:'objectId',
            limit:1
        });
    }
    render(){
        return(
            <div style={{background:'#f7f7f7',minHeight:'100vh',paddingTop:20}}>
                <div style={{background:'#fff'}}>
                    <TextField 
                        hintText="名称" 
                        value={''}
                        onChange={this.nameChange}
                        style={{width:'100%'}} 
                        hintStyle={{paddingLeft:10}}    
                        inputStyle={{paddingLeft:10}}                                            
                        underlineStyle={{bottom:0,borderBottomColor:'#f7f7f7'}} 
                        underlineFocusStyle={{borderBottomColor:'#2196f3'}}
                    />
                    <TextField 
                        hintText="印刷数量" 
                        value={''}
                        onChange={this.numChange}
                        style={{width:'100%'}} 
                        hintStyle={{paddingLeft:10}}
                        inputStyle={{paddingLeft:10}}
                        underlineStyle={{bottom:'0px',borderBottomColor:'#f7f7f7'}} 
                        underlineFocusStyle={{borderBottomColor:'#2196f3'}}
                    />
                </div>
                <div style={{textAlign:'center',marginTop:'30px'}}>
                    <RaisedButton label="创建" primary={true} onClick={this.submit}/>
                </div>
            </div>
        )
    }
}
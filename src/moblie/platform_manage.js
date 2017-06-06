import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {blue500} from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import {CustListHC,cust_item_sty} from '../_component/cust_list';
import Checkbox from 'material-ui/Checkbox';
import SonPage from '../_component/base/sonPage';
import Popover from 'material-ui/Popover/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import RaisedButton from 'material-ui/RaisedButton';
import AutoList from '../_component/base/autoList';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'
import {changeToLetter} from '../_modules/tool';
import QrImg from '../_component/base/qrImg';
import UserSearch from '../_component/user_search';
import Input from '../_component/base/input';
import TextField from 'material-ui/TextField'


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("平台管理");
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


let sUrl='';
let qrLinkData={
    uid:_user.customer.objectId,
    type:4,
    i:0
};
let wx_app_id=W.getCookie('current_wx');
let data=Object.assign({},qrLinkData);
let custType = 1;
data.url=location.origin+'/?register=true&parentId='+_user.customer.objectId+'&custType='+custType+'&name='+encodeURIComponent(_user.customer.name)+'&wx_app_id='+WiStorm.config.wx_app_id;
// if(_user.employee){
//     data.url=data.url+'&managerId='+_user.employee.objectId;
// }
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

function setUrl(id){
    sUrl='http://autogps.cn/?s='+id;
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
    // history.replaceState('home.html','home.html','home.html');
    W.fixPath();
    wx.onMenuShareTimeline(op);
    wx.onMenuShareAppMessage(op);
    W.emit(thisView,'setShareOver');
}

class App extends Component {
    constructor(props,context){
        super(props, context);
       
        this.state = {
            plattype:0,
            area:"0",
            areaId:0,
            open: false,
            company:"0",
            sevice:"0",
            active:0,
            authType:[]
            // back:0
        }
        this._data={
            custTypeId:'1|5|8',
            appId:WiStorm.config.objectId,
        }
        this.showProject = false;
        this.showCompany = false;
        this.showComTypes = false;
        this.typeChange = this.typeChange.bind(this);
        this.select = this.select.bind(this);
        this.projectBack = this.projectBack.bind(this);
        this.hideCompany = this.hideCompany.bind(this);
        // this.searchArea = this.searchArea.bind(this);
        // this.handleTouchTap = this.handleTouchTap.bind(this);
        this.selectCompany = this.selectCompany.bind(this);
        this.selectService = this.selectService.bind(this);
        this.hideComType = this.hideComType.bind(this);
        this.getArea = this.getArea.bind(this);
        this.showQr = this.showQr.bind(this);
        this.hideQr = this.hideQr.bind(this);
    }
    componentDidMount() {
        // Wapi.area.list(res => {
        //     this.setState({area:res.data})
        // },{level:1})
        window.addEventListener('getareaId',this.getArea)
        window.addEventListener('getAuthorize',e => {
            this.showCompany = true;
            console.log(e,'zheyoushweishenme');
            this.forceUpdate();
        })
        window.addEventListener('getType',e => {
            console.log(e.params,'leixing');
            this.showComTypes = true;
            // this.setState({authType:e.params})
            this.forceUpdate();
        })
    }
    componentWillUnmount() {
        window.removeEventListener(getareaId,this.getArea);
        // window.removeEventListener(EVENT.ADDED,this.added);
        // window.removeEventListener(EVENT.ADDED,this.added);
    }
    // showCompany
    shouldComponentUpdate(nextState){
        if(nextState != this.state){
            return true
        }
    }
    //显示邀约注册二维码
    showQr(){
        this.setState({active:1});
        this._timeout=false;
        setTimeout(e=>this._timeout=true,500);
        thisView.setTitle(___.scan_regist);
    }
    //隐藏邀约注册
    hideQr(){
        if(this._timeout){
            this.setState({active:0});
            thisView.setTitle("平台管理");
        }
    }

    //获取组件Adress中传过来的值
    getArea(e){
        this.setState({area:e.params});
    }

    //按业务和公司进行分类
    typeChange(e,i,v){
        this.setState({plattype:v})
        this.setState({company:'0'})//恢复类型默认值
        this.setState({sevice:'0'})
        // console.log(e,i,v,'eiv') //event 0 0//event 1 1
    }

    //点击右上+显示增加服务项目或邀约注册品牌商
    select(v){
        console.log(v,'v')
        if(v==0){
            this.showProject = true; //显示服务项目
            this.forceUpdate();
        }else {
            this.showProject = false;
            this.forceUpdate();
            this.showQr();
        }
    }
    //隐藏服务项目
    projectBack(){
        this.showProject = false;
        this.forceUpdate();
    }
    //隐藏授权公司
    hideCompany(){
        this.showCompany = false;
        this.forceUpdate();
        // this.setState({back:0})
    }
    //隐藏授权类型
    hideComType(){
        this.showComTypes = false;
        this.forceUpdate();
    }
    //选择区域
    selectCompany(e,i,v){
        // console.log(e,i,v,'evid')
        this.setState({company:v})
    }
    //选择服务
    selectService(e,i,v){
        console.log(e,i,v,'evid')
        this.setState({sevice:v})
    }
    render() {
        // console.log(this.showProject,'this.show')
        // console.log(this.state.area,'area')
        // let areas = this.state.area.map((ele,index) =>(<RaisedButton label={ele.name} value={ele.id}  labelStyle={{color:'#000'}}  key={index+1} />))
        // areas.unshift(<MenuItem value={0} primaryText="区域" key={0} />)
        // console.log(this.state.plattype,'业务和公司')
        // console.log(this._data,'传筛选品/代/服公司')
        let show=this.state.active==1;
        console.log(this.showCompany,'显示授权公司')
        let customer = ["品牌商","代理商","服务商"]
        let custs = customer.map((ele,index) => (<MenuItem value={ele} primaryText={ele} key={index+1}/>))
        let service = ['销售','安装',"洗车","美容","保养","轮胎"]
        let sers = service.map((ele,index) => (<MenuItem value={ele} primaryText={ele} key={index+1}/>))
        return (
            <ThemeProvider>
                <div style={show?{display:'none'}:{display:'block',background:'#f7f7f7',minHeight:'100vh'}}>
                    <div style={{paddingLeft:'10px'}}>
                        <DropDownMenu value={this.state.plattype} onChange={this.typeChange} underlineStyle={{borderTop:0}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                            <MenuItem value={0} primaryText="业务" />
                            <MenuItem value={1} primaryText="公司" />
                        </DropDownMenu>
                        {   this.state.plattype?
                            (<div style={{width:'66%',display:'inline-block'}}>
                                <Address />
                                <DropDownMenu value={this.state.company} onChange={this.selectCompany} underlineStyle={{borderTop:0}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                                    <MenuItem value={"0"} primaryText="全部" />
                                    {custs}
                                </DropDownMenu>
                                <DropDownMenu value={this.state.sevice} onChange={this.selectService} underlineStyle={{borderTop:0}}labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                                    <MenuItem value={"0"} primaryText="服务" />
                                    {sers}
                                </DropDownMenu>
                            </div>):''
                        }
                        <IconButton style={{float:'right'}} onClick={() => {this.select(this.state.plattype)}}><ContentAdd color={blue500}/></IconButton>
                    </div>
                    {/*<SonPage open={this.showProject} back={this.projectBack}>
                        <Project />
                    </SonPage>*/}
                    {
                        this.state.plattype? 
                        <div><CustList data={this._data} screen={Object.assign({},{area:this.state.area},{custType:this.state.company},{service:this.state.sevice})}/></div>
                        :
                        <div><UserItem /></div>}
                   
                </div>
                {/*邀约注册*/}
                <QrBox show={show} hide={this.hideQr}/>
                {/*业务授权*/}
                <SonPage open={this.showCompany} back={this.hideCompany}>
                    <AuthorizeList />
                </SonPage>
                {/*公司授权*/}
                <SonPage open={this.showComTypes} back={this.hideComType}>
                    <ComTypeList />
                </SonPage>
            </ThemeProvider>
        );
    }
}
//业务列表
class UserItem extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            data:props.data
        }
        this.onCheck = this.onCheck.bind(this);
    }
    onCheck(e){
        console.log(e)
        W.emit(window,'getAuthorize',e)
    }
    render() {
        let item = ['营销推广','政企业务','平台运营']
        let items = item.map((ele,index)=> (<MenuItem 
                                        rightIcon={<Checkbox style={{float:'right'}} />}
                                        primaryText={ele}
                                        key={index}
                                        onTouchTap={() => this.onCheck(index+1)}
                                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                                    />))
        return (
            <div style={{background:'#fff'}}>{items}</div>
        );
    }
}
//业务授权公司列表
class AuthorizeList extends Component{
    constructor(props,context){
        super(props,context)
        this.state ={
            type:0,
            data:[],
            showAuth:0
        }
        this.showAuth = this.showAuth.bind(this);
        this.backAuth = this.backAuth.bind(this);
    }
    componentDidMount() {
        window.addEventListener('getAuthorize',e => {
            // console.log(e,'eeee')
            this.setState({type:e.params})
            Wapi.authorize.list(res => {
                console.log(res.data,'res.data')
                this.setState({data:res.data})
            },{
                authorizeType:'3',
                actProductId: e.params,
            })
        })
    }
    showAuth(e,i,v){
        this.setState({showAuth:v})
    }
    backAuth(){
        this.setState({showAuth:0})
    }
    render(){
        // console.log(this.state.showAuth,'hhhhh')
        // console.log(this.state.data,'获取到的授权表中业务类型')
        let type =['营销推广','政企业务','平台运营']
        return(
            <div style={{background:'#f7f7f7',minHeight:'100%'}}>
                <span style={{display:'inline-block',lineHeight:'48px',paddingLeft:'16px'}}>{type[this.state.type-1]}</span>
                <DropDownMenu value={this.state.showAuth} onChange={this.showAuth} underlineStyle={{borderTop:0}} style={{float:'right'}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                    <MenuItem value={0} primaryText="已授权" />
                    <MenuItem value={1} primaryText="新增授权" />
                </DropDownMenu>
                <div>
                    {
                        this.state.showAuth?
                        <Authorizing
                            data={this.state.data}
                            type={this.state.type}
                            back={this.backAuth}
                        />
                        :
                        <Authorized
                            data={this.state.data}
                            type={this.state.type}
                            back={this.backAuth}
                        />
                    }
                </div>
            </div>
        )
    } 
}
//已授权
class Authorized extends Component {
    constructor(props,context){
        super(props,context)    
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.data =[];
        this.obj = [];
    }
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            let dele = null;
            this.data.forEach((ele,index) => {
                if(ele.objectId == JSON.parse(e.target.value).objectId){
                    dele = index;
                }
            })
            console.log(dele);
            this.data.splice(dele,1)
            // this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data,'data')
        // console.log(JSON.parse(e.target.value),'dd')
    }
    submit(){
        let custobj = [];
        let auobj = [];
        // let type = ['营销推广','政企业务','平台运营','扫码移车']
        this.data.forEach(ele => {
            custobj.push(ele.applyCompanyId);
            auobj.push(ele.objectId);
        })
        Wapi.authorize.update(res => {
            // console.log(res,'ddddfdfdfd')
            // history.back();
            Wapi.customer.update(res => {
                history.back();
                this.props.back()
            },{
                _objectId:custobj.join('|'),
                Authorize:'-'+(this.props.type-1)+''
            })
        },{_objectId:auobj.join('|'),status:2})
    }
    render() {
        console.log(this.props.data,'ddff')
        let dataLength = [];
        let Item = this.props.data.map((ele,index) => {
            if(ele.status==1){
                dataLength.push(ele)
                return (
                   <MenuItem 
                        rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                        primaryText={ele.applyCompanyName}
                        key={index}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                    />
                )
            }
        })
        // console.log(Item.length)
        return (
            <div>
                {Item}
                <div style={{width:'100%',textAlign:'center',marginTop:'20px',paddingBottom:20}}>
                    {dataLength.length?<RaisedButton label="取消授权" onClick={this.submit} secondary={true} fullWidth={true}/>:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff'}}/>}
                </div>
            </div>
        );
    }
}
//新增授权
class Authorizing extends Component {
    constructor(props,context){
        super(props,context)    
        this._data={
            custTypeId:'1|5',
            appId:WiStorm.config.objectId
        }
        this.state ={
            company:[],
            total:0,
            search:[],
            addAuthorize:[]
        }
        this.page = 1;
        this.search = this.search.bind(this);
        this.submit = this.submit.bind(this);
        this.addAuthorize=[];
    }
    componentDidMount() {
        Wapi.customer.list(res =>{
            this.setState({company:res.data});
            this.setState({total:res.total})
        },this._data,{page_no:this.page})

        window.addEventListener('addAutho', e =>{
           this.addAuthorize = e.params
        })
     

    }

    
    search(e,val){
        // this.data=val;
        this._data.name = "^"+val
        // console.log(e,val,'dd')
        Wapi.customer.list(res =>{
            console.log(res.data,'res');
            this.setState({search:res.data});
        },this._data)
    }
    loadNextPage(){
        let arr=this.state.company;
        this.page++;
        Wapi.customer.list(res=>{
            this.setState({company:arr.concat(res.data)});
        },this._data,{
            page_no:this.page
        });
    }

    submit(){
        console.log(2)
        // this.watch()
        console.log(this.addAuthorize,'授权')
        var create_json = {
            data: []
        };
        let getdata = this.addAuthorize;
        // let data = [];
        let auData = [];//存储已经存在在授权表但已暂停授权
        this.props.data.forEach(ele => {
            if(ele.status == 2){
                // console.log(ele,'elelee')
                this.addAuthorize.forEach(e => {
                    if(ele.applyCompanyId == e.objectId){
                        // console.log(e,'eeeeeeeee')
                        getdata.splice(getdata.indexOf(e),1)
                        // console.log()
                        // data.concat(this.addAuthorize.splice(getdata.indexOf(e),1))
                        // data.push(e)
                        auData.push(ele)
                    }
                })  
            }
        })

        // console.log(data,'customer信息')
        console.log(auData,'auData')
        getdata.map(ele => {
            var op = {
                actProductId: this.props.type,
                applyCompanyId: ele.objectId,
                applyCompanyName: encodeURIComponent(ele.name),
                applyUserName: encodeURIComponent(ele.contact),
                authorizeType:3,
                status:1
            }
            create_json.data.push(op)
        })
        console.log(create_json,'addcreate')
        // let type = ['营销推广','政企业务','平台运营','扫码移车']
        if(auData.length>0){
            let obj = [];
            let auobj = [];
            // data.forEach(ele => {
            //     obj.push(ele.objectId)
            // })
            auData.forEach(ele => {
                auobj.push(ele.objectId);
                obj.push(ele.applyCompanyId)
            })
            console.log(obj,'obje')
            Wapi.authorize.update(res => {
                // history.back();
                Wapi.customer.update(res => {
                    this.props.back()
                    history.back();
                },{
                    _objectId:obj.join('|'),
                    Authorize:'+'+(this.props.type-1)+''
                })
            },{_objectId:auobj.join('|'),status:1})
        }
        if(this.addAuthorize.length){
            let cpdata = [];
            this.addAuthorize.forEach(ele => {
                cpdata.push(ele.objectId)
            })
            
            Wapi.authorize.addBatch(res => {
                // history.back();
                Wapi.customer.update(res => {
                    this.props.back()
                    history.back();
                },{
                    _objectId:cpdata.join('|'),
                    Authorize:'+'+(this.props.type-1)+''
                })
            },create_json)
        }
        
    }
    render() {
        // console.log(this.state.company,'当前的品牌/代理')
        // console.log(this.state.search,'搜索的品/代')
        console.log(this.props.type,'授权类型')
        // console.log(this.props.data,'ddffss')
        console.log(this.addAuthorize,'授权')
        let listDis={};
        let searchList=null;

        let addCompany = this.state.company
        // if(this.state.search.length){

        // }
        // 筛选authorize表中是否有公司已授权
        this.props.data.forEach(ele => {
            if(ele.status == 1){
                addCompany.forEach((eles,index) => {
                    if(eles.objectId == ele.applyCompanyId){
                        addCompany.splice(index,1)
                    }
                })
            }
        })
        // console.log(addCompany,'筛选过后')
        if(this.state.search.length){
            let searchComp = this.state.search
            this.props.data.forEach(ele => {
                if(ele.status == 1){
                    searchComp.forEach((eles,index) => {
                        if(eles.objectId == ele.applyCompanyId){
                            searchComp.splice(index,1)
                        }
                    })
                }
            })
            searchList=<NoAuItem data={searchComp}/>;
            listDis.display='none';
        }
        return (
            <div >
                <div style={{background:'#fff'}}>
                    <TextField 
                        hintText={___.search}
                        onChange={this.search}
                        style={{width:'100%',background:'#fff'}} 
                        hintStyle={{paddingLeft:10}}
                        inputStyle={{paddingLeft:10}}
                        underlineStyle={{bottom:'0px',borderBottomColor:'#f7f7f7'}} 
                        underlineFocusStyle={{borderBottomColor:'#2196f3'}}
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
                <div style={{width:'100%',textAlign:'center',marginTop:'20px',paddingBottom:20}}>
                   <RaisedButton label="确认授权" onClick={this.submit} secondary={true} />
                </div>
            </div>
        );
    }
}

class NoAuItem extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state ={
            data:props.data
        }
        this.check = this.check.bind(this);
        this.data=[];
    }
    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.data})
    }
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            let dele = null;
            this.data.forEach((ele,index) => {
                if(ele.objectId == JSON.parse(e.target.value).objectId){
                    dele = index;
                }
            })
            console.log(dele);
            this.data.splice(dele,1)
            // this.data.splice(this.data.indexOf(JSON.parse(e.target.value),1))
        }
        console.log(this.data,'data')
        W.emit(window,'addAutho',this.data)
    }
    render() {
        // console.log(this.state.data,'thi.pfr.d')
        let items=this.state.data.map((ele,index)=>{
                    // let data = [];
                    // data.push(ele)
                    return ( <MenuItem 
                        rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                        primaryText={ele.name}
                        key={index}
                        value={ele}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                    />)});
        return(
            <div >
                {items}
            </div>
        )
    }
}
let NoAulist=AutoList(NoAuItem);

//公司列表
class Company extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            data:props.data
        }
        this.showAuth = this.showAuth.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data:nextProps.data});
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.data!==this.props.data);
    }
    showAuth(data){
        console.log(data,'获取的公司信息');
        W.emit(window,'getType',data)
    }
    render(){
        let cType=this.state.data.custType
        if(this.state.data.custTypeId==8&&this.state.data.isInstall==0){
            cType="服务商"
        }

        let strAddress=(this.state.data.province+this.state.data.city+this.state.data.area) || ' ';
        let title=(<span>
            {this.state.data.name}
            <small style={cust_item_sty.sm}>{cType+' '}</small>
            <small style={cust_item_sty.sm}>{strAddress}</small>
        </span>);
        return(
            <div style={{background:'#fff'}}>
                {this.state.data.isInstall?"":
                    <ListItem
                        rightIcon={<Checkbox label="" style={{float:'right'}}/>}
                        primaryText={title}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        onTouchTap={() => this.showAuth(this.state.data)}
                    />
                    }
            </div>
        )
    }
}


class Dlist extends Component{
    render() {
        let items;
        // console.log(this.props.data,'获得所有公司的信息')
        // let arr=[];
       
        if(this.props.data){
            // this.props.data.forEach((ele,index) => {
            //     if(ele.custTypeId==1||ele.custTypeId==5||(ele.custTypeId==8&&ele.isInstall==0)){
            //         arr.push(ele)
            //     }
            // })
            items=this.props.data.map((ele,index)=><Company key={ele.objectId} data={ele}/>);
        }  
        else
            items=(<div style={{textAlign:'center',color:'#f7f7f7'}}>
                <h2>{___.user_list_null}</h2>
            </div>);
        return (
            <List>
                {items}
            </List>
        );
    }
}
let Alist=AutoList(Dlist);
class CustList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:-1,
            screen:props.screen
        }
        this.op=props.op||{
            page:'objectId',
            sorts:'objectId',
            page_no:1
        }
        // this.countParams=null;
        this.loadNextPage = this.loadNextPage.bind(this);
    }
    componentDidMount() {
        Wapi.customer.list(res=>{
            let data=this.state.data.concat(res.data);
            this.setState({data});
        },this.props.data,this.op);
    }
    shouldComponentUpdate(nextProps, nextState) {
        // if(nextProps != this.props) return true
        // return (nextState!=this.state);
        if(nextProps != this.props||nextState!=this.state) return true
        // if(nextState!=this.state||nextProps != this.props){
        //     return false
        // }
    }
   componentWillReceiveProps(nextProps){
        this.setState({screen:nextProps.screen})
        let option = {
            custTypeId:nextProps.data.custTypeId,
            appId: nextProps.data.appId,
        }
        this.op.page_no=1;//还原页数
        if(nextProps.screen.custType != 0){
            console.log(nextProps.screen.custType)
            option.custType = nextProps.screen.custType
            if(nextProps.screen.custType == "服务商"){
                option.custType = "经销商"
            }
        }
        if(nextProps.screen.area.proviceId){
            option.provinceId = nextProps.screen.area.proviceId
        }
        if(nextProps.screen.area.cityId){
            option.cityId = nextProps.screen.area.cityId
        }
        if(nextProps.screen.area.areaId){
            option.areaId = nextProps.screen.area.areaId
        }
        console.log(option,'otopndfno')
        Wapi.customer.list(res=>{
            // this.setState({data:[]})
            this.setState({data:res.data});
            console.log(res.data,'asdsd')
        },option,this.op);
        console.log(nextProps.data,'data')
   }
    loadNextPage(){
        let option = {
            custTypeId:this.props.data.custTypeId,
            appId: this.props.data.appId,
        }
        if(this.props.screen.custType != 0){
            console.log(this.props.screen.custType)
            option.custType = this.props.screen.custType
            if(this.props.screen.custType == "服务商"){
                option.custType = "经销商"
            }
        }
        if(this.props.screen.area.proviceId){
            option.provinceId = this.props.screen.area.proviceId
        }
        if(this.props.screen.area.cityId){
            option.cityId = this.props.screen.area.cityId
        }
        if(this.props.screen.area.areaId){
            option.areaId = this.props.screen.area.cityId
        }
        console.log('next')
        this.op.page_no++;
        // debugger;
        Wapi.customer.list(res=>{
            let data=this.state.data.concat(res.data);
            this.setState({data:data});
        },option,this.op);
    }
    render() {
        
        
        console.log(this.props.screen,'dddddd')
        // console.log(this.props.data,'ddsdfd')
        // console.log(data,'data')
        console.log(this.state.data,'所有的公司信息')
        return (
            <div>
                <Alist 
                    max={this.state.total}
                    limit={20} 
                    data={this.state.data} 
                    next={this.loadNextPage} 
                />
            </div>
        );
    }
}


//公司授权业务列表
class ComTypeList extends Component {
    constructor(props,context){
        super(props,context);
        this.state ={
            data:[],
            type:0,
            showAuth:0,
            authorize:[],
        }
        this.showAuth = this.showAuth.bind(this);
        this.back = this.back.bind(this);
    }
    componentDidMount() {
        // let op ={
        //     applyCompanyId:this.state.data.objectId,
        // }
        // if(this.state.data.custType == 1||this.state.data.custType ==5){
        //     op.authorizeType = 3 //业务类型
        // }else if(this.state.custType == 8){
        //     op.authorizeType = 2 //服务类型
        // }
        // Wapi.authorize.list(res => {
        //     this.setState({authorize:res.data})
        // },op)
        window.addEventListener('getType',e => {
            console.log(e.params,'authoirizeing');
            this.setState({data:e.params})
            let op ={
                applyCompanyId:e.params.objectId,
            }
            if(e.params.custType == 1||e.params.custType ==5){
                op.authorizeType = 3 //业务类型
            }else if(e.params.custType == 8){
                op.authorizeType = 2 //服务类型
            }
            Wapi.authorize.list(res => {
                this.setState({authorize:res.data})
            },op)
            this.forceUpdate();
        })
    }
    // componentWillReceiveProps(nextProps){
    //     if(nextProps&&nextProps.data){
    //         this.setState({data:nextProps.data})
    //     }
    // }
    showAuth(e,i,v){
        this.setState({showAuth:v})
    }
    back(){
        this.setState({showAuth:0})
    }
    render() {
        // console.log(this.state.data,'该公司的信息')
        console.log(this.state.authorize,'该公司拥有的权限')
        return (
            <div style={{background:'#f7f7f7',minHeight:'100%'}}>
                <span style={{display:'inline-block',lineHeight:'48px',paddingLeft:'16px'}}>{this.state.data.name}</span>
                <DropDownMenu value={this.state.showAuth} onChange={this.showAuth} underlineStyle={{borderTop:0}} style={{float:'right'}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                    <MenuItem value={0} primaryText="已授权" />
                    <MenuItem value={1} primaryText="未授权" />
                </DropDownMenu>
                <div>
                    {
                        this.state.showAuth?
                        <ComTypeAuthing
                            data={this.state.authorize}
                            type={this.state.data}
                            back={this.back}
                        />
                        :
                        <ComTypeAuthed
                            data={this.state.authorize}
                            type={this.state.data}
                        />
                    }
                </div>
            </div>
        );
    }
}

//已授权
class ComTypeAuthed extends Component {
     constructor(props,context){
        super(props,context)    
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.data =[];
        this.obj = [];
    }
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            // this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
            let dele = null;
            this.data.forEach((ele,index) => {
                if(ele.objectId){
                    if(ele.objectId == JSON.parse(e.target.value).objectId){
                        dele = index;
                    }
                }else{
                    if(ele == JSON.parse(e.target.value)){
                        dele = index;
                    }
                }
            })
            console.log(dele);
            this.data.splice(dele,1)
        }
        console.log(this.data,'data')
        // console.log(JSON.parse(e.target.value),'dd')
    }
    submit(){
        let custobj = "";
        let auobj = [];
        let Cautho = [];
        // let type = ['营销推广','政企业务','平台运营','扫码移车']
        this.data.forEach(ele => {
            custobj=ele.applyCompanyId;
            auobj.push(ele.objectId);
            Cautho.push(ele.actProductId-1)
        })


        console.log(custobj,'customer的obj')
        console.log(Cautho,'要更新的customerAuthorzie')
        console.log(auobj,'授权表中obj')
        console.log(auobj,'更新授权表obj')
        Wapi.authorize.update(res => {
            Wapi.customer.update(res => {
                history.back();
            },{
                _objectId:custobj,
                Authorize:'-'+Cautho.join('|')+''
            })
        },{_objectId:auobj.join('|'),status:2})
    }
    render() {
        console.log(this.props.data,'ddff')
        let dataLength = [];
        let authorizeType=['营销推广','政企业务','平台运营'];
        let sevice = ['销售','安装','洗车','轮胎']
        let Item = null;
        this.props.data.forEach((ele,index) => {
            console.log(ele,'shouquanchubulia')
            if(ele.status==1){ //已授权，
                if(ele.authorizeType == 3){ //业务类型
                    dataLength.push(ele)
                    /*return (
                        <MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={authorizeType[ele.actProductId-1]}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />
                    )*/
                }else if(ele.authorizeType == 2){ //服务类型
                    dataLength.push(ele)
                    /*return (
                        <MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={sevice[ele.actProductId-1]}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />
                    )*/
                }
                
            }
        })
        Item = dataLength.map((ele,index) => {
            if(ele.authorizeType == 2){
                return (
                    <MenuItem 
                        rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                        primaryText={sevice[ele.actProductId-1]}
                        key={index}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                    />
                )
            }else if(ele.authorizeType == 3){
                return (
                    <MenuItem 
                        rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                        primaryText={authorizeType[ele.actProductId-1]}
                        key={index}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                    />
                )
            }
            
        })
        console.log(dataLength,Item,'daaasfdfdsf')
        return (
            <div>
                {Item}
                <div style={{width:'100%',textAlign:'center',marginTop:'20px'}}>
                    {dataLength.length?<RaisedButton label="取消授权" onClick={this.submit} secondary={true} />:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff'}}/>}
                </div>
            </div>
        );
    }
}

//未授权
class ComTypeAuthing extends Component {
    constructor(props,context){
        super(props,context)    
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.data =[];
        this.obj = [];
    }
    check(e,val){
        console.log(val,'val')
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            let dele = null;
            this.data.forEach((ele,index) => {
                if(ele.objectId){
                    if(ele.objectId == JSON.parse(e.target.value).objectId){
                        dele = index;
                    }
                }else{
                    if(ele == JSON.parse(e.target.value)){
                        dele = index;
                    }
                }
            })
            console.log(dele);
            this.data.splice(dele,1)
            // this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data,'data')
        // console.log(JSON.parse(e.target.value),'dd')
    }
    submit(){
        let type = ['营销推广','政企业务','平台运营']
        let serType = ['销售','安装','洗车','轮胎']
        let haobj = []; //已存在未授权
        let aobj = [];  //不存在authorize
        let naobj = [] //已存在
        let addtype = [];
        //新增authorize
        var create_json = {
            data: []
        };

        this.data.forEach((ele,index) => {
            if(ele.objectId){
                haobj.push(ele.objectId)
                naobj.push(ele.actProductId-1)
            }else {
                aobj.push(ele)
            }
        })
        if(aobj.length){
            aobj.forEach((ele,index) => {
                // addtype.push(type.indexOf(ele))
                if(this.props.type.custTypeId == 1 || this.props.type.custTypeId == 5){//代理商/品牌商
                    addtype.push(type.indexOf(ele))
                    var op = {
                        actProductId: type.indexOf(aobj[index])+1,
                        applyCompanyId: this.props.type.objectId,
                        applyCompanyName: encodeURIComponent(this.props.type.name),
                        applyUserName: encodeURIComponent(this.props.type.contact),
                        authorizeType:3,
                        status:1
                    }
                    create_json.data.push(op)
                }else if(this.props.type.custTypeId == 8){ //服务商
                    addtype.push(serType.indexOf(ele))
                    var op = {
                        actProductId: serType.indexOf(aobj[index])+1,
                        applyCompanyId: this.props.type.objectId,
                        applyCompanyName: encodeURIComponent(this.props.type.name),
                        applyUserName: encodeURIComponent(this.props.type.contact),
                        authorizeType:2,
                        status:1
                    }
                     create_json.data.push(op)
                }
            })
        }

        console.log(haobj,'已存在未授权')
        console.log(aobj,'不存在authorize')
        console.log(naobj,'已存在')
        console.log(addtype,'添加到customer的type')
        console.log(create_json,'create_json')


        if(haobj.length){
            Wapi.authorize.update(res => {
                Wapi.customer.update(resp => {
                    this.props.back();
                    history.back();
                },{_objectId:this.props.type.objectId,Authorize:'+'+naobj.join('|')+''})
            },{_objectId:haobj.join('|'),status:1})
        }

        if(create_json.data.length){
            Wapi.authorize.addBatch(res => {
                if(res.status_code==0){
                    Wapi.customer.update(resp => {
                        this.props.back();
                        history.back()
                    },{_objectId:this.props.type.objectId,Authorize:'+'+addtype.join('|')+''})
                }
            },create_json)
        }

    }
    render() {
        console.log(this.props.data,'ddff')
        let dataLength = [];
        let authorizeType=['营销推广','政企业务','平台运营'];
        let sevice = ['销售','安装','洗车','轮胎']
        let addAuth = []
        let noauthLength = [];
        // let ItemLength = []
        let Item = this.props.data.map((ele,index) => {
            // console.log(addAuth.splice(authorizeType.indexOf(authorizeType[ele.actProductId-1]),1),'authoriize')
            if(ele.authorizeType == 3){         //业务类型
                addAuth.push(authorizeType[ele.actProductId-1])
            }else if(ele.authorizeType == 2){   //服务类型
                addAuth.push(sevice[ele.actProductId-1])
            }
            if(ele.status==2){ //已暂停且类型为业务
                dataLength.push(ele)
                if(ele.authorizeType == 3){ //业务类型
                    return (
                        <MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={authorizeType[ele.actProductId-1]}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />
                    )
                }else if(ele.authorizeType == 2) { //服务类型
                    return (
                        <MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={sevice[ele.actProductId-1]}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />
                    )
                }
                    
            }
        })

        let noauth = [];
        if(addAuth.length){//在授权表中已有授权
            this.props.data.forEach(ele => {
                if(ele.authorizeType == 3){ //业务类型
                    noauth = authorizeType.map((eles,index) => {
                    // console.log('品牌商/代理商')                        
                        if(addAuth.indexOf(eles) == -1) { //未在授权表中出现过的
                            noauthLength.push(eles);//用于判断是否有列表显示
                            return (
                                <MenuItem 
                                    rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(eles)} style={{float:'right'}} />}
                                    primaryText={eles}
                                    key={index}
                                    style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                                />
                            )
                        }
                    })
                }else if(ele.authorizeType == 2) { //服务类型
                    noauth = sevice.map((eles,index) => {
                        if(addAuth.indexOf(eles) == -1) {
                            noauthLength.push(eles);//用于判断是否有列表显示
                            return (
                                <MenuItem 
                                    rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(eles)} style={{float:'right'}} />}
                                    primaryText={eles}
                                    key={index}
                                    style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                                />
                            )
                        }
                    })
                }
            })
        }else {
            if(this.props.type.custTypeId == 8){ //服务商
                noauth = sevice.map((eles,index) => {
                    if(addAuth.indexOf(eles) == -1) {
                        noauthLength.push(eles);//用于判断是否有列表显示
                        return (
                            <MenuItem 
                                rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(eles)} style={{float:'right'}} />}
                                primaryText={eles}
                                key={index}
                                style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                            />
                        )
                    }
                })
            }else {//品牌商/代理商
                // console.log('品牌商/代理商')
                noauth = authorizeType.map((eles,index) => {
                    if(addAuth.indexOf(eles) == -1) { //未在授权表中出现过的
                        noauthLength.push(eles);//用于判断是否有列表显示
                        return (
                            <MenuItem 
                                rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(eles)} style={{float:'right'}} />}
                                primaryText={eles}
                                key={index}
                                style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                            />
                        )
                    }
                })
            }
        }
        console.log(addAuth,'授权表中有的要更新');
        console.log(noauth,Item,'querensohou')

        return (
            <div>
                {Item}
                {noauth}
                <div style={{width:'100%',textAlign:'center',marginTop:'20px'}}>
                    {(dataLength.length||noauthLength.length)?<RaisedButton label="确认授权" onClick={this.submit} secondary={true} />:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff'}}/>}
                </div>
            </div>
        );
    }
}


//公司授权业务列表


// let CustList=CustListHC(UserItem);
//服务项目
/*class Project extends Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        return(
            <div style={{background:'#f3f3f3',height:'100vh',width:'100vw'}}>
                服务项目
            </div>
        )
    }
}*/


//级联选择
class Address extends Component {
      constructor(props,context){
        super(props,context);
        this.state ={
            provice:[],
            city:[],
            citys:[],
            imit:false,
            areaId:0,
            area:[],

        }
        this.getCity = this.getCity.bind(this);
        this.selectCity = this.selectCity.bind(this);
        this.selectArea = this.selectArea.bind(this);
        this.showselect = this.showselect.bind(this);
        this.close = true;
        this.address = "区域";
        this.area ={},
        this.provice = '';
        this.city = '';
    }
    componentDidMount() {
        Wapi.area.list(res => {
            this.setState({provice:res.data})
        },{level:1})
        Wapi.area.list(res => {
            this.setState({city:res.data})
        },{level:2})
    }
    getCity(provice){
        // let provice = event.target.innerHTML.replace('<div>','').replace('</div>','');
        // console.log(provice == "全部")
        this.provice = provice;
        if(provice == "省份"){
            this.close = true;  
            this.area={} 
            this.sendArea(this.area)
        }else {
            this.close = false;
        }
        let city=[];
        this.address = provice;
        this.state.provice.forEach(ele => {
            if(ele.name == provice ){
                this.area.proviceId = ele.id;
                this.state.city.forEach(eles => {
                    if(ele.id == eles.parentId){
                        ele.provinceName = provice;
                        city.push(eles)
                    }
                })
            }
        })
        this.setState({area:[]})
        this.setState({citys:city})
        this.forceUpdate();
        console.log(city,'city');
        
    }
    selectCity(city){
        // let city = event.target.innerHTML.replace('<div>','').replace('</div>','');
        this.city = city;
        // let scity=this.state.city[0];
        let scity = {};
        let cityId=0 //城市Id
        this.state.city.forEach(ele => {
            if(ele.name == city) {
                cityId = ele.id;
                scity = ele;
            }
        })
        console.log(scity,'scity')
        if(city != '城市'){
            this.address = city;
            this.close = false;
            // this.area ={};
            // this.area.proviceId = scity.parentId
            this.area.cityId = cityId
        }else {
            this.close = true;
            // this.address = scity.provinceName
            this.area.cityId = null;
            this.area.areaId = null;
            this.sendArea(this.area)
            this.address = this.provice
        }

        Wapi.area.list(res => {
            this.setState({area:res.data})
        },{level:3,parentId:cityId})

        this.setState({areaId:cityId})
        // W.emit(window,'getcity',scity);
        
        // this.props.load();
    }
    selectArea(area){
        // let area = event.target.innerHTML.replace('<div>','').replace('</div>','');
        let areaId = '';
        this.state.area.forEach(ele => {if(ele.name==area){areaId = ele.id}})

        if(area != '地区'){
            this.address = area;
            this.area.areaId = areaId
        }else {
            this.area.areaId = null;
            this.address = this.city
        }
       
        console.log(areaId,'event')
        this.close = true;
        this.forceUpdate();
        // W.emit(window,'getareaId',this.area);
        this.sendArea(this.area)
    }
    sendArea(data){
        W.emit(window,'getareaId',data);
    }
    showselect(){
        console.log(111)
        this.close = !this.close;
        // this.address = "";
        this.forceUpdate();
    }

    
    render() {
        // console.log(this.state.provice,'省');
        // console.log(this.state.citys,'市');
        console.log(this.close,'this.closes')
        // console.log(this.state.area,'区')
        let provice = this.state.provice.map((ele,index) => (<ListItem onTouchTap={()=>{this.getCity(ele.name)}} value={ele.id} primaryText={ele.name.substring(0,3)} key={index+1} />))
        provice.unshift(<ListItem onTouchTap={()=>{this.getCity("省份")}} value={0} primaryText="省份" key={0}/>)
        let citys = this.state.citys.map((ele,index) => (<ListItem onTouchTap={()=>{this.selectCity(ele.name)}} value={ele.id} primaryText={ele.name.substring(0,4)} key={index+1} innerDivStyle={{textOverflow:'ellipsis'}}/>))
        if(citys.length>0){
            citys.unshift(<ListItem onTouchTap={()=>{this.selectCity('城市')}} value={0} primaryText="城市" key={0}/>)
        }
        let areas = [];
        if(this.state.area.length>0){
            areas = this.state.area.map((ele,index) => (<ListItem onTouchTap={()=>{this.selectArea('地区')}} value={ele.id} primaryText={ele.name.substring(0,4)} key={index+1} innerDivStyle={{textOverflow:'ellipsis'}}/>))
            areas.unshift(<ListItem onTouchTap={()=>{this.selectArea('地区')}} value={0} primaryText="地区" key={0}/>)
        }
        return (
            <div style={{display:'inline-block',padding: '0px 0px 0px 6px'}}>
                <div style={{fontSize:'15px',position:'relative',top:'5px'}} onClick={this.showselect}><span style={{display:'inline-block',minWidth:30,maxWidth:55,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{this.address}</span><span style={{position:'relative',top:3}}><NavigationArrowDropDown style={{fill: 'rgba(0, 0, 0, 0.11)'}}/></span></div>
                <div style={this.close?{display:'none'}:{display:'block',position:'absolute',left:0,top:50,zIndex:999,background:'#fff',width:'100%',height:'50%',boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',borderRadius: '2px'}} >
                    <List style={{float:'left',background:'#fff',width:'33%',paddingTop:0,height:'100%',overflow:'auto'}}>
                        {provice}
                    </List>
                    <List style={{float:'right',background:'#fff',width:'34%',paddingTop:0,height:'100%',overflow:'auto'}}>
                        {areas}
                    </List>
                    <List style={{float:'right',background:'#fff',width:'33%',paddingTop:0,height:'100%',overflow:'auto'}}>
                        {citys}
                    </List>
                </div>
            </div>
        );
    }
}

// 邀约注册
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
                        <div>{'品牌商注册'}</div>
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
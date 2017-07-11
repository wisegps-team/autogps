//营销活动
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Card from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import EditActivity from '../_component/editActivity';
import Input from '../_component/base/input';
import {getOpenIdKey,changeToLetter} from '../_modules/tool';


const styles = {
    main:{paddingBottom:'20px'},
    card:{margin:'10px',padding:'0px 10px 10px',borderBottom:'1px solid #cccccc'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    line:{marginTop:'0.5em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    a:{marginRight:'1em',color:'#009688'},
    no_data:{marginTop:'15px',display:'block',width:'100%',textAlign:'center'},
    hide:{display:'none'},
    to:{horizontal: 'right', vertical: 'top'},
    menu_item:{height:'40px'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'},
    warn:{color:'#ff9900'},
    search_head:{width:'100%',display:'block'},
    add_icon:{float:'right',marginRight:'15px',color:"#2196f3"},
    search_box:{marginLeft:'15px',marginTop:'15px',width:'80%',display:'block'},
    span_left:{fontSize:'0.8em',color:'#666666'},
    span_right:{fontSize:'0.8em'},
    warnPage:{position: 'absolute',left: '0px',top: '0px',width:'100%',height: '100%',backgroundColor: '#fff'},
    warns:{textIndent:'2em',padding:'10px'},
    hide:{display:'none'},
    p:{textIndent:'2em'},
    btn:{width:'100%',display:'block',textAlign:'center',paddingBottom:'30px'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}


var thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.seller_activity);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('booking_list.js',2);
});

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
            curActivity:null,
            activityName:'',
            noEdit:false,

            keyword:'',
        }
        this.limit=99;
        this.page_no=1;
        this.total=0;
        this.originalActivities=[];
        this.activities=[];
        this.booking=[];
        this.gotData=false;

        this.search = this.search.bind(this);
        this.weixin = [{name:'服务号'},{name:'营销号'}];

        this.nextPage = this.nextPage.bind(this);
        this.toAdd = this.toAdd.bind(this);
        this.add = this.add.bind(this);
        this.addSubmit = this.addSubmit.bind(this);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
        this.editBack = this.editBack.bind(this);
        this.editSubmit = this.editSubmit.bind(this);
    }
    search(e,value){
        this.activities=this.originalActivities.filter(ele=>ele.name.includes(value));
        this.setState({keyword:value});
    }
    getChildContext(){
        return {
            delete:this.delete,
            edit:this.edit,
            url:this.url,
        };
    }
    componentDidMount() {
        Wapi.weixin.list(res=>{
            this.weixin[0]=res.data.find(ele=>ele.type==0)||{name:'服务号'};
            this.weixin[1]=res.data.find(ele=>ele.type==1)||{name:'营销号'};
        },{uid:_user.customer.objectId});

        let par={
            "group":{
                "_id":{"activityId":"$activityId"},
                "status0":{"$sum":"$status0"},
                "status1":{"$sum":"$status1"},
                "status2":{"$sum":"$status2"},
                "status3":{"$sum":"$status3"}
            },
            "sorts":"objectId",
            "uid":_user.customer.objectId,
        }
        Wapi.booking.aggr(resAggr=>{
            this.booking=resAggr.data;
            this.getData();
        },par);
        // this.getData();
    }
    nextPage(){
        this.page_no++;
        this.getData();
    }
    getData(){
        Wapi.activity.list(res=>{
            this.total=res.total;
            let activities=res.data;

            activities.map(ele=>{
                let booking=this.booking.find(item=>item._id.activityId==ele.objectId);
                if(booking){
                    ele.status0=booking.status0;
                    ele.status1=booking.status1;
                    ele.status2=booking.status2;
                    ele.status3=booking.status3;
                }else{
                    ele.status0=0;
                    ele.status1=0;
                    ele.status2=0;
                    ele.status3=0;
                }
            });
            this.originalActivities=this.activities.concat(activities);
            this.activities=this.activities.concat(activities);
            this.gotData=true;
            this.forceUpdate();
        },{
            uid:_user.customer.objectId,
        },{
            limit:this.limit,
            page_no:this.page_no,
            sorts:'-createdAt',
        });
    }
    toAdd(){
        this.showWarn=true;
        this.forceUpdate();
    }
    add(){
        this.showWarn=false;
        this.setState({
            isEdit:true,
            noEdit:false,
            curActivity:null,
            activityName:'',
        });
    }
    addSubmit(activity){
        this.activities.unshift(activity);
        history.back();
    }
    delete(activity){
        if(_user.objectId!=activity.creator){
            W.alert(___.not_creator);
            return;
        }
        if(activity.status0!=0){
            W.alert(___.activity_delete_booked);
            return;
        }
        W.confirm(___.confirm_delete_data,(b)=>{
            if(b){
                Wapi.activity.delete(res=>{
                    if(res.status_code==0){
                        for(let i=this.activities.length;i--;){
                            if(this.activities[i].objectId==activity.objectId){
                                this.activities.splice(i,1);
                                this.forceUpdate();
                                break;
                            }
                        }
                        W.alert(___.delete_activity_success);
                    }else{
                        W.alert(___.delete_activity_fail);
                    }
                },{objectId:activity.objectId});
            }
        });
    }
    edit(activity){
        let noEdit=false;
        if(activity.creator!=_user.objectId){
            noEdit=true;
        }
        this.setState({
            isEdit:true,
            curActivity:activity,
            activityName:activity.name,
            noEdit:noEdit,
        });
    }
    editBack(){
        this.setState({isEdit:false});
    }
    editSubmit(activity){
        for(let i=this.activities.length-1;i>=0;i--){
            if(this.activities[i].objectId==activity.objectId){
                this.activities[i]=activity;
                break;
            }
        }
        this.forceUpdate();
        history.back();
    }
    url(acitivity){
        window.location=acitivity.url;
    }
    render() {
        let marketPromission=_user.customer.other&&_user.customer.other.va;
        return (
            <ThemeProvider>
                <div>
                    <div style={styles.search_head}>
                        <ContentAdd style={styles.add_icon} onClick={this.toAdd}/>
                        <div style={styles.search_box}>
                            <Input 
                                style={{height:'36px'}}
                                inputStyle={{height:'30px'}}
                                onChange={this.search} 
                                hintText={___.search}
                                value={this.state.keyword}
                            />
                        </div>
                    </div>

                    <div style={(this.gotData && this.activities.length==0) ? styles.no_data : styles.hide}>
                        点击右上角＋创建营销活动！
                    </div>

                    <div name='list' style={!this.showWarn ? styles.main : styles.hide}>
                        <Alist 
                            max={this.total} 
                            limit={this.limit} 
                            data={this.activities} 
                            next={this.nextPage} 
                        />
                    </div>
                    
                    <SonPage title={___.edit_seller_activity} open={this.state.isEdit} back={this.editBack}>
                        <EditActivity 
                            isCarownerSeller={false}
                            data={this.state.curActivity} 
                            noEdit={this.state.noEdit}
                            editSubmit={this.editSubmit} 
                            addSubmit={this.addSubmit}
                        />
                    </SonPage>

                    <div style={this.showWarn?styles.warnPage:styles.hide}>
                        <div style={styles.warns}>
                            <p>创建营销活动前，请先了解以下注意事项：</p>
                            <p>一、营销活动类别</p>
                            <p style={(Boolean(marketPromission) && marketPromission.includes('3'))?{}:styles.hide}>
                                车主营销：您的终端用户可在公众号[{this.weixin[0].name}]的“推荐有礼”分享。
                            </p>
                            <p style={(Boolean(marketPromission) && marketPromission.includes('1'))?{}:styles.hide}>
                                渠道营销：您的员工和渠道伙伴可在公众号[{this.weixin[1].name}]的“推荐有礼”分享。
                            </p>
                            <p style={(Boolean(marketPromission) && marketPromission.includes('0'))?{}:styles.hide}>
                                集团营销：您的集团营销人员可在公众号[{this.weixin[1].name}]的“推荐有礼”分享。
                            </p>
                            <p>二、营销产品类别</p>
                            <p>全国安装：车主预订后可在您授权的网点和选择同一营销产品其他伙伴授权的网点安装。</p>
                            <p>本地安装：车主预订后只能在您授权的网点安装。</p>
                            <p>三、预订时支持本人预订或赠送好友，本人预订可选零元预订或支付订金，赠送好友可选零元预订或支付设备款及安装费，预订时选择支付订金或设备款则通过微信付款到智联车网平台，预订后车主自由选择合适的安装网点，安装注册时支持同品牌营销产品低端换高端、高端换低端等多种选购方式，充分满足车主需求和营销需求。</p>
                            <p>四、如有预付款，安装注册时平台同步划转到设备当前所属代理商/经销商的企业账号，佣金也由平台自动从该企业账号划转到营销人员个人钱包，<span style={{fontWeight:'bold'}}>为保证资金结算正常，请通过平台及时办理出入库手续。</span></p>
                        </div>
                        <div style={styles.btn}>
                            <RaisedButton label={___.ok} primary={true} onClick={this.add} />
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    delete:React.PropTypes.func,
    edit:React.PropTypes.func,
    url:React.PropTypes.func
}

let strStatus=[___.terminated,___.ongoing];
let strBoolean=[___.no,___.yes];
let activityType=[___.carowner_seller,___.group_marketing,___.employee_marketing,___.subordinate_marketing];
let strChannel=[___.national_marketing,___.regional_marketing];
class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.toActivityPage = this.toActivityPage.bind(this);
        this.toCountPage = this.toCountPage.bind(this);
        this.canTouch=true;
    }
    toActivityPage(data){
        if(!this.canTouch)return;
        this.canTouch=false;
        setTimeout(()=>{
            this.canTouch=true;
        }, 500);

        data._seller=_user.employee?_user.employee.name:_user.customer.contact;
        data._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
        data._sellerTel=_user.employee?_user.employee.tel:_user.mobile;
        let strOpenId='';
        let idKey=getOpenIdKey();
        if(_user.authData && _user.authData[idKey]){
            strOpenId='&seller_open_id='+_user.authData[idKey];
        }

        
        Wapi.qrLink.get(res=>{//获取与[当前活动和seller]对应的短码，如没有则新建
            let linkUrl='';
            if(res.data){
                linkUrl='http://t.autogps.cn/?s='+res.data.id;
                // history.replaceState('home.html','home.html','home.html');
                W.fixPath();
                window.location=linkUrl;
                // console.log(linkUrl);
            }else{
                Wapi.qrLink.add(re=>{
                    let _id=changeToLetter(re.autoId);
                    linkUrl='http://t.autogps.cn/?s='+_id;
                    Wapi.qrLink.update(json=>{
                        // history.replaceState('home.html','home.html','home.html');
                        W.fixPath();
                        window.location=linkUrl;
                        // console.log(linkUrl);
                    },{
                        _objectId:re.objectId,
                        id:_id
                    })
                },{
                    i:1,
                    act:String(data.objectId),
                    sellerId:String(data._sellerId),
                    uid:String(data.uid),
                    type:3,
                    url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
                        +'&uid='+data.uid
                        +'&sellerId='+data._sellerId
                        +'&activityId='+data.objectId
                        +strOpenId
                        +'&timerstamp='+Number(new Date()),
                });
            }
        },{
            act:data.objectId,
            sellerId:data._sellerId,
            uid:data.uid,
            type:3
        });

        // history.replaceState('home.html','home.html','home.html');
        // window.location='http://'+WiStorm.config.domain.wx+'/autogps/action.html?intent=logout&action='+encodeURIComponent(data.url)
        //     +'&title='+encodeURIComponent(data.name)
        //     +'&uid='+_user.customer.objectId
        //     +'&seller_name='+encodeURIComponent(_user.customer.name)
        //     +'&sellerId='+_user.objectId
        //     +'&mobile='+_user.mobile
        //     +'&agent_tel='+_user.customer.tel
        //     +'&wxAppKey='+data.wxAppKey
        //     +'&activityId='+data.objectId
        //     +'&seller_open_id='+_user.authData.openId
        //     +'&timerstamp='+Number(new Date());
    }
    toCountPage(page,data){
        if(page=='booking'){
            let par={
                activityId:data.objectId,
                status:0
            }
            thisView.goTo('booking_list.js',par);
        }else{
            let par={
                activityId:data.objectId,
                status:1
            }
            thisView.goTo('booking_list.js',par);
        }
    }
    render() {
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <div key={i} style={styles.card}>
                <IconMenu
                    style={{float:'right'}}
                    iconButtonElement={
                        <IconButton style={{border:'0px',padding:'0px',margin:'0px',width:'24px',height:'24px'}}>
                            <MoreVertIcon/>
                        </IconButton>
                    }
                    targetOrigin={styles.to}
                    anchorOrigin={styles.to}
                    >
                    <MenuItem 
                        style={styles.menu_item} 
                        primaryText={___.preview} 
                        onTouchTap={()=>this.toActivityPage(ele)}
                    />
                    <MenuItem 
                        style={ele.uid==_user.customer.objectId ? styles.menu_item : styles.hide} 
                        primaryText={___.edit} 
                        onTouchTap={()=>this.context.edit(ele)}
                    />
                    <MenuItem 
                        style={ele.uid==_user.customer.objectId ? styles.menu_item : styles.hide}
                        primaryText={___.delete} 
                        onTouchTap={()=>this.context.delete(ele)}
                    />
                </IconMenu>
                <div style={styles.line}>
                    {ele.name}
                    <span style={ele.status?styles.hide:{}}><span style={styles.warn}> 暂停推广</span></span>
                </div>
                <div style={combineStyle(['line','span_right'])}>
                    {activityType[ele.type]
                    +(Number.isInteger(ele.channel)?('/'+strChannel[ele.channel]):'')}
                </div>
                <div style={{marginTop: '0.5em',fontSize: '0.8em',display: 'block',height: '1.5em'}}>
                    <div style={{width:'32%',float: 'left'}}>
                        <span style={{color:'#666666'}}>{___.seller_account+'：'}</span>
                        <span>{0}</span>
                    </div>
                    <div style={{width:'32%',float: 'left'}}>
                        <span style={{color:'#666666'}}>{___.click_account+'：'}</span>
                        <span>{0}</span>
                    </div>
                    <div style={{width:'30%',float: 'left'}}>
                        <span style={{color:'#666666'}}>{___.booked_number+'：'}</span>
                        <span>{ele.status0}</span>
                    </div>
                </div>
                {/*<div style={styles.line}>
                    <span style={styles.span_left}>{___.regional_marketing+' : '}</span>
                    <span style={styles.span_right}>{ele.brand+' '+ele.product}</span>
                </div>
                <div style={styles.line}>
                    <span style={styles.span_left}>{___.support_hotline+' : '}</span>
                    <span style={styles.span_right}>{ele.tel}</span>
                </div>
                <div style={styles.line}>
                    <span style={styles.span_left}>{___.offersDesc+' : '}</span>
                    <span style={styles.span_right}>{'现在支付订金'+ele.reward+'元，'+ele.offersDesc}</span>
                </div>*/}
            </div>
        )
        return(
            <div>
                {items}
            </div>
        )
    }
}
DList.contextTypes={
    delete: React.PropTypes.func,
    edit: React.PropTypes.func,
    url: React.PropTypes.func
};
let Alist=AutoList(DList);



export default App;

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
import Card from 'material-ui/Card';

import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';


const styles={
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingBottom:'20px'},
    main_sonpage:{width:'90%',paddingTop:'10px',paddingLeft:'5%',paddingRight:'5%',paddingBottom:'20px'},
    card:{marginTop:'0.5em',padding:'0.5em',borderBottom:'1px solid #999999'},
    line:{marginTop:'0.5em',fontSize:'0.8em',color:'#999999'},
    link:{marginRight:'1em',color:'#009688'},
}

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const emptyCust={
    name:'',
    contact:'',
    tel:'',
    province:'',
    city:'',
    area:''
}
class App extends Component{
    constructor(props, context) {
        super(props, context);
        // this._data={
        //     parentId:_user.customer.objectId,
        //     custTypeId:'5|8',
        //     isInstall:1,//注释掉这一个条件，假装有数据
        // };
        this.custs=[];
        this.state={
            detail:false,
            inCount:false,
            curCust:null,
        }
        this.detail = this.detail.bind(this);
        this.detailBack = this.detailBack.bind(this);
        this.purchase = this.purchase.bind(this);
    }
    getChildContext(){
        return{
            'VIEW':thisView,
            detail:this.detail,
            purchase:this.purchase,
        }
    }
    componentDidMount() {
        // purchaseNum//采购数量，即上一级出库到此用户的设备数量
        // distributeNum//分配数量，上级分配给此用户安装的设备数量（不进入此用户的库存）
        // installNum//安装数量，此用户的出库记录

        let params={
            parentId:_user.customer.objectId,
            custTypeId:'5|8',
            isInstall:1,//注释掉这一个条件，假装有数据
            appId:WiStorm.config.objectId
        };
        Wapi.customer.list(res=>{//获取此用户的所有下级
            let custs=res.data;

            let par={
                'group':{
                    '_id':{'to':'$to'},
                    'outCount':{'$sum':'$outCount'},
                },
                'sorts':'objectId',
                'from':_user.customer.objectId,
                'type':0
            };
            Wapi.deviceLog.aggr(re=>{//从当前用户出库的出库，按接收方id分组
                custs.map(ele=>{
                    ele.purchaseNum=0;
                    ele.distributeNum=0;
                    ele.installNum=0;

                    let tarData=re.data.find(item=>item._id.to==ele.objectId);
                    ele.purchaseNum=tarData?tarData.outCount:0;
                });

                let p={
                    'group':{
                        '_id':{'from':'$from'},
                        'outCount':{'$sum':'$outCount'},
                    },
                    'sorts':'objectId',
                    'type':0
                };
                Wapi.deviceLog.aggr(r=>{//获取所有用户的出库数量，按发出方分组
                    custs.map(ele=>{
                        let tarData=r.data.find(item=>item._id.from==ele.objectId);
                        ele.installNum=tarData?tarData.outCount:0;
                    });

                    let pBooking={
                        'group':{
                            '_id':{'installId':'$installId'},
                            'status0':{'$sum':'$status0'},
                        },
                        'sorts':'objectId',
                        'uid':_user.customer.objectId,
                    };
                    Wapi.booking.aggr(rBooking=>{//获取所有预定记录数量，按installId分组
                        custs.map(ele=>{
                            let tarData=rBooking.data.find(item=>item._id.installId==ele.objectId);
                            ele.distributeNum=tarData?tarData.status0:0;
                        });

                        console.log(custs);
                        this.custs=custs;
                        this.forceUpdate();

                    },pBooking);

                },p);

            },par);
            
        },params,{limit:-1});
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
    detail(data){
        this.setState({
            curCust:data,
            detail:true,
        });
    }
    detailBack(){
        this.setState({
            curCust:null,
            detail:false,
        });
    }
    purchase(data){

        let params={
            from:_user.customer.objectId,
            to:data.objectId,
        }
        thisView.postMessage('pushPopCount.js',params);
        thisView.goTo('pushPopCount.js',params);
    }
    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.install_shop} iconElementRight={<IconButton onClick={this.tip}><ContentAdd/></IconButton>}/>
                <div style={styles.main}>
                    <CustList data={this.custs}/>
                </div>
                <SonPage open={this.state.detail} back={this.detailBack}>
                    <CustDetail data={this.state.curCust}/>
                </SonPage>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    VIEW:React.PropTypes.object,

    detail:React.PropTypes.func,
    purchase:React.PropTypes.func,
}

class UserItem extends Component{
    constructor(props, context) {
        super(props, context);
    }
    render() {
        console.log('render item');
        let data=this.props.data;
        return (
            <div style={styles.card}>
                <div onClick={()=>this.context.detail(data)}>{data.name}</div>
                <div style={{marginTop:'0.5em',fontSize:'0.8em'}}>
                    <span style={styles.link} onClick={()=>this.context.purchase(data)}>{___.purchase+' '+data.purchaseNum||0}</span>
                    <span style={{marginRight:'1em'}}>{___.distribute+' '+data.distributeNum||0}</span>
                    <span style={{marginRight:'1em'}}>{___.install+' '+data.installNum||0}</span>
                </div>
            </div>
        );
    }
}
UserItem.contextTypes ={
    VIEW:React.PropTypes.object,
    delete:React.PropTypes.func,
    showCount:React.PropTypes.func,

    detail:React.PropTypes.func,
    purchase:React.PropTypes.func,
}
class CustList extends Component {
    constructor(props,context){
        super(props,context);
        this.data=[];
    }
    componentDidMount() {
        if(this.props.data){
            this.data=this.data.concat(this.props.data);
            this.forceUpdate();
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.data=this.data.concat(nextProps.data);
            this.forceUpdate();
        }
    }
    
    render() {
        console.log('render list');
        let items=this.data.map((ele,i)=><UserItem key={i} data={ele}/>);
        return (
            <div>
                {items}
            </div>
        );
    }
}


class CustDetail extends Component {
    render() {
        let data=Object.assign(emptyCust,this.props.data);
        return (
            <div style={styles.main_sonpage}>
                <div>
                    <div style={styles.line}>{___.name}</div>
                    <div>{data.name}</div>
                </div>
                <div>
                    <div style={styles.line}>{___.person}</div>
                    <div>{data.contact}</div>
                </div>
                <div>
                    <div style={styles.line}>{___.cellphone}</div>
                    <div>{data.tel}</div>
                </div>
                <div>
                    <div style={styles.line}>{___.address}</div>
                    <div>{data.province + data.city + data.area}</div>
                </div>
            </div>
        );
    }
}


function setShare(){
    var op={
        title: ___.invitation_url, // 分享标题
        desc: _user.customer.name, // 分享描述
        link: location.origin+'/?intent=logout&register=true&parentId='+_user.customer.objectId+'&custType=8&name='+encodeURIComponent(_user.customer.name)+'&isInstall=1', // 分享链接
        imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
        success: function(){},
        cancel: function(){}
    }
    // history.replaceState('home.html','home.html','home.html');
    W.fixPath();
    wx.onMenuShareTimeline(op);
    wx.onMenuShareAppMessage(op);
    setShare=null;
}

if(W.native)
    setShare()
else
    window.addEventListener('nativeSdkReady',setShare);
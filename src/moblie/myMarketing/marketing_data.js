//我的营销>营销资料
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import AppBar from '../../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {reCode,getOpenIdKey} from '../../_modules/tool';
import Input from '../../_component/base/input';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.act_data);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('bind_count.js',2);
    thisView.prefetch('scan_count.js',2);
});

const styles = {
    main:{
        // paddingTop:'50px',
        paddingBottom:'20px'
    },
    card:{
        margin:'10px',
        padding:'0px 10px 10px',
        borderBottom:'1px solid #cccccc'
    },
    count:{
        marginRight:'1em'
    },
    line:{
        paddingTop:'0.5em'
    },
    variable:{
        color:'#009688'
    },
    link:{
        color:'#0000cc'
    },
    hide:{
        display:'none',
    },
    content:{
        margin:'15px'
    },
    spans:{
        fontSize:'1em',
        marginRight:'1em',
    },
    search_head:{
        width:'100%',
        display:'block'
    },
    add_icon:{
        float:'right',
        marginRight:'15px'
    },
    search_box:{
        marginLeft:'15px',
        marginTop:'15px',
        width:'80%',
        display:'block'
    }
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

// 测试用
// W.native={
//     scanner:{
//         start:function(callback){
//             setTimeout(function(){
//                 callback('http://t.autogps.cn/?s=274');
//             },100);
//         }
//     }
// }
// let isWxSdk=true;

//正式用
let isWxSdk=false;
if(W.native){
    isWxSdk=true;
}else{
    window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});
}

let qrLinks=[
    {
        name:'第一批二维码',
        act:'806314613238009900',
        sellerId:'001',
        url:'http://www.baidu.com',
        bind:10,
        scan:9,
    },{
        name:'第二批二维码',
        act:'805974631000444900',
        sellerId:'002',
        url:'http://www.qq.com',
        bind:10,
        scan:9,
    },{
        name:'第三批二维码',
        act:'803863722111144000',
        sellerId:'003',
        url:'http://www.sina.com',
        bind:10,
        scan:9,
    },
]
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            keyword:''
        }
        this.activity={};
        this.originalData=[];
        this.data=[];
        this.national=false;
        this.gotData = false;
        this.search = this.search.bind(this);
        this.getData = this.getData.bind(this);
        this.bindCount = this.bindCount.bind(this);
        this.scanToBind = this.scanToBind.bind(this);
    }
    search(e,value){
        console.log(this.data);
        // this.activities=this.originalActivities.filter(ele=>ele.name.includes(value));
        // this.setState({keyword:value});
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(e.params){
                this.activity=e.params;
                this.gotData=true;
                console.log(e.params);
                Wapi.customer.get(res=>{
                    if(res.data.custTypeId==1){
                        this.national=true;
                        this.forceUpdate();
                    }
                },{objectId:e.params.uid});
            }
            this.getData();            
        });
    }
    getData(){
        Wapi.qrLink.aggr(res=>{
            this.originalData=res.data;
            this.data=res.data;
            this.forceUpdate();
        },{
            "group":{
                "_id":{
                    "batchId":"$batchId",
                    "batchName":"$batchName",
                    "type":"$type",
                },
                "bindNum":{
                    "$sum":"$status"
                }
            },
            "sorts":"batchId",
            "sellerId":_user.objectId,
            "act":this.activity.objectId,
        });
    }
    bindCount(data){
        thisView.goTo('bind_count.js',data); 
    }
    scanCount(data){
        // thisView.goTo('scan_count.js',data.act);
    }
    scanToBind(){
        let _this=this;
        // history.replaceState('home.html','home.html','../home.html');
        W.fixPath();
        if(isWxSdk){
            W.native.scanner.start(link=>{//扫码
                console.log(link);
                link=reCode(link);
                let reg=/https*:\/\/autogps\.cn\/\?s=.*/;
                let regs = /https*:\/\/t\.autogps\.cn\/\?s=.*/
                if(!(reg.test(link)||regs.test(link))){//判断二维码是否是卫网平台创建的
                    W.alert(___.qrcode_unknown);
                    return;
                }
                let code=link.split('=')[1];
                Wapi.qrDistribution.get(re=>{//判断该二维码是否和当前用户属于同一经销商
                    let canBind=false;
                    let uid=re.data.uid;
                    let batchId=re.data.objectId;
                    let batchName=re.data.name;
                    
                    let activity=_this.activity;

                    if(_user.employee && _user.employee.companyId==uid){//如果当前用户为(营销人员|员工),则判断其所属公司id是否和二维码uid相同
                        canBind=true;
                    }
                    if(_user.customer.custTypeId==8 && _user.customer.parentId.includes(uid)){//如果当前用户为经销商，则判断其上一级id是否和二维码uid相同
                        canBind=true;
                    }
                    if(activity.uid!=uid){//活动创建者和二维码拥有者不是同一个公司
                        W.alert(___.not_same_user);
                        return;
                    }
                    if(!canBind){
                        W.alert(___.not_belong);
                        return;
                    }

                    Wapi.qrLink.get(res=>{//判断该二维码是否已被创建或绑定
                        if(res.data && res.data.status){//已被绑定
                            W.alert(___.qrcode_bound);
                            return;
                        }

                        let created=false;
                        if(res.data!=null){//未被创建，则需要创建
                            created=true;
                        }
                        
                        activity._seller=_user.employee?_user.employee.name:_user.customer.contact;
                        activity._sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
                        activity._sellerTel=_user.employee?_user.employee.tel:_user.customer.tel;

                        let strOpenId='';
                        let idKey=getOpenIdKey();
                        if(_user.authData && _user.authData[idKey]){
                            strOpenId='&seller_open_id='+_user.authData[idKey];
                        }
                        let data={
                            i:1,
                            uid:String(_user.customer.objectId),
                            id:code,
                            sellerId:String(_user.objectId),
                            act:String(_this.activity.objectId),
                            type:1,
                            batchId:batchId,
                            batchName:batchName,
                            status:1,
                            url:WiStorm.root+'action.html?intent=logout'
                                +'&activityId='+activity.objectId
                                +'&sellerId='+activity._sellerId
                                +'&uid='+activity.uid
                                +strOpenId
                                +'&timerstamp='+Number(new Date()),
                            // url:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(activity.url)
                            //     +'&title='+encodeURIComponent(activity.name)
                            //     +'&uid='+activity.uid
                            //     +'&seller_name='+encodeURIComponent(activity._seller)
                            //     +'&sellerId='+activity._sellerId
                            //     +'&mobile='+activity._sellerTel
                            //     +'&agent_tel='+_user.customer.tel
                            //     +'&wxAppKey='+activity.wxAppKey
                            //     +'&activityId='+activity.objectId
                            //     +strOpenId
                            //     +'&timerstamp='+Number(new Date()),
                        }

                        let parPm={
                            id:1,
                            type:4,
                            qrcodeId:data.id,
                            marpersonId:data.sellerId,
                            maractivityId:data.act,
                            publiceId:W.getCookie('current_wx'),
                            marcompanyId:_user.customer.objectId,
                            maractcompanyId:activity.uid,
                            martypeId:activity.type,
                            pertypeId:_user.customer.objectId,
                            commission:activity.count,
                            busmanageId:activity.principalId||'',//需要获取
                            marproductId:activity.actProductId,
                        }
                        if(_user.employee){
                            let depart=STORE.getState().department.find(ele=>ele.objectId==_user.employee.departId);
                            if(depart){
                                parPm.busmanageId=depart.adminId||'';
                                parPm.pertypeId=_user.employee.departId;
                            }

                            Wapi.department.get(resDpt=>{
                                let depart=resDpt.data;
                                if(depart && (depart.uid==_user.customer.objectId) ){//活动创建公司的员工
                                    parPm.busmanageId=depart.adminId||'';
                                    parPm.pertypeId=_user.employee.departId;
                                }
                                if(depart && (depart.uid!=_user.customer.objectId) ){//下级经销商的员工
                                    let strMng=_user.customer.parentMng.find(ele=>ele.includes(activity.uid));
                                    if(strMng){
                                        parPm.busmanageId=strMng.split('in')[0];
                                    }
                                }
                                updateQr();
                            },{objectId:_user.employee.departId});
                        }else{
                            updateQr();
                        }
                        
                        function updateQr(){

                            if(created){
                                data._objectId=res.data.objectId;
                                Wapi.qrLink.update(r=>{//更新二维码

                                    data.objectId=data._objectId;
                                    delete data._objectId;
                                    
                                    Wapi.promotion.add(pro=>{
                                        W.alert(___.bind_success);
                                        _this.getData();
                                    },parPm);
                                },data);
                            }else{
                                Wapi.qrLink.add(r=>{

                                    Wapi.promotion.add(pro=>{
                                        W.alert(___.bind_success);
                                        _this.getData();
                                    },parPm);
                                },data);
                            }

                        }

                    },{
                        id:code,
                    },{
                        err:true,
                    });

                },{
                    max:'>='+code,
                    min:'<='+code
                });
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    render() {
        let items=this.data.map((ele,i)=>
            <div key={i} style={styles.card}>
                {/*<div style={styles.line}>{ele._id.batchName}</div>*/}
                <div style={styles.line}>
                    <span style={styles.spans}>
                        {___.bind_num+' '}
                        <span onClick={()=>this.bindCount(ele)} style={styles.link}>{ele.bindNum||0}</span>
                    </span>
                    <span style={styles.spans}>
                        {___.scan_count+' '}
                        <span onClick={()=>this.scanCount(ele)} style={styles.variable}>{ele.scan||0}</span>
                    </span>
                </div>
                <div style={styles.line}>
                    <span style={styles.spans}>
                        {(this.national ? ___.national_marketing : ___.regional_marketing)+' '}
                        <span style={styles.variable}>{(this.activity.brand||'')+this.activity.product}</span>
                    </span>
                    <span style={styles.spans}>
                        {___.device_price+' '}
                        <span style={styles.variable}>{(this.activity.price||0).toFixed(2)}</span>
                    </span>
                </div>
            </div>
        );
        let noBinded=<div style={(this.data.length==0&&this.gotData) ? styles.content : styles.hide}>{___.no_bind}</div>
        return (
            <ThemeProvider>
            <div style={styles.main}>
                {/*<AppBar 
                    title={___.act_data} 
                    style={{position:'fixed',top:'0px'}}
                    iconElementRight={<IconButton onClick={this.scanToBind}><ContentAdd/></IconButton>}
                />*/}
                <div style={styles.search_head}>
                    <ContentAdd style={styles.add_icon} color="#2196f3" onClick={this.scanToBind}/>
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
                <div>
                    {items}
                    {noBinded}
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
export default App;

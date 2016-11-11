//我的营销
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import EditActivity from '../_component/editActivity';


const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    card:{margin:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    line:{marginTop:'0.5em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    a:{marginRight:'1em',color:'#009688'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

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
            isCarownerSeller:false,
            noEdit:true,
            activityName:'',
        }
        this.limit=20;
        this.page_no=1;
        this.total=-1;
        this.activities=[];
        this.booking=[];
        this.strType='';

        this.nextPage = this.nextPage.bind(this);
        this.add = this.add.bind(this);
        this.addSubmit = this.addSubmit.bind(this);
        this.edit = this.edit.bind(this);
        this.editBack = this.editBack.bind(this);
        this.editSubmit = this.editSubmit.bind(this);
    }
    getChildContext(){
        return {
            edit:this.edit
        };
    }
    componentDidMount() {
        let parents=_user.customer.parentId.join('|');
        let par={
            "group":{
                "_id":{"activityId":"$activityId"},
                "status0":{"$sum":"$status0"},
                "status1":{"$sum":"$status1"},
                "status2":{"$sum":"$status2"},
                "status3":{"$sum":"$status3"}
            },
            "sorts":"activityId",
            "uid":_user.customer.objectId + '|' +parents,
            sellerId:_user.employee?_user.employee.objectId:_user.customer.objectId,
        }
        Wapi.booking.aggr(resAggr=>{
            this.booking=resAggr.data;
            Wapi.customer.list(res=>{
                this._parents=res.data||[];
                this.getData();
            },{
                objectId:_user.customer.parentId.join('|')
            });
        },par);
        
    }
    nextPage(){
        // this.page_no++;
        // this.getData();
    }
    getData(){
        if(_user.customer.other && _user.customer.other.va){

            if(_user.customer.other.va.includes('3')){//如果开通车主营销，则显示type=0的车主营销，包括本身及其上级的车主营销

                let parents=_user.customer.parentId.join('|');
                let par1={
                    uid:_user.customer.objectId + '|' + parents,
                    status:1,
                    type:0
                }
                Wapi.activity.list(res=>{//type=0 车主营销的活动
                    this.total=res.total;
                    let activities=res.data;
                    
                    activities.forEach(ele=>{
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
                        let cust=this._parents.find(c=>c.objectId==ele.uid);
                        if(cust){
                            ele.wxAppKey=cust.wxAppKey;
                        }
                    });
                    this.activities=this.activities.concat(activities);
                    this.forceUpdate();
                },par1,{
                    sorts:'-createdAt',
                    limit:-1,
                });

            }
            if(_user.customer.other.va.includes('0')){//如果开通集团营销，则显示type=1的营销活动
                
                let par2={
                    uid:_user.customer.objectId,
                    status:1,
                    type:1
                }
                Wapi.activity.list(res=>{//type=0 车主营销的活动
                    this.total=res.total;
                    let activities=res.data;
                    
                    activities.forEach(ele=>{
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
                        ele.wxAppKey=_user.customer.wxAppKey;
                    });
                    this.activities=this.activities.concat(activities);
                    this.forceUpdate();
                },par2,{
                    sorts:'-createdAt',
                    limit:-1,
                });

            }

        }
    }
    add(){
        this.setState({
            isEdit:true,
            curActivity:null,
            activityName:'',
        });
    }
    addSubmit(activity){
        console.log(activity);
        this.activities.unshift(activity);
        history.back();
    }
    edit(activity){
        let isCarownerSeller=false;
        if(activity.type==0){
            isCarownerSeller=true;
        }
        this.setState({
            isEdit:true,
            curActivity:activity,
            activityName:activity.name,
            isCarownerSeller:isCarownerSeller,
        });
    }
    editBack(){
        this.setState({isEdit:false});
    }
    editSubmit(activity){
        console.log(activity);
        for(let i=this.activities.length-1;i>=0;i--){
            if(this.activities[i].objectId==activity.objectId){
                if(activity.status==0){
                    this.activities.splice(i,1);
                }else{
                    this.activities[i]=activity;
                }
                break;
            }
        }
        this.forceUpdate();
        history.back();
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.my_marketing}
                        style={{position:'fixed'}}
                    />
                    <div name='list' style={styles.main}>
                        {/*items*/}
                        <Alist 
                            max={this.total} 
                            limit={this.limit} 
                            data={this.activities} 
                            next={this.nextPage} 
                        />
                    </div>
                    
                    <SonPage title={___.seller_activity} open={this.state.isEdit} back={this.editBack}>
                        <EditActivity 
                            isCarownerSeller={this.state.isCarownerSeller}
                            data={this.state.curActivity} 
                            noEdit={this.state.noEdit}
                            editSubmit={this.editSubmit} 
                            addSubmit={this.addSubmit}
                        />
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    edit:React.PropTypes.func
}

let strStatus=[___.terminated,___.ongoing];
let strBoolean=[___.no,___.yes]
class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.toActivityPage = this.toActivityPage.bind(this);
        this.toCountPage = this.toCountPage.bind(this);
    }
    toActivityPage(data){
        history.replaceState('home.html','home.html','home.html');
        window.location=WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)+'&uid='+_user.customer.objectId+'&sellerId=0&mobile='+encodeURIComponent(___.noBooking)+'&title='+encodeURIComponent(data.name)+'&agent_tel='+_user.customer.tel+'&seller_name='+encodeURIComponent(___.noBooking);
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
        console.log(page);
        console.log(data);
    }
    share(data){
        if(!data.wxAppKey){
            W.alert(___.wx_server_null);
            return;
        }
        function setShare(){
            let _seller=_user.employee?_user.employee.name:_user.customer.contact;
            let _sellerId=_user.employee?_user.employee.objectId:_user.customer.objectId;
            let _sellerTel=_user.employee?_user.employee.tel:_user.mobile;
            var op={
                title: data.name, // 分享标题
                desc: data.booking_offersDesc, // 分享描述
                link:WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)+'&uid='+_user.customer.objectId+'&sellerId='+_sellerId+'&mobile='+_sellerTel+'&title='+encodeURIComponent(data.name)+'&agent_tel='+_user.customer.tel+'&seller_name='+encodeURIComponent(_seller)+'&wx_app_id='+data.wxAppKey+'&activityId='+data.objectId,
                imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
                success: function(){},
                cancel: function(){}
            }
            wx.onMenuShareTimeline(op);
            wx.onMenuShareAppMessage(op);
            setShare=null;
            W.alert(___.share_activity);
        }
        if(W.native){
            setShare();
        }
        else{
            W.toast(___.ready_activity_url);
            window.addEventListener('nativeSdkReady',setShare);
        }

        console.log('share');
        
    }
    render() {
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <table>
                    <tbody>
                        <tr >
                            <td style={styles.td_left}>{___.activity_name}</td>
                            <td style={styles.td_right} onClick={()=>this.toActivityPage(ele)}>{ele.name}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.activity_status}</td>
                            <td style={styles.td_right}>{strStatus[ele.status]}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.start_date}</td>
                            <td style={styles.td_right}>{ele.createdAt.slice(0,10)}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={{marginLeft:'3px',fontSize:'0.8em'}}>
                    <span style={styles.a} onClick={()=>this.toCountPage('booking',ele)}>{___.bookingNum +' '+ ele.status0}</span>
                    <span style={styles.a} onClick={()=>this.toCountPage('registe',ele)}>{___.register +' '+ ele.status1}</span>
                </div>
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.details} primary={true} onClick={()=>this.context.edit(ele)} />
                    <FlatButton label={___.share} primary={true} onClick={()=>this.share(ele)} />
                </div>
            </Card>);
        return(
            <div>
                {items}
            </div>
        )
    }
}
DList.contextTypes={
    edit: React.PropTypes.func
};
let Alist=AutoList(DList);



export default App;

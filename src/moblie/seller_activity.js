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
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Card from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import EditActivity from '../_component/editActivity';
import Input from '../_component/base/input';


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
    add_icon:{float:'right',marginRight:'15px'},
    search_box:{marginLeft:'15px',marginTop:'15px',width:'80%',display:'block'}
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
        this.total=-1;
        this.originalActivities=[];
        this.activities=[];
        this.booking=[];
        this.gotData=false;

        this.search = this.search.bind(this);

        this.nextPage = this.nextPage.bind(this);
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
        // let par={
        //     "group":{
        //         "_id":{"activityId":"$activityId"},
        //         "status0":{"$sum":"$status0"},
        //         "status1":{"$sum":"$status1"},
        //         "status2":{"$sum":"$status2"},
        //         "status3":{"$sum":"$status3"}
        //     },
        //     "sorts":"objectId",
        //     "uid":_user.customer.objectId,
        // }
        // Wapi.booking.aggr(resAggr=>{
        //     this.booking=resAggr.data;
        //     this.getData();
        // },par);
        this.getData();
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
            status:1,
        },{
            limit:this.limit,
            page_no:this.page_no,
            sorts:'-createdAt',
        });
    }
    add(){
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
        W.confirm(___.confirm_delete_activity,(b)=>{
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
    url(acitivity){
        window.location=acitivity.url;
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    {/*<AppBar 
                        title={___.seller_activity}
                        style={{position:'fixed'}}
                        iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
                    />*/}
                    <div style={styles.search_head}>
                        <ContentAdd style={styles.add_icon} onClick={this.add}/>
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

                    <div name='list' style={styles.main}>
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
class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.toActivityPage = this.toActivityPage.bind(this);
        this.toCountPage = this.toCountPage.bind(this);
    }
    toActivityPage(data){
        // history.replaceState('home.html','home.html','home.html');
        // window.location=WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(data.url)
        //     +'&uid='+_user.customer.objectId
        //     +'&sellerId=0&mobile='+encodeURIComponent(___.noBooking)
        //     +'&title='+encodeURIComponent(data.name)
        //     +'&agent_tel='+_user.customer.tel
        //     +'&seller_name='+encodeURIComponent(___.noBooking)
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
                        onTouchTap={()=>this.context.url(ele)}
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
                <div style={combineStyle(['variable','line'])}>
                    {ele.name}
                </div>
                <div style={combineStyle(['variable','line'])}>
                    {activityType[ele.type]+'/'
                    +ele.sellerType
                    +(ele.count?'/计算提成':'')}
                    <span style={ele.status?styles.hide:{}}>/<span style={styles.warn}>暂停推广</span></span>            
                </div>
                <div style={styles.line}>
                    {___.regional_marketing+' '}
                    <span style={styles.variable}>{(ele.brand||'')+ele.product}</span>
                </div>
                <div style={styles.line}>
                    {___.support_hotline+' '}
                    <span style={styles.variable}>{ele.tel}</span>
                </div>
                <div style={styles.line}>
                    {___.offersDesc+' '}
                    <span style={styles.variable}>{ele.offersDesc}</span>
                </div>
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

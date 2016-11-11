//车主营销
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import {List,ListItem} from 'material-ui/List';
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
            activityName:'',
            noEdit:false,
        }
        this.limit=20;
        this.page_no=1;
        this.total=-1;
        this.activities=[];
        this.booking=[];

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
        let par={
            "group":{
                "_id":{"activityId":"$activityId"},
                "status0":{"$sum":"$status0"},
                "status1":{"$sum":"$status1"},
                "status2":{"$sum":"$status2"},
                "status3":{"$sum":"$status3"}
            },
            "sorts":"sellerId",
            "uid":_user.customer.objectId
        }
        Wapi.booking.aggr(resAggr=>{
            this.booking=resAggr.data;
            this.getData();
        },par);
    }
    nextPage(){
        this.page_no++;
        this.getData();
    }
    getData(){
        let parents=_user.customer.parentId.join('|');
        let params={//可以看到当前代理商及其上级的车主营销活动,只显示进行中的
            uid:_user.customer.objectId + '|' +parents,
            status:1,
            type:0  //  车主营销 type=0
        }
        Wapi.activity.list(res=>{
            this.total=res.total;
            let activities=res.data;

            activities.map(ele=>{
                let booking=this.booking.find(item=>item._id.sellerId==ele.objectId);
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
            this.activities=this.activities.concat(activities);
            this.forceUpdate();
        },params,{
            limit:this.limit,
            page_no:this.page_no,
            sorts:'-createdAt',
        });
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
        let noEdit=false;
        if(activity.uid!=_user.customer.objectId){
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
                        title={___.carowner_seller}
                        style={{position:'fixed'}}
                        iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
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
                    
                    <SonPage title={___.carowner_seller} open={this.state.isEdit} back={this.editBack}>
                        <EditActivity 
                            isCarownerSeller={true}
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
let strBoolean=[___.no,___.yes];
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

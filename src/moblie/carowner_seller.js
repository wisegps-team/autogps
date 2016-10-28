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
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';
import Input from '../_component/base/input';
import DeviceLogList from '../_component/device_list';
import ProductLogList from '../_component/productlog_list';
import {reCode} from '../_modules/tool';
import UserSearch from '../_component/user_search';
import AutoList from '../_component/base/autoList';


const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em',marginBottom:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    w:{width:'100%'},
    line:{marginTop:'0.5em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const activity={
    name:'一个活动',
    url:'http://wx.autogps.cn',
    status:1,
    reward:50,
    status0:10,
    status1:5,
    status2:3,
    objectId:100,
}
const _activities=[];
for(let i=0;i<10;i++){
    let a=Object.assign({},activity);
    a.name=a.name+i;
    a.objectId+=i;
    _activities.push(a);
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
            curActivity:null,
            activityName:'',
        }
        this.limit=20;
        this.page_no=1;
        this.total=-1;
        this.activities=[];

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
        this.getData();
    }
    nextPage(){
        this.page_no++;
        this.getData();
    }
    getData(){
        //测试用
        // this.total=_activities.length;
        // this.activities=_activities.slice(0,this.page_no*this.limit+this.limit);
        // this.forceUpdate();

        Wapi.activity.list(res=>{
            this.total=res.total;
            let activities=res.data;

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
                let arr=resAggr.data;
                activities.map(ele=>{
                    let booking=arr.find(item=>item._id.sellerId==ele.objectId);
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
            },par);

        },{
            uid:_user.customer.objectId
        },{
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
        this.setState({
            isEdit:true,
            curActivity:activity,
            activityName:activity.name,
        });
    }
    editBack(){
        this.setState({isEdit:false});
    }
    editSubmit(activity){
        console.log(activity);
        for(let i=this.activities.length-1;i>=0;i--){
            if(this.activities[i].objectId==activity.objectId){
                this.activities[i]=activity;
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
                            limit={20} 
                            data={this.activities} 
                            next={this.nextPage} 
                        />
                    </div>
                    
                    <SonPage open={this.state.isEdit} back={this.editBack}>
                        <EditActivity 
                            data={this.state.curActivity} 
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

let strStatus=['已终止','进行中'];
class DList extends Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <div>{___.name +' '+ ele.name}</div>
                <div style={styles.line}>{___.status +' '+ strStatus[ele.status]}</div>
                <div style={styles.line}>{___.reward +' ￥'+ ele.reward}</div>
                <div style={styles.line}>
                    <span style={{marginRight:'1em'}}>{___.count_booked +' '+ ele.status0||0}</span>
                    <span style={{marginRight:'1em'}}>{___.count_registed +' '+ ele.status1||0}</span>
                    <span>{___.count_paid +' '+ ele.status2||0}</span>
                </div>
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.edit} primary={true} onClick={()=>this.context.edit(ele)} />
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


class EditActivity extends Component {
    constructor(props,context){
        super(props,context);
        this.data={
            name:'',
            url:'',
            reward:'',
            status:1,
        }
        this.intent='add';

        this.nameChange = this.nameChange.bind(this);
        this.urlChange = this.urlChange.bind(this);
        this.rewardChange = this.rewardChange.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.intent='edit';
            this.data=Object.assign({},nextProps.data);
            this.forceUpdate();
        }else{
            this.intent='add';
            this.data={
                name:'',
                url:'',
                reward:'',
                status:1
            };
            this.forceUpdate();
        }
    }
    
    nameChange(e,value){
        this.data.name=value;
    }
    urlChange(e,value){
        this.data.url=value;
    }
    rewardChange(e,value){
        this.data.reward=value;
    }
    statusChange(e,value){
        this.data.status=Number(value);
        this.forceUpdate();
    }
    submit(){
        let data=this.data;
        if(data.name==''){
            W.alert('name empty');
            return;
        }
        if(data.url==''){
            W.alert('url empty');
            return;
        }
        if(data.reward==''){
            W.alert('reward empty');
            return;
        }

        if(this.intent=='edit'){
            Wapi.activity.update(res=>{
                this.props.editSubmit(data);
            },{
                _objectId:data.objectId,
                name:data.name,
                url:data.url,
                reward:data.reward,
                status:data.status,
            });
        }else{
            Wapi.activity.add(res=>{
                data.status0=0;
                data.status1=0;
                data.status2=0;
                data.objectId=res.objectId;
                this.props.addSubmit(data);
            },{
                uid:_user.customer.objectId,
                name:data.name,
                url:data.url,
                reward:data.reward,
                status:1,
            });
        }
    }
    render() {
        return (
            <div style={styles.input_page}>
                <Input floatingLabelText={___.activity_name} value={this.data.name} onChange={this.nameChange} />
                <Input floatingLabelText={___.activity_url} value={this.data.url} onChange={this.urlChange} />
                <Input floatingLabelText={___.activity_reward} value={this.data.reward} onChange={this.rewardChange} />
                <div style={{textAlign:'left'}}>
                    <span style={{fontSize:'0.7em',color:'#999999'}}>{___.status}</span>
                    <Toggle label={strStatus[this.data.status]} labelPosition="right" toggled={Boolean(this.data.status)} onToggle={this.statusChange}/>
                </div>
                <RaisedButton style={styles.line} label={___.submit} primary={true} onClick={this.submit} />
            </div>
        );
    }
}


export default App;

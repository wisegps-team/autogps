//营销活动
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
import Checkbox from 'material-ui/Checkbox';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';
import Input from '../_component/base/input';
import DeviceLogList from '../_component/device_list';
import ProductLogList from '../_component/productlog_list';
import {reCode} from '../_modules/tool';
import AutoList from '../_component/base/autoList';
import EmployeeSearch from '../_component/employee_search';
import UserTypeSearch from '../_component/userType_search';


const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    card:{margin:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    input_page:{textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    line:{marginTop:'0.5em'},
    input_group:{marginTop:'0.5em',textAlign:'left'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'10px'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

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

let strStatus=[___.terminated,___.ongoing];
let strBoolean=[___.no,___.yes]
class DList extends Component{
    constructor(props,context){
        super(props,context);
        this.toActivityPage = this.toActivityPage.bind(this);
    }
    toActivityPage(url){
        window.location=url;
    }
    render() {
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <table>
                    <tbody>
                        <tr >
                            <td style={styles.td_left}>{___.activity_name}</td>
                            <td style={styles.td_right} onClick={()=>this.toActivityPage(ele.url)}>{ele.name}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.activity_status}</td>
                            <td style={styles.td_right} onClick={this.toActivityPage}>{strStatus[ele.status]}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.activity_reward}</td>
                            <td style={styles.td_right} onClick={this.toActivityPage}>{ele.reward}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.project_manager}</td>
                            <td style={styles.td_right} onClick={this.toActivityPage}>{ele.principal}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.seller}</td>
                            <td style={styles.td_right} onClick={this.toActivityPage}>{ele.sellerType}</td>
                        </tr>
                    </tbody>
                </table>
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


function getInitData(){
    const initData={
        name:'',    //活动名称
        url:'',     //活动链接
        principal:'',   //项目经理
        principalId:'', //项目经理id
        sellerType:'',  //营销人员类别
        sellerTypeId:'',//营销人员类别id
        reward:'',  //佣金
        pay:0,     //佣金支付方式
        offersDesc:'',  //预定优惠
        price:'',       //终端价格
        installationFee:'', //安装费用
        getCard:false,      //客户经理开卡
        status:1,   //活动状态（进行中/已终止）
    };
    return initData;
}
class EditActivity extends Component {
    constructor(props,context){
        super(props,context);
        this.data=getInitData();
        this.intent='add';

        this.dataChange = this.dataChange.bind(this);
        this.principalChange = this.principalChange.bind(this);
        this.sellerTypeChange = this.sellerTypeChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            console.log('edit');
            this.intent='edit';
            let data=getInitData();
            this.data=Object.assign(data,nextProps.data);
            this.forceUpdate();
        }else{
            this.intent='add';
            this.data=getInitData();
            this.forceUpdate();
        }
    }
    
    dataChange(e,value){
        this.data[e.target.name]=value;
        if(e.target.name=='status'){
            this.data.status=Number(value);
            this.forceUpdate();
        }else if(e.target.name=='getCard'){
            this.data.getCard=value;
            this.forceUpdate();
        }
    }
    principalChange(data){
        console.log(data);
        this.data.principal=data.name;
        this.data.principalId=data.objectId;
    }
    sellerTypeChange(data){
        console.log(data);
        this.data.sellerType=data.name;
        this.data.sellerTypeId=data.objectId;
    }
    submit(){
        let data=this.data;
        if(data.name==''){//名称不为空
            W.alert('name empty');
            return;
        }
        if(data.url==''){//活动链接不为空
            W.alert('url empty');
            return;
        }
        if(data.principal==''){//项目经理不为空
            W.alert('project_manager empty');
            return;
        }
        if(data.sellerType==''){//销售人员类型不为空
            W.alert('sellerType empty');
            return;
        }
        if(data.reward==''){//佣金不为空
            W.alert('reward empty');
            return;
        }
        if(data.offersDesc==''){//优惠描述不为空
            W.alert('offersDesc empty');
            return;
        }
        if(data.price==''){//设备价格不为空
            W.alert('price empty');
            return;
        }
        if(data.installationFee==''){//安装费用不为空
            W.alert('installationFee empty');
            return;
        }

        if(this.intent=='edit'){
            data._objectId=data.objectId;
            delete data.objectId;
            Wapi.activity.update(res=>{
                this.props.editSubmit(data);
                this.data=getInitData();
                this.forceUpdate();
            },data);
        }else{
            data.uid=_user.customer.objectId;
            Wapi.activity.add(res=>{
                data.status0=0;
                data.status1=0;
                data.status2=0;
                data.objectId=res.objectId;
                this.props.addSubmit(data);
                this.data=getInitData();
                this.forceUpdate();
            },data);
        }
    }
    render() {
        console.log(this.data);
        return (
            <div style={styles.input_page}>
                {/*活动名称*/}
                <Input name='name' floatingLabelText={___.activity_name} value={this.data.name} onChange={this.dataChange} />
                
                {/*活动链接*/}
                <Input name='url' floatingLabelText={___.activity_url} value={this.data.url} onChange={this.dataChange} />
                
                {/*项目经理*/}
                <div style={{textAlign:'left'}}>
                    <EmployeeSearch name='principal' floatText={___.project_manager} defaultValue={this.data.principal} onChange={this.principalChange} data={{companyId:_user.customer.objectId,type:0}}/>
                </div>
                
                {/*营销人员（类型）*/}
                <div style={{textAlign:'left'}}>
                    <UserTypeSearch name='sellerType' floatText={___.seller} defaultValue={this.data.sellerType} onChange={this.sellerTypeChange} data={{uid:_user.customer.objectId,type:1}}/>
                </div>

                {/*佣金标准*/}
                <Input name='reward' floatingLabelText={___.activity_reward+___.yuan} value={this.data.reward} onChange={this.dataChange} />
                
                {/*支付方式*/}
                <SelectField name='pay' floatingLabelText={___.pay_type} style={{width:'100%',textAlign:'left'}} value={this.data.pay} onChange={this.dataChange}>
                    <MenuItem value={0} primaryText={___.cash} />
                </SelectField>

                {/*优惠描述*/}
                <Input name='offersDesc' floatingLabelText={___.booking_offersDesc+___.characters} value={this.data.offersDesc} onChange={this.dataChange} />
                {/*终端价格*/}
                <Input name='price' floatingLabelText={___.device_price+___.yuan} value={this.data.price} onChange={this.dataChange} />
                {/*安装费用*/}
                <Input name='installationFee' floatingLabelText={___.install_price+___.yuan} value={this.data.installationFee} onChange={this.dataChange} />
                {/*客户经理开卡*/}
                <div style={styles.input_group}>
                    <Checkbox 
                        name='getCard' 
                        style={{paddingTop:'10px'}} 
                        checked={this.data.getCard}
                        label={___.isgetCard} 
                        onCheck={this.dataChange} 
                    />
                </div>
                <div style={styles.input_group}>
                    <span style={{fontSize:'0.7em',color:'#999999'}}>{___.status}</span>
                    <Toggle //活动状态（进行中或已终止）
                        name='status' 
                        label={strStatus[this.data.status]} 
                        labelPosition="right" 
                        toggled={Boolean(this.data.status)} 
                        onToggle={this.dataChange}
                    />
                </div>

                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.submit} primary={true} onClick={this.submit} />
                </div>
            </div>
        );
    }
}


export default App;

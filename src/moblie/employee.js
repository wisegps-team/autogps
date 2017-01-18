import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import md5 from 'md5';
import STORE from '../_reducers/main';

import {ThemeProvider} from '../_theme/default';
import Card from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Input from '../_component/base/input';

import AppBar from '../_component/base/appBar';
import Fab from '../_component/base/fab';
import SonPage from '../_component/base/sonPage';
import TypeSelect from '../_component/base/TypeSelect';
import DepartmentTree,{DepartmentSelcet} from'../_component/department_tree';
import EditEmployee from'../_component/EditEmployee';
import {randomStr,getDepart} from '../_modules/tool';
import AutoList from '../_component/base/autoList';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.employee);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('share_register.js',2);
});

if(!_user.customer.sellerWxAppKey)
    Wapi.weixin.get(function(res){
        _user.customer.sellerWxAppKey=res.data?res.data.wxAppKey:null;
    },{
        uid:_user.customer.objectId,
        type:1
    });

const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    // sonpage_main:{width:'90%',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    sonpage_main:{paddingBottom:'20px',marginLeft:(window.innerWidth-256)/2+'px',marginRight:(window.innerWidth-256)/2+'px'},
    card:{marginTop:'1em',padding:'0.5em 1em'},
    table_tr:{height:'30px'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'2em'},
}

const _sex=[___.woman,___.man];
let submited=false;

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            employees:[],
            edit_employee:{},
            show_sonpage:false,
            intent:'add',
            total:0,
            search:[]
        }
        this.page=1;
        this.getEmployees=this.getEmployees.bind(this);
        this.addEmployee=this.addEmployee.bind(this);
        this.showDetails=this.showDetails.bind(this);
        this.editEmployeeCancel=this.editEmployeeCancel.bind(this);
        this.editEmployeeSubmit=this.editEmployeeSubmit.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.search = this.search.bind(this);

        this._data={
            companyId:_user.customer.objectId,
            type:'<>1',
            isQuit:false
        };
        // this._data.companyId='798351359882694700';
    }
    getChildContext(){
        return {
            ACT:this.act,
            custType:this.props.custType,
            showDetails:this.showDetails
        };
    }

    componentDidMount(){//初始化时获取人员表
        this.getEmployees();
    }
    getEmployees(){//获取当前人员表数据
        Wapi.employee.list(res=>{
            this.setState({
                employees:res.data,
                total:res.total,
            });
        },this._data,{
            fields:'objectId,uid,companyId,name,tel,sex,departId,isQuit,role,roleId',
            limit:20
        });

    }

    addEmployee(){
        // this.setState({
        //     edit_employee:{},
        //     show_sonpage:true,
        //     intent:'add',
        // });
        if(!_user.customer.sellerWxAppKey){
            W.alert(___.seller_wx_app_null);
            return;
        }
        let url=location.origin+'/?location=tempRegister.html&intent=logout&needOpenId=true&parentId='
                +_user.customer.objectId
                +'&departId=0&wx_app_id='+_user.customer.sellerWxAppKey
                +'&name='+_user.customer.name;
        thisView.goTo('share_register.js',url);
    }
    showDetails(data){
        this.setState({
            edit_employee:data,
            show_sonpage:true,
            intent:'edit',
        });
    }
    editEmployeeCancel(){
        this.setState({show_sonpage:false});
    }
    editEmployeeSubmit(data,allowLogin,callBack){
        if(submited){   //防止重复点击提交
            W.alert(___.donot_click);
            return;
        }
        submited=true;

        if(this.state.intent=='edit'){//修改人员
            let params={
                _uid:data.uid,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                roleId:data.roleId,
                role:data.role,
                isQuit:data.isQuit
            };
            Wapi.employee.update(res=>{
                if(res.status_code!=0){
                    W.alert('更新人员信息失败');
                    return;
                }

                if(this.state.edit_employee.roleId!=params.roleId){//如果当前人员的角色更改了，需要修改旧的角色和新的角色表

                    let parDelete={
                        _objectId:params.roleId,
                        users:'-"'+params._uid+'"'
                    };//从之前的角色的users中删除当前人员
                    Wapi.role.update(reDelete=>{
                        console.log('reDelete');
                    },parDelete);

                    let parAdd={
                        _objectId:params.roleId,
                        users:'+"'+params._uid+'"'
                    };//在当前的角色的users中添加当前人员
                    Wapi.role.update(reAdd=>{
                        console.log('reAdd');
                    },parAdd);

                }

                let arr=this.state.employees;
                arr.map(ele=>{
                    if(ele.uid==data.uid){
                        ele.name=params.name;
                        ele.tel=params.tel;
                        ele.sex=params.sex;
                        ele.departId=params.departId;
                        ele.roleId=params.roleId;
                        ele.role=params.role;
                        ele.isQuit=params.isQuit;
                    }
                });
                arr=arr.filter(ele=>!ele.isQuit);
                this.setState({employees:arr});//修改完成后更新该条人员数据

                callBack();//回调函数，重置人员编辑页面各组件的值
                history.back();//更新数据后返回

            },params);

        }else if(this.state.intent=='add'){//添加人员
            let that=this;
            
            let param={
                userType:9,
                mobile:data.tel,
                password:md5(randomStr()),
                err:true
            };
            if(allowLogin){
                param.password=md5(data.tel.slice(-6));
            }
            Wapi.user.add(function (res) {  //用户表添加一条数据
                if(res.status_code!=0){
                    W.alert('添加用户信息失败');
                    return;
                }
                console.log('add user success');

                let par={
                    companyId:_user.customer.objectId,
                    name:data.name,
                    tel:data.tel,
                    sex:data.sex,
                    departId:data.departId,
                    role:data.role,
                    roleId:data.roleId,
                    isQuit:false,
                    appId:WiStorm.config.objectId,
                    err:true
                };
                par.uid=res.uid;//201611301525返回值改回uid
                Wapi.employee.add(function(re){    //人员表添加一条数据
                    if(re.status_code!=0){
                        W.alert('添加人员信息失败');
                        return;
                    }
                    console.log('add emmployee success');

                    let p={
                        _objectId:par.roleId,
                        users:'+"'+par.uid+'"',
                        err:true
                    };
                    Wapi.role.update(function(role){    //对应的角色表更新一条数据,添加一个User
                        if(role.status_code!=0){
                            W.alert('更新角色表信息失败');
                            return;
                        }
                        console.log('update role success');

                        if(allowLogin){//如果允许登录 则发送短信
                            data.objectId=re.objectId;
                            let sms=___.employee_sms_content;
                            let tem={
                                app_name:___.app_name,
                                name:data.name,
                                sex:data.sex?___.sir:___.lady,
                                account:data.tel,
                                pwd:data.tel.slice(-6)
                            }
                            Wapi.comm.sendSMS(function(res){
                                W.errorCode(res);
                            },data.tel,0,W.replace(sms,tem));
                        }
                        
                        par.objectId=re.objectId;
                        let arr=that.state.employees;
                        arr.unshift(par);
                        that.setState({employees:arr});//添加完成后将新增的人员加入人员数组

                        callBack();//回调函数，重置人员编辑页面各组件的值
                        history.back();//更新数据后返回

                    },p);

                },par);

            },param);

        }
        
    }

    loadNextPage(){
        let arr=this.state.employees;
        this.page++;
        Wapi.employee.list(res=>{
            this.setState({employees:arr.concat(res.data)});
        },this._data,{
            fields:'objectId,uid,companyId,name,tel,sex,departId,isQuit,role,roleId',
            limit:20,
            page_no:this.page
        });
    }
    search(e,val){
        if(!val){
            this.setState({search:[]});
            return;
        }
        let data=Object.assign({},this._data);
        data.name='^'+val;
        Wapi.employee.list(res=>{
            this.setState({search:res.data});
        },data);
    }
    render() {
        let listDis={};
        let searchList=null;
        if(this.state.search.length){
            searchList=<DumbList data={this.state.search}/>;
            listDis.display='none';
        }
        return (
            <ThemeProvider>
                <div style={{
                    display: 'flex',
                    paddingLeft: '10px',
                    paddingRight: '5px',
                    alignItems: 'center'
                }}>
                    <Input 
                        onChange={this.search} 
                        hintText={___.search} 
                    />
                    <IconButton onClick={this.addEmployee} style={{flex:'0 0'}}><ContentAdd/></IconButton>
                </div>
                <div style={listDis}>
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.employees} 
                        next={this.loadNextPage} 
                    />
                </div>
                {searchList}
                <SonPage open={this.state.show_sonpage} back={this.editEmployeeCancel}>
                    <EditEmployee data={this.state.edit_employee} submit={this.editEmployeeSubmit}/>
                </SonPage>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    custType: React.PropTypes.array,
    ACT: React.PropTypes.object,
    showDetails:React.PropTypes.func
}

class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele,index)=>
            <Card style={styles.card} key={index}>
                <table >
                    <tbody >
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.person_name}</td>
                            <td style={styles.td_right}>{ele.name}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.sex}</td>
                            <td style={styles.td_right}>{_sex[ele.sex]}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.department}</td>
                            <td style={styles.td_right}>{getDepart(ele.departId)}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.role}</td>
                            <td style={styles.td_right}>{ele.role}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td style={styles.td_left}>{___.phone}</td>
                            <td style={styles.td_right}>{ele.tel}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.details} primary={true} onClick={()=>this.context.showDetails(ele)} />
                </div>
            </Card>
        );
        return(
            <div style={styles.main}>
                {items}
            </div>
        )
    }
}
 DumbList.contextTypes={
    showDetails: React.PropTypes.func
};
let Alist=AutoList(DumbList);

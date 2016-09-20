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

import AppBar from '../_component/base/appBar';
import Fab from '../_component/base/fab';
import SonPage from '../_component/base/sonPage';
import TypeSelect from '../_component/base/TypeSelect';
import DepartmentTree,{DepartmentSelcet} from'../_component/department_tree';
import EditEmployee from'../_component/EditEmployee';
import {getDepart} from '../_modules/tool';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingTop:'50px',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    // sonpage_main:{width:'90%',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    sonpage_main:{paddingBottom:'20px',marginLeft:(window.innerWidth-256)/2+'px',marginRight:(window.innerWidth-256)/2+'px'},
    card:{marginTop:'1em',padding:'0.5em 1em'},
    table_tr:{height:'30px'},
    table_td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'2em'},
}

const _employee={
    uid:1,
    departId:1,
    type:1,
    name:'小明',
    sex:1,
    tel:'1234567890',
}
const _employees=[];
for(let i=0;i<=4;i++){
    let e=Object.assign({},_employee);
    e.uid=i;
    e.tel+=i;
    _employees.push(e);
}
const _sex=[___.woman,___.man];
const _type=['角色A','角色B','角色C'];
// const _depar=[{name:'部门A',id:1234},'部门B','部门C'];

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            employees:[],
            edit_employee:{},
            show_sonpage:false,
            intent:'add',
        }
        this.getEmployees=this.getEmployees.bind(this);
        this.addEmployee=this.addEmployee.bind(this);
        this.showDetails=this.showDetails.bind(this);
        this.editEmployeeCancel=this.editEmployeeCancel.bind(this);
        this.editEmployeeSubmit=this.editEmployeeSubmit.bind(this);
    }
    getChildContext(){
        return {
            ACT:this.act,
            custType:this.props.custType
        };
    }

    componentDidMount(){//初始化时获取人员表
        this.getEmployees();
    }
    getEmployees(){//获取当前人员表数据
        Wapi.employee.list(res=>{
            this.setState({employees:res.data});
        },{
            companyId:_user.customer.objectId
        },{
            fields:'objectId,uid,companyId,name,tel,sex,departId,type'
        });
        // this.setState({employees:_employees});
    }

    addEmployee(){
        this.setState({
            edit_employee:{},
            show_sonpage:true,
            intent:'add',
        });
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
    editEmployeeSubmit(data,allowLogin){
        this.setState({show_sonpage:false});
        if(this.state.intent=='edit'){//修改人员
            Wapi.employee.update(res=>{
                this.getEmployees();//添加、修改完成后重新获取人员表数据
            },{
                _uid:data.uid,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                type:data.type,
            });
        }else if(this.state.intent=='add'){//添加人员
            let that=this;
            
            let par={
                userType:9,
                mobile:data.tel,
                password:md5(randomStr())
            };
            if(allowLogin){
                par.password=md5(data.tel.slice(-6));
            }
            Wapi.user.add(function (res) {
                let params={
                    companyId:_user.customer.objectId,
                    name:data.name,
                    tel:data.tel,
                    sex:data.sex,
                    departId:data.departId,
                    type:data.type,
                };
                params.uid=res.uid;
                Wapi.employee.add(function(res){
                    that.getEmployees();//添加、修改完成后重新获取人员表数据
                    Wapi.role.update(function(role){
                        W.confirm(___.create_user_su,function(b){if(b)history.back()});
                        data.objectId=res.objectId;
                        STORE.dispatch(action.fun.add(data));
                        let sms=___.cust_sms_content;
                        let tem={
                            name:data.name,
                            sex:data.sex?___.sir:___.lady,
                            account:data.tel,
                            pwd:data.tel.slice(-6)
                        }
                        if(allowLogin){
                            Wapi.comm.sendSMS(function(res){
                                W.errorCode(res);
                            },data.tel,0,W.replace(sms,tem));
                        }
                    },{
                        _objectId:'773344067361837000',
                        users:'+"'+res.objectId+'"'
                    })
                },params);

            },par);

        }
        
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.employee_manage} 
                        style={styles.appbar}
                        iconElementRight={
                            <IconButton onTouchTap={this.addEmployee}><ContentAdd/></IconButton>
                        }
                    />
                    <EmployeeCards employees={this.state.employees} showDetails={this.showDetails}/>
                    <SonPage open={this.state.show_sonpage} back={this.editEmployeeCancel}>
                        <EditEmployee data={this.state.edit_employee} submit={this.editEmployeeSubmit}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    custType: React.PropTypes.array,
    ACT: React.PropTypes.object
}

class EmployeeCards extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let items=this.props.employees.map((ele,index)=>
            <Card style={styles.card} key={index}>
                <table >
                    <tbody >
                        <tr style={styles.table_tr}>
                            <td>{___.person_name}</td>
                            <td style={styles.table_td_right}>{ele.name}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td>{___.sex}</td>
                            <td style={styles.table_td_right}>{_sex[ele.sex]}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td>{___.department}</td>
                            <td style={styles.table_td_right}>{getDepart(ele.departId)}</td>
                        </tr>
                        {/*<tr style={styles.table_tr}>
                            <td>{___.role}</td>
                            <td style={styles.table_td_right}>{_type[ele.type]}</td>
                        </tr>*/}
                        <tr style={styles.table_tr}>
                            <td>{___.phone}</td>
                            <td style={styles.table_td_right}>{ele.tel}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.details} primary={true} onClick={()=>this.props.showDetails(ele)} />
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
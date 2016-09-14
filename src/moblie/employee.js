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
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';

import AppBar from '../_component/base/appBar';
import Fab from '../_component/base/fab';
import SonPage from '../_component/base/sonPage';
import SexRadio from '../_component/base/sexRadio';
import TypeSelect from '../_component/base/TypeSelect';
import Input from '../_component/base/input';
import {DepartmentTree,DepartmentSelcet} from'../_component/department_tree';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>,thisView);
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
            console.log(res);
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
    editEmployeeSubmit(data){
        this.setState({show_sonpage:false});
        if(this.state.intent=='edit'){
            Wapi.employee.update(res=>{
                this.getEmployees();//添加、修改完成后重新获取人员表
            },{
                _uid:data.uid,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                type:data.type,
            });
        }else if(this.state.intent=='add'){
            let par={                
                userType:9,
                mobile:data.tel,
                password:md5(data.tel.slice(-6))
            };
            let params={
                companyId:_user.customer.objectId,
                name:data.name,
                tel:data.tel,
                sex:data.sex,
                departId:data.departId,
                type:data.type,
            };
            console.log(data);
            Wapi.user.add(res_u=>{
                params.uid=res_u.uid;
                console.log(data);
                Wapi.employee.add(res_e=>{
                    this.getEmployees();//添加、修改完成后重新获取人员表
                },params);
            },par);
        }
        
    }

    render() {
        let items=this.state.employees.map(ele=><EmployeeCard key={ele.uid} data={ele} showDetails={this.showDetails} />);
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.employee_manage} 
                        style={styles.appbar}
                        iconElementRight={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                <MenuItem primaryText={___.add} onTouchTap={this.addEmployee}/>
                            </IconMenu>
                        }
                    />
                    <div style={styles.main}>
                        {items}
                    </div>

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
const APP=connect(function select(state) {
    return {
        custType:state.custType
    };
})(App);


class EmployeeCard extends React.Component{
    constructor(props,context){
        super(props,context);
        this.showDetails=this.showDetails.bind(this);
    }
    showDetails(){
        this.props.showDetails(this.props.data);
    }
    render(){
        console.log('render card')
        let ele=this.props.data;

        let departs=STORE.getState().department;
        let _depart=departs.find(item=>item.objectId==ele.departId);
        let _departName='';
        if(_depart)_departName=_depart.name;
        return(
            <Card style={styles.card}>
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
                            <td style={styles.table_td_right}>{_departName}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td>{___.role}</td>
                            <td style={styles.table_td_right}>{_type[ele.type]}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td>{___.phone}</td>
                            <td style={styles.table_td_right}>{ele.tel}</td>
                        </tr>
                    </tbody>
                </table>
                <Divider />
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.details} primary={true} onClick={this.showDetails} />
                </div>
            </Card>
        )
    }
}

class EditEmployee extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            allowLogin:false,
            show_quit:false,
            quit:false,
            quit_time:'',
        }
        this.data={
            uid:'',
            name:'',
            tel:'',
            sex:1,
            departId:0,
            type:0,
        }
        this.nameChange=this.nameChange.bind(this);
        this.sexChange=this.sexChange.bind(this);
        this.telChange=this.telChange.bind(this);
        this.deparChange=this.deparChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.allowLogin=this.allowLogin.bind(this);
        this.quit=this.quit.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps){
        let data=nextProps.data;
        if(data.uid){
            this.data.uid=data.uid;
            this.data.name=data.name;
            this.data.tel=data.tel;
            this.data.departId=data.departId;
            this.data.sex=data.sex;
            this.data.type=data.type;
            this.setState({
                show_quit:true,
                quit:false,
            });
        }else{
            this.data.name='';
            this.data.tel='';
            this.data.departId=0;
            this.data.sex=1;
            this.data.type=0;
            this.setState({
                show_quit:false,
                allowLogin:false,
            });
        }
    }
    setParams(data){
        console.log('setParams');
    }
    nameChange(e,value){
        this.data.name=value;
    }
    telChange(e,value){
        this.data.tel=value;
    }
    sexChange(value){
        this.data.sex=value;
    }
    deparChange(value){
        console.log(value);

        this.data.departId=value.id;
        this.forceUpdate();
    }
    typeChange(e,k,value){
        this.data.type=value;
        this.forceUpdate();
    }
    allowLogin(e,value){
        this.setState({allowLogin:value});
    }
    quit(e,value){
        this.setState({quit:value});
    }
    submit(){
        let data=this.data;
        this.props.submit(data);
    }
    render(){
        return(
            <div style={styles.sonpage_main}>
                <Input floatingLabelText={___.person_name} value={this.data.name} onChange={this.nameChange} />
                
                <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)',marginBottom:'0px'}}>{___.sex}</p>
                <SexRadio style={{paddingTop:'10px'}} value={this.data.sex} onChange={this.sexChange}/>
                
                <Input floatingLabelText={___.phone} value={this.data.tel} onChange={this.telChange} />
                
                <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)'}}>{___.department}</p>
                <DepartmentSelcet value={this.data.departId} onChange={this.deparChange}/>
              
                <SelectField floatingLabelText={___.role} value={this.data.type} onChange={this.typeChange} >
                    <MenuItem key={0} value={0} primaryText={_type[0]} />
                    <MenuItem key={1} value={1} primaryText={_type[1]} />
                    <MenuItem key={2} value={2} primaryText={_type[2]} />
                </SelectField>

                <Checkbox 
                    style={{paddingTop:'10px',display:this.state.show_quit?'none':'block'}} 
                    label={___.allow_login} 
                    onCheck={this.allowLogin } 
                />

                <Checkbox 
                    style={{paddingTop:'10px',display:this.state.show_quit?'block':'none'}} 
                    label={___.quit} 
                    onCheck={this.quit } 
                />

                <DatePicker
                    style={{display:this.state.quit?'block':'none'}}
                    floatingLabelText="离职日期"
                    defaultDate={new Date()}
                    okLabel={___.ok}
                    cancelLabel={___.cancel}
                />

                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.ok} primary={true} onClick={this.submit }/>
                </div>
            </div>
        )
    }
}
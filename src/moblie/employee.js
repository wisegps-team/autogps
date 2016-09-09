import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

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

import AppBar from '../_component/base/appBar';
import Fab from '../_component/base/fab';
import SonPage from '../_component/base/sonPage';
import SexRadio from '../_component/base/sexRadio';
import TypeSelect from '../_component/base/TypeSelect';

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
    table_td_right:{paddingLeft:'2em'},
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
const _type=['系统管理员','调度员','普通员工'];
const _depar=['部门A','部门B','部门C'];

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            employees:[],
            isEditting:false,
            edit_employee:{},
        }
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

    componentDidMount(){
        this.setState({employees:_employees});
    }

    addEmployee(){
        this.setState({
            edit_employee:{},
            isEditting:true
        });
    }
    showDetails(data){
        console.log(data);
        this.setState({
            edit_employee:data,
            isEditting:true
        });
    }
    editEmployeeCancel(){
        this.setState({isEditting:false});
    }
    editEmployeeSubmit(){
        this.setState({isEditting:false});
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

                    <SonPage open={this.state.isEditting} back={this.editEmployeeCancel}>
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
        let ele=this.props.data;
        return(
            <Card style={styles.card}>
                <table >
                    <tbody >
                        <tr style={styles.table_tr}>
                            <td>{___.person_name}</td>
                            <td style={styles.table_td_right}>{ele.name}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td>{___.department}</td>
                            <td style={styles.table_td_right}>{_depar[ele.departId]}</td>
                        </tr>
                        <tr style={styles.table_tr}>
                            <td>{___.sex}</td>
                            <td style={styles.table_td_right}>{_sex[ele.sex]}</td>
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
            departId:0,
            sex:1,
            type:0,
            tel:'',

            allowLogin:false,

            quit:false,
            quit_time:'',
        }
        this.data={
            name:'',
        }
        this.nameChange=this.nameChange.bind(this);
        this.sexChange=this.sexChange.bind(this);
        this.telChange=this.telChange.bind(this);
        this.deparChange=this.deparChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.allowLogin=this.allowLogin.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps){
        console.log('will receive props')
        let data=nextProps.data;
        if(data.name){
            this.setState({
                departId:data.departId,
                sex:data.sex,
                type:data.type,
                tel:data.tel,
                quit:false,
            });
            this.data.name=data.name;
        }else{
            this.setState({
                departId:0,
                sex:1,
                type:0,
                tel:'',
                allowLogin:false,
            });
            this.data.name='';
        }
    }
    setParams(data){
        console.log('setParams')
    }
    nameChange(e,value){
        // this.setState({name:value});
        this.data.name=value;
    }
    deparChange(e,k,value){
        this.setState({departId:value});
    }
    sexChange(value){
        this.setState({sex:value});
    }
    typeChange(e,k,value){
        this.setState({type:value});
    }
    telChange(e,value){
        this.setState({tel:value});
    }
    allowLogin(e,value){
        this.setState({allowLogin:value});
    }
    quit(e,value){
        if(value){
            sth;
        }
    }
    submit(){
        let data=this.state;
    }
    render(){
        console.log(this.state);
        console.log(this.data);
        let _name=this.data.name;
        return(
            <div style={styles.sonpage_main}>
                <TextField floatingLabelText={___.person_name} value={_name} onChange={this.nameChange} />
                <SexRadio style={{paddingTop:'20px'}} value={this.state.sex} onChange={this.sexChange}/>
                <TextField floatingLabelText={___.phone} value={this.state.tel} onChange={this.telChange} />
                <SelectField floatingLabelText={___.department} value={this.state.departId} onChange={this.deparChange} >
                    <MenuItem key={0} value={0} primaryText={_depar[0]} />
                    <MenuItem key={1} value={1} primaryText={_depar[1]} />
                    <MenuItem key={2} value={2} primaryText={_depar[2]} />
                </SelectField>
                <SelectField floatingLabelText={___.role} value={this.state.type} onChange={this.typeChange} >
                    <MenuItem key={0} value={0} primaryText={_type[0]} />
                    <MenuItem key={1} value={1} primaryText={_type[1]} />
                    <MenuItem key={2} value={2} primaryText={_type[2]} />
                </SelectField>

                <Checkbox style={{paddingTop:'10px'}} label={___.allow_login} onCheck={this.allowLogin } />

                <Checkbox style={{paddingTop:'10px'}} label={___.quit} onCheck={this.quit } />


                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.ok} primary={true} onClick={this.submit }/>
                </div>
            </div>
        )
    }
}
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import Input from './base/input';
import PhoneInput from './base/PhoneInput';
import SexRadio from './base/sexRadio';
import {DepartmentTree,DepartmentSelcet} from'./department_tree';

const _type=['角色A','角色B','角色C'];
const styles={
    sonpage_main:WiStorm.agent.mobile?
        {paddingBottom:'20px',marginLeft:(window.innerWidth-256)/2+'px',marginRight:(window.innerWidth-256)/2+'px'}
        :{marginLeft:'1em'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'2em'},
};

//使用时需要传入数据data和点击提交方法submit，submit会返回编辑后的data
let _today=new Date();
class EditEmployee extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            allowLogin:false,
            isDriver:false,
        }
        this.intent='edit';
        this.data={
            uid:'',
            name:'',
            tel:'',
            sex:1,
            departId:0,
            type:0,
            isQuit:false,
            quitDate:_today,
        }
        this.nameChange=this.nameChange.bind(this);
        this.sexChange=this.sexChange.bind(this);
        this.telChange=this.telChange.bind(this);
        this.deparChange=this.deparChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.allowLogin=this.allowLogin.bind(this);
        this.inputDriver=this.inputDriver.bind(this);
        this.quit=this.quit.bind(this);
        this.quitTimeChange=this.quitTimeChange.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps){
        let data=nextProps.data;
        if(data.uid){//如果props中有uid，则说明是页面为用户编辑
            this.data.uid=data.uid;
            this.data.name=data.name;
            this.data.tel=data.tel;
            this.data.departId=data.departId;
            this.data.sex=data.sex;
            this.data.type=data.type;
            this.data.isQuit=false;
            this.intent='edit';
        }else{//如果props中没有uid，则当前页面为用户新增
            this.data.name='';
            this.data.tel='';
            this.data.departId=0;
            this.data.sex=1;
            this.data.type=0;
            this.setState({
                allowLogin:false,
            });
            this.intent='add';
        }
    }
    setParams(data){
        console.log('setParams');
    }
    nameChange(e,value){
        this.data.name=value;
    }
    telChange(value,str){
        this.data.tel=value;
    }
    sexChange(value){
        this.data.sex=value;
    }
    deparChange(value){
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
    inputDriver(e,value){
        this.setState({isDriver:value});
    }
    quit(e,value){
        this.data.isQuit=value;
        this.forceUpdate();
    }
    quitTimeChange(e,value){
        this.data.quitDate=W.dateToString(value).slice(0,10);
    }
    submit(){
        let data=this.data;
        this.props.submit(data,this.state.allowLogin);
        this.data={
            uid:'',
            name:'',
            tel:'',
            sex:1,
            departId:0,
            type:0,
            isQuit:false,
            quitDate:_today,
        }
    }
    render(){
        return(
            <div style={styles.sonpage_main}>
                <Input floatingLabelText={___.person_name} value={this.data.name} onChange={this.nameChange} />
                
                <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)',marginBottom:'0px'}}>{___.sex}</p>
                <SexRadio style={{paddingTop:'10px'}} value={this.data.sex} onChange={this.sexChange}/>
                
                <PhoneInput floatingLabelText={___.phone} value={this.data.tel} onChange={this.telChange} />
                
                <p style={{fontSize:'0.75em', color:'rgba(0, 0, 0, 0.498039)'}}>{___.department}</p>
                <DepartmentSelcet value={this.data.departId} onChange={this.deparChange}/>
              
                {/*<SelectField floatingLabelText={___.role} value={this.data.type} onChange={this.typeChange} >
                    <MenuItem key={0} value={0} primaryText={_type[0]} />
                    <MenuItem key={1} value={1} primaryText={_type[1]} />
                    <MenuItem key={2} value={2} primaryText={_type[2]} />
                </SelectField>*/}

                <div style={{display:this.intent=='edit'?'block':'none'}} >
                    <Checkbox //离职选择框
                        style={{paddingTop:'10px'}} 
                        checked={this.data.isQuit}
                        label={___.quit} 
                        onCheck={this.quit } 
                    />
                    <DatePicker
                        style={{display:this.data.isQuit?'block':'none'}}
                        floatingLabelText="离职日期"
                        defaultDate={_today}
                        onChange={this.quitTimeChange}
                        okLabel={___.ok}
                        cancelLabel={___.cancel}
                    />
                </div>

                <div style={{display:this.intent=='add'?'block':'none'}}>
                    <Checkbox //允许登录选择框
                        style={{paddingTop:'10px'}}
                        label={___.allow_login}
                        onCheck={this.allowLogin }
                    />
                    {/*<Checkbox //是否驾驶员选择框
                        style={{paddingTop:'10px'}}
                        label={"是否驾驶员"}
                        onCheck={this.inputDriver }
                    />
                    <div style={{display:this.state.isDriver?'block':'none'}} >
                        <SelectField floatingLabelText={___.role} value={this.data.type} onChange={this.typeChange} >
                            <MenuItem key={0} value={0} primaryText={_type[0]} />
                            <MenuItem key={1} value={1} primaryText={_type[1]} />
                            <MenuItem key={2} value={2} primaryText={_type[2]} />
                        </SelectField>
                        <DatePicker
                            floatingLabelText="领证日期"
                            defaultDate={new Date()}
                            okLabel={___.ok}
                            cancelLabel={___.cancel}
                        />
                        <DatePicker
                            floatingLabelText="有效期限"
                            defaultDate={new Date()}
                            okLabel={___.ok}
                            cancelLabel={___.cancel}
                        />
                    </div>*/}
                </div>

                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.ok} primary={true} onClick={this.submit }/>
                </div>
            </div>
        )
    }
}

export default EditEmployee;
"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import md5 from 'md5';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Input from './base/input';
import PhoneInput from './base/PhoneInput';
import TypeSelect from './base/TypeSelect';
import AreaSelect from './base/areaSelect';
import SexRadio from './base/sexRadio';

const styles={
    content:{
        textAlign:'left',
        width:'90%',
        marginLeft:'5%',
        marginRight:'5%',
    },
    left:{
        // paddingTop:'10px',
        whiteSpace: 'nowrap',
        // width: window.innerWidth*1/5 + 'px',
    },
    right:{
        paddingBottom:'5px',
        marginBottom:'1em',
        width:'100%',
        // width:window.innerWidth*3/5 + 'px',
    },
    footer:{
        marginTop:'20px',
        textAlign:'center',
    }
}

class UserAdd extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            tel_warning:null
        }
        this.data={
            _objectId:null,
            name:'',
            province:'',
            provinceId:-1,
            city:'',
            cityId:-1,
            area:'',
            areaId:-1,
            custTypeId:0,
            custType:'',
            contact:'',
            sex:1,
            tel:'',
        };
        Object.assign(this.state,this.getData(props));

        this.nameChange=this.nameChange.bind(this);
        this.areaChange=this.areaChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.contactChange=this.contactChange.bind(this);
        this.sexChange=this.sexChange.bind(this);
        this.telChange=this.telChange.bind(this);

        this.clickSave=this.clickSave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data!=this.props.data){
            this.setState(this.getData(nextProps));
        }
    }
    
    getData(nextProps){
        if(nextProps.data){
            let data=nextProps.data;
            return{
                objectId:data.objectId,
                name:data.name,
                province:data.province,
                provinceId:data.provinceId,
                city:data.city,
                cityId:data.cityId,
                area:data.area,
                areaId:data.areaId,
                custTypeId:data.custTypeId,
                contact:data.contact,
                tel:data.tel,
                sex:data.sex,
            };
        }else
            return {}
    }

    nameChange(e,value){
        this.data.name=value;
    }
    areaChange(value){
        if(!value)return;
       
        this.data.province=value.province;
        this.data.provinceId=value.provinceId;
        this.data.city=value.city;
        this.data.cityId=value.cityId;
        this.data.area=value.area;
        this.data.areaId=value.areaId;
        
        this.forceUpdate();
    }
    typeChange(value){
        let custType=this.context.custType;
        let type=custType.find(ele=>(ele.id==value));
        this._userType=type.userType;
        this.data.custTypeId=value;
        this.data.custType=type.name;

        this.forceUpdate();
    }
    contactChange(e,value){
        this.data.contact=value;
    }
    sexChange(value){
        this.data.sex=value;
    }
    telChange(value,warning){
        this.setState({
            tel_warning:warning
        });
        this.data.tel=value;
    }

    clickSave(){
        let data=this.data;
        console.log(data);
        if(data.name==''){
            W.alert(___.user_name_empty);
            return;
        }
        if(data.province==''){
            W.alert(___.area_empty);
            return;
        }
        if(data.contact==''){
            W.alert(___.contact_empty);
            return;
        }
        if(this.state.tel_warning){
            W.alert(this.state.tel_warning);
            return;
        }
        if(data.tel.length==0){
            W.alert(___.phone_empty);
            return;
        }
        // add user;
        data.parentId=[_user.customer.objectId.toString()];
        // data.treePath=parent.treePath?parent.treePath+','+parent.uid:parent.uid;    
        let that=this;
        let action=this.context.ACT.action;
        if(data._objectId){
            Wapi.customer.update(function(res){
                W.alert(___.update_su,()=>history.back());
                STORE.dispatch(action.fun.update(data));
            },data);
        }else{
            delete data._objectId;
            let sms=this.props.type=='user_manage'?___.user_sms_content:___.cust_sms_content;
            Wapi.user.add(function (res) {
                data.uid=res.uid;
                Wapi.customer.add(function(res){
                    W.confirm(___.create_user_su,function(b){if(b)history.back()});
                    data.objectId=res.objectId;
                    STORE.dispatch(action.fun.add(data));
                    let tem={
                        name:data.contact,
                        sex:data.sex?___.sir:___.lady,
                        account:data.tel,
                        pwd:data.tel.slice(-6)
                    }
                    Wapi.comm.sendSMS(function(res){
                        W.errorCode(res);
                    },data.tel,0,W.replace(sms,tem));
                },data);
            },{
                userType:this._userType,
                mobile:this.data.tel,
                password:md5(this.data.tel.slice(-6))
            });
        }
    }

    render(){
        let area={
            province:this.data.province,
            provinceId:this.data.provinceId,
            city:this.data.city,
            cityId:this.data.cityId,
            area:this.data.area,
            areaId:this.data.areaId
        }
        return(
            <div style={styles.content}>
                <table style={{width:'100%'}}>
                    <tbody>
                        <tr>
                            <td style={styles.left}>{___.name}</td>
                            <td><Input value={this.data.name} style={styles.right} name={'name'} onChange={this.nameChange}/></td>
                        </tr>
                        <tr>
                            <td style={styles.left}>{___.area}</td>
                            <td><AreaSelect value={area} style={styles.right} name={'area'} onChange={this.areaChange}/></td>
                        </tr>
                        <tr>
                            <td style={styles.left}>{___.type}</td>
                            <td><TypeSelect type={this.props.type} value={this.data.custTypeId} style={styles.right} name={'type'} onChange={this.typeChange}/></td>
                        </tr>
                        <tr>
                            <td style={styles.left}>{___.person}</td>
                            <td><Input style={styles.right} value={this.data.contact} name={'person'} onChange={this.contactChange}/></td>
                        </tr>
                        <tr>
                            <td style={{paddingTop:'20px'}}>{___.sex}</td>
                            <td style={{paddingTop:'20px'}}><SexRadio value={this.data.sex} name={'sex'} onChange={this.sexChange}/></td>
                        </tr>
                        <tr>
                            <td style={styles.left}>{___.phone}</td>
                            <td><PhoneInput style={styles.right} value={this.data.tel} old_value={this.props.data?this.props.data.tel:''} name={'phone'} onChange={this.telChange}/></td>
                        </tr>
                    </tbody>
                </table>
                
                <footer style={styles.footer}>
                    <RaisedButton label={___.save} primary={true} style={styles.btn} onClick={this.clickSave}/>
                </footer>
            </div>
        );
    }
}
UserAdd.contextTypes={
    custType: React.PropTypes.array,
    ACT: React.PropTypes.object
}
export default UserAdd;
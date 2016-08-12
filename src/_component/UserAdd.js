"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';
import md5 from 'md5';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

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
    },
    left:{
        paddingTop:'15px',
        width:'100%'
    },
    right:{
         paddingBottom:'5px',
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
            objectId:null,
            name:'',
            province:'',
            provinceId:-1,
            city:'',
            cityId:-1,
            area:'',
            areaId:-1,
            custTypeId:0,
            contact:'',
            tel:'',
            sex:1,

            tel_warning:null
        }
        Object.assign(this.state,this.getData(props));
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
        this.setState({name:value});
    }
    areaChange(value){
        if(!value)return;
        this.setState({
            province:value.province,
            provinceId:value.provinceId,
            city:value.city,
            cityId:value.cityId,
            area:value.area,
            areaId:value.areaId
        });
    }
    typeChange(value){
        let custType=this.context.custType;
        let type=custType.find(ele=>(ele.id==value));
        this._userType=type.userType;
        this.setState({'custTypeId':value,'custType':type.name});
    }
    contactChange(e,value){
        this.setState({contact:value});
    }
    sexChange(value){
        this.setState({sex:Number(value)});
    }
    telChange(value,warning){
        this.setState({
            tel:value,
            tel_warning:warning
        });
    }

    clickSave(){
        let data={
            _objectId:this.state.objectId,
            name:this.state.name,
            province:this.state.province,
            provinceId:this.state.provinceId,
            city:this.state.city,
            cityId:this.state.cityId,
            area:this.state.area,
            areaId:this.state.areaId,
            custTypeId:this.state.custTypeId,
            custType:this.state.custType,
            contact:this.state.contact,
            sex:this.state.sex,
            tel:this.state.tel
        };
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
        data.parentId=[_user.customer.uid];
        // data.treePath=parent.treePath?parent.treePath+','+parent.uid:parent.uid;    
        let that=this;
        if(data._objectId){
            Wapi.customer.update(function(res){
                W.alert(___.update_su,()=>history.back());
                STORE.dispatch(that.context.ACT.fun.update(data));
            },data);
        }else{
            delete data._objectId;
            Wapi.user.add(function (res) {
                data.uid=res.uid;
                Wapi.customer.add(function(res){
                    W.confirm(___.create_user_su,function(b){if(b)history.back()});
                    data.objectId=res.objectId;
                    STORE.dispatch(that.context.ACT.fun.add(data));
                    let tem={
                        name:data.contact,
                        sex:data.sex?___.sir:___.lady,
                        account:data.tel,
                        pwd:data.tel.slice(-6)
                    }
                    Wapi.comm.sendSMS(function(res){
                        W.errorCode(res);
                    },data.tel,0,W.replace(___.cust_sms_content,tem));
                },data);
            },{
                userType:this._userType,
                mobile:this.state.tel,
                password:md5(this.state.tel.slice(-6))
            });
        }
    }

    render(){
        let area={
            province:this.state.province,
            provinceId:this.state.provinceId,
            city:this.state.city,
            cityId:this.state.cityId,
            area:this.state.area,
            areaId:this.state.areaId
        }
        return(
            <div style={styles.content}>
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.left}>{___.name}</td>
                            <td><Input value={this.state.name} style={styles.right} name={'name'} onChange={this.nameChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td>{___.area}</td>
                            <td><AreaSelect value={area} style={styles.right} name={'area'} onChange={this.areaChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td>{___.type}</td>
                            <td><TypeSelect type={this.props.type} value={this.state.custTypeId} style={styles.right} name={'type'} onChange={this.typeChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td style={styles.left}>{___.person}</td>
                            <td><Input style={styles.right} value={this.state.contact} name={'person'} onChange={this.contactChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td style={{paddingTop:'20px'}}>{___.sex}</td>
                            <td style={{paddingTop:'20px'}}><SexRadio value={this.state.sex} name={'sex'} onChange={this.sexChange.bind(this)}/></td>
                        </tr>
                        <tr>
                            <td style={styles.left}>{___.cellphone}</td>
                            <td><PhoneInput style={styles.right} value={this.state.tel} old_value={this.props.data?this.props.data.tel:''} name={'phone'} onChange={this.telChange.bind(this)}/></td>
                        </tr>
                    </tbody>
                </table>
                <footer style={styles.footer}>
                    <RaisedButton label={___.save} primary={true} style={styles.btn} onClick={this.clickSave.bind(this)}/>
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
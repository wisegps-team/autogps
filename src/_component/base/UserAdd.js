"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import Input from './input';
import PhoneInput from './PhoneInput';
import TypeSelect from './TypeSelect';
import AreaSelect from './areaSelect';
import SexRadio from './sexRadio';

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
            uid:'',
            name:'',
            province:'',
            city:'',
            address:'',
            type:0,
            contact:'',
            tel:'',
            sex:0,
            treePath:'',
            parentId:'',
            creatorId:'',
            acl:'',

            tel_warning:null
        }
    }
    componentDidMount(){
        if(this.props.data){
            let data=this.props.data;
            this.setState({
                name:data.name,
                province:data.province,
                city:data.city,
                address:data.address,
                type:data.type,
                contact:data.contact,
                tel:data.tel,
                sex:data.sex,
            });
        }
    }

    nameChange(e,value){
        this.setState({name:value});
    }
    areaChange(value){
        console.log('UserAdd.js areaChange');
        console.log(value)
        if(!value)return;
        this.setState({
            province:value.province,
            city:value.city,
            address:value.address
        });
    }
    typeChange(value){
        this.setState({type:value});
    }
    contactChange(e,value){
        this.setState({contact:value});
    }
    sexChange(value){
        this.setState({sex:value});
    }
    telChange(value,warning){
        this.setState({
            tel:value,
            tel_warning:warning
        });
    }

    clickSave(){
        console.log(this.state);
        let data={
            name:this.state.name,
            province:this.state.province,
            city:this.state.city,
            address:this.state.address,
            type:this.state.type,
            contact:this.state.contact,
            sex:this.state.sex,
            tel:this.state.tel
        };
        if(data.name==''){
            alert('用户名称不能为空');
        }
        if(data.province==''){
            alert('用户地区不能为空');
        }
        if(data.contact==''){
            alert('联系人不能为空');
        }
        if(this.state.tel_warning){
            alert(this.state.tel_warning);
        }
    }

    render(){
        let area={
            province:this.state.province,
            city:this.state.city,
            address:this.state.address,
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
                            <td><TypeSelect value={this.state.type} style={styles.right} name={'type'} onChange={this.typeChange.bind(this)}/></td>
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

export default UserAdd;
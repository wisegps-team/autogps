/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import VerificationCode from '../base/verificationCode';
import Input from '../base/input';
import PasswordRepeat from './password';
import sty from './style';

class Register extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            account:null
        }
        this.formData={
            mobile:null,
            valid_code:null,
            password:null,
            valid_type:1
        };
        this.change = this.change.bind(this);
        this.accountChange = this.accountChange.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
    }
    success(res){
        if(!res.status_code||res.status_code==8){
            Object.assign(res,this.formData);
            this.props.onSuccess(res);
        }else
            W.errorCode(res);
    }
    submit(){
        for(let k in this.formData){
            if(!this.formData[k]){
                W.alert(k+___.not_null);
                return;
            }
        }
        let data=Object.assign({},this.formData);
        if(!this.props.beforRegister||this.props.beforRegister(data))
            Wapi.user.register(this.success,data);
    }

    accountChange(e,val){
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(val)){
            this.formData['mobile']=val;  
            this.setState({account:val}); 
        }
    }
    change(val,name){
        this.formData[name]=val;
    }

    render() {
        return (
            <div {...this.props}>
                <Input
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    onChange={this.accountChange}
                />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={this.state.account} 
                    onSuccess={this.change}
                />
                <PasswordRepeat 
                    onChange={this.change}
                    name='password'
                />
                <RaisedButton label={___.register} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Register;
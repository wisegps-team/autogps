/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import Input from '../base/input';
import VerificationCode from '../base/verificationCode';
import AccountInput from './account';
import PasswordRepeat from './password';
import sty from './style';

class Register extends Component {
    constructor(props, context) {
        super(props, context);
        this.formData={
            mobile:null,
            valid_code:null,
            password:null,
            valid_type:1
        };
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
        this.success = this.success.bind(this);
    }
    success(res){
        Object.assign(res,this.formData);
        this.props.onSuccess(res);
    }
    submit(){
        for(let k in this.formData){
            if(!this.formData[k]){
                W.alert(k+___.not_null);
                return;
            }
        }
        Wapi.user.register(this.success,Object.assign({},this.formData));
    }
    change(val,name){
        this.formData[name]=val;
    }

    render() {
        return (
            <div {...this.props}>
                <AccountInput
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    defaultValue={this.formData.account}
                    onChange={this.change}
                    needExists={false}
                />
                <VerificationCode 
                    name='valid_code'
                    type={1}
                    account={this.formData.account} 
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
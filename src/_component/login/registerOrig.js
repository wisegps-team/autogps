/**
 * 注册用户组件
 */
"use strict";

import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import VerificationOrig from '../base/verificationOrig';
import Input from '../base/input';
import PasswordRepeat from './password';
import sty from './style';

const strFormData={
    mobile:___.phone_num,
    valid_code:___.phone_num,
    password:___.pwd,
    valid_type:'valid_type'
}
class RegisterOrig extends Component {
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
        this.correct='';
        this.canSubmit=false;
        this.change = this.change.bind(this);
        this.verifiSuccess = this.verifiSuccess.bind(this);
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
        if(this.formData.mobile&&this.formData.mobile.length==11){
            this.formData.password=this.formData.mobile.slice(-6);
        }else{
            W.alert(___.phone_err);
            return;
        }
        for(let k in this.formData){
            if(!this.formData[k]){
                W.alert(strFormData[k]+___.not_null);
                return;
            }
        }
        let data=Object.assign({},this.formData);

        // if(!this.props.beforRegister||this.props.beforRegister(data))
        //     Wapi.user.register(this.success,data);
            
        this.props.beforRegister(()=>{
            Wapi.user.register(this.success,data);
        })
    }

    accountChange(e){
        let val=e.target.value;
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(val)){
            this.formData['mobile']=val;
        }else{
            this.formData['mobile']=null;
        }
        this.setState({account:val});
    }
    change(val){
        this.formData.valid_code=val;
        if(this.correct!='' && val!=this.correct){
            this.canSubmit=false;
            this.forceUpdate();
        }
    }
    verifiSuccess(val){
        this.correct=val;
        this.canSubmit=true;
        this.forceUpdate();
    }

    render() {
        return (
            <div {...this.props}>
                <div style={{backgroundColor:'#fff'}}>
                    <div style={sty.r}>
                        <input 
                            name='account' 
                            type='tel' 
                            placeholder={___.phone_num} 
                            style={sty.input} 
                            onChange={this.accountChange}
                        />
                    </div>
                    <div style={{display:'flex',alignItems:'flex-end',padding:'3px 10px'}}>
                        <VerificationOrig 
                            name='valid_code'
                            type={1}
                            account={this.state.account} 
                            onSuccess={this.verifiSuccess}
                            onChange={this.change}
                            style={{width:'100%'}}
                        />
                    </div>
                </div>
                <div style={{textAlign:'center'}}>
                    <RaisedButton disabled={!this.canSubmit} label={___.register} onClick={this.submit} primary={true} style={{marginTop:'15px'}} labelColor='#eee'/>
                </div>
            </div>
        );
    }
}

export default RegisterOrig;
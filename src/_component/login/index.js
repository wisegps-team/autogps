import React, {Component} from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import Input from '../base/input';
import VerificationCode from '../base/verificationCode';
import P from '../../_modules/public';

const sty={
    but:{
        width:'100%',
        marginTop:'10px'
    },
    ch:{
        width:'auto',
        marginTop: '10px'
    },
    cl:{
        width:'auto'
    }
}

let pwd=W.getSetting("pwd");
let account=W.getSetting("account");
let remember_pwd=W.getSetting('remember_pwd');
class Login extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            verification:'none'
        }
        this.formData={
            'password':pwd,
            'account':account
        };
        P.rebuild(this);
    }
    componentDidMount() {
        if(this.formData.password&&this.formData.account)
            this.submit();
    }
    

    bind(){
        return[
            function loginSuccess(res){
                let that=this;
                if (res.status_code) {
                    W.loading();
                    if(res.status_code==444){
                        this.login_res=res;
                        W.alert(___.please_verification,()=>this.setState({verification:'block'}));
                        return;
                    }
                    W.errorCode(res);
                    return;
                } 
                Wapi.user.get(function(result) {
                    if (result.status_code) {
                        W.errorCode(result);
                        return;
                    } else {
                        if(!result.data.mobileVerified){
                            //未通过手机验证
                        }else{
                            Object.assign(result,res);
                            that.props.onSuccess(result);
                        }
                    }
                }, {
                    objectId: res.uid,
                    access_token: res.access_token
                });
            },
            function submit(){
                this.formData.account=this.formData.account?this.formData.account.trim():null;
                this.formData.password=this.formData.password?this.formData.password.trim():null;
            
                if(!this.formData.account){
                    this.setState({account_err:___.input_account});
                    return;
                }
                if(!this.formData.password){
                    this.setState({password_err:___.input_pwd});
                    return;
                }
                W.loading();
                Wapi.user.login(this.loginSuccess,this.formData);
                if(this.need_remember){
                    W.setSetting("pwd",this.formData.password);
                    W.setSetting("account",this.formData.account);
                }
            },
            function change(e,val){
                let name=e.currentTarget.name;
                this.formData[name]=val;
                if(val){
                    let s={};
                    s[name+'_err']='';
                    this.setState(s);
                }
            },
            function remember(e,val){//点击记住密码
                this.need_remember=val;
                W.setSetting('remember_pwd',val);
            },
            function verified(val){
                //验证码输入正确了

            }
        ];
    }

    render() {
        return (
            <div {...this.props}>
                <Input
                    name='account'
                    hintText={___.input_account}
                    floatingLabelText={___.account}
                    defaultValue={this.formData.account}
                    errorText={this.state.account_err}
                    onChange={this.change}
                />
                <Input
                    name='password'
                    type='password'
                    hintText={___.input_pwd}
                    floatingLabelText={___.pwd}
                    defaultValue={this.formData.password}
                    errorText={this.state.password_err}
                    onChange={this.change}
                />
                <Checkbox
                    label={___.remember}
                    defaultChecked={remember_pwd}
                    onCheck={this.remember}
                    style={sty.ch}
                    labelStyle={sty.cl}
                />
                <VerificationCode 
                    type={1}
                    account={this.formData.account} 
                    onSuccess={this.verified}
                    style={{display:this.state.verification}}
                />
                <RaisedButton label={___.login} primary={true} style={sty.but} onClick={this.submit}/>
            </div>
        );
    }
}

export default Login;
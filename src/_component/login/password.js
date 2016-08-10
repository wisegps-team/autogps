/**
 * 输入重复密码，校验两次输入的密码是否相同
 */
import React, {Component} from 'react';
import Input from '../base/input';

class PasswordRepeat extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            err:true,//密码不符合格式
            pwdErr:true,
            pwd:''
        }
        this.change = this.change.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState!==this.state);
    }
    

    change(e,val){
        let name=e.currentTarget.name;
        if(name=='password'){
            //校验密码是否符合格式
            let r=new RegExp(this.props.regExp||'^[a-zA-Z0-9]{6,}$');
            if(r.test(val)){
                this.setState({err:false,pwd:val});
            }else{
                this.setState({err:true,pwd:''});
            }
        }else{
            //校验两次密码是否一致
            if(val==this.state.pwd){
                this.setState({pwdErr:false});
                this.props.onChange(val,this.props.name);
            }else{
                this.setState({pwdErr:true});
            }
        }
    }
    
    render() {
        let errorText=this.state.err?___.pwd_input_err:'';
        let pwdErr=this.state.pwdErr?___.two_pwd_err:''
        return (
            <div {...this.props}>
                <Input
                    name='password'
                    type='password'
                    hintText={___.input_pwd}
                    floatingLabelText={___.pwd}
                    errorText={errorText}
                    onChange={this.change}
                />
                <Input
                    name='pass'
                    type='password'
                    disabled={this.state.err}
                    hintText={___.input_pwd}
                    floatingLabelText={___.pwd}
                    errorText={pwdErr}
                    onChange={this.change}
                />
            </div>
        );
    }
}

export default PasswordRepeat;
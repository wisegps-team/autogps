import React, {Component} from 'react';
import Input from './input';
import Wapi from '../../_modules/Wapi/index';

class PhoneInput extends Component{
    constructor(props, context){
        super(props, context);
        this.state={
            code_err:null
        }
    }
    change(e,value){
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(value)){
            this.setState({code_err:null});
            let _this=this;
            Wapi.user.checkExists(function(json){
                if(json.exist){
                    _this.setState({code_err:___.phone_registed});
                }else{
                    _this.setState({code_err:null});
                }
            },{mobile:value});
        }else{
            this.setState({code_err:___.phone_err});
        }
    }
    render(){
        return(
            <Input
                id={'phone_input'}
                errorText={this.state.code_err}
                onChange={this.change.bind(this)}
                style={this.props.style}
            />
        );
    }
}

export default PhoneInput;
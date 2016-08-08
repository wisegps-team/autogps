import React, {Component} from 'react';
import Input from './input';
import Wapi from '../../_modules/Wapi/index';

class PhoneInput extends Component{
    constructor(props, context){
        super(props, context);
        this.state={
            code_err:null,
            value:null,
        }
    }
    change(e,value){
        this.setState({value:value});
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(value)){
            this.setState({code_err:null});
            if(value==this.props.old_value){
                console.log('phone not change');
                return;
            }

            let _this=this;
            Wapi.user.checkExists(function(json){
                if(json.exist){
                    _this.setState({code_err:___.phone_registed});
                    _this.props.onChange(value,___.phone_registed);
                }else{
                    _this.setState({code_err:null});
                    _this.props.onChange(value);
                }
            },{mobile:value});
        }else{
            if(value==''){
                this.setState({code_err:___.phone_empty});
                this.props.onChange(value,___.phone_empty);
            }else{
                this.setState({code_err:___.phone_err});
                this.props.onChange(value,___.phone_err); 
            }
        }
    }
    render(){
        return(
            <Input
                id={'phone_input'}
                errorText={this.state.code_err}
                onChange={this.change.bind(this)}
                style={this.props.style}
                value={this.state.value||this.props.value}
            />
        );
    }
}

export default PhoneInput;
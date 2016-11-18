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
        this.change=this.change.bind(this);
    }
    change(e,value){
        let reg=/^[1][3578][0-9]{9}$/;
        if(reg.test(value)){
            this.setState({value,code_err:null});

            let _this=this;
            Wapi.user.checkExists(function(json){
                if(!_this.props.needExist==!json.exist){
                    _this.setState({code_err:null});
                    _this.props.onChange(value);
                }else{
                    if(json.exist){
                        _this.setState({code_err:___.phone_registed});
                        _this.props.onChange(value,___.phone_registed);
                    }else{
                        _this.setState({code_err:___.phone_not_registed});
                        _this.props.onChange(value,___.phone_not_registed);
                    }
                }
            },{mobile:value});
        }else{
            if(value==''){
                this.setState({value,code_err:___.phone_empty});
                this.props.onChange(value,___.phone_empty);
            }else{
                this.setState({value,code_err:___.phone_err});
                this.props.onChange(value,___.phone_err); 
            }
        }
    }
    render(){
        return(
            <Input
                {...this.props}
                errorText={this.state.code_err}
                onChange={this.change}
                value={this.state.value||this.props.value}
            />
        );
    }
}

export default PhoneInput;
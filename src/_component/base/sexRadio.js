import React, {Component} from 'react';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const sty={
    main:{
        width:'auto',
        display:'inline-block',
        marginRight:'10px'
    },
    label:{
        width: 'auto'
    },
    icon:{
        marginRight:'5px'
    }
}

class SexRadio extends Component {
    constructor(props, context) {
        super(props, context);
        this.change = this.change.bind(this);
    }
    
    change(event,val){
        if(this.value==val)return;
        this.value=val;
        this.props.onChange(val);
    }
    render() {        
        return (
            <RadioButtonGroup {...this.props} name="sex" defaultSelected={(typeof this.props.value)!='undefined'?this.props.value.toString():'1'} onChange={this.change}>
                <RadioButton
                    value='1'
                    label={___.man}
                    labelStyle={sty.label}
                    iconStyle={sty.icon}
                    style={sty.main}
                />
                <RadioButton
                    value='0'
                    label={___.woman}
                    labelStyle={sty.label}
                    iconStyle={sty.icon}
                    style={sty.main}
                />
            </RadioButtonGroup>
        );
    }
}

export default SexRadio;
import React, {Component} from 'react';

import TextField from 'material-ui/TextField';

const sty={
    tf:{
        height:'58px',
        marginTop: '3px'
    },
    tl:{
        top:'24px'
    },
    ti:{
        marginTop:'0px',
        height:'auto',
        top:'22px'
    },
    te:{
        top:'28px'
    }
}
class Input extends Component {
    render() {
        return (
            <TextField
                style={sty.tf}
                floatingLabelStyle={sty.tl}
                inputStyle={sty.ti}
                errorStyle={sty.te}
                fullWidth={true}
                {...this.props}
            />
        );
    }
}

export default Input;
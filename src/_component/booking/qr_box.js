import React, {Component} from 'react';
import ProductName,{color} from './product_name';

const sty={
    img:{
        width:'128px',
        height:'128px'
    },
    qr:{
        padding:'10px',
        textAlign:'center',
        margin: 'auto'
    },
}

class QrBox extends Component {
    render() {
        return ( 
            <div>
                <div style={{width:'100%',height:window.innerWidth,display:'block',backgroundColor:'#ffffff'}}>
                    <img src='http://wx.autogps.cn/autogps/img/device.jpg' style={{width:'100%',height:'100%'}}/>
                </div>
                <div style={{width:'100%',display:'block',position:'absolute',top:window.innerWidth-64+'px',textAlign:'center'}}>
                    <img style={sty.img} src={this.props.url}/>
                    <div style={{marginTop:'15px'}}>{'[ '+___.press+' ]'}</div>
                    <div style={{marginTop:'15px'}}>{___.booking_qr}</div>
                </div>
            </div>
        );
    }
}

export default QrBox;
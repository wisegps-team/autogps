import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import ProductName,{color} from './product_name';

class ErrorBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.again = this.again.bind(this);
        this.continue = this.continue.bind(this);
    }
    
    again(){
        this.props.callback(0);
    }
    continue(){
        this.props.callback(1);
    }
    render() {
        let booking=this.props.booking;
        let act=this.props.act;
        return (
            <div>
                <table style={{borderCollapse: 'collapse',fontSize:'0.8em',backgroundColor:'#ffffff',marginTop:'50px'}}>
                <tbody>
                    <tr>
                        <td style={{width:window.innerWidth*0.62+'px',height:'125px',padding:'0px',backgroundColor:'#ffffff'}}>
                            {act.imgUrl?
                            <img src={act.imgUrl} style={{width:window.innerWidth*0.62,height:'125px',verticalAlign: 'middle'}} alt={act.name}/>
                            :<div style={{width:window.innerWidth*0.62,textAlign:'center'}}>{act.name}</div>}
                        </td>
                        <td style={{width:window.innerWidth*0.38+'px',textAlign:'left',color:'#999999'}}>
                            <div style={{marginLeft:'1em'}}>
                                预订ID：<span style={{color:'#000000'}}>{_g.mobile.slice(-6)}</span>
                            </div>
                            <div style={{marginTop:'5px',marginBottom:'5px'}}>
                                预订商品：<span style={{color:'#000000'}}>{booking.product.brand+booking.product.name}</span>
                            </div>
                            <div>
                                统一售价：<span style={{color:'#000000'}}>{booking.product.price.toFixed(2)}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
                <div style={{padding: '0 1em'}}>
                    <div style={{textAlign:'center',marginTop:'20px'}}>{___.b_err_des}</div>
                    <div style={{textAlign:'center',marginTop:'30px'}}>
                        <RaisedButton label={___.book_again} secondary={true} onClick={this.again} style={{marginRight:'10px'}} labelColor='#f6f6f6'/>
                        <RaisedButton label={___.continue_book} primary={true} onClick={this.continue} labelColor='#f6f6f6'/>
                    </div>
                    <div style={{marginTop:'20px',color:'#999999',textAlign:'center'}}>
                        {___.please_consult}
                        <a href={'tel:'+act.tel}>{act.tel}</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBox;
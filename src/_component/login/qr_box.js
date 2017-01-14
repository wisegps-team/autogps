import React, {Component} from 'react';

const qrsty={
    img:{
        width:window.screen.width*0.75-48+'px',
        height:window.screen.width*0.75-48+'px'
    },
    qr:{
        padding:'10px',
        textAlign:'center',
        margin: 'auto'
    },
}
class QrBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            url:''
        }
    }
    
    componentDidMount() {
        Wapi.serverApi.getAnyQrcode(res=>{//获取二维码
            if(res.status_code){
                W.alert(res.err_msg);
                return;
            }
            this.setState({url:res.url});
        },{
            type:999,//扫码之后不做任何处理的类型
            data:'scene',
            wxAppKey:_g.wx_app_id
        });
    }
    
    render() {
        return (
            <div style={qrsty.qr}>
                <img style={qrsty.img} src={this.state.url}/>
                <p>{'[ '+___.press+' ]'}</p>
                <h4>{___.reg_des}</h4>
            </div>
        );
    }
}

export default QrBox;
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '../_theme/default';

import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { blue500 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import TextField from 'material-ui/TextField'
import SonPage from '../_component/base/sonPage';

const thisView = window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("普通挪车");
thisView.addEventListener('load', function () {
    ReactDOM.render(<App />, thisView);
});

function AddQrLink(wxAppKey, callback) {
    let qrLinkData = {
        uid: _user.customer.objectId,
        type: 2,
        i: 0,
        id: _user.customer.objectId + 'A',
        url: 'http://' + WiStorm.config.domain.user + '/wo365_user' + '/movecar.html?intent=logout'
        + '&needOpenId=' + true
        + '&creator=' + _user.customer.objectId
        + '&type=' + 1
        + '&wx_app_id=' + wxAppKey
    };
    let qrLinkData2 = {
        uid: _user.customer.objectId,
        type: 2,
        i: 0,
        id: _user.customer.objectId + 'B',
        url: 'http://' + WiStorm.config.domain.user + '/wo365_user' + '/movecar.html?intent=logout'
        + '&needOpenId=' + true
        + '&creator=' + _user.customer.objectId
        + '&type=' + 2
        + '&wx_app_id=' + wxAppKey
    }
    let op = {};
    Wapi.qrLink.list(res => {
        // op.data = res.data
        if (!res.data.length) {
            Wapi.qrLink.add(res => {
                Wapi.qrLink.get(r => {
                    let type1 = 'http://t.autogps.cn/?s=' + r.data.id;
                    op.type1 = type1
                    Wapi.qrLink.add(re => {
                        Wapi.qrLink.get(rs => {
                            let type2 = 'http://t.autogps.cn/?s=' + rs.data.id;
                            op.type2 = type2
                            callback(op);
                        }, { objectId: re.objectId });
                    }, qrLinkData2);
                }, { objectId: res.objectId });
            }, qrLinkData);
        } else {
            let op = {
                type1: 'http://t.autogps.cn/?s=' + res.data[0].id,
                type2: 'http://t.autogps.cn/?s=' + res.data[1].id
            }    
            callback(op)
        }
    }, {
            uid: _user.customer.objectId,
            type: 2
        })
}

class App extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            type1: '',
            type2: '',
            qrData: {},
            noneWx: 0
        }
    }
    componentDidMount() {
        Wapi.weixin.get(wx => {
            if (wx.data) {
                let wxAppKey = wx.data.wxAppKey
                AddQrLink(wxAppKey, (op) => {
                    console.log(op, 'op')
                    debugger;
                    if (op.type1) {
                        this.setState({ type1: op.type1 })
                        this.setState({ type2: op.type2 })
                    } else {
                        this.setState({ qrdata: op })
                    }
                })
                this.setState({ noneWx: 0 })
            } else {
                console.log(1)
                this.setState({ noneWx: 1 })
            }
        }, {
                uid: _user.customer.objectId,
                type: 0
            })
    }
    render() {
        return (
            <ThemeProvider>
                <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
                    <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', background: '#fff' }}>
                        <div style={{ marginBottom: '1em' }}>
                            {'车主绑定车辆'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            <span style={{ display: 'inline-block', width: '100%' }}>
                               {this.state.type1}&nbsp;&nbsp;<a style={{color: blue500}} className="copyToClip" data-clipboard-text={this.state.type1}></a>
                            </span>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', background: '#fff' }}>
                        <div style={{ marginBottom: '1em' }}>
                            {'他人呼叫挪车'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            <span style={{ display: 'inline-block', width: '100%' }}>
                               {this.state.type2}&nbsp;&nbsp;<a style={{color: blue500}} className="copyToClip" data-clipboard-text={this.state.type2}></a>
                            </span>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', background: '#fff', fontSize: 12 }}>
                        <p style={{ marginTop: 0, marginBottom: 0 }}>{'将上述链接分别生成二维码后即可设计印刷挪车贴。'}</p>
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

/*渠道统计编码数量列表 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '../../_theme/default';

import DropDownMenu from 'material-ui/DropDownMenu';
import { Menu, MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { blue500 } from 'material-ui/styles/colors';
import Input from '../../_component/base/input';
import SocialPeople from 'material-ui/svg-icons/social/people'

import IconMenu from 'material-ui/IconMenu';
import Dialog from 'material-ui/Dialog';
import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account'
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';
import ActionReportProblem from 'material-ui/svg-icons/action/report-problem'
import ActionPermIdentity from 'material-ui/svg-icons/action/perm-identity'
import ActionExtension from'material-ui/svg-icons/action/extension'
import ContentClear from 'material-ui/svg-icons/content/clear'

import SonPage from '../../_component/base/sonPage';
import { getOpenIdKey, changeToLetter } from '../../_modules/tool';



const thisView = window.LAUNCHER.getView();//第一句必然是获取view
// thisView.setTitle("扫码挪车");
thisView.addEventListener('load', function () {
    ReactDOM.render(<App />, thisView);
});


class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            one_qr: [],
            normal_qr: []
        }
    }
    componentDidMount(){
        thisView.addEventListener('show',e => {
            // console.log(e,'e')
            // console.log(e.params,'e.params')
            let obj = e.params.objectId;
            Wapi.qrDistribution.list(res => {
                console.log(res.data,'this object qrD');
                let oneqr = res.data.filter(ele => ele.type == 2)
                let normal = res.data.filter(ele => ele.type == 3)
                // console.log(oneqr,'onerqr');
                this.setState({one_qr:oneqr})
                // console.log(normal,'normal')
                this.setState({normal_qr:normal})
            },{
                uid:obj,
                type:'2|3'
            },{
                fields:'objectId,id,name,uid,type,num,max,min,bind_num,move_num,createdAt,wxAppKey'
            })
        })
    }
    render(){
         let oneqr=[],normal_qr=[];
        if(this.state.one_qr.length){
            oneqr = this.state.one_qr.map((ele,index) =>{
               return(<OneAndNorm data={ele} key={index}/>)
            })
        }
        console.log(this.state.normal_qr,'dddddddddddd')
        if(this.state.normal_qr.length){
            normal_qr = this.state.normal_qr.map((ele,index) =>{
               return( <OneAndNorm data={ele} key={index}/>)
            })
        }
        return(
            <ThemeProvider>
                <div style={{background:'#f7f7f7',height:'100vh'}}>
                    {/* <div style={{height:40, paddingLeft:10,lineHeight:'40px',background:'#f7f7f7'}}>{'编码制卡'}</div> */}
                    { oneqr }
                    { normal_qr }
                </div>
            </ThemeProvider>
        )
    }
}

class OneAndNorm extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            data:props.data,
            wxname:null
        }
        Wapi.weixin.get(wx => {
            this.setState({wxname:wx.data.name})
            console.log(wx,'wxx')
        },{
            wxAppKey:this.props.data.wxAppKey
        })
    }
    componentWillReceiveProps(nextProps){
        // if(nextProps&&nextProps.data){
        //     console.log(nextProps.data,'neisdodjfodjfsd')
        //     this.setState({data:nextProps.data})
            
        // }
        console.log(nextProps.data,'zheshishenme')
    }
    render(){
        let data = W.dateToString(W.date(this.state.data.createdAt))
        // console.log(data,'datadaata')
        let url = null,typename='';
        if(this.state.data.type == 3){
             url = 'https://t.autogps.cn/?s='+this.state.data.objectId+'A'
             typename = '单一编码'
        }else {
            url = 'https://t.autogps.cn/?s='+this.state.data.min+'-'+this.state.data.max
            typename = '一物一码'
        }
        let width = (window.screen.width-14)/3+'px'
        let sty = {
                pd:{paddingTop:'10px',fontSize:'14px'},
                fs12:{fontSize:'12px'},
                pdfs:{paddingTop:'10px',fontSize:'12px'},
                cl6:{color:'#797676'},
                c0:{color:'#000'},
                wid:{display:'inline-block',width:width}
            }
        return(
            <div style={{background:'#fff',padding:'0 7px',borderBottom:'1px solid #f7f7f7'}}>
                <div style={sty.pd}>{this.state.data.name}</div>
                <div style={sty.pdfs}>{typename}&nbsp;&nbsp;{'['+this.state.wxname+']'}</div>
                <div style={sty.pdfs}>
                    <span style={sty.cl6}>{'日期：'}</span><span>{data}</span>
                </div>
                <div style={sty.pdfs}> 
                    <span style={sty.cl6}>{'链接：'}</span><span style={{color:'#2196f3'}}>{url}</span>
                </div>
                <div style={{borderBottom:'1px solid #f7f7f7',padding:'10px 0',background:'#fff'}}>
                    <div style={sty.fs12}>
                        <span style={sty.wid}>
                            <span style={sty.cl6}>{'数量：'}</span><span style={sty.c0}>{this.state.data.num||0}</span>
                        </span>
                        <span style={sty.wid}>
                            <span style={sty.cl6}>{'绑定：'}</span><span style={sty.c0}>{this.state.data.bind_num||0}</span>
                        </span>
                        <span style={sty.wid}>
                            <span style={sty.cl6}>{'挪车：'}</span><span style={sty.c0}>{this.state.data.move_num||0}</span>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
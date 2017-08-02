import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import LinearProgress from 'material-ui/LinearProgress';

import AppBar from '../../_component/base/appBar';
import {setTitle,getOpenIdKey} from '../../_modules/tool';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import UserNameInput from '../../_component/base/userNameInput';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SonPage from '../../_component/base/sonPage'


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.personal_info);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    p:{
        // padding: '10px',
    },
    logo:{
        top:'0px',
        bottom:'0px',
        margin: 'auto',
        height:'40px',
        width:'40px'
    },
    limg:{
        width: '100%',
        height: '100%'
    },
    list_item:{
        borderBottom:'1px solid #dddddd'
    },
    list_right:{
        marginTop:'12px',
        marginRight:'30px'
    },
}
const strSex=[___.female,___.male];

class App extends Component {
    render() {
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.personal_info}/>*/}
                <div style={sty.p}>
                    <ShowBox/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

class ShowBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            userName:false,
            dInformation:false,
            sex:false
        }
        this.userName = this.userName.bind(this);
        this.close = this.close.bind(this);
        this.changeName = this.changeName.bind(this);
        this.saveName = this.saveName.bind(this);
        this.open = this.open.bind(this);
        this.back = this.back.bind(this);
        this.sexOpen = this.sexOpen.bind(this);
        this.changeSex = this.changeSex.bind(this);
    }
    
    userName(){
        this.setState({userName:true});
        this._name = '';
    }
    sexOpen(){
        // this.setState({sex:true});
        // this._sex = _user.
        if(_user.employee){
            this._sex = parseInt(_user.employee.sex) === 0 ? 2 : 1;
            // this.forceUpdate();
        }else{
            this._sex = parseInt(_user.customer.sex) === 0 ? 2 : 1;
            // this.forceUpdate();
        }
        this.setState({sex:true});
    }
    changeSex(e,v){
        // console.log(e,v,'test e v')
        let sex = parseInt(v) === 2 ? 0 : 1
        this._sex = sex;
        let that = this;
        if(_user.employee){
            Wapi.employee.update(res => {
                _user.employee.sex = that._sex;
                W.setSetting('user',_user);
                this.setState({sex:false})
            },{
                _objectId:_user.employee.objectId,
                sex:sex
            })
        }else{
            Wapi.customer.update(res => {
                _user.customer.sex = that._sex;
                this.setState({sex:false})
            },{
                _objectId:_user.customer.objectId,
                sex: sex
            })
        }
    }
    close(){
        this.setState({
            userName:false
        });
        // this.setState({sex:false})
    }
    changeName(name){
        this._name=name;
    }
    saveName(){
        // if(this._name == _user.)
        if(this._name){
            let that=this;
            if(_user.employee){
                Wapi.employee.get(res => {
                    if(res.data){
                        W.alert(___.username_registed)
                    }else{
                        Wapi.employee.update(re => {
                            _user.employee.name = that._name;
                            W.setSetting('user',_user);
                            that.close();
                        },{
                            _objectId:_user.employee.objectId,
                            name:that._name
                        })
                    }
                },{
                    name:that._name
                })
            }else{
                Wapi.customer.get(res => {
                    if(res.data){
                        W.alert(___.username_registed)
                    }else{
                        Wapi.customer.update(re => {
                            _user.customer.contact = that._name;
                            W.setSetting('user',_user);
                            that.close();
                        },{
                            _objectId:_user.customer.objectId,
                            contact:that._name
                        })
                    }
                },{
                    contact:that._name
                })
            }
        }else{
            W.alert('请输入用户名')
            return;
        }
    }

    logout(){
        W.loading('正在退出');
        let key=getOpenIdKey();
        let wxId = null;
        if(_user && _user.authData){
            wxId=_user.authData[key+'_wx'];//上次登录的公众号id
        }
        if(wxId)
            W.logout('&logout=true&needOpenId=true&wx_app_id='+wxId);
        else
            W.logout('&logout=true&needOpenId=true');
    }
    open(){
        this.setState({dInformation:true})
    }
	back(){
        this.setState({dInformation:false})
    }
    render() {
        const actions = [
            <FlatButton
                label={___.cancel}
                primary={true}
                onTouchTap={this.close}
            />,
            <FlatButton
                label={___.ok}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.saveName}
            />
        ];
        /*let company_item='';
        if(_user.customer.custTypeId!=7){
            company_item=<ListItem 
                    primaryText={___.company}
                    rightAvatar={<span style={sty.list_right}>{_user.customer.name}</span>}
                    style={sty.list_item}
                />;
        }*/
        
        let sex=_user.employee ? strSex[_user.employee.sex] : strSex[_user.customer.sex];
        console.log(this._sex,'this_sex')
        return (
            <div>
                <List>
                    {/*{company_item}*/}
                    <ListItem 
                        primaryText={___.person_name}
						rightAvatar={<span style={sty.list_right}>{_user.employee?_user.employee.name:_user.customer.contact}</span>}
                        style={sty.list_item}
                        onClick={this.userName}
                    />
                    <ListItem 
                        primaryText={___.sex} 
						rightAvatar={<span style={sty.list_right}>{sex}</span>}
                        style={sty.list_item}
                        onClick={this.sexOpen}
                    />
                    <ListItem 
                        primaryText={'账号'}
						rightAvatar={<span style={sty.list_right}>{_user.mobile}</span>}
                        style={sty.list_item}
                        onClick={this.open}
                    />
                    {/*<ListItem 
                        primaryText={___.logined_bind}
                        rightIcon={<NavigationChevronRight />}
                        style={sty.list_item}
                    />*/}
                </List>
                <List style={{padding:'20px 16px 8px 16px',textAlign:'canter'}}>
                    <RaisedButton label={___.logout} fullWidth={true} secondary={true} onClick={this.logout}/>                    
                </List>
                <Dialog
                    title={___.edit_user_name}
                    open={this.state.userName}
                    actions={actions}
                    contentStyle={{zIndex:1499}}
                    style={{zIndex:1499}}
                >
                    <UserNameInput onChange={this.changeName} value={_user.userName} floatingLabelText={___.input_user_name}/>
                </Dialog>
                <Dialog
                    title={'性别'}
                    open={this.state.sex}
                    actions={[]}
                    contentStyle={{zIndex:1499}}
                    style={{zIndex:1499}}
                >
                    <RadioButtonGroup name="sex" valueSelected={this._sex} labelPosition="left" onChange={this.changeSex}>
                        <RadioButton
                            value={2}
                            label="女"
                            style={{padding: '8px 0 12px 5px',borderBottom:'1px solid #ccc',}}
                        />
                        <RadioButton
                            value={1}
                            label="男"
                            style={{padding: '12px 0 12px 5px'}}
                        />
                    </RadioButtonGroup>
                </Dialog>
                {/* <Dialog
                    title={___.edit_user_name}
                    open={this.state.userName}
                    actions={actions}
                >
                    <UserNameInput onChange={this.changeName} value={_user.userName} floatingLabelText={___.input_user_name}/>
                </Dialog> */}
                <SonPage open={this.state.dInformation} back={this.back}>
                    <Dinfo/>
                </SonPage>
            </div>
        );
    }
}

class Dinfo extends Component {
    constructor(props,context){
        super(props,context)
        this.state ={
            wx:null
        }
    }
    componentDidMount() {
        let wxAppKey = _user.authData.wx_autogps_cn_openId_wx||null
        if(wxAppKey){
            Wapi.weixin.get(res => {
                // console.log()
                this.setState({wx:res.data})
            },{
                wxAppKey:wxAppKey
            })
        }
        
    }
    render(){
        console.log(this.state.wx)
        return (
            <div style={{padding:'0 10px'}}>
                <h3 style={{marginBottom:0}}>{_user.customer.custTypeId !==7?'营销平台':'车主平台'}</h3>
                <div style={{marginTop:10}}>
                    <span style={{color:'#ccc'}}>{'注册时间：'}</span>
                    <span>{W.dateToString(W.date(_user.customer.createdAt))}</span>
                </div> 
                <div style={{marginTop:8}}>
                    <span style={{color:'#ccc'}}>{'绑定时间：'}</span>
                    <span>{W.dateToString(W.date(_user.authData.wx_autogps_cn_openId_bind))}</span>
                </div> 
                <div style={{marginTop:8}}>
                    <span style={{color:'#ccc'}}>{'登录时间：'}</span>
                    <span>{W.dateToString(W.date(_user.authData.wx_autogps_cn_openId_login_date))}</span>
                </div>  
                <div style={{marginTop:8}}>
                    <span style={{color:'#ccc',width:80,display:'inline-block',textAlign:'justify',textAlignLast:'justify'}}>{'公众号：'}</span>
                    <span>{this.state.wx?this.state.wx.name:'无'}</span>
                </div>                           
            </div>
        )
    }
    
}
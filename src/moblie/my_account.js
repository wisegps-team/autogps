import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import Input from '../_component/base/input';
import AreaSelect from '../_component/base/areaSelect';
import Avatar from 'material-ui/Avatar';

import ActionLock from 'material-ui/svg-icons/action/lock';
import ActionAccountBalanceWallet from 'material-ui/svg-icons/action/account-balance-wallet';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import ContentClear from 'material-ui/svg-icons/content/clear';

import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import Forget from '../_component/login/forget';
import UserNameInput from '../_component/base/userNameInput';
import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';
import {getOpenIdKey} from '../_modules/tool';

import Dialog from 'material-ui/Dialog';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

    // let view=thisView.prefetch('#forget',3);
    // ReactDOM.render(<ForgetApp/>,view);

    // let walletView=thisView.prefetch('#wallet',3);
    // ReactDOM.render(<WalletApp/>,walletView);
    
    thisView.prefetch('booking_list.js',2);
});

const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    main:{
        padding:'10px',
        // marginTop:'50px',
    },
    p:{
        padding: '10px',
    },
    lo:{
        width: '100%',
        // position: 'fixed',
        // bottom: '10%',
        // left: '10%'
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
    income:{
        color:'#009900',
        fontSize:'20px',
        float:'right'
    },
    expenses:{
        color:'#990000',
        fontSize:'20px',
        float:'right'        
    },
    bill:{
        padding:'5px 10px',
        borderTop:'1px solid #cccccc'
    },
    bill_remark:{
        fontSize:'14px',
        color:'#666666',
        paddingTop:'5px'
    },
    head:{
        width:'100%',
        height:'120px',
        display:'block',
        textAlign:'center',
        paddingTop:'70px'
    },
    head_str:{
        fontSize:'14px',
        marginBottom:'5px'
    },
    head_num:{
        fontSize:'36px',
        marginBottom:'10px'
    },
    a:{
        color:'#009988'
    },
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            edit:false
        }
        this.edit = this.edit.bind(this);
        this.back = this.back.bind(this);
    }
    componentDidMount() {
        Wapi.pay.checkWxPay(res=>{
            this.forceUpdate();
        },'wxPay_withdraw');
    }
    
    edit(){
        this.setState({edit:true});
    }
    back(){
        this.setState({edit:false});
    }
    render() {
        // let box=this.state.edit?(<EditBox back={this.back}/>):(<ShowBox edit={this.edit}/>);
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.user}/>
                <div style={sty.p}>
                    <ShowBox/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


class ForgetApp extends Component{
    resetSuccess(){
        W.alert(___.resset_success,function(){
            W.logout();
        });
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.forget_pwd}/>
                <div style={sty.p}>
                    <Paper zDepth={1} style={sty.p}>
                        <Forget onSuccess={this.resetSuccess}/>
                    </Paper>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

let record={
    objectId:1,
    money:233,
    remark:'remark',
    income:true,
}
let records=[];
for(let i=5;i--;){
    let r=Object.assign({},record);
    r.objectId=i;
    r.income=!(i%2);
    records[i]=r;
}
class WalletApp extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isInputPsw:false,
            isInputAmount:false,
        }
        this.data=[];
        this.psw='';
        this.amount=0;
        this.page_no=1;
        this.total=0;

        this.loadNextPage = this.loadNextPage.bind(this);
        this.getRecords = this.getRecords.bind(this);

        this.inputPsw = this.inputPsw.bind(this);
        this.closeInputPsw = this.closeInputPsw.bind(this);
        this.pswChange = this.pswChange.bind(this);

        this.inputAmount = this.inputAmount.bind(this);
        this.closeInputAmount = this.closeInputAmount.bind(this);
        this.amountChange = this.amountChange.bind(this);

        this.withdrawCash = this.withdrawCash.bind(this);
        this.toRecharge = this.toRecharge.bind(this);
    }
    componentDidMount() {
        this.getRecords();
    }
    loadNextPage(){
        this.page_no++;
        this.getRecords();
    }
    getRecords(){
        Wapi.user.getBillList(res=>{
            this.tota=res.total;
            let _data=res.data.reverse();
            this.data=this.data.concat(_data);
            this.forceUpdate();
        },{
            uid:_user.objectId,
            start_time:'2016-01-01',
            end_time:'2026-12-12',
        });
    }

    inputPsw(){
        this.setState({isInputPsw:true});
    }
    closeInputPsw(){
        this.setState({isInputPsw:false});
    }
    pswChange(e,value){
        this.psw=value;
    }

    inputAmount(){
        this.setState({
            isInputPsw:false,
            isInputAmount:true
        });
    }
    closeInputAmount(){
        this.setState({isInputAmount:false});
    }
    amountChange(e,value){
        this.amount=value;
    }

    withdrawCash(){
        console.log('wxPay_withdraw');
        console.log(this.psw);
        console.log(this.amount);
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)){
            this.setState({isInputAmount:false});
            W.alert(___.amount_error);
            return;
        }
        if(this.amount>_user.balance){
            this.setState({isInputAmount:false});
            W.alert(___.balance_not_enough);
            return;
        }
        this.setState({isInputAmount:false});
        
        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay({
            uid:_user.uid,
            order_type:3,
            remark:'提现',
            amount:this.amount,
            title:'提现',
            psw:this.psw,
            // isCust:1,
        },'wxPay_withdraw',location.href);
    }
    toRecharge(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)||this.amout==0){
            W.alert(___.amount_error);
            return;
        }
        let pay_data={
            uid:_user.uid,
            order_type:2,
            remark:'充值',
            amount:this.amount,
            title:'充值',
            // isCust:1,
        }
        console.log('wxpay_recharge');
        console.log(pay_data);
        // W.alert(pay_data.uid,e=>{Wapi.pay.wxPay(pay_data,'wxPay_recharge',location.href);});//测试用，弹出uid
        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay(pay_data,'wxPay_recharge',location.href);
    }

    render() {
        const actions = 1;
        return (
            <ThemeProvider>
            <div>

                <AppBar 
                    style={sty.appbar}
                    title={___.my_wallet} 
                />

                <div style={sty.head}>
                    <div style={sty.head_str}>{___.balance}</div>
                    <div style={sty.head_num}>{toMoneyFormat(_user.balance)}</div>
                    <div>
                        <a style={sty.a} onTouchTap={this.inputPsw}>{___.withdraw_cash}</a>
                    </div>
                </div>

                <div style={sty.main}>
                    <Alist 
                        max={this.total} 
                        limit={20} 
                        data={this.data} 
                        next={this.loadNextPage} 
                    />
                </div>
                
                <Dialog
                    open={this.state.isInputPsw}
                    actions={[
                        <FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputPsw}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.inputAmount}
                        />
                    ]}
                >
                    
                    <Input
                        floatingLabelText={___.input_user_psw}
                        onChange={this.pswChange}
                        type="password"
                    />

                </Dialog>

                <Dialog
                    open={this.state.isInputAmount}
                    actions={[
                        <FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputAmount}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.withdrawCash}
                        />
                    ]}
                >
                    
                    <Input
                        floatingLabelText={___.input_withdraw_amount}
                        onChange={this.amountChange}
                    />

                </Dialog>
            </div>
            </ThemeProvider>
        );
    }
}

class DList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele)=>
            <div key={ele.objectId} style={sty.bill}>
                <div style={(ele.amount>=0) ? sty.income : sty.expenses}>
                    {(ele.amount>=0) ? ('+'+ele.amount) : (ele.amount)}
                </div>
                <div style={sty.bill_remark}>{W.dateToString(new Date(ele.createdAt))}</div>
                <div style={sty.bill_remark}>{decodeURIComponent(ele.remark)}</div>
            </div>
        );
        return(
            <div>
                {items}
            </div>
        )
    }
}
let Alist=AutoList(DList);

class ShowBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            userName:false
        }
        this.reset = this.reset.bind(this);
        this.userName = this.userName.bind(this);
        this.close = this.close.bind(this);
        this.changeName = this.changeName.bind(this);
        this.saveName = this.saveName.bind(this);
        this.wallet = this.wallet.bind(this);
    }

    reset(){
        thisView.goTo('./myAccount/forget.js');
    }

    userName(){
        this.setState({userName:true});
    }

    close(){
        this.setState({
            userName:false
        });
    }

    changeName(name){
        this._name=name;
    }
    saveName(){
        if(this._name){
            let that=this;
            Wapi.user.get(function(res){
                if(res.status_code==0){
                    W.alert(___.username_registed);
                }else{
                    Wapi.user.updateMe(function(re){
                        _user.username=that._name;
                        W.setSetting('user',_user);
                        that.close();
                    },{
                        username:that._name
                    });
                }
            },{
                username:that._name
            });
        }
    }

    personalInfo(){
        thisView.goTo('./myAccount/personal_info.js');
    }


    wallet(){
        thisView.goTo('./myAccount/wallet.js');
    }

    logout(){
        W.loading('正在退出');
        let key=getOpenIdKey();
        let wxId=_user.authData[key+'_wx'];//上次登录的公众号id
        if(wxId)
            W.logout('&logout=true&needOpenId=true&wx_app_id='+wxId);
        else
            W.logout('&logout=true&needOpenId=true');
    }
    recommend(){
        thisView.goTo('my_marketing.js');
    }

    systemSet(){
        thisView.goTo('./myAccount/system_set.js');
    }

    toBillList(){
        //这里的‘我的订单’是指的什么？sellerId为当前用户的订单？
        let par={
            sellerId:_user.objectId,
            status:0
        }
        thisView.goTo('booking_list.js',par);
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

        let forget=this.state.resetPwd?sty.p:Object.assign({},sty.p,{display:'none'});
        console.log((_user));
        return (
            <div>
                <div 
                onClick={this.personalInfo}
                style={{textAlign:'center',padding:'10px 0px 20px'}}>
                    <div style={{marginBottom:'10px',fontSize:'18px'}}>{_user.customer.name}</div>
                    <div style={{marginBottom:'10px'}}>{_user.employee && _user.employee.name}</div>
                    <div>{_user.mobile}</div>
                </div>
                <Divider/>
                <List>
                    {/*修改用户名*/}
                    {/*<ListItem primaryText={___.edit_user_name} leftIcon={<ActionAccountBox/>} onClick={this.userName}/>*/}
                    {/*修改密码*/}
                    {/*<ListItem primaryText={___.reset_pwd} leftIcon={<ActionLock/>} onClick={this.reset}/>*/}
                    {/*我的订单*/}
                    {/*<ListItem 
                        primaryText={___.my_order} 
                        onClick={this.toBillList}
                        rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>2</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />*/}
                    <ListItem 
                        primaryText={___.my_wallet} 
                        onClick={this.wallet}
                        rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{toMoneyFormat(_user.balance)}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    <ListItem 
                        primaryText={___.recommend} 
                        onClick={this.recommend}
                        rightAvatar={<span style={{marginTop:'12px',marginRight:'30px'}}>{toMoneyFormat(0)}</span>}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    {/*系统设置*/}
                    <ListItem 
                        primaryText={___.system_set} 
                        onClick={this.systemSet}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                </List>
                <List style={{padding:'20px 16px 8px 16px',textAlign:'canter'}}>
                    <RaisedButton label={___.logout} fullWidth={true} secondary={true} style={sty.lo} onClick={this.logout}/>                    
                </List>
                <Dialog
                    title={___.edit_user_name}
                    open={this.state.userName}
                    actions={actions}
                >
                    <UserNameInput onChange={this.changeName} value={_user.userName} floatingLabelText={___.input_user_name}/>
                </Dialog>
            </div>
        );
    }
}

class EditBox extends Component {
    render() {
        return (
            <div>
                edit
            </div>
        );
    }
}


class Logo extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            completed:0
        }
        this.uploadLogo = this.uploadLogo.bind(this);
    }
    
    uploadLogo(){
        return;
        // let that=this;
        // let input=document.createElement('input');
        // input.type='file';
        // input.accept="image/*";
        // input.addEventListener('change',function(){
        //     let file=this.files[0];
        //     let type=file.type.split('/')[0];
        //     if(type!="image"){
        //         h.value="";
        //         h.files=null;
        //         W.alert(___.only_image);
        //         return;
        //     }
        //     Wapi.file.upload(function(res){
        //         if (res.status_code) {
        //             W.errorCode(res);
        //             return;
        //         }
        //         Wapi.user.update(function(){
        //             _user.logo=res.image_file_url;
        //             W.setSetting('user',_user);
        //             that.setState({'completed':0});
        //         },{
        //             _uid:_user.uid,
        //             logo:res.image_file_url
        //         });
        //     },file,(completed)=>that.setState({'completed':completed*100}));
        // });
        // input.click();
    }
    render() {
        let logo=_user.logo?(<Avatar src={_user.logo} onClick={this.uploadLogo} style={sty.limg}/>):
        (<ActionFace onClick={this.uploadLogo} style={sty.limg}/>);
        let progress=this.state.completed?<LinearProgress mode="determinate" value={this.state.completed}/>:null;
        return (
            <span {...this.props}>
                {logo}
                {progress}
            </span>
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    return '￥' + money.toFixed(2);
}
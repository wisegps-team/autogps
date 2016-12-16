import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {Tabs, Tab} from 'material-ui/Tabs';

import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';
import MobileChecker from '../_component/base/mobileChecker';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view


thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    
    let rechargeView=thisView.prefetch('#recharge',3);
    ReactDOM.render(<RechargePage/>,rechargeView);
    
    let withdrawView=thisView.prefetch('#withdraw',3);
    ReactDOM.render(<WithdrawPage/>,withdrawView);
});

const styles={
    head:{width:'100%',height:'120px',display:'block',backgroundColor:'#29B6F6',textAlign:'center',paddingTop:'40px'},
    head_str:{fontSize:'14px',color:'#ffffff',marginBottom:'5px'},
    head_num:{fontSize:'36px',color:'#ffffff'},
    bill:{padding:'5px 10px',borderBottom:'1px solid #cccccc'},
    bill_remark:{fontSize:'14px',color:'#999999',paddingTop:'5px'},
    main:{margin:'10px'},
    income:{color:'#009900',fontSize:'20px',float:'right'},
    expenses:{color:'#990000',fontSize:'20px',float:'right'},
    line:{margin:'0px 15px',padding:'15px 5px',borderBottom:'1px solid #dddddd'},
    line_right:{float:'right'},
    a:{color:'#009988'},
    sonpage_main:{padding:'1em',textAlign:'center'},
    inputGroup:{display:'block',paddingTop:'1em',paddingBottom:'1em'},
}
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

let companyBillUid='0';
let Balance=0;
//代理商、经销商的财务管理
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            show_bill:false,
        }
        this.data={
            balance:0,
        }
        
        this.toBill = this.toBill.bind(this);
        this.billBack = this.billBack.bind(this);

    }
    
    componentDidMount() {
        Wapi.user.get(res=>{
            companyBillUid=res.data.objectId;
            this.data.balance=res.data.balance;
            Balance=res.data.balance;
            console.log('get customer bill account,companyBillUid='+companyBillUid);
            this.forceUpdate();
        },{
            mobile:_user.customer.objectId,
            account_type:2
        });

        Wapi.pay.checkWxPay(res=>{
            this.forceUpdate();
        },'wxPay_recharge');
        Wapi.pay.checkWxPay(res=>{
            this.forceUpdate();
        },'wxPay_withdraw');
    }

    toBill(){
        this.setState({show_bill:true});
    }
    billBack(){
        this.setState({show_bill:false});
    }

    toRecharge(){
        if(companyBillUid=='0'){//如果当前账户信息尚未获取到，则延迟500ms执行
            setTimeout(e=>{
                this.toRecharge();
            }, 500);
            return;
        }
        thisView.goTo('#recharge');
    }

    toWithdraw(){
        if(companyBillUid=='0'){
            setTimeout(e=>{
                this.toWithdraw();
            }, 500);
            return;
        }
        thisView.goTo('#withdraw');
    }

    render() {
        return (
            <ThemeProvider>
            <div>

                <div style={styles.head}>
                    <div style={styles.head_str}>{___.balance}</div>
                    <div onTouchTap={this.toBill} style={styles.head_num}>{toMoneyFormat(this.data.balance)}</div>
                </div>

                <div onTouchTap={this.toRecharge} style={{padding:'1em',borderBottom:'1px solid #cccccc'}}>
                    <div style={{float:'right'}}><NavigationChevronRight /></div>
                    <div>{___.recharge}</div>
                </div>

                <div onTouchTap={this.toWithdraw} style={{padding:'1em',borderBottom:'1px solid #cccccc'}}>
                    <div style={{float:'right'}}><NavigationChevronRight /></div>
                    <div>{___.withdraw_cash}</div>
                </div>

                <SonPage open={this.state.show_bill} back={this.billBack} title={___.bill_details}>
                    <BillPage companyBillUid={companyBillUid}/>
                </SonPage>

            </div>
            </ThemeProvider>
        );
    }
}
export default App;

class RechargePage extends Component {
    constructor(props,context){
        super(props,context);
        this.amount=0;
        this.rechargeChange = this.rechargeChange.bind(this);
        this.toRecharge = this.toRecharge.bind(this);
    }
    rechargeChange(e,value){
        this.amount=value;
    }
    toRecharge(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)||this.amout==0){
            alert(___.amount_error);
            return;
        }
        let pay_data={
            uid:companyBillUid,
            order_type:2,
            remark:'充值',
            amount:this.amount,
            title:'充值',
            uidType:1,
            // isCust:1,
        }
        console.log('wxpay_recharge');
        console.log(pay_data);
        W.alert(pay_data.uid,e=>{Wapi.pay.wxPay(pay_data,'wxPay_recharge',location.href);});
        // history.replaceState('home','home','home.html');
        // Wapi.pay.wxPay(pay_data,'wxPay_recharge',location.href);
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.recharge}/>

                <div style={styles.sonpage_main}>
                    <div style={styles.inputGroup}>
                        <span >{___.input_recharge_amount}</span>
                        <span style={{paddingLeft:'1em'}}>
                            <Input name='withdraw' style={{height:'30px',width:'100px'}} inputStyle={{height:'20px'}} onChange={this.rechargeChange}/>
                        </span>
                    </div>
                    <RaisedButton onClick={this.toRecharge} label={___.ok} primary={true}/>
                </div>

            </div>
            </ThemeProvider>
        );
    }
}

class WithdrawPage extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isInputAmount:true
        }
        this.amount=0;
        this.withdrawChange = this.withdrawChange.bind(this);
        this.toCheckPhone = this.toCheckPhone.bind(this);
        this.toWithdraw = this.toWithdraw.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(!this.state.isInputAmount){
                this.setState({isInputAmount:true});
            }
        })
    }
    withdrawChange(e,value){
        this.amount=value;
    }
    toCheckPhone(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)||this.amount==0){
            alert(___.amount_error);
            return;
        }
        if(this.amount>Balance){
            alert(___.balance_not_enough);
            return;
        }
        this.setState({isInputAmount:false});
    }
    toWithdraw(){
        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay({
            uid:companyBillUid,
            order_type:3,
            remark:'提现',
            amount:this.amount,
            title:'提现',
            psw:this.psw,
            uidType:1,
            // isCust:1,
        },'wxPay_withdraw',location.href);
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.withdraw_cash}/>

                <div style={this.state.isInputAmount ? styles.sonpage_main : {display:'none'}}>
                    <div style={styles.inputGroup}>
                        <span>{___.input_withdraw_amount}</span>
                        <span style={{paddingLeft:'1em'}}>
                            <Input name='withdraw' style={{height:'30px',width:'100px'}} inputStyle={{height:'20px'}} onChange={this.withdrawChange}/>
                        </span>
                    </div>
                    <p style={{fontSize:'0.8em',color:'#666666'}}>{___.withdraw_alert}</p>
                    <RaisedButton style={{marginTop:'1em'}} onClick={this.toCheckPhone} label={___.ok} primary={true}/>
                </div>

                <div style={this.state.isInputAmount ? {display:'none'} : styles.sonpage_main}>
                    <p style={{fontSize:'0.8em'}}>{___.need_check_phone}</p>
                    <div style={{width:'90%',marginLeft:'5%'}}>
                        <MobileChecker mobile={_user.customer.tel} onSuccess={this.submit}/>
                    </div>
                    <RaisedButton onClick={this.toWithdraw} label={___.ok} primary={true}/>
                </div>

            </div>
            </ThemeProvider>
        );
    }
}


class BillPage extends Component {
    constructor(props,context){
        super(props,context);
        this.data=[];
        this.page_no=1;
        this.total=0;
        this.loadNextPage = this.loadNextPage.bind(this);
        this.getRecords = this.getRecords.bind(this);
    }
    componentDidMount() {
        this.getRecords(this.props.companyBillUid);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.companyBillUid==this.props.companyBillUid)return;
        this.getRecords(nextProps.companyBillUid);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.companyBillUid==this.props.companyBillUid){
            return false;
        }else{
            return true;
        }
    }
    
    loadNextPage(){
        this.page_no++;
        this.getRecords(this.props.companyBillUid);
    }
    getRecords(uid){
        console.log('get bill records,companyBillUid='+uid);
        if(uid==0)return;
        Wapi.user.getBillList(res=>{
            this.tota=res.total;
            let _data=res.data.reverse();
            this.data=this.data.concat(_data);
            this.forceUpdate();
        },{
            uid:uid,
            start_time:'2016-01-01',
            end_time:'2026-12-12',
        });
    }
    render() {
        return (
            <div style={styles.main}>
                <Alist 
                    max={this.total} 
                    limit={20} 
                    data={this.data} 
                    next={this.loadNextPage} 
                />
            </div>
        );
    }
}

class DList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele)=>
            <div key={ele.objectId} style={styles.bill}>
                <div style={(ele.amount>=0) ? styles.income : styles.expenses}>
                    {(ele.amount>=0) ? ('+' + ele.amount.toFixed(2)) : (ele.amount.toFixed(2))}
                </div>
                <div style={styles.bill_remark}>{W.dateToString(new Date(ele.createdAt))}</div>
                <div style={styles.bill_remark}>{decodeURIComponent(ele.remark)}</div>
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



//工具方法 金额转字符
function toMoneyFormat(money){
    return '￥' + money.toFixed(2);
}
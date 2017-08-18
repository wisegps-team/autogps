import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {Tabs, Tab} from 'material-ui/Tabs';

// import AppBar from '../_component/base/appBar';
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
import VerificationOrig from '../_component/base/verificationOrig'

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.company_account);

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    
    let rechargeView=thisView.prefetch('#recharge',3);
    rechargeView.setTitle(___.recharge);
    ReactDOM.render(<RechargePage/>,rechargeView);
    
    let withdrawView=thisView.prefetch('#withdraw',3);
    withdrawView.setTitle(___.withdraw_cash);
    ReactDOM.render(<WithdrawPage/>,withdrawView);
});

const styles={
    appbar:{position:'fixed',top:'0px'},
    head:{width:'100%',height:'120px',display:'block',textAlign:'center',paddingTop:'40px',backgroundColor:'#3c9bf9'},
    head_str:{fontSize:'14px',marginBottom:'5px',color:'#ffffff'},
    head_num:{fontSize:'36px',marginBottom:'10px',color:'#ffffff'},
    bill:{padding:'5px 10px',borderBottom:'1px solid #cccccc'},
    bill_remark:{paddingTop:'5px'},
    main:{margin:'10px'},
    income:{float:'right'},
    expenses:{color:'#990000',float:'right'},
    line:{margin:'0px 15px',padding:'15px 5px',borderBottom:'1px solid #dddddd'},
    line_right:{float:'right'},
    a:{color:'#FFFF8D'},
    sonpage_main:{marginLeft:'10px',marginRight:'10px',textAlign:'center'},
    inputGroup:{display:'block',paddingTop:'1em',paddingBottom:'1em'},
    no_record:{width:'100%',textAlign:'center'},
}
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}
function vmiddle(num,sty){
    return Object.assign({marginTop:((window.innerHeight-num)/2-50)+'px'},sty);
}

let companyBillUid='0';
let Balance=0;
//代理商、经销商的财务管理
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data={
            balance:0,
        }
        
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
        console.log(this.data.balance,'test this data balance')
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar 
                    title={___.company_account} 
                    style={styles.appbar}
                />*/}

                <div style={styles.head}>
                    {/*<div style={styles.head_str}>{___.balance}</div>*/}
                    <div style={styles.head_num}>{toMoneyFormat(this.data.balance)}</div>
                    <div>
                        <span style={this.data.balance?{marginRight:'20px'}:{}}>
                            <a style={styles.a} onTouchTap={this.toRecharge}>{___.recharge}</a>
                         </span> 
                         { 
                             this.data.balance? 
                            <span>
                                <a style={styles.a} onTouchTap={this.toWithdraw}>{___.withdraw_cash}</a>
                            </span>
                             :null 
                         } 
                    </div>
                </div>
                
                <BillPage companyBillUid={companyBillUid}/>


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
            W.alert(___.amount_error);
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
        // W.alert(pay_data.uid,e=>{Wapi.pay.wxPay(pay_data,'wxPay_recharge',location.href);});//测试用，弹出uid
        // history.replaceState('home','home','home.html');
        W.fixPath();
        Wapi.pay.wxPay(pay_data,'wxPay_recharge',location.href);
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.recharge}/>*/}

                <div style={ vmiddle(130,styles.sonpage_main) }>
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
        this.success = this.success.bind(this);
        this.toWithdraw = this.toWithdraw.bind(this);
        this.withdrawal = this.withdrawal.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(!this.state.isInputAmount){
                this.setState({isInputAmount:true});
            }
        })
    }
    withdrawChange(e,value){
        // this.amount = value
        this.amount=e.target.value;
        this.forceUpdate();
        // console.log(e.target.value,value)
    }
    toCheckPhone(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)||this.amount==0){
            W.alert(___.amount_error);
            return;
        }
        if(this.amount>Balance){
            W.alert(___.balance_not_enough);
            return;
        }
        this.setState({isInputAmount:false});
    }
    success(val,name){
        this.code=val;
        this.forceUpdate();
        // console.log(val,'dd')
    }
    toWithdraw(){
        if(!this.code){
            W.alert(___.code_err);
            return;
        }
        // history.replaceState('home','home','home.html');
        W.fixPath();
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
    withdrawal(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        console.log(this.amount,'prince')
        if(!reg.test(this.amount)||this.amount==0){
            W.alert(___.amount_error);
            return;
        }
        if(this.amount>Balance){
            W.alert(___.balance_not_enough);
            return;
        }
        if(!this.code){
            W.alert(___.code_err);
            return;
        }
        // history.replaceState('home','home','home.html');
        W.fixPath();
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
        let sty={
            r:{display:'flex',alignItems:'flex-end',padding:'3px 10px',borderBottom:'1px solid #dddddd',background:'#fff'},
            input:{width:'100%',height:'40px',fontSize:'16px',border:'none',outline:'none'}
        }
        let mobile=_user.customer.tel.replace(_user.customer.tel.slice(-8,-4),'****');
        let show = this.amount&&this.code?false:true
        console.log(this.amount,this.code)
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.withdraw_cash}/>*/}
                <div style={{height:'100vh',background:'#f7f7f7'}}>
                    <div style={{paddingTop:'30px'}}>
                        <div style = { sty.r } >
                            <input name = 'withdraw'  placeholder = { '请输入提现金额' } style = { sty.input } onChange = { this.withdrawChange }/> 
                        </div >
                        <div style = {{ display: 'flex', alignItems: 'flex-end', padding: '3px 10px', background:'#fff' }} >
                            <VerificationOrig 
                                name='valid_code'
                                type={1}
                                account={_user.customer.tel} 
                                style = {{ width: '100%' }}
                                onSuccess={this.success}
                            />
                        </div >
                        <p style={{fontSize:'0.8em',textIndent:'2em',padding:'0 4px',lineHeight:'20px'}}>{'按照微信支付账户管理规定，提现需扣除0.6%手续费，为确保你的账户资金安全，需通过您账号'}{mobile}{'验证身份。'}</p>
                        <div style={{textAlign:'center'}}>
                            <RaisedButton disabled={show} style={{marginTop:'1em'}} onClick={this.withdrawal} label={'提现'} primary={true}/>
                        </div>
                    </div> 
                </div>
                {/* <div style={this.state.isInputAmount ? vmiddle(180,styles.sonpage_main) : {display:'none'}}>
                    <div style={styles.inputGroup}>
                        <span>{___.input_withdraw_amount}</span>
                        <span style={{paddingLeft:'1em'}}>
                            <Input name='withdraw' style={{height:'30px',width:'100px'}} inputStyle={{height:'20px'}} onChange={this.withdrawChange}/>
                        </span>
                    </div>
                    <p style={{fontSize:'0.8em',color:'#666666'}}>{___.withdraw_alert}</p>
                    <RaisedButton style={{marginTop:'1em'}} onClick={this.toCheckPhone} label={___.ok} primary={true}/>
                </div>

                <div style={this.state.isInputAmount ? {display:'none'} : vmiddle(200,styles.sonpage_main)}>
                    <p style={{fontSize:'0.8em'}}>{___.need_check_phone}</p>
                    <div style={{width:'90%',marginLeft:'5%'}}>
                        <MobileChecker mobile={_user.customer.tel} onSuccess={this.success}/>
                    </div>
                    <RaisedButton style={{marginTop:'1em'}} onClick={this.toWithdraw} label={___.ok} primary={true}/>
                </div> */}

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
        this.gotData=false;
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
            this.gotData=true;
            this.total=res.total;
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
                {(this.gotData && this.total==0) ? (
                    <div style={styles.no_record}>
                        {___.no_money_records}
                    </div>):(
                    <Alist 
                        max={this.total} 
                        limit={20} 
                        data={this.data} 
                        next={this.loadNextPage} 
                    />
                )}
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
                    {(ele.amount>=0) ? (ele.amount.toFixed(2)) : (Math.abs(ele.amount).toFixed(2))}
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
    return money.toFixed(2);
}
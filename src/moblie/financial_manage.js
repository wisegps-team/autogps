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

const thisView=window.LAUNCHER.getView();//第一句必然是获取view


thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    head:{width:'100%',height:'120px',display:'block',backgroundColor:'#29B6F6',textAlign:'center',paddingTop:'40px'},
    head_str:{fontSize:'14px',color:'#ffffff',marginBottom:'5px'},
    head_num:{fontSize:'26px',color:'#ffffff'},
    bill:{padding:'5px 10px',borderBottom:'1px solid #cccccc'},
    bill_remark:{fontSize:'14px',color:'#999999',paddingTop:'5px'},
    main:{margin:'10px'},
    income:{color:'#009900',fontSize:'20px'},
    expenses:{color:'#990000',fontSize:'20px'},
    line:{margin:'0px 15px',padding:'15px 5px',borderBottom:'1px solid #dddddd'},
    line_right:{float:'right'},
    a:{color:'#009988'},
}
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}



//代理商、经销商的财务管理
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            show_bill:false,
            isInputRecharge:false,
            isInputPsw:false,
            isInputWithdraw:false,
        }
        this.data={
            balance:0,
        }
        this.companyBillUid='0';
        this.psw='';
        this.amount=0;
        
        this.toBill = this.toBill.bind(this);
        this.billBack = this.billBack.bind(this);

        this.inputRecharge = this.inputRecharge.bind(this);
        this.closeInputRecharge = this.closeInputRecharge.bind(this);
        this.rechargeChange = this.rechargeChange.bind(this);
        this.toRecharge = this.toRecharge.bind(this);

        this.inputPsw = this.inputPsw.bind(this);
        this.closeInputPsw = this.closeInputPsw.bind(this);
        this.pswChange = this.pswChange.bind(this);

        this.inputWithdraw = this.inputWithdraw.bind(this);
        this.closeInputWithdraw = this.closeInputWithdraw.bind(this);
        this.withdrawChange = this.withdrawChange.bind(this);

        this.toWithdraw = this.toWithdraw.bind(this);
    }
    
    componentDidMount() {
        Wapi.user.get(res=>{
            this.companyBillUid=res.data.objectId;
            this.data.balance=res.data.balance;
            console.log('get customer bill account,companyBillUid='+this.companyBillUid);
            this.forceUpdate();
        },{mobile:_user.customer.objectId});

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

    inputRecharge(){
        this.setState({isInputRecharge:true});
    }
    closeInputRecharge(){
        this.setState({isInputRecharge:false});
    }
    rechargeChange(e,value){
        this.amount=value;
    }
    toRecharge(){
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)){
            alert(___.amount_error);
            return;
        }
        this.setState({isInputAmount:false});

        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay({
            uid:this.companyBillUid,
            order_type:2,
            remark:'充值',
            amount:this.amount,
            title:'充值',
            uidType:1,
            // isCust:1,
        },'wxPay_recharge',location.href);
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

    inputWithdraw(){
        this.setState({
            isInputPsw:false,
            isInputWithdraw:true
        });
    }
    closeInputWithdraw(){
        this.setState({isInputWithdraw:false});
    }
    withdrawChange(e,value){
        this.amount=value;
    }

    toWithdraw(){
        //输入管理员密码
        let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!reg.test(this.amount)){
            alert(___.amount_error);
            return;
        }
        if(this.amount>this.data.balance){
            alert(___.balance_not_enough);
            return;
        }
        this.setState({isInputAmount:false});

        history.replaceState('home','home','home.html');
        Wapi.pay.wxPay({
            uid:this.companyBillUid,
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

                <div style={styles.head}>
                    <div style={styles.head_str}>{___.balance}</div>
                    <div onTouchTap={this.toBill} style={styles.head_num}>{toMoneyFormat(this.data.balance)}</div>
                </div>

                <List>
                    <ListItem 
                        key={1}
                        primaryText={___.recharge}
                        onClick={this.inputRecharge}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #cccccc'}}
                    />
                    <ListItem 
                        key={2}
                        primaryText={___.withdraw_cash}
                        onClick={this.inputPsw}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #cccccc'}}
                    />
                </List>

                <SonPage open={this.state.show_bill} back={this.billBack} title={___.bill_details}>
                    <BillPage companyBillUid={this.companyBillUid}/>
                </SonPage>

                {/*输入充值金额*/}
                <Dialog 
                    open={this.state.isInputRecharge} 
                    actions={
                        [<FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputRecharge}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.toRecharge}
                        />]
                    } >

                    <Input
                        floatingLabelText={___.input_recharge_amount}
                        onChange={this.rechargeChange}
                    />

                </Dialog>

                {/*输入用户密码*/}
                <Dialog 
                    open={this.state.isInputPsw} 
                    actions={
                        [<FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputPsw}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.inputWithdraw}
                        />]
                    } >
                    
                    <Input
                        floatingLabelText={___.input_admin_psw}
                        onChange={this.pswChange}
                        type="password"
                    />

                </Dialog>

                {/*输入提现金额*/}
                <Dialog 
                    open={this.state.isInputWithdraw} 
                    actions={
                        [<FlatButton
                            label={___.cancel}
                            primary={true}
                            onClick={this.closeInputWithdraw}
                        />,
                        <FlatButton
                            label={___.ok}
                            primary={true}
                            onClick={this.toWithdraw}
                        />]
                    } >
                    
                    <Input
                        floatingLabelText={___.input_withdraw_amount}
                        onChange={this.withdrawChange}
                    />

                </Dialog>

            </div>
            </ThemeProvider>
        );
    }
}
export default App;

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
                    {(ele.amount>=0) ? ('+'+ele.amount) : (ele.amount)}
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
    let str=money.toString();
    if(str.includes('.')){
        return '￥' + str;
    }else{
        return '￥' + str +'.00';
    }
}
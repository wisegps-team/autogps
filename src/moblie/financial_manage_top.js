import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<FinanceTop/>,thisView);
    thisView.prefetch('./finance/bill_list.js',2);
});

const styles={
    head:{width:'100%',height:'120px',display:'block',backgroundColor:'#29B6F6',textAlign:'center',paddingTop:'40px'},
    head_str:{fontSize:'14px',color:'#ffffff',marginBottom:'5px'},
    head_num:{fontSize:'26px',color:'#ffffff'},
    line:{margin:'0px 15px',padding:'15px 5px',borderBottom:'1px solid #dddddd'},
    line_right:{float:'right'},
    a:{color:'#009988'},
}
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}


//顶级账户的财务管理
class FinanceTop extends Component {
    constructor(props,context){
        super(props,context);

        this.companyNumber=0;
        this.personNumber=0;

        this.companyBalance=0;
        this.personalBalance=0;
        this.tempBalance=0;
        this.counterFee=0;
        this.totalBalance=0;

        this.toListBillList = this.toListBillList.bind(this);
        this.toCompanyAccount = this.toCompanyAccount.bind(this);
        this.toPersonalAccount = this.toPersonalAccount.bind(this);
        this.toCounterFeeList = this.toCounterFeeList.bind(this);
    }
    componentDidMount() {
        let flag=0;

        Wapi.user.getAccountList(res=>{
            this.companyNumber=res.total;
            if(flag==2){
                this.forceUpdate();
            }else{
                flag++;
            }
        },{account_type:2});

        Wapi.user.getAccountList(res=>{
            this.personNumber=res.total;
            if(flag==2){
                this.forceUpdate();
            }else{
                flag++;
            }
        },{account_type:1});
        
        Wapi.user.getAccountTotal(res=>{
            let data=res.data;
            this.companyBalance = data.find(ele=>ele.accountType==2).total;
            this.personalBalance = data.find(ele=>ele.accountType==1).total;
            this.tempBalance = _user.balance;
            this.totalBalance = this.companyBalance + this.personalBalance + this.tempBalance;
            if(flag==2){
                this.forceUpdate();
            }else{
                flag++;
            }
        });
    }
    toListBillList(){
        thisView.goTo('./finance/bill_list.js',{objectId:_user.customer.objectId,name:___.app_name});
    }
    toCompanyAccount(){
        thisView.goTo('./finance/company_accounts.js');
    }
    toPersonalAccount(){
        thisView.goTo('./finance/personal_accounts.js');
    }
    toCounterFeeList(){
        console.log('toCounterFeeList');
    }
    render() {
        return (
            <div>
                <div style={styles.head}>
                    <div style={styles.head_str}>{___.balance}</div>
                    <div style={styles.head_num}>{toMoneyFormat(this.totalBalance)}</div>
                </div>
                <div style={styles.line}>
                    <div style={combineStyle(['line_right','a'])} onTouchTap={this.toListBillList}>{toMoneyFormat(this.tempBalance)}</div>
                    <div >{___.temp_money}</div>
                </div>
                <div style={styles.line}>
                    <div style={styles.line_right}>{toMoneyFormat(this.companyBalance)}</div>
                    <div >{___.company_account}<span style={styles.a} onTouchTap={this.toCompanyAccount}>{' '+this.companyNumber}</span></div>
                </div>
                <div style={styles.line}>
                    <div style={styles.line_right}>{toMoneyFormat(this.personalBalance)}</div>
                    <div >{___.personal_account}<span style={styles.a} onTouchTap={this.toPersonalAccount}>{' '+this.personNumber}</span></div>
                </div>
                <div style={styles.line}>
                    <div style={combineStyle(['line_right','a'])} onTouchTap={this.toCounterFeeList}>{toMoneyFormat(this.counterFee)}</div>
                    <div >{___.counter_fee}</div>
                </div>
            </div>
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    let str=money.toString();
    if(str.includes('.')){
        return '￥' + str;
    }else{
        return '￥' + str +'.00';
    }
}
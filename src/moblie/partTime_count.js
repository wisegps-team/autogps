//营销人员对应的预定/注册/结算统计页面

import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';
import Card from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


let _res={
    code:0,
    data:[
        {
            sellerId:'111',
            name:'小明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            sellerId:'222',
            name:'明明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            sellerId:'333',
            name:'xixi',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
    ]
}

const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'50px',paddingBottom:'20px'},
    card:{marginTop:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
}

let _customers=[];
let _customer={
    custId:'12345600',
    name:'客户',
    tel:'13245678909',
    bookDate:'2016-09-21',
    registDate:'2016-09-22',
    balanceDate:'2016-09-23',
    confirmDate:'2016-09-24',
};
for(let i=0;i<5;i++){
    let c=Object.assign({},_customer);
    c.custId+=i;
    c.name+=i;
    _customers.push(c);
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            sellerId:'0',
            seller:{},
            customers:[],
            total:0,
            status:1,
        }
        this.page=1;
        this.showAllSeller=true;//是否显示所有销售人员名下的客户
        this.changeStatus=this.changeStatus.bind(this);
    }
    getChildContext(){
        return {
            status:this.state.status,
            settlement:this.settlement
        };
    }
    componentDidMount(){
        let seller={};
        let _this=this;
        thisView.addEventListener('show',function (e) {
            if(e.params){//如果接收到信息，说明是seller页面点击某个seller传过来的，则只显示所选销售人员名下的客户
                _this.showAllSeller=false;
                seller=e.params;
                _this.setState({
                    sellerId:seller.sellerId,
                    seller:seller,
                    customers:_customers,
                    total:_customers.length,
                });
            }
        });
        // if(this.showAllSeller){//如果未接收到信息，默认显示所有seller名下的客户
        //     _this.setState({
        //         customers:_customers,
        //         total:_customers.length,
        //     });
        // }
    }
    changeStatus(e,k,value){
        this.setState({status:value});
    }
    settlement(data){
        console.log(data);
        //结算
    }
    loadNextPage(){
        // let arr=this.state.customers;
        // this.page++;
        // Wapi.employee.list(res=>{
        //     this.setState({customers:arr.concat(res.data)});
        // },{
        //     companyId:_user.customer.objectId,
        // },{
        //     fields:'objectId,uid,companyId,name,tel,sex,departId,type,isQuit',
        //     limit:20,
        //     page_no:this.page
        // });
    }
    render(){
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.sell_count} 
                        style={styles.appbar}
                    />
                    <div style={styles.main}>
                        <div style={{display:(this.state.sellerId=='0'?'none':'block')}}>{"销售人员："+this.state.seller.name}</div>
                        <div>
                            {"客户筛选："}
                            <SelectField style={{width:'50%'}} value={this.state.status} onChange={this.changeStatus}>
                                <MenuItem value={0} primaryText="已预定" />
                                <MenuItem value={1} primaryText="已注册" />
                                <MenuItem value={2} primaryText="已结算" />
                                <MenuItem value={3} primaryText="已确认" />
                            </SelectField>
                        </div>
                        <Alist 
                            max={this.state.total} 
                            limit={20} 
                            data={this.state.customers} 
                            next={this.loadNextPage} 
                        />
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}
App.childContextTypes={
    status:React.PropTypes.number,
    settlement:React.PropTypes.func
}


class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let cards=this.props.data.map(ele=>{
            let str='';
            let date='';
            switch(this.context.status){
                case 0:{
                    str=___.book_date;
                    date=ele.bookDate;
                    break;
                }case 1:{
                    str=___.register_date;
                    date=ele.registDate;
                    break;
                }case 2:{
                    str=___.balance_date;
                    date=ele.balanceDate;
                    break;
                }case 3:{
                    str=___.confirm_date;
                    date=ele.confirmDate;
                    break;
                }default:{
                    break;
                }
            }
            return(
                <Card key={ele.custId} style={styles.card}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={styles.td_left}>{ele.name}</td>
                                <td style={styles.td_right}>{ele.tel}</td>
                            </tr>
                            <tr>
                                <td style={styles.td_left}>{str}</td>
                                <td style={styles.td_right}>{date}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={styles.bottom_btn_right}>
                        <FlatButton label={"结算"} primary={true} onClick={()=>this.context.settlement(ele)} />
                    </div>
                </Card>
            )
        })
        return(
            <div>
                {cards}
            </div>
        )
    }
}
 DumbList.contextTypes={
    status:React.PropTypes.number,
    settlement: React.PropTypes.func
};
let Alist=AutoList(DumbList);


class CustomerBooked extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            customers:[]
        }
    }
    componentDidMount(){
        this.setState({customers:_customers});
    }
    render(){
        let cards=this.state.customers.map(ele=>
            <Card key={ele.custId} style={styles.card}>
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{ele.name}</td>
                            <td style={styles.td_right}>{ele.tel}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{"预定日期"}</td>
                            <td style={styles.td_right}>{ele.bookDate}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
        return(
            <div>
                {cards}
            </div>
        )
    }
}
class CustomerRegisted extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            customers:[]
        }
    }
    componentDidMount(){
        this.setState({customers:_customers});
    }
    render(){
        let cards=this.state.customers.map(ele=>
            <Card key={ele.custId} style={styles.card}>
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{ele.name}</td>
                            <td style={styles.td_right}>{ele.tel}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{"注册日期"}</td>
                            <td style={styles.td_right}>{ele.registDate}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
        return(
            <div>
                {cards}
            </div>
        )
    }
}
class CustomerBalanced extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            customers:[]
        }
    }
    componentDidMount(){
        this.setState({customers:_customers});
    }
    render(){
        let cards=this.state.customers.map(ele=>
            <Card key={ele.custId} style={styles.card}>
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{ele.name}</td>
                            <td style={styles.td_right}>{ele.tel}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{"结算日期"}</td>
                            <td style={styles.td_right}>{ele.balanceDate}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
        return(
            <div>
                {cards}
            </div>
        )
    }
}
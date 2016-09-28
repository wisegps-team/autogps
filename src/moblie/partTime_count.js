//营销人员对应的预定/注册/结算统计页面

import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';
import Card from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SocialShare from 'material-ui/svg-icons/social/share';

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
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'60px',paddingBottom:'20px',},
    card:{marginTop:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
}

let _books=[];
let _book={
    name:'客户',
    tel:'13245678909',
    createdAt:'2016-09-21',
    resTime:'2016-09-22',
    payTime:'2016-09-23',
    confirmTime:'2016-09-24',
};
for(let i=0;i<5;i++){
    let c=Object.assign({},_book);
    c.name+=i;
    _books.push(c);
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            sellerId:'>0',
            seller:{name:___.all},
            status:1,

            books:[],
            total:0,

            isSeller:false,
        }
        this.page=1;
        this.changeStatus=this.changeStatus.bind(this);
    }
    getChildContext(){
        return {
            isSeller:this.state.isSeller,
            status:this.state.status,
            pay:this.pay,
            confirm:this.confirm,
        };
    }
    componentDidMount(){
        let _this=this;
        thisView.addEventListener('show',function (e) {
            let _isSeller=false;
            let _sellerId=_this.state.sellerId;
            let _seller=_this.state.seller;
            
            if(e.params){
                //如果接收到信息，说明是seller页面点击某个seller传过来的，则只显示所选销售人员名下的客户
                _seller=e.params;
                _isSeller=false;
                _sellerId=_seller.objectId;
            }else if(_user.employee&&_user.employee.departId=='-1'){
                //如果是销售人员自己登录，则显示该销售人员名下的客户
                _isSeller=true;
                _sellerId=_user.employee.objectId;
                _seller=_user.employee;
            }else{
                //其他情况，未传数据且不是销售人员，则显示公司的所有客户
                _isSeller=false;
                _sellerId='>0';
                _seller={name:___.all};
            }
            Wapi.booking.list(res=>{
                _this.setState({
                    isSeller:_isSeller,
                    sellerId:_sellerId,
                    seller:_seller,

                    books:res.data,
                    total:res.total,

                    //测试用数据
                    //books:_books,
                    //total:_books.length,
                });
            },{
                uid:_user.customer.objectId,
                sellerId:_sellerId,
                status:_this.state.status,
            });
        });
    }
    changeStatus(e,k,value){
        Wapi.booking.list(res=>{
            this.setState({
                status:value,
                books:res.data,
                total:res.total,
            });
        },{
            uid:_user.customer.objectId,
            sellerId:this.state.sellerId,
            status:value,
        });
        // this.setState({status:value});
    }
    pay(data){//结算
        console.log(data);
        Wapi.booking.update(res=>{
            console.log(res);
            let arr=this.state.books;
            arr=arr.filter(ele=>ele.objectId!=data.objectId);
            this.setState({books:arr});
        },{
            _objectId:data.objectId,
            status:2,
            status2:1,
            payTime:W.dateToString(new Date()),
        });
    }
    confirm(data){//确认
        console.log(data);
        Wapi.booking.update(res=>{
            console.log(res);
            let arr=this.state.books;
            arr=arr.filter(ele=>ele.objectId!=data.objectId);
            this.setState({books:arr});
        },{
            _objectId:data.objectId,
            status:3,
            status3:1,
            confirmTime:W.dateToString(new Date()),
        });
    }
    getUrl(){
        if(_user.customer.other&&_user.customer.other.url){
            location='http://w.wo365.net/action.html&action='+_user.customer.other.url+'&uid='+_user.customer.objectId+'&sellerId='+_user.employee.objectId;
        }else{
            W.alert(___.no_event_page);
        }
    }
    loadNextPage(){
        let arr=this.state.books;
        this.page++;

        Wapi.booking.list(res=>{
            this.setState({
                books:arr.concat(res.data),
            });
        },{
            uid:_user.customer.objectId,
            sellerId:this.state.sellerId,
            status:this.state.status,
        },{
            limit:20,
            page_no:this.page
        });
    }
    render(){
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.sell_count} 
                        style={styles.appbar}
                        iconElementRight={
                            <IconButton style={{display:this.state.isSeller?'block':'none'}} onTouchTap={this.getUrl}>
                                <SocialShare/>
                            </IconButton>
                        }
                    />
                    <div style={styles.main}>
                        <table>
                            <tbody>
                                <tr>
                                    <td style={styles.td_left}>{___.seller}</td>
                                    <td style={styles.td_right}>{this.state.seller.name}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.customer_filter}</td>
                                    <td style={styles.td_right}>
                                        <SelectField style={{width:'150px'}} value={this.state.status} onChange={this.changeStatus}>
                                            <MenuItem value={0} primaryText={___.count_booked} />
                                            <MenuItem value={1} primaryText={___.count_registed} />
                                            <MenuItem value={2} primaryText={___.count_paid} />
                                            <MenuItem value={3} primaryText={___.count_confirmed} />
                                        </SelectField>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Alist 
                            max={this.state.total} 
                            limit={20} 
                            data={this.state.books} 
                            next={this.loadNextPage} 
                        />
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}
App.childContextTypes={
    isSeller:React.PropTypes.bool,
    status:React.PropTypes.number,
    pay:React.PropTypes.func,
    confirm:React.PropTypes.func,
}


class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let style_pay_btn={display:'none'};
        let style_confirm_btn={display:'none'};
        let cards=this.props.data.map((ele,index)=>{
            let str='';
            let date='';
            switch(this.context.status){
                case 0:{
                    str=___.book_date;
                    date=ele.createdAt||'';
                    break;
                }case 1:{
                    str=___.register_date;
                    date=ele.resTime||'';
                    if(!this.context.isSeller){
                        style_pay_btn={display:'block'};
                    }
                    break;
                }case 2:{
                    str=___.pay_date;
                    date=ele.payTime||'';
                    if(this.context.isSeller){
                        style_confirm_btn={display:'block'};
                    }
                    break;
                }case 3:{
                    str=___.confirm_date;
                    date=ele.confirmTime||'';
                    break;
                }default:{
                    break;
                }
            }
            return(
                <Card key={index} style={styles.card}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={styles.td_left}>{ele.name}</td>
                                <td style={styles.td_right}>{ele.mobile}</td>
                            </tr>
                            <tr>
                                <td style={styles.td_left}>{str}</td>
                                <td style={styles.td_right}>{date.slice(0,10)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={style_pay_btn}>
                        <div style={styles.bottom_btn_right}>
                            <FlatButton label={___.pay} primary={true} onClick={()=>this.context.pay(ele)} />
                        </div>
                    </div>
                    <div style={style_confirm_btn}>
                        <div style={styles.bottom_btn_right}>
                            <FlatButton label={___.ok} primary={true} onClick={()=>this.context.confirm(ele)} />
                        </div>
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
    isSeller:React.PropTypes.bool,
    status:React.PropTypes.number,
    pay: React.PropTypes.func,
    confirm: React.PropTypes.func,
};
let Alist=AutoList(DumbList);


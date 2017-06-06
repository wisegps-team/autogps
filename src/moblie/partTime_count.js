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


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'60px',paddingBottom:'20px',},
    card:{marginTop:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
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
        this.pay=this.pay.bind(this);
        this.confirm=this.confirm.bind(this);
        this.getUrl=this.getUrl.bind(this);
        this.loadNextPage=this.loadNextPage.bind(this);
    }
    getChildContext(){
        return {
            sellerId:this.state.sellerId,
            isSeller:this.state.isSeller,
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
            }else if(_user.employee&&_user.employee.type==1){
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
                    sellerId:_sellerId.toString(),
                    seller:_seller,

                    books:res.data,
                    total:res.total,

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
            console.log(res);
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
    }
    pay(data){//结算
        W.prompt(___.input_pay_money,'',money=>{
            if(!money)return;

            let reg=/^[0-9]+\.?[0-9]*$/;
            if(reg.test(money)){
                Wapi.booking.update(res=>{
                    let arr=this.state.books;
                    arr=arr.filter(ele=>ele.objectId!=data.objectId);
                    this.setState({books:arr});

                    //发短信给客户经理
                    let tel=this.state.seller.tel;
                    let content=___.pay_message + money;
                    Wapi.comm.sendSMS(function(res){
                        W.errorCode(res);
                    },tel,0,content);
                },{
                    _objectId:data.objectId,
                    status:2,
                    status2:1,
                    payTime:W.dateToString(new Date()),
                    money:money,
                });
            }else{
                W.alert(___.money_wrong);
            }
        })

    }
    confirm(data){//确认
        console.log(data);
        Wapi.booking.update(res=>{
            W.alert(___.confirm_pay);
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
        // history.replaceState('home','home','home.html');
        W.fixPath();
        if(_user.customer.other&&_user.customer.other.url){
            location=WiStorm.root+'action.html?intent=logout&action='+encodeURIComponent(_user.customer.other.url)
                +'&uid='+_user.customer.objectId
                +'&sellerId='+_user.employee.objectId
                +'&mobile='+this.state.seller.tel
                +'&title='+encodeURIComponent(_user.customer.other.title)
                +'&agent_tel='+_user.customer.tel
                +'&seller_name='+_user.employee.name
                +'&timerstamp='+Number(new Date());
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
                                            <MenuItem value={'0|1|2|3'} primaryText={___.all} />
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
    sellerId:React.PropTypes.string,
    isSeller:React.PropTypes.bool,
    pay:React.PropTypes.func,
    confirm:React.PropTypes.func,
}


class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let cards=this.props.data.map((ele,index)=>{
            let style_pay_btn={display:'none'};
            let style_confirm_btn={display:'none'};
            let str_status='';
            let color_status='';
            let style_status=[{display:'none'},{display:'none'},{display:'none'},{display:'none'}];

            switch(ele.status){
                case 0:{
                    style_status[0]={display:'table-row'};
                    str_status=___.count_booked;
                    color_status='#8BC34A';
                    break;
                }case 1:{
                    style_status[1]={display:'table-row'};
                    if(!this.context.isSeller&&this.context.sellerId!='>0'){
                        style_pay_btn={display:'block'};
                    }
                    str_status=___.count_registed;
                    color_status='#00BFA5';
                    break;
                }case 2:{
                    style_status[2]={display:'table-row'};
                    if(this.context.isSeller){
                        style_confirm_btn={display:'block'};
                    };
                    str_status=___.count_paid;
                    color_status='#FFC107';
                    break;
                }case 3:{
                    style_status[2]={display:'table-row'};
                    style_status[3]={display:'table-row'};
                    str_status=___.count_confirmed;
                    color_status='#FF9800';
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
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                            <tr style={style_status[0]}>
                                <td style={styles.td_left}>{___.book_date}</td>
                                <td style={styles.td_right}>{ele.createdAt.slice(0,10)}</td>
                            </tr>
                            <tr style={style_status[1]}>
                                <td style={styles.td_left}>{___.register_date}</td>
                                <td style={styles.td_right}>{ele.resTime?ele.resTime.slice(0,10):''}</td>
                            </tr>
                            <tr style={style_status[2]}>
                                <td style={styles.td_left}>{___.pay_date}</td>
                                <td style={styles.td_right}>{ele.payTime?ele.payTime.slice(0,10):''}</td>
                            </tr>
                            <tr style={style_status[2]}>
                                <td style={styles.td_left}>{___.pay_money}</td>
                                <td style={styles.td_right}>{ele.money?("￥"+ele.money):''}</td>
                            </tr>
                            <tr style={style_status[3]}>
                                <td style={styles.td_left}>{___.confirm_date}</td>
                                <td style={styles.td_right}>{ele.confirmTime?ele.confirmTime.slice(0,10):''}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{marginLeft:'2px',color:color_status}}>{str_status}</div>
                    <div style={style_pay_btn}>
                        <div style={styles.bottom_btn_right}>
                            <FlatButton label={___.pay} primary={true} onClick={()=>this.context.pay(ele)} />
                        </div>
                    </div>
                    <div style={style_confirm_btn}>
                        <div style={styles.bottom_btn_right}>
                            <FlatButton label={___.pay_confirm} primary={true} onClick={()=>this.context.confirm(ele)} />
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
    sellerId:React.PropTypes.string,
    isSeller:React.PropTypes.bool,
    pay: React.PropTypes.func,
    confirm: React.PropTypes.func,
};
let Alist=AutoList(DumbList);


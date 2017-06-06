//预订列表，条件在goTo的时候传进来

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import {Tabs, Tab} from 'material-ui/Tabs';
import Card from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SocialShare from 'material-ui/svg-icons/social/share';

import SonPage from '../_component/base/sonPage';
import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';
import {makeRandomEvent} from '../_modules/tool';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
let _par=null;
thisView.setTitle(___.order);
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    _par=e.params;
});

const EVENT=makeRandomEvent({
    openDetails:'open_details',
});


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'10px',paddingBottom:'20px',},
    card:{marginTop:'5px',padding:'10px',lineHeight: '30px',borderBottom:'solid 1px #999999'},
    w:{width:'50%',display:'inline-block'},
    a:{color: 'rgb(26, 140, 255)'},
    p:{'padding': '0 1em'},
    hide:{display:'none'},
    no_book:{width:'100%',display:'block',marginTop:'30px',textAlign:'center'},
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            books:[],
            total:0,
            bookData:null
        }
        this.page=1;
        this._data={};
        this.gotData=false;

        this.getData = this.getData.bind(this);
        this.loadNextPage=this.loadNextPage.bind(this);
        this.toList = this.toList.bind(this);
    }
    componentDidMount(){
        let _this=this;
        thisView.addEventListener('show',function (e) {
            // _this.setState({
            //     books:[],
            //     total:0,
            // });
            // _this.page=1;
            if(e.params){
                _this._data=e.params;
            }else{
                _this._data=_par;
            }
            this.gotData=false;
            _this.getData(_this._data);
        });
        window.addEventListener(EVENT.openDetails,e=>this.setState({bookData:e.params}));
    }
    
    getData(data){
        if(data._more_params){
            let len=data.params.length;
            let books=[];
            let total=0;
            data.params.forEach(ele=>{
                Wapi.booking.list(re=>{
                    books=books.concat(re.data);
                    total=total+re.total;
                    len--;
                    if(len==0){
                        this.gotData=true;
                        if(this.state.total!=0 && this.state.total==total)return;
                        this.setState({
                            books:books,
                            total:total
                        });
                    }
                },ele,{limit:-1});
            })
        }else{
            Wapi.booking.list(res=>{
                this.gotData=true;
                if(this.state.total!=0 && this.state.total==res.total)return;
                this.setState({
                    books:res.data,
                    total:res.total
                });
            },data,{limit:-1});
        }
    }

    loadNextPage(){
        let arr=this.state.books;
        this.page++;

        Wapi.booking.list(res=>{
            this.setState({
                books:arr.concat(res.data),
            });
        },this._data,{
            limit:20,
            page_no:this.page
        });
    }

    toList(){
        this.setState({
            bookData:null
        });
    }
    render(){
        return(
            <ThemeProvider>
                {/*<AppBar 
                    title={___.booked_cust} 
                    style={styles.appbar}
                />*/}
                <div style={styles.main}>
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.books} 
                        next={this.loadNextPage} 
                    />
                    <div style={(this.state.total==0 && this.gotData) ? styles.no_book : styles.hide}>
                        当前用户暂无相关订单
                    </div>
                </div>
                
                <SonPage title={___.details} open={this.state.bookData!=null} back={this.toList}>
                    <DetailBox data={this.state.bookData}/>
                </SonPage>
            </ThemeProvider>
        )
    }
}

class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    open(data){
        console.log('line160');
        // history.replaceState('home.html','home.html','home.html');
        W.fixPath();
        window.location=WiStorm.root+'order.html?bookingId='+data.objectId;

        // W.emit(window,EVENT.openDetails,data);
    }
    render() {
        let cards=this.props.data.map((ele,index)=>{
            let colors=['#8BC34A','#00BFA5'];
            let i=ele.status;
            return(
                <div key={index} style={styles.card}>
                    <div>
                        <span style={styles.w}>{___.recommender+'：'+ele.sellerName}</span>
                        <span style={styles.w}>{___.booker+'：'+ele.name}</span>
                    </div>
                    <div>{___.book_date+'：'+W.dateToString(W.date(ele.createdAt)).slice(0,10)}</div>
                    <div style={{marginLeft:'2px',color:colors[i]}}>
                        {/*{___.status+'：'+___.booking_status[i]}*/}
                        <a style={styles.a} onClick={e=>this.open(ele)}>{___.details}</a>
                    </div>
                </div>
            )
        })
        return(
            <div>
                {cards}
            </div>
        )
    }
}
let Alist=AutoList(DumbList);


//详细信息
class DetailBox extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:false
        }
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.data&&this.props.data!=nextProps.data){
            this.setState({data:nextProps.data});
            // let that=this;
            // if(nextProps.data.activityId)
            //     Wapi.activity.get(function(res){
            //         if(res.data){
            //             let act={
            //                 deposit:res.data.deposit||' ',
            //                 price:res.data.price||' ',
            //                 installationFee:res.data.installationFee||' ',
            //                 product:res.data.product||' '
            //             }
            //             let data=Object.assign({},nextProps.data,act);
            //             that.setState({data});
            //         }
            //     },{
            //         objectId:nextProps.data.activityId
            //     });
        }  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.data!=this.state.data;
    }
    
    
    render() {
        let d=this.state.data||{};
        console.log(d);
        let resTime=d.status?<h4>{___.register_date+'：'+W.dateToString(W.date(d.resTime))}</h4>:null;
        return (
            <div style={styles.p}>
                {/*订单提交时间*/}
                <h4>{___.submit_booking+'：'+W.dateToString(W.date(d.createdAt))}</h4>
                {/*客户姓名*/}
                <h4>{___.booker+'：'+d.name+'/'+d.mobile}</h4>
                {/*订单号*/}
                <h4>{___.order_id+'：'+d.objectId}</h4>
                {/*车主姓名*/}
                <h4>{___.carowner_info+'：'+d.userName+'/'+d.userMobile}</h4>
                {/*产品型号*/}
                <h4>{___.booking_product+'：'+( d.product ? (d.product.brand+d.product.name) : ___.loading)}</h4>
                {/*产品价格*/}
                <h4>{___.product_price+'：'+( d.product ? d.product.price : ___.loading)}</h4>
                {/*付款时间*/}
                {/*付款金额*/}
                {/*付款方式*/}
                {/*预约安装*/}
                {/*预约门店*/}
                {/*门店电话*/}
                {/*预约确认*/}
                {/*预约时间*/}
                {/*安装注册*/}
                {/*注册车主*/}
                {/*注册产品*/}
                {/*货款结算*/}
                {/*支付金额*/}
                {/*佣金结算*/}
                {/*支付金额*/}

                <h4>{___.recommender+'：'+d.sellerName}</h4>
                <h4>{___.install_price+'：'+( d.product ? d.product.installationFee : ___.loading )}</h4>
                {resTime}
            </div>
        );
    }
}


//工具方法 金额转字符
function toMoneyFormat(money){
    return '￥' + money.toFixed(2);
}

function Equal(x,y){
    let kx=Object.keys(x);
    let ky=Object.keys(y);

    if(kx.length!=ky.length)return false;
    
    let flag=0;
    for(let i=kx.length-1;i>=0;i--){
        let p=kx[i];
        if(!y[p])return false;
        if(y[p]!=x[p])return false;
        
        if(i==0)flag++;
    }
    
    for(let j=ky.length-1;j>=0;j--){
        let q=ky[j];
        if(!x[q])return false;
        if(x[q]!=y[q])return false;

        if(j==0)flag++;
    }

    return flag==2;
}
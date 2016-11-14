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
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    _par=e.params;
});

const EVENT=makeRandomEvent({
    openDetails:'open_details',
});


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'60px',paddingBottom:'20px',},
    card:{marginTop:'1em',padding:'0.5em',lineHeight: '30px'},
    w:{
        width:'50%',
        display:'inline-block'
    },
    a:{
        color: 'rgb(26, 140, 255)',
        marginLeft: '2em'
    },
    p:{
        'padding': '0 1em'
    }
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            books:[],
            total:0,
            bookData:false
        }
        this.page=1;
        this._data={};

        this.loadNextPage=this.loadNextPage.bind(this);
        this.toList = this.toList.bind(this);
    }
    componentDidMount(){
        let _this=this;
        thisView.addEventListener('show',function (e) {
            _this.setState({
                books:[],
                total:0,
            });
            _this.page=1;
            if(e.params){
                _this._data=e.params;
            }else{
                _this._data=_par;
            }
            Wapi.booking.list(res=>{
                _this.setState({
                    books:res.data,
                    total:res.total
                });
            },_this._data);
        });
        window.addEventListener(EVENT.openDetails,e=>this.setState({bookData:e.params}));
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
            bookData:false
        });
    }
    render(){
        return(
            <ThemeProvider>
                <AppBar 
                    title={'预约客户'} 
                    style={styles.appbar}
                />
                <div style={styles.main}>
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.books} 
                        next={this.loadNextPage} 
                    />
                </div>
                
                <SonPage title={___.details} open={this.state.bookData} back={this.toList}>
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
        W.emit(window,EVENT.openDetails,data);
    }
    render() {
        let cards=this.props.data.map((ele,index)=>{
            let colors=['#8BC34A','#00BFA5'];
            let i=ele.status;
            return(
                <Card key={index} style={styles.card}>
                    <div>
                        <span style={styles.w}>{___.recommender+'：'+ele.sellerName}</span>
                        <span style={styles.w}>{___.booker+'：'+ele.name}</span>
                    </div>
                    <div>{___.book_date+'：'+W.dateToString(W.date(ele.createdAt)).slice(0,10)}</div>
                    <div style={{marginLeft:'2px',color:colors[i]}}>
                        {___.status+'：'+___.booking_status[i]}
                        <a style={styles.a} onClick={e=>this.open(ele)}>{___.details}</a>
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
            let that=this;
            if(nextProps.data.activityId)
                Wapi.activity.get(function(res){
                    if(res.data){
                        let act={
                            deposit:res.data.deposit,
                            price:res.data.price,
                            installationFee:res.data.installationFee,
                            product:res.data.product
                        }
                        let data=Object.assign({},nextProps.data,act);
                        that.setState({data});
                    }
                },{
                    objectId:nextProps.data.activityId
                });
        }  
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.data!=this.state.data;
    }
    
    
    render() {
        let d=this.state.data||{};
        let resTime=d.status?<h4>{___.register_date+'：'+W.dateToString(W.date(d.resTime))}</h4>:null;
        return (
            <div style={styles.p}>
                <h4>{___.recommender+'：'+d.sellerName}</h4>
                <h4>{___.book_date+'：'+W.dateToString(W.date(d.createdAt))}</h4>
                <h4>{___.booker+'：'+d.name}</h4>
                <h4>{___.booking_phone+'：'+d.mobile}</h4>
                <h4>{___.product_type+'：'+(d.product||___.loading)}</h4>
                <h4>{___.device_price+'：'+(d.price||___.loading)}</h4>
                <h4>{___.install_price+'：'+(d.installationFee||___.loading)}</h4>
                {resTime}
            </div>
        );
    }
}
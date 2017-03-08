//做分页后

import React, {Component} from 'react';

import Card from 'material-ui/Card';
import AutoList from './base/autoList';
import Input from './base/input';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import SonPage from './base/sonPage';

const styles = {
    main:{width:'90%',marginLeft:'5%',marginRight:'5%'},
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    hide:{display:'none'},
    line:{marginTop:'0.5em'},
    bold:{fontWeight:'bold'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'},
    search_head:{width:'100%',display:'block'},
    add_icon:{float:'right',marginRight:'15px'},
    search_box:{marginLeft:'15px',marginTop:'15px',marginRight:'15px',width:'80%',display:'block'},
    to:{horizontal: 'right', vertical: 'top'},
};


class ProductLogList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            // brand:STORE.getState().brand,
            product:[],
            push:false,
            pop:false,
            selectProduct:null,
            keyword:'',
        }
        this.showStock=false;
        this.stock=[];

        this.originalProduct=[];
        this.search = this.search.bind(this);
        
        this.toPushPage = this.toPushPage.bind(this);
        this.toPopPage = this.toPopPage.bind(this);
        this.getProduct = this.getProduct.bind(this);

        this.toStockPage = this.toStockPage.bind(this);
        this.showStockBack = this.showStockBack.bind(this);
    }

    search(e,value){
        let product=this.originalProduct.filter(ele=>ele._id.brand.includes(value)||ele._id.model.includes(value));
        this.setState({
            keyword:value,
            product:product,
        });
    }
    
    componentDidMount() {
        this.props.thisView.addEventListener('show',e=>{
            this.getProduct();
        });
        this.getProduct();
    }
    
    getProduct(params){
        W.loading(true);
        let par={
            "group":{
                "_id":{
                    "modelId":"$modelId",
                    "model":"$model",
                    "brand":"$brand",
                    "brandId":"$brandId"
                },
                "inCount":{
                    "$sum":"$inCount"
                },
                "outCount":{
                    "$sum":"$outCount"
                }
            },
            "sorts":"modelId",
            "uid":_user.customer.objectId
        }
        if(params){
            par = Object.assign(par,params);
        }
        Wapi.deviceLog.aggr(res=>{
            W.loading();
            let product=res.data.filter(l=>l._id.modelId);
            product.forEach(ele=>{
                ele.inCount=ele.inCount||0;
                ele.outCount=ele.outCount||0;
                ele.stock=ele.inCount-ele.outCount;
            });
            this.originalProduct=product;
            this.setState({product});
        },par);
    }
    
    toPushPage(product){        
        let paramsPush={
            type:1,
            modelId:product._id.modelId,
                    
            page_from:'productlog_list',//这是传递给pushpopcount.js的，不是用于请求数据的
        }
        this.props.thisView.postMessage('pushPopCount.js',paramsPush);
        this.props.thisView.goTo('pushPopCount.js',paramsPush);
    }
    toPopPage(product){
        let paramsPop={
            type:0,
            modelId:product._id.modelId,
                    
            page_from:'productlog_list',
        }
        this.props.thisView.postMessage('pushPopCount.js',paramsPop);
        this.props.thisView.goTo('pushPopCount.js',paramsPop);
    }
    toStockPage(product){
        Wapi.device.list(res=>{
            this.stock=res.data.map(ele=>ele.did);
            this.showStock=true;
            this.forceUpdate();
        },{
            uid:_user.customer.objectId,
            modelId:product._id.modelId
        },{
            fields:'did,objectId'
        })
    }
    showStockBack(){
        this.showStock=false;
        this.forceUpdate();
    }
    render() {
        let menus=[
            <MenuItem key={0} primaryText={___.pop} onTouchTap={this.props.deviceOut}/>,
            <MenuItem key={1} primaryText={___.push} onTouchTap={this.props.deviceIn}/>,
            <MenuItem key={2} primaryText={___.device_return} onTouchTap={this.props.deviceReturn}/>
        ];
        let showMenu=[];
        if(_user.customer.custTypeId==1){
            showMenu=[menus[1],menus[0]];
        }else if(_user.customer.custTypeId==5){
            showMenu=[menus[0],menus[2]];
        }else if(_user.customer.custTypeId==8){
            showMenu=[menus[2]];
        }
        let rightIcon=
            <IconMenu
                iconButtonElement={
                    <IconButton style={{border:'0px',padding:'0px',margin:'0px',width:'24px',height:'24px'}}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                targetOrigin={styles.to}
                anchorOrigin={styles.to}
                >
                {showMenu}
            </IconMenu>;

        let items=this.state.product.map((ele,i)=>
            <div key={i} style={styles.list_item}>
                <div>
                    <span>{ele._id.brand+' '}</span>
                    <span>{ele._id.model}</span>
                </div>
                <div style={{marginTop:'0.5em',fontSize:'0.8em'}}>
                    <span onClick={()=>this.toPushPage(ele)} style={{marginRight:'1em'}}>
                        {___.push+' '}
                        <span style={styles.link}>{ele.inCount||0}</span>
                    </span>
                    <span onClick={()=>this.toPopPage(ele)} style={{marginRight:'1em'}}>
                        {' '+___.pop+' '}
                        <span style={styles.link}>{ele.outCount||0}</span>
                    </span>
                    <span onClick={()=>this.toStockPage(ele)}>
                        {' '+___.stock_count+' '}
                        <span style={styles.link}>{ele.stock||0}</span>
                    </span>
                </div>
            </div>);

        return (
            <div>
                <div style={styles.search_head}>
                    <div style={styles.add_icon}>{rightIcon}</div>
                    <div style={styles.search_box}>
                        <Input 
                            style={{height:'36px'}}
                            inputStyle={{height:'30px'}}
                            onChange={this.search} 
                            hintText={___.search}
                            value={this.state.keyword}
                        />
                    </div>
                </div>
                <div style={styles.main}>
                    {items}
                </div>
                <SonPage open={this.showStock} back={this.showStockBack}>
                    <StockList data={this.stock}/>
                </SonPage>
            </div>
        );
    }
}


class StockList extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            data:[],
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.setState({data:nextProps.data});
        }
    }
    
    render() {
        let data=this.state.data;
        let items=data.map((ele,i)=><p key={i}>{ele}</p>);
        return (
            <div style={styles.card}>
                {items}
            </div>
        );
    }
}


export default ProductLogList;
//做分页后

import React, {Component} from 'react';

import Card from 'material-ui/Card';
import SonPage from './base/sonPage';
import AutoList from './base/autoList';


const styles = {
    main:{width:'90%',marginLeft:'5%',marginRight:'5%'},
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    hide:{display:'none'},
    line:{marginTop:'0.5em'},
    bold:{fontWeight:'bold'},
};


class ProductLogList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            // brand:STORE.getState().brand,
            product:STORE.getState().product,
            push:false,
            pop:false,
            selectProduct:null,
        }
        
        this.toPushPage = this.toPushPage.bind(this);
        this.toPopPage = this.toPopPage.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.getStockNum = this.getStockNum.bind(this);
    }
    
    componentDidMount() {
        this.getProduct();
    }
    
    getProduct(params){
        let product=this.state.product;
        if(this.props.isBrandSeller){
            this.getStockNum(product,params);
        }else{
            //如果不是品牌商，那么不能直接从STORE里面取得brand和product,this.state.product应该为[]，所以需要通过设备型号查找
            let par={
                "group":{
                    "_id":{
                        "modelId":"$modelId"
                    }
                },
                "sorts":"createdAt",
                "uid":_user.customer.objectId
            }
            
            Wapi.device.aggr(re=>{
                let l=re.data.length;
                for(let i=0;i<l;i++){
                    let p=re.data[i]._id.modelId;
                    if(!p)continue;

                    let _product={};
                    Wapi.product.get(res=>{
                        _product=res.data;
                        product[i]=_product;
                        if(i==l-1){
                            this.getStockNum(product,params);
                        }
                    },{objectId:p});
                }
            },par);
        }
    }

    getStockNum(product,params) {
        let par={
            "group":{
                "_id":{
                    "modelId":"$modelId"
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
            let arr=res.data;
            product.map(ele=>{
                let aggr=arr.find(item=>item._id.modelId==ele.objectId);
                if(aggr){
                    ele.inCount=aggr.inCount;
                    ele.outCount=aggr.outCount;
                    ele.stock=aggr.inCount-aggr.outCount;
                }else{
                    ele.inCount=0;
                    ele.outCount=0;
                    ele.stock=0;
                }
            });
            this.setState({product:product});
        },par);
    }
    
    toPushPage(product){        
        let paramsPush={
            type:1,
            modelId:product.objectId
        }
        this.props.thisView.postMessage('pushPopCount.js',paramsPush);
        this.props.thisView.goTo('pushPopCount.js',paramsPush);
    }
    toPopPage(product){
        let paramsPop={
            type:0,
            modelId:product.objectId
        }
        this.props.thisView.postMessage('pushPopCount.js',paramsPop);
        this.props.thisView.goTo('pushPopCount.js',paramsPop);
    }
    render() {
        let items=this.state.product.map((ele,i)=>
            <div key={i} style={styles.list_item}>
                <div>
                    <span>{ele.brand+' '}</span>
                    <span>{ele.name}</span>
                </div>
                <div style={{marginTop:'0.5em',fontSize:'0.8em'}}>
                    <span onClick={()=>this.toPushPage(ele)} style={{marginRight:'1em',color:'#009688'}}>{___.push+' '+ele.inCount||0}</span>
                    <span onClick={()=>this.toPopPage(ele)} style={{marginRight:'1em',color:'#009688'}}>{' '+___.pop+' '+ele.outCount||0}</span>
                    <span>{' '+___.stock_count+' '+ele.stock||0}</span>
                </div>
            </div>);

        return (
            <div style={styles.main}>
                {items}
            </div>
        );
    }
}


export default ProductLogList;
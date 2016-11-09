//做分页后

import React, {Component} from 'react';

import Card from 'material-ui/Card';
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
    }
    
    componentDidMount() {
        this.getProduct();
    }
    
    getProduct(params){
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
            let product=res.data;
            product.map(ele=>{
                ele.inCount=ele.inCount||0;
                ele.outCount=ele.inCount||0;
                ele.stock=ele.inCount-ele.outCount;
            });
            this.setState({product:product});
        },par);
    }
    
    toPushPage(product){        
        let paramsPush={
            type:1,
            modelId:product._id.modelId
        }
        this.props.thisView.postMessage('pushPopCount.js',paramsPush);
        this.props.thisView.goTo('pushPopCount.js',paramsPush);
    }
    toPopPage(product){
        let paramsPop={
            type:0,
            modelId:product._id.modelId
        }
        this.props.thisView.postMessage('pushPopCount.js',paramsPop);
        this.props.thisView.goTo('pushPopCount.js',paramsPop);
    }
    render() {
        let items=this.state.product.map((ele,i)=>
            <div key={i} style={styles.list_item}>
                <div>
                    <span>{ele._id.brand+' '}</span>
                    <span>{ele._id.model}</span>
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
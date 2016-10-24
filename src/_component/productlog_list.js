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
        this.pushPageBack = this.pushPageBack.bind(this);
        this.toPopPage = this.toPopPage.bind(this);
        this.popPageback = this.popPageback.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.getStockNum = this.getStockNum.bind(this);
    }
    
    componentDidMount() {
        this.getProduct();
    }
    
    getProduct(params){
        // console.log('get product');
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
        this.setState({
            push:true,
            selectProduct:product,
        });
    }
    pushPageBack(){
        this.setState({push:false});
    }
    toPopPage(product){
        this.setState({
            pop:true,
            selectProduct:product,
        });
    }
    popPageback(){
        this.setState({pop:false});
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
                    <span style={{color:'#009688'}}>{' '+___.stock_count+' '+ele.stock||0}</span>
                </div>
            </div>);

        return (
            <div style={styles.main}>
                {items}
                <SonPage title={___.push_record} open={this.state.push} back={this.pushPageBack}>
                    <PushPopCount product={this.state.selectProduct} intent={'push'}/>
                </SonPage>
                <SonPage title={___.pop_record} open={this.state.pop} back={this.popPageback}>
                    <PushPopCount product={this.state.selectProduct} intent={'pop'}/>
                </SonPage>
            </div>
        );
    }
}


class Dlist extends Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <div>{ele.brand+' '+ele.model}</div>
                <div style={styles.line}>{___.time+' '+W.dateToString(W.date(ele.createdAt))}</div>
                <div style={styles.line}>{___.num+' '+ele.did.length}</div>
                <div style={styles.line}><a onClick={()=>this.context.toDidList(ele)} style={styles.a}>IMEI</a></div>
            </Card>);
        return(
            <div>
                {items}
            </div>
        )
    }
}
Dlist.contextTypes ={
    toDidList:React.PropTypes.func,
}
let Alist=AutoList(Dlist);
export class PushPopCount extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            curLog:null,
            showDid:false,
            data:[],
            total:-1,
        }
        this.par={
            uid:_user.customer.objectId
        }
        this.op={
            page_no:1,
            limit:20,
            sorts:'-createdAt',
        }

        this.toDidList = this.toDidList.bind(this);
        this.showDidBack = this.showDidBack.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }
    getChildContext(){
        return {
            toDidList:this.toDidList,
        };
    }
    componentWillReceiveProps(nextProps) {
        this.par.type=nextProps.intent=='push'?1:0;
        if(nextProps.product){
            this.par.modelId=nextProps.product.objectId;
            // par=Object.assign(par,{modelId:nextProps.product.objectId});
        }
        if(nextProps.params){
            this.par=Object.assign(this.par,nextProps.params);
        }
        Wapi.deviceLog.list(res=>{
            this.setState({
                data:res.data,
                total:res.total,
            });
        },this.par,this.op);
    }
    toDidList(log){
        this.setState({
            curLog:log,
            showDid:true
        });
    }
    showDidBack(){
        this.setState({
            curLog:null,
            showDid:false
        });
    }
    nextPage(){
        this.op.page_no++;
        console.log('nextPage');
        Wapi.deviceLog.list(res=>{
            let arr=Object.assign({},this.state.data);
            this.setState({
                data:res.data.concat(arr)
            });
        },this.par,this.op);
    }
    render() {
        if(this.props.intent=='push')console.log('total push:'+this.state.total);
        return (
            <div>
                <Alist 
                    max={this.state.total} 
                    limit={20} 
                    data={this.state.data} 
                    next={this.nextPage} 
                />
                <SonPage title={this.props.intent=='push'?___.push_record:___.pop_record} open={this.state.showDid} back={this.showDidBack}>
                    <DidList data={this.state.curLog}/>
                </SonPage>
            </div>
        );
    }
}
PushPopCount.childContextTypes={
    toDidList:React.PropTypes.func,
}


class DidList extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            data:{createdAt:'0',did:[]},
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.setState({data:nextProps.data});
        }
    }
    
    render() {
        // console.log('didList render');
        let data=this.state.data;
        let items=this.state.data.did.map((ele,i)=><p key={i}>{ele}</p>);
        return (
            <div style={styles.card}>
                <div><span style={styles.bold}>{___.time}</span>{' '+W.dateToString(W.date(data.createdAt))}</div>
                <div style={styles.line}><span style={styles.bold}>{___.num}</span>{' '+data.did.length}</div>
                <div style={styles.line}><span style={styles.bold}>{___.device_id}</span></div>
                <div style={{textAlign:'center'}}>{items}</div>
            </div>
        );
    }
}

export default ProductLogList;
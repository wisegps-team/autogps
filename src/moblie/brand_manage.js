/**
 * 品牌产品管理，新增修改删除品牌和产品
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AppBar from '../_component/base/appBar';
import DepartmentTree from'../_component/department_tree';
import {MakeTreeComponent} from '../_component/base/tree';

import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

import {brand_act,product_act} from '../_reducers/dictionary';

const thisView=window.LAUNCHER.getView();
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    main:{
        padding:'10px'
    },
    d:{
        width:'100%',
        margin: '10px 0'
    },
    c:{
        verticalAlign: 'top',
        marginLeft:'1em',
    },
    f:{
        verticalAlign: 'top',
        marginLeft:'1em',
        float: 'right',
    }
}

class App extends Component {
    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.brand_manage}/>
                <div style={sty.main}>
                    <BrandTree/>
                </div>
            </ThemeProvider>
        );
    }
}

/**
 * 包含了数据逻辑的品牌树组件
 */
class BrandTree extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            brand:STORE.getState().brand,
            product:STORE.getState().product
        }
        this.addBrand = this.addBrand.bind(this);
    }
    componentDidMount() {
        this.unsubscribe = STORE.subscribe(() =>{
            let brand=STORE.getState().brand;
            let product=STORE.getState().product;
            let newState={};
            if(this.state.brand!=brand){
                newState.brand=brand;
            }
            if(this.state.product!=product)
                newState.product=product;
            this.setState(newState);
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState!=this.state);
    }

    addBrand(){
        W.prompt(___.input_brand,'',t=>{
            if(!t)return;
            let data={
                uid:_user.customer.objectId,
                company:_user.customer.name,
                name:t
            }
            Wapi.brand.add(function(res){
                data.objectId=res.objectId;
                STORE.dispatch(brand_act.add(data));
            },data);
        });
    }
    
    render() {
        let brands=this.state.brand.map(e=>(<Brand key={e.objectId} data={e} product={this.state.product}/>));
        return (
            <div>
                <div>
                    {_user.customer.name}
                    <ContentAddCircleOutline style={sty.c} onClick={this.addBrand}/>
                </div>
                <ul>
                    {brands}
                </ul>
            </div>
        );
    }
}

/**
 * 品牌
 */
class Brand extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            product:this.getProduct(props.product),
            name:this.props.data.name
        }
        this.addProduct = this.addProduct.bind(this);
        this.edit = this.edit.bind(this);
        this.remove = this.remove.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let newState={
            name:nextProps.data.name,
            product:this.getProduct(nextProps.product)
        };
        this.setState(newState);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState.name!=this.state.name||nextState.product!=this.state.product);
    }
    getProduct(arr){
        return arr.filter(e=>e.brandId==this.props.data.objectId);
    }
    

    edit(){
        W.prompt(___.edit_brand,this.props.data.name,t=>{
            if(!t)return;
            let data=this.props.data;
            let that=this;
            Wapi.brand.update(function(){
                data.name=t;
                STORE.dispatch(brand_act.update(data));
            },{
                _objectId:data.objectId,
                name:t
            });
        });
    }

    remove(){
        //删除一个品牌,如果品牌下有设备不能删除
        let pids=this.state.product.map(e=>e.objectId).join('|');
        let that=this;
        Wapi.device.list(function(res){
            if(res.data&&res.data.length){
                W.alert(___.brand_can_not_remove);
            }else{
                W.confirm(___.confirm_remove.replace('<%name%>',that.props.data.name),t=>{
                    if(!t)return;
                    let id=that.props.data.objectId;
                    Wapi.brand.delete(e=>STORE.dispatch(brand_act.delete(id)),{objectId:id});
                    Wapi.product.delete(e=>e,{objectId:pids});
                });
            }
        },{
            modelId:pids
        })
    }

    addProduct(){
        //新增一个产品
        W.prompt(___.input_product,'',t=>{
            if(!t)return;
            let data={
                uid:_user.customer.objectId,
                company:_user.customer.name,
                brand:this.props.data.name,
                brandId:this.props.data.objectId,
                name:t
            }
            Wapi.product.add(function(res){
                data.objectId=res.objectId;
                STORE.dispatch(product_act.add(data));
            },data);
        });
    }
    render() {
        let product=this.state.product.map(e=>
            <Product data={e} key={e.objectId}/>
        );
        let products=product.length?(<ul>{product}</ul>):null;
        return (
            <li style={sty.d} onTouchStart={touchStart} onTouchEnd={touchEnd}>
                <span onClick={this.edit}>{this.props.data.name}</span>
                <ContentRemoveCircleOutline style={sty.f} onClick={this.remove} key={'remove'}/>
                <ContentAddCircleOutline style={sty.f} onClick={this.addProduct} key={'add'}/>
                {products}
            </li>
        );
    }
}
Brand.contextTypes={
    mode:React.PropTypes.string,
    select:React.PropTypes.func,
}

class Product extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            name:props.data.name
        }
        this.edit = this.edit.bind(this);
        this.remove = this.remove.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({name:nextProps.data.name});
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState.name!=this.state.name);
    }
    edit(){
        W.prompt(___.edit_product,this.props.data.name,t=>{
            if(!t)return;
            let data=this.props.data;
            Wapi.product.update(function(){
                data.name=t;
                STORE.dispatch(product_act.update(data));
            },{
                _objectId:data.objectId,
                name:t
            });
        });
    }
    remove(){
        let id=this.props.data.objectId;
        let name=this.props.data.name;
        Wapi.device.list(function(res){
            if(res.data&&res.data.length){
                W.alert(___.product_can_not_remove);
            }else
                W.confirm(___.confirm_remove.replace('<%name%>',name),t=>{
                    if(!t)return;
                    Wapi.product.delete(e=>STORE.dispatch(product_act.delete(id)),{objectId:id});
                });
        },{
            modelId:id
        });
    }
    render() {
        return (
            <li style={sty.d} onTouchStart={touchStart} onTouchEnd={touchEnd}>
                <span onClick={this.edit}>{this.state.name}</span>
                <ContentRemoveCircleOutline style={sty.c} onClick={this.remove}/>
            </li>
        );
    }
}
Product.contextTypes={
    edit:React.PropTypes.func,
    remove:React.PropTypes.func,
}


function touchStart(e){
    e.target.style.background='#eee';
}
function touchEnd(e){
    e.target.style.background='#fff';
}
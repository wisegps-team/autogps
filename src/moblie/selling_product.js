import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import Input from '../_component/base/input';
import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles = {
    main:{padding:'15px'},
    input_page:{textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'10px'},
    select:{width:'100%',textAlign:'left'},
    list_item:{borderBottom: '1px solid #ccc'},
    icon:{height: '48px',width: '48px',position: 'absolute',right: '0px',top: '0px',bottom: '0px',margin: 'auto'},
};

let _product={
    brand:"品牌1",
    brandId:"778511900261617700",
    installationFee:"111",
    name:"产品1",
    price:"1111",
    productId:"778510709490323500",
    productUrl:"http://www.baidu.com",
    reward:"11",
    uid:'798351359882694700',
}
let _list=[];
for(let i=5;i--;){
    let p=Object.assign({},_product);
    p.productId+=i;
    _list.push(p);
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
        }
        this.curProduct={};
        this.list=[];

        this.url = this.url.bind(this);
        this.edit = this.edit.bind(this);
        this.editBack = this.editBack.bind(this);
        this.editSubmit = this.editSubmit.bind(this);
        this.add = this.add.bind(this);
        this.addSubmit = this.addSubmit.bind(this);
    }
    componentDidMount() {
        // this.list=_list;
        // this.forceUpdate();
        Wapi.activityProduct.list(res=>{
            this.list=res.data;
            this.forceUpdate();
        },{
            uid:_user.customer.objectId
        });
    }
    url(product){
        window.location=product.productUrl;
    }
    edit(product){
        this.curProduct=product;
        this.setState({isEdit:true});
    }
    editSubmit(product){
        let data=Object.assign({},product);
        data._objectId=data.objectId;
        delete data.objectId;

        Wapi.activityProduct.update(res=>{
            console.log(res);
            if(res.status_code!=0){
                W.alert('修改产品信息失败');
                return;
            }
            
            for(let i=this.list.length;i--;){
                if(this.list[i].objectId==product.objectId){
                    this.list[i]=product;
                    break;
                }
            }
            history.back();
        },data);
    }
    editBack(){
        this.setState({isEdit:false});
    }
    add(){
        this.curProduct={};
        this.setState({isEdit:true});
    }
    addSubmit(product){
        Wapi.activityProduct.add(res=>{
            console.log(res);
            if(res.status_code!=0){
                W.alert('添加产品信息失败');
                return;
            }

            product.objectId=res.objectId;
            this.list.unshift(product);
            history.back();
        },product);
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.selling_product}
                        iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
                    />
                    <div>
                        <ProductList data={this.list} url={this.url} edit={this.edit}/>
                    </div>
                    <SonPage title={___.add_selling_product} open={this.state.isEdit} back={this.editBack}>
                        <EditProduct data={this.curProduct} editSubmit={this.editSubmit} addSubmit={this.addSubmit}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}
export default App;

class ProductList extends Component {
    render() {
        let data=this.props.data;
        let items=data.map(ele=>            
            <ListItem
                key={ele.productId}
                primaryText={ele.brand +' '+ ele.name}
                style={styles.list_item}
                rightIcon={
                    <IconMenu
                        iconButtonElement={
                            <IconButton>
                                <MoreVertIcon/>
                            </IconButton>
                        }
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        style={styles.icon}
                    >
                        <MenuItem key='0' onClick={()=>this.props.url(ele)}>{___.product_url}</MenuItem>
                        <MenuItem key='1' onClick={()=>this.props.edit(ele)}>{___.edit}</MenuItem>
                    </IconMenu>}
            />
        );
        return (
            <List style={styles.main}>
                {items}
            </List>
        );
    }
}

function initData(){
    return{
        uid:_user.customer.objectId,
        productId:'0',
        name:'',
        brandId:'',
        brand:'',
        price:'',
        installationFee:'',
        reward:'',
        productUrl:'',
    };
}
class EditProduct extends Component {
    constructor(props,context){
        super(props,context);

        this.noEdit=false;
        this.types=[];
        this.intent='add';

        this.data=initData();

        this.dataChange = this.dataChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        let par={
            "group":{
                "_id":{
                    "modelId":"$modelId",
                    "model":"$model",
                    "brand":"$brand",
                    "brandId":"$brandId"
                }
            },
            "sorts":"modelId",
            "uid":_user.customer.objectId
        }
        Wapi.deviceLog.aggr(res=>{
            let products=res.data.map(ele=>ele._id);
            this.types=products;
            this.forceUpdate();
        },par);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data.name){
            this.intent='edit';
            this.data=Object.assign({},nextProps.data);
            this.forceUpdate();
        }else{
            this.intent='add';
            this.data=initData();
            this.forceUpdate();
        }
    }
    
    dataChange(e,value,key){
        if(e.target.name){
            this.data[e.target.name]=value;
        }else{  //SelectField不能返回name，而且需要取key
            let type=this.types.find(ele=>ele.modelId==key);
            if(type){
                this.data.productId=type.modelId;
                this.data.name=type.model;
                this.data.brandId=type.brandId;
                this.data.brand=type.brand;
                this.forceUpdate();
            }else{
                this.data.productId='0';
                this.forceUpdate();
            }
        }
    }
    submit(){
        let data=this.data;

        if(data.productId==0){
            W.alert(___.product_type + ___.not_null);
            return;
        }
        if(data.price==0){
            W.alert(___.device_price + ___.not_null);
            return;
        }
        if(data.installationFee==0){
            W.alert(___.install_price + ___.not_null);
            return;
        }
        if(data.reward==0){
            W.alert(___.activity_reward + ___.not_null);
            return;
        }
        if(data.productUrl==0){
            W.alert(___.product_url + ___.not_null);
            return;
        }

        if(this.intent=='edit'){
            this.props.editSubmit(data);
        }else{
            this.props.addSubmit(data);
        }
    }
    render() {
        let types=this.types;
        let typeItems=types.map(ele=><MenuItem key={ele.modelId} value={ele.modelId} primaryText={ele.model}/>);
        typeItems.unshift(<MenuItem key={0} value={0} primaryText={___.please_select_model} />);
        return (
            <div style={styles.input_page}>

                {/*产品型号*/}
                <SelectField name='pay' floatingLabelText={___.product_type} value={this.data.productId} onChange={this.dataChange} style={styles.select} maxHeight={200} disabled={this.noEdit}>
                    {typeItems}
                </SelectField>

                {/*终端价格*/}
                <Input name='price' floatingLabelText={___.device_price+___.yuan} value={this.data.price} onChange={this.dataChange} disabled={this.noEdit} />

                {/*安装费用*/}
                <Input name='installationFee' floatingLabelText={___.install_price+___.yuan} value={this.data.installationFee} onChange={this.dataChange} disabled={this.noEdit} />

                {/*佣金标准*/}
                <Input name='reward' floatingLabelText={___.activity_reward+___.yuan} value={this.data.reward} onChange={this.dataChange} disabled={this.noEdit} />

                {/*产品介绍*/}
                <Input name='productUrl' floatingLabelText={___.activity_url} value={this.data.productUrl} onChange={this.dataChange} disabled={this.noEdit} />
            
                {/*提交*/}
                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.submit} primary={true} onClick={this.submit} />
                </div>

            </div>
        );
    }
}

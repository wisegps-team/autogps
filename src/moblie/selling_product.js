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
import TextField from 'material-ui/TextField';

import Input from '../_component/base/input';
import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.selling_product);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('myAccount/my_order.js',2);
});

const styles = {
    main:{padding:'15px'},
    input_page:{textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'10px'},
    select:{width:'100%',textAlign:'left'},
    list_item:{borderBottom: '1px solid #ccc'},
    icon:{height: '48px',width: '48px',position: 'absolute',right: '0px',top: '0px',bottom: '0px',margin: 'auto'},
    card:{paddingBottom:'10px',borderBottom:'1px solid #ccc'},
    to:{horizontal: 'right', vertical: 'top'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'},
    line:{marginTop:'10px'},
    spans:{width:'140px',display:'table-cell'},
    menu_item:{height:'40px'},
    no_data:{marginTop:'15px',display:'block',width:'100%',textAlign:'center'},
    hide:{display:'none'},
    search_head:{width:'100%',display:'block'},
    add_icon:{float:'right',marginRight:'15px',color:"#2196f3"},
    search_box:{marginLeft:'15px',marginTop:'15px',width:'80%',display:'block'},
    span_left:{fontSize:'0.8em',color:'#666666'},
    span_right:{fontSize:'0.8em'},
    a:{color:'rgb(26, 140, 255)'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

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

let strChannel=[___.national_marketing,___.regional_marketing];
let strAuthStatus=['待审核','已授权','已取消','未授权'];

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
            keyword:''
        }
        this.curProduct={};
        this.originalList=[];
        this.list=[];
        this.gotData=false;

        this.marketPermission=false;//营销权限，确定当前customer能否新增和显示自己的营销产品

        this.search = this.search.bind(this);
        this.url = this.url.bind(this);
        this.authorize = this.authorize.bind(this);
        this.edit = this.edit.bind(this);
        this.editBack = this.editBack.bind(this);
        this.editSubmit = this.editSubmit.bind(this);
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.addSubmit = this.addSubmit.bind(this);
        this.toOrder = this.toOrder.bind(this);
    }
    search(e,value){
        this.list=this.originalList.filter(ele=>ele.name.includes(value)||ele.brand.includes(value));
        this.setState({keyword:value});
    }
    componentDidMount() {
        W.loading(true);
        // this.list=_list;
        // this.forceUpdate();

        let _this=this;
        thisView.addEventListener('message',(e)=>{
            // console.log('收到"'+e.from+'"post过来的信息'+JSON.stringify(e.data));
            let data=e.data;
            let target=this.originalList.find(ele=>ele.objectId==data.actProductId);
            target.myAuth+=data.num;
            this.forceUpdate();
        });
        
        //获取当前customer的权限，确定是否显示右上角‘添加’按钮,[集团营销，渠道营销，车主营销]包含其中至少一个
        let va=(_user.customer.other&&_user.customer.other.va)||'';
        if(va.includes('0')||va.includes('1')||va.includes('3')){
            this.marketPermission=true;
        }

        let par={};
        if(this.marketPermission){
            par={
                uid:_user.customer.objectId+'|'+_user.customer.parentId.join('|')
            };
        }else{
            par={
                uid:_user.customer.parentId.join('|'),
                createdActivity:true
            };
        }

        Wapi.activityProduct.list(res=>{
            this.originalList=res.data;
            // this.list=res.data;
            this.gotData=true;

            if(this.marketPermission){
                Wapi.authorize.list(re=>{
                    let auths=re.data;
                    let counts=countIt(auths);
                    
                    this.originalList=this.originalList.map(ele=>{
                        let target=counts.find(item=>item.actProductId==ele.objectId);
                        if(target){
                            ele.allAuth=target.allAuth;
                            ele.myAuth=target.myAuth;
                        }else{
                            ele.allAuth=0;
                            ele.myAuth=0;
                        }
                        return ele;
                    });
                    this.list=this.originalList;

                    W.loading();
                    this.forceUpdate();
                },{
                    status:'1|2'
                },{
                    fields:'actProductId,approveCompanyId',limit:-1
                });
            }else{
                let flag=0;
                let pids=this.originalList.map(ele=>ele.objectId);
                Wapi.authorize.list(r=>{
                    let auths=r.data;
                    this.originalList=this.originalList.map(ele=>{
                        let target=auths.find(item=>item.actProductId==ele.objectId);
                        if(target){
                            ele.authStatus=target.status;
                        }else{
                            ele.authStatus=3;
                        }
                        return ele;
                    });
                    this.list=this.originalList;
                    flag++;
                    if(flag==2){
                        W.loading();
                        this.forceUpdate();
                    }
                },{
                    actProductId:pids.join('|'),
                    applyCompanyId:_user.customer.objectId
                },{
                    fields:'actProductId,status'
                })

                Wapi.booking.aggr(result=>{
                    let bookCount=result.data;
                    this.originalList=this.originalList.map(ele=>{
                        let target=bookCount.find(item=>item._id.product.id==ele.productId);
                        if(target){
                            ele.bookNum=target.status0;
                        }else{
                            ele.bookNum=0;
                        }
                        return ele;
                    });
                    this.list=this.originalList;
                    flag++;
                    if(flag==2){
                        W.loading();
                        this.forceUpdate();
                    }
                },{
                    "group":{
                        "_id":{"product":"$product"},
                        "status0":{"$sum":"$status0"}
                    },
                    "sorts":"objectId",
                    "installId":_user.customer.objectId
                })
            }

        },par,{
            limit:-1
        });

    }
    url(product){
        window.location=product.productUrl;
    }
    authorize(product,intent){
        if(product.myAuth==0&&intent==0){
            W.alert('暂未授权任何商家');
            return;
        }
        let params={
            product:product,
            intent:intent
        };
        thisView.goTo('authorize.js',params);
        // thisView.postMessage('authorize.js',params);
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
    delete(product){
        W.confirm(___.confirm_delete_product,b=>{
            if(!b)return;
            Wapi.activityProduct.delete(res=>{
                console.log(res);
                this.list=this.list.filter(ele=>ele.objectId!=product.objectId);
                this.forceUpdate();
            },{objectId:product.objectId});
        })
    }
    add(){
        this.curProduct={};
        this.setState({isEdit:true});
    }
    toOrder(product){
        console.log(product);
        let par={
            installId:_user.customer.objectId,
            productId:product.productId
        }
        thisView.goTo('myAccount/my_order.js',par);
    }
    addSubmit(product){
        Wapi.activityProduct.list(re=>{
            if(re.total>0){//验证一个型号每个代理商／品牌商只能创建一个营销产品
                W.alert(___.product_no_repeat);
                return;
            }

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

        },{
            uid:product.uid,
            productId:product.productId
        })
    }
    render() {
        let styAdd = this.marketPermission ? styles.add_icon : {display:'none'};
        return (
            <ThemeProvider>
                <div>
                    {/*<AppBar 
                        title={___.selling_product}
                        iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
                    />*/}
                    <div style={styles.search_head}>
                        <ContentAdd style={styAdd} onClick={this.add}/>
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
                    <div style={(this.gotData && this.list.length==0) ? styles.no_data : styles.hide}>
                        无营销产品！
                    </div>
                    <div>
                        <ProductList 
                            data={this.list} 
                            url={this.url} 
                            authorize={this.authorize} 
                            edit={this.edit} 
                            delete={this.delete}
                            toOrder={this.toOrder}
                        />
                    </div>
                    <SonPage title={___.edit_selling_product} open={this.state.isEdit} back={this.editBack}>
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
        let marketPromission=_user.customer.other&&_user.customer.other.va;
        let data=this.props.data;
        console.log(data);
        let items=data.map((ele,i)=>
            <div key={i} style={styles.card}>
                <IconMenu
                    style={{float:'right'}}
                    iconButtonElement={
                        <IconButton style={{border:'0px',padding:'0px',margin:'0px',width:'24px',height:'24px'}}>
                            <MoreVertIcon/>
                        </IconButton>
                    }
                    targetOrigin={styles.to}
                    anchorOrigin={styles.to}
                    >
                    <MenuItem 
                        style={styles.menu_item} 
                        primaryText={___.preview} 
                        onTouchTap={()=>this.props.url(ele)}
                    />
                    <MenuItem 
                        style={marketPromission ? styles.menu_item : styles.hide}
                        primaryText={___.authorize} 
                        onTouchTap={()=>this.props.authorize(ele,1)}
                    />
                    <MenuItem 
                        style={ele.uid==_user.customer.objectId ? styles.menu_item : styles.hide} 
                        primaryText={___.edit} 
                        onTouchTap={()=>this.props.edit(ele)}
                    />
                    <MenuItem 
                        style={ele.uid==_user.customer.objectId ? styles.menu_item : styles.hide}
                        primaryText={___.delete} 
                        onTouchTap={()=>this.props.delete(ele)}
                    />
                </IconMenu>
                <div style={styles.line}>
                    {ele.brand +' '+ ele.name}
                </div>
                <div style={styles.line}>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{___.marketing_channel+' : '}</span>
                        <span style={styles.span_right}>{Number.isInteger(ele.channel)?(strChannel[ele.channel]):''}</span>
                    </span>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{___.activity_reward+' : '}</span>
                        <span style={styles.span_right}>{moneyFont(ele.reward)}</span>
                    </span>
                </div>
                <div style={styles.line}>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{___.device_price+' : '}</span>
                        <span style={styles.span_right}>{moneyFont(ele.price)}</span>
                    </span>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{___.install_paymen+' : '}</span>
                        <span style={styles.span_right}>{moneyFont(ele.installationFee)}</span>
                    </span>
                </div>
                {/*有营销活动权限的*/}
                <div style={marketPromission?styles.line:styles.hide}>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{'共享授权'+' : '}</span>
                        <span style={styles.span_right}>{ele.allAuth}</span>
                    </span>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{'我的授权'+' : '}</span>
                        <span style={combineStyle(['span_right','a'])} onClick={()=>this.props.authorize(ele,0)}>{ele.myAuth}</span>
                    </span>
                </div>
                {/*无营销活动权限的*/}
                <div style={marketPromission?styles.hide:styles.line}>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{'授权状态'+' : '}</span>
                        <span style={styles.span_right}>{strAuthStatus[ele.authStatus]}</span>
                    </span>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{'预约车主'+' : '}</span>
                        <span style={combineStyle(['span_right','a'])} onClick={()=>this.props.toOrder(ele)}>{ele.bookNum}</span>
                    </span>
                </div>

            </div>
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
        channel:_user.customer.custTypeId==1?0:1,
        createdActivity:false
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
        if(e.target&&e.target.name){
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
        let typeItems=types.map(ele=><MenuItem key={ele.modelId} value={ele.modelId} primaryText={ele.brand+ele.model}/>);
        typeItems.unshift(<MenuItem key={0} value={0} primaryText={___.please_select_model} />);
        return (
            <div style={styles.input_page}>

                {/*产品型号*/}
                <SelectField name='pay' floatingLabelText={___.product_type} value={this.data.productId} onChange={this.dataChange} style={styles.select} maxHeight={200} disabled={this.noEdit}>
                    {typeItems}
                </SelectField>

                {/*终端价格*/}
                <Input name='price' floatingLabelText={___.device_price+___.yuan} value={moneyFont(this.data.price)} onChange={this.dataChange} disabled={this.noEdit} />

                {/*安装费用*/}
                <Input name='installationFee' floatingLabelText={___.install_price+___.yuan} value={moneyFont(this.data.installationFee)} onChange={this.dataChange} disabled={this.noEdit} />

                {/*佣金标准*/}
                <Input name='reward' floatingLabelText={___.activity_reward+___.yuan} value={moneyFont(this.data.reward)} onChange={this.dataChange} disabled={this.noEdit} />

                {/*产品介绍*/}
                <Input name='productUrl' floatingLabelText={___.product_description} value={this.data.productUrl} onChange={this.dataChange} disabled={this.noEdit} />
            
                {/*提交*/}
                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.submit} primary={true} onClick={this.submit} />
                </div>

            </div>
        );
    }
}

function moneyFont(num){
    return Number(num).toFixed(2);
}

function countIt(data){
    let arr=[];
    for(let i=data.length;i--;){
        let obj=data[i];
        if(arr.length){
            for(let j=arr.length-1;j>=0;j--){
                if(arr[j].actProductId==obj.actProductId){
                    if(obj.approveCompanyId==_user.customer.objectId){
                        arr[j].myAuth++;
                    }else{
                        arr[j].allAuth++;
                    }
                    break;
                }
                if(j==0){
                    arr.push({
                        actProductId:obj.actProductId,
                        allAuth:(obj.approveCompanyId==_user.customer.objectId?0:1),
                        myAuth:(obj.approveCompanyId==_user.customer.objectId?1:0)
                    });
                }
            }
        }else{
            arr.push({
                actProductId:obj.actProductId,
                allAuth:(obj.approveCompanyId==_user.customer.objectId?0:1),
                myAuth:(obj.approveCompanyId==_user.customer.objectId?1:0)
            });
        }
    }
    console.log(arr);
    return arr;
}
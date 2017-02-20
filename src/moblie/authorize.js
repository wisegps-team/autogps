import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';

import ToggleCheckBox from 'material-ui/svg-icons/toggle/check-box';
import ToggleCheckBoxOutlineBlank from 'material-ui/svg-icons/toggle/check-box-outline-blank';

import Input from '../_component/base/input';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.partner_authorize);
let _params={};
thisView.addEventListener('load',function(e){
    _params=e.params;
    ReactDOM.render(<App/>,thisView);
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
    warn:{color:'rgb(255, 152, 0)'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            intent:0    //0:show, 1:add
        }
        this.actProduct={brand:'',name:''};
        this.authorizing=[];
        this.authorized=[];
        this.addPage = this.addPage.bind(this);
        this.addAuth = this.addAuth.bind(this);
        this.showPage = this.showPage.bind(this);
    }
        
    componentDidMount(){
        let _this=this;
        loadPage();
        thisView.addEventListener('show',function (e) {
            if(e.params){
                _params=e.params;
            }
            loadPage();
        });
        function loadPage(){
            W.loading(1);
            _this.actProduct=_params.product;
            if(_params.intent){
                _this.addPage(_params.product.objectId);
            }else{
                _this.showPage(_params.product.objectId);
            }
        }
    }
    addPage(id){
        Wapi.authorize.list(res=>{
            this.authorized=res.data;
            let cids=this.authorized.map(ele=>Number(ele.applyCompanyId));

            Wapi.customer.list(re=>{
                W.loading();
                let cust=re.data.filter(ele=>!cids.includes(ele.objectId));
                this.authorizing=cust;
                this.setState({intent:1});
            },{
                parentId:_user.customer.objectId
            },{
                limit:-1
            })

        },{
            actProductId:id,
            approveCompanyId:_user.customer.objectId,
            limit:-1
        })
    }
    addAuth(cids){
        let custs=this.authorizing.filter(ele=>cids.includes(ele.objectId));
        let i=custs.length;
                    // thisView.postMessage('selling_product.js',{
                    //     actProductId:this.actProduct.objectId,
                    //     num:custs.length
                    // });
                    // W.alert('授权成功',()=>{
                    //     history.back();
                    // })
        custs.forEach(item=>{
            Wapi.authorize.add(res=>{
                i--;
                if(i==0){
                    thisView.postMessage('selling_product.js',{
                        actProductId:this.actProduct.objectId,
                        num:custs.length
                    });
                    W.alert('授权成功',()=>{
                        history.back();
                    })
                }
            },{
                actProductId:this.actProduct.objectId,
                applyCompanyId:item.objectId,
                applyCompanyName:item.name,
                approveCompanyName:_user.customer.name,
                approveCompanyId:_user.customer.objectId,
                approveUserId:_user.objectId,
                approveDate:W.dateToString(new Date()),
                status:1
            });
        });
    }
    showPage(id){
        Wapi.authorize.list(res=>{
            W.loading();
            this.authorized=res.data;
            this.setState({intent:0});
        },{
            actProductId:id,
            approveCompanyId:_user.customer.objectId
        })
    }
    render() {
        let addList=<Authorizing data={this.authorizing} actProduct={this.actProduct} addAuth={this.addAuth}/>;
        let showList=<Authorized data={this.authorized} actProduct={this.actProduct}/>;
        return (
            <ThemeProvider>
                <div>
                    {this.state.intent?addList:showList}
                </div>
            </ThemeProvider>
        );
    }
}

let strChannel=[___.national_marketing,___.regional_marketing];
class Authorizing extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            keyword:''
        }

        this.originalList=[];
        this.list=[];

        this.selected=[];
        this.search = this.search.bind(this);
        this.select = this.select.bind(this);
        this.checked = this.checked.bind(this);
        this.authorize = this.authorize.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.selected=[];
        if(nextProps.data.length==0){
            W.alert('暂无需要授权的商家');
        }
        this.originalList=nextProps.data;
        this.list=nextProps.data;
        this.forceUpdate();
    }
    search(e,value){
        this.list=this.originalList.filter(ele=>ele.name.includes(value));
        this.setState({keyword:value});
    }
    select(data){
        this.selected.includes(data.objectId)?
        this.selected=this.selected.filter(ele=>ele!=data.objectId):
        this.selected.push(data.objectId);
        this.forceUpdate();
    }
    checked(e,v){
        let value=e.target.value;
        if(v){
            this.selected.push(Number(value));
        }else{
            this.selected=this.selected.filter(ele=>ele!=value);
        }
        this.forceUpdate();
    }
    authorize(){
        let _this=this;
        W.confirm('确定授权给所选商家？',function(b){
                    if(b){
                        _this.props.addAuth(_this.selected);   
                    }
                });
    }
    
    render() {
        let p=this.props.actProduct;
        let strName=(Number.isInteger(p.channel)?(strChannel[p.channel]):'')+' '+p.brand+p.name;
        let list=this.list.map((ele,i)=>
            <ListItem 
                key={i} 
                primaryText={ele.name} 
                onTouchTap={()=>this.select(ele)} 
                leftCheckbox={
                    <Checkbox 
                        value={ele.objectId} 
                        checked={this.selected.includes(ele.objectId)} 
                        onCheck={this.checked}
                    />} 
                style={{borderBottom:'solid 1px #ccc'}}
            />
        );
        return (
            <div>
                <div style={styles.search_head}>
                    <div style={styles.search_box}>
                        <Input 
                            style={{height:'36px'}}
                            inputStyle={{height:'30px'}}
                            onChange={this.search} 
                            hintText={'搜索商家'}
                            value={this.state.keyword}
                        />
                    </div>
                </div>
                {/*<div style={{width:'100%',padding:'15px 0px',borderBottom:'1px solid #999999',textAlign:'center'}}>
                    授权产品：{strName}
                </div>*/}
                <div style={{margin:'10px',fontSize:'0.8em'}}>
                    请选择授权商家
                </div>
                {list}
                <div style={{width:'100%',padding:'30px 0px 20px',textAlign:'center'}}>
                    <RaisedButton label={___.ok} primary={true} onClick={this.authorize}/>
                </div>
            </div>
        );
    }
}

let strStatus=['待审核','已授权','已取消'];
class Authorized extends Component {
    constructor(props,context){
        super(props,context);
        this.bookCount=[];
        this.data=[];
        this.cancelAuth = this.cancelAuth.bind(this);
        this.reAuth = this.reAuth.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        let pid=nextProps.actProduct.productId;
        Wapi.booking.aggr(res=>{
            this.bookCount=res.data;
            this.data=nextProps.data.map(ele=>{
                let target=this.bookCount.find(item=>item._id.installId==ele.applyCompanyId);
                if(target){
                    ele.bookNum=target.status0;
                }else{
                    ele.bookNum=0;
                }
                return ele;
            });
            this.forceUpdate();
        },{
            "group":{
                "_id":{"installId":"$installId"},
                "status0":{"$sum":"$status0"}
            },
            "sorts":"objectId",
            "product.id":pid
        });
    }    
    cancelAuth(data){
        Wapi.authorize.update(res=>{
            W.alert('已取消'+data.applyCompanyName+'的授权',()=>{
                data.status=2;
                this.forceUpdate();
            });
        },{
            _objectId:data.objectId,
            status:2,
            cancelUserId:_user.objectId,
            cancelDate:W.dateToString(new Date())
        });
    }
    reAuth(data){
        Wapi.authorize.update(res=>{
            W.alert('已恢复'+data.applyCompanyName+'的授权',()=>{
                data.status=1;
                this.forceUpdate();
            });
        },{
            _objectId:data.objectId,
            status:1,
            approveUserId:_user.objectId,
            approveDate:W.dateToString(new Date())
        });
    }
    render() {
        let p=this.props.actProduct;
        let strName=(Number.isInteger(p.channel)?(strChannel[p.channel]):'')+' '+p.brand+p.name;
        let items=this.data.map((ele,i)=>
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
                        style={ele.status==1?styles.menu_item:styles.hide} 
                        primaryText={'取消授权'}
                        onTouchTap={()=>this.cancelAuth(ele)}
                    />
                    <MenuItem 
                        style={ele.status==2?styles.menu_item:styles.hide} 
                        primaryText={'恢复授权'}
                        onTouchTap={()=>this.reAuth(ele)}
                    />
                </IconMenu>
                <div style={{marginTop:'10px',marginBottom:'10px'}}>
                    {ele.applyCompanyName}
                </div>
                {/*<div>
                    <span>授权状态：</span><span>{strStatus[ele.status]}</span>
                    <span style={{marginLeft:'20px'}}>预约车主：</span><span>{ele.bookNum}</span>
                </div>*/}
                <div style={styles.line}>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{'授权状态'+' : '}</span>
                        <span style={ele.status==1?styles.span_right:styles.hide}>{strStatus[1]}</span>
                        <span style={ele.status==2?combineStyle(['span_right','warn']):styles.hide}>{strStatus[2]}</span>
                    </span>
                    <span style={styles.spans}>
                        <span style={styles.span_left}>{'预约车主'+' : '}</span>
                        <span style={styles.span_right}>{ele.bookNum}</span>
                    </span>
                </div>
            </div>
        );
        return (
            <div>
                <div style={{width:'100%',padding:'15px 0px',borderBottom:'1px solid #999999',textAlign:'center'}}>
                    授权产品：{strName}
                </div>
                <List style={styles.main}>
                    {items}
                </List>
            </div>
        );
    }
}


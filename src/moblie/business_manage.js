import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import DropDownMenu from 'material-ui/DropDownMenu';
import {Menu, MenuItem} from 'material-ui/Menu';
import AutoList from '../_component/base/autoList';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("业务管理");
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles = {
    main:{padding:'0 15px',paddingBottom:'0'},
    line:{marginTop:'10px',width:'106%'},
    card:{paddingBottom:'10px',borderBottom:'1px solid #f7f7f7'},
    spans:{width:'140px',display:'table-cell'},
    spanss:{width:'110px',display:'table-cell'},
    span_left:{fontSize:'0.5em',color:'#666666'},
    span_right:{fontSize:'0.5em'},
};

class App extends Component {
    constructor(props,context){
        super(props,context)
    }
    render() {
        // console.log(this.showBuss)
        return (
             <ThemeProvider style={{background:'#f7f7f7',minHeight:'100vh'}}>
                 {
                     _user.customer.custTypeId == 8 ?<CustTypeB />:<CustTypeA />
                 }
            </ThemeProvider>
        );
    }
}

//品、代商
class CustTypeA extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            type:0,
            actpro:[],
            product:[]
        }
        this.change = this.change.bind(this);
        this.hideBuss = this.hideBuss.bind(this);
        this.hideCom = this.hideCom.bind(this);
        this.showBuss = false;
        this.showCom = false;
    }
    componentDidMount() {
        window.addEventListener('AuthCom', e => {
            this.setState({actpro:e.params});
            this.showBuss=true;
            this.forceUpdate();
        })
        window.addEventListener('GetProduct', e => {
            this.setState({product:e.params})
            this.showCom = true;
            this.forceUpdate();
        })
    }
    hideBuss(){
        console.log(121212)
        this.showBuss = false;
        this.forceUpdate();
        // console.log(this.showBuss)
    }
    hideCom(){
        this.showCom = false;
        this.forceUpdate();
    }
    change(e,i,v){
        this.setState({type:v})
    }
    render(){
        return (
            <div>
                <div style={{paddingLeft:'10px'}}>
                    <DropDownMenu value={this.state.type} onChange={this.change} underlineStyle={{borderTop:0}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                        <MenuItem value={0} primaryText="业务" />
                        <MenuItem value={1} primaryText="门店" />
                    </DropDownMenu>
                </div>
                { this.state.type ? <CompanyList /> : <BussList /> }
                <SonPage open={this.showBuss} back={this.hideBuss}>
                    <BussAuCom data={this.state.actpro}/>
                </SonPage>
                <SonPage open={this.showCom} back={this.hideCom}>
                    <ActCom data={this.state.product}/>
                </SonPage>
            </div>
        )
    }
}
//服务商
class CustTypeB extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            data:[]
        }
        this.goTo = this.goTo.bind(this)
    }
    componentDidMount() {
        Wapi.authorize.list(res => {
            console.log(res.data,'readfa')
            this.setState({data:res.data})
        },{
            applyCompanyId:_user.customer.objectId,
            status:1
        })
    }
    goTo(){
        thisView.goTo('scan_move.js')
    }
    render(){
        let width = (window.screen.width-32)/3+'px'
        let items = this.state.data.map((ele,index) => (<ProductItem key={index} data={ele} />))
        return(
            <div>
                <div style={{lineHeight:'30px',textAlign:'left',background:'#f7f7f7',paddingLeft:'10px'}}>{'安装'}</div>                
                {items.length?
                    items
                    :
                    <MenuItem primaryText='暂无列表' style={{background:'#fff'}}/>
                }
                {/*<div style={{background:'#fff'}}>
                    <div style={{lineHeight:'30px',textAlign:'left',background:'#f7f7f7',paddingLeft:'10px'}}>
                        {'扫码挪车'}
                        <span onClick={()=>{this.goTo()}} style={{display:'inline-block',float:'right',width:'40px',height:30,textAlign:'center'}}>></span>
                    </div>
                    <div style={{fontSize:'12px',color:'#666',lineHeight:'40px',paddingLeft:10}}>
                        <span style={{display:'inline-block',width:width}}>{'客户'+'：'}</span>
                        <span style={{display:'inline-block',width:width}}>{'启用数量'+'：'}</span>
                        <span style={{display:'inline-block',width:width}}>{'绑定统计'+'：'}</span>
                    </div>
                </div>*/}
            </div>
        )
    }
}
class ProductItem extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            data:props.data,
            product:null
        }
    }
    componentDidMount() {
        Wapi.activityProduct.get(res => {
            this.setState({product:res.data})
        },{productId:this.state.data.productId})
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.data){
            // this.setState({data:props.data})
             Wapi.activityProduct.get(res => {
                this.setState({product:res.data})
            },{productId:nextProps.data.productId})
        }
    }
    render(){
        // let item = []
        console.log(this.state.product,'dfd')
        let ele = this.state.product
        let item = null;
        if(this.state.product){
            item = ( 
                <div  style={styles.card}>
                    <div style={styles.line}>
                        <span>{ele.brand +' '+ ele.name}</span>
                    </div>
                    <div style={styles.line}>
                        <span style={styles.spans}>
                            <span style={styles.span_left}>{___.activity_reward+' : '}</span>
                            <span style={styles.span_right}>{moneyFont(ele.reward)}</span>
                        </span>
                        <span style={styles.spanss}>
                            <span style={styles.span_left}>{'售价'+' : '}</span>
                            <span style={styles.span_right}>{moneyFont(ele.price)}</span>
                        </span>
                        <span style={styles.spans}>
                            <span style={styles.span_left}>{___.install_paymen+' : '}</span>
                            <span style={styles.span_right}>{moneyFont(ele.installationFee)}</span>
                        </span>
                    </div>
                </div>
            )
        }
         
        return(
            <div style={{background:'#fff'}}>
                 <List style={styles.main}>
                    {item}
                </List>
            </div>
        )
    }

}
function moneyFont(num){
    return Number(num).toFixed(2);
}

//业务
class BussList extends Component {
    constructor(props,context){
        super(props,context)
        this.state ={
            actPro: [],
            move:[],
            customerTotal:null
        }
        this.onCheck = this.onCheck.bind(this);
        //查询authorize的条件
        this._data = {
            applyCompanyId:_user.customer.objectId,
            status:1,
            authorizeType:3,
            actProductId:1
        }
        this.onCheck = this.onCheck.bind(this);
        this.goMove = this.goMove.bind(this);

    }
    componentDidMount() {
        Wapi.authorize.list(res => {
            if(res.data.length){ //有营销推广权限
                Wapi.activity.list(resp => {
                    let obj = [];
                    resp.data.forEach(ele => {
                        obj.push(ele.actProductId)
                    })
                    Wapi.activityProduct.list(respon => {
                        console.log(respon,'respon')
                        this.setState({actPro:respon.data})
                    },{
                        objectId:obj.join('|')
                    })
                },{
                    uid:_user.customer.objectId
                })
            }else{ //没有营销推广权限
                if(_user.customer.custTypeId == 5){ //当前为代理商
                    Wapi.activityProduct.list(respon => { //上级品牌商授权的营销产品
                        console.log(respon,'resp')
                        this.setState({actPro:respon.data})
                    },{
                        uid:_user.customer.parentId.join('|')
                    })
                }
            }
        },this._data)
        // Wapi.authorize.get(res => {
        //     this.setState({move:res.data})
        // },{
        //     applyCompanyId:_user.customer.objectId,
        //     status:1,
        //     authorizeType:3,
        //     actProductId:4
        // })
        // Wapi.customer.list(res => {
        //     if(res.data.length){
        //         this.setState({customerTotal:res.total})
        //     }
        // },{
        //     parentId:_user.customer.objectId,
        //     custTypeId:10
        // })
    }
    onCheck(data){
        console.log(data,'传的参数')
        W.emit(window,'AuthCom',data)
    }
    goMove(e,v){
        // console.log(e.target,v)
        if(v){
            thisView.goTo('scan_move.js')
        }
    }
    render() {
        // console.log(this.state.move,'move')
        let item = this.state.actPro.map((ele,index) => {
            let name;
            if(ele.uid == _user.customer.objectId){
                name = ___.regional_marketing+'  '+ele.brand+' '+ele.name
            }else {
                name = ___.national_marketing+'  '+ele.brand+' '+ele.name
            }
            return(
                <MenuItem 
                    rightIcon={<Checkbox style={{float:'right'}} />}
                    primaryText={name}
                    key={index}
                    onTouchTap={() => this.onCheck(Object.assign({},ele,{type:name}))}
                    style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                />
            )
        })
        let width = (window.screen.width-32)/3+'px'
        // let move = this.state.move?this.state.move
        return (
            <div>
                <div style={{background:'#fff'}}>
                     {item}
                </div>
            </div>
        );
    }
}
// 业务类型授权公司列表
class BussAuCom extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            data:props.data,
            showAuth:0,
            haveAuth:[]
        }
        this.showAuth = this.showAuth.bind(this);
        this.backAuth = this.backAuth.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.data){
            Wapi.authorize.list(res => {
                this.setState({haveAuth:res.data})
                // console.log(res.data,'ddfdfd')
            },{
                approveCompanyId:_user.customer.objectId,
                actProductId:nextProps.data.objectId,
            })
        }
    }
    showAuth(e,i,v){
        this.setState({showAuth:v})
    }
    backAuth(){
        this.setState({showAuth:0})
    }
    render() {
        console.log(this.props.data,"objectId")
        return (
            <div style={{background:'#f7f7f7',minHeight:'100vh'}}>
                <span style={{display:'inline-block',lineHeight:'48px',paddingLeft:'16px'}}>{this.props.data.type}</span>
                <DropDownMenu value={this.state.showAuth} onChange={this.showAuth} underlineStyle={{borderTop:0}} style={{float:'right'}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                    <MenuItem value={0} primaryText="已授权" />
                    <MenuItem value={1} primaryText="未授权" />
                </DropDownMenu>
                <div>
                    {
                        this.state.showAuth?
                        <BussAuthorizing data={this.state.haveAuth} back={this.backAuth} product={this.props.data}/>
                        :
                        <BussAuthorized data={this.state.haveAuth} back={this.backAuth}/>
                    }
                </div>
            </div>
        );
    }
}
//未授权
class BussAuthorizing extends Component {
    constructor(props,context){
        super(props,context);
        this.state ={
            data:props.data,
            total:0,
            noAuth:[]
        }
        // this.page = 1;
        // this.nextPage = this.nextPage.bind(this);;
        
    }
    componentDidMount() {
        Wapi.customer.list(res => {
            console.log(res.data,'resdatadddddddddddd')
            this.setState({total:res.total})
            this.setState({noAuth:res.data})
        },{
            parentId:_user.customer.objectId,
            isInstall:1
        },{limit:-1})
    }
    // componentWillReceiveProps(nextProps){
    //     if(nextProps&&nextProps.data){
    //         // this.page=1
    //         Wapi.customer.list(res => {
    //             console.log(res.total,'dddd')
    //             this.setState({total:res.total})
    //             this.setState({noAuth:res.data})
    //         },{
    //             parentId:_user.customer.objectId
    //         },{limit:-1})
    //     }    
    // }

    render() {
        console.log(this.state.noAuth,'获取到的customer信息')
        return (
            <div>
                <NoItem 
                    data={this.state.noAuth} 
                    authData={this.state.data}
                    backAuth={this.props.back}
                    product={this.props.product}
               />
            </div>
        );
    }
}
class NoItem extends Component{
    constructor(props,context){
        super(props,context);
        this.state ={
            data:props.data
        }
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.only = this.only.bind(this);
        this.data = []
    }
    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.data})
    }
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data,'data')
    }
    submit(){
        let hobj = [];
        let aobj = [];
        // var actProductId = "";
        // var brandId,brandName,productId,productName;
        // console.log('objjdjgdfjdkfjkdjf')
        this.data.forEach(ele => {
            if(ele.actProductId){
                hobj.push(ele.objectId);
                
                // actProductId = ele.actProductId
                // // console.log(ele.actProductId,'ele.actProductId')
                // if(ele.brandId){
                //     brandId = ele.brandId;
                //     // console.log(ele.brandId,'ele.brandId')
                //     brandName = ele.brandName;
                //     // console.log(ele.brandName,'ele.brandName')
                // }
                // if(ele.productId){
                //     productId = ele.productId
                //     // console.log(ele.productId,'ele.productId')
                // }
                // if(ele.productName){
                //     // productName = ele.productName
                //     // console.log(ele.prodcutName,'ele.productName')
                // }
            }else if(ele.custTypeId){
                aobj.push(ele)
            }
        })
        var create_json = {
            data: []
        }
        aobj.forEach(ele => {
            var op = {
                actProductId: this.props.product.objectId,
                applyCompanyId: ele.objectId,
                applyCompanyName: encodeURIComponent(ele.name),
                approveCompanyId: _user.customer.objectId,
                approveCompanyName: encodeURIComponent(_user.customer.name),
                approveDate:W.dateToString(new Date()),
                authorizeType: 1,   
                brandId: this.props.product.brandId,
                brandName: encodeURIComponent(this.props.product.brand),
                productId: this.props.product.productId,  
                productName: encodeURIComponent(this.props.product.name),
                status: 1
            }
            create_json.data.push(op)
        })
        console.log(aobj,'要添加的obj')
        console.log(hobj,'要更新的obj')
        console.log(create_json,'create_json')
        if(create_json.data.length){
            Wapi.authorize.addBatch(res => {
                this.props.backAuth()
                history.back()
            },create_json)
        }
        if(hobj.length){
            Wapi.authorize.update(res => {
                this.props.backAuth()
                history.back()
            },{_objectId:hobj.join('|'),status:1})
        }
    }
    only(data){
        var newArr = [];
        var json = {};
        for(var i = 0; i < data.length; i++){
            if(data[i].objectId){
                if(!json[data[i].objectId]){
                    newArr.push(data[i]);
                    json[data[i].objectId] = 1;
                }
            }
        }
        return newArr
    }
    render() {
        // let 

        console.log(this.state.data,'所有的customer信息')
        console.log(this.props.authData,'所有的anthorize信息')
        let noAuth = []
        noAuth = this.props.authData.filter(ele => {
            if(ele.status != 1){
                return ele
            }
        })
        let aobj = [].concat(this.state.data);
        // if(this.state.length&&this.props.authData.lengtyh)

        //用add标记已经存在的customer表
        aobj.forEach((ele,index) => {
            this.props.authData.forEach((element,i) => {
                if(ele.objectId == element.applyCompanyId ){
                    ele.add = 1
                }
            })
        })
        // this.state.data.map(ele => {
        //     if()
        // })
        // let hh = this.only(aobj)
        console.log(aobj,'未存在的authorize')
        // console.log(hh,'hhhhhhh')
        console.log(noAuth,'已经存在但未授权')
        // let obj = noAuth.concat(aobj); //获得所有的已存在但未授权的authorize
        //添加customer到列表中
        aobj.forEach(ele => {
            if(!ele.add){
                noAuth.push(ele)
            }
        })
        // console.log(obj,'obj')
        console.log(noAuth,'已经存在但未授权')
        let items = [];
        noAuth.map((ele,index)=>{
                    if(ele.applyCompanyId){
                        items.push(<MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={ele.applyCompanyName}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />)
                    }else if(ele.custTypeId){
                        items.push(<MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={ele.name}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />)
                    } 
                });
        return(
            <div >
                {items}
                {items.length?<RaisedButton label="确认授权" style={{padding:'20px 0' ,background:'#f7f7f7'}} onClick={this.submit} secondary={true} fullWidth={true}/>:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff',textAlign:'center'}}/>}
            </div>
        )
    }
}
let NoAuthList = AutoList(NoItem)


//已授权
class BussAuthorized extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            data:props.data,
            haveAuth:[]
        }
        this.data = [];
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
    }
    // componentDidMount() {
        
    // }
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data,'data')
    }
    submit(){
        let obj = [];
        this.data.forEach(ele => {
            obj.push(ele.objectId)
        })
        Wapi.authorize.update(res => {
            history.back();
        },{_objectId:obj.join('|'),status:2,authorizeType:1})
    }
    render() {
        // console.log(this.props.data,'haveauth')
        let items = this.props.data.map((ele,index) => {
            if(ele.status == 1){ //已授权
                return(
                    <MenuItem 
                        rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                        primaryText={ele.applyCompanyName}
                        key={index}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                    />
                )
            }
        })
        return (
            <div>
                {/*<HaveAList 
                    max={this.props.data}
                />*/}
                {items}
                {items.length?<RaisedButton label="取消授权" style={{padding:'20px 0',background:'#f7f7f7'}} onClick={this.submit} secondary={true} fullWidth={true}/>:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff',textAlign:'center'}}/>}
            </div>
        );
    }
}

// let HaveAList = 

//门店
class CompanyList extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            compData: [],
            total:0
        }
        this.page = 1;
        this.loadNextPage = this.loadNextPage.bind(this);
    }
    componentDidMount() {
        Wapi.customer.list(res => {
            this.setState({total:res.total})
            this.setState({compData:res.data})
        },{parentId:_user.customer.objectId,isInstall:1}, {page_no:this.page})
    }
    
    loadNextPage(){
        let arr=this.state.compData;
        this.page++;
        Wapi.customer.list(res=>{
            this.setState({compData:arr.concat(res.data)});
        },{parentId:_user.customer.objectId,isInstall:1},{
            page_no:this.page
        });
    }
    render(){
        return (
            <div>
               <Comlist 
                    max={this.state.total} 
                    limit={20} 
                    data={this.state.compData} 
                    next={this.loadNextPage} 
               />
            </div>
        )
    }
}

class CompanyItem extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state ={
            data:props.data
        }
        this.touch = this.touch.bind(this)
    }
    componentWillReceiveProps(nextProps){
        this.setState({data:nextProps.data})
    }
    touch(data){
        console.log(data,'事件参数')
        W.emit(window,'GetProduct',data)
    }
    render() {
        let items=this.state.data.map((ele,index)=>{
                    return ( <MenuItem 
                        rightIcon={<Checkbox style={{float:'right'}} />}
                        primaryText={ele.name}
                        key={index}
                        value={ele}
                        onTouchTap={() => this.touch(ele)}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                    />)});
        return(
            <div >
                {items}
            </div>
        )
    }
}
let Comlist=AutoList(CompanyItem);

//门店授权产品
class ActCom extends Component{
    constructor(props,context){
        super(props,context)
        this.state ={
            showAuth: 0,
            allPro:[],
            authPro:[]
        }
        this.showAuth = this.showAuth.bind(this)
        this.back = this.back.bind(this);
        this._data = {
            applyCompanyId:_user.customer.objectId,
            status:1,
            authorizeType:3,
            actProductId:1
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.data){
            console.log(nextProps.data,'this.data')
            Wapi.authorize.list(res => {
                if(res.data.length){ //有营销推广权限
                    Wapi.activity.list(resp => {
                        let obj = [];
                        resp.data.forEach(ele => {
                            obj.push(ele.actProductId)
                        })
                        Wapi.activityProduct.list(respon => {
                            console.log(respon,'respon')
                            this.setState({allPro:respon.data})
                            let obj = [];
                            respon.data.forEach(ele => {
                                obj.push(ele.objectId)
                            })
                            Wapi.authorize.list(r => {
                                this.setState({authPro:r.data})
                            },{actProductId:obj.join('|'),applyCompanyId:nextProps.data.objectId},{limit:-1})
                        },{objectId:obj.join('|')})
                    },{uid:_user.customer.objectId})
                }else{ //没有营销推广权限
                    if(_user.customer.custTypeId == 5){ //当前为代理商
                        // Wapi.authorize.list(resp => {
                        //     let obj = [];
                        //     resp.forEach(ele => {
                        //         obj.push(ele.applyCompanyId)
                        //     })
                        //     Wapi.activityProduct.list(respon => {
                        //         console.log(respon,'resp')
                        //         this.setState({actPro:resp.data})
                        //     },{uid:_user.customer.parentId.join('|')})
                        // },{
                        //     approveCompanyId:_user.customer.parentId.join('|'),
                        //     status:1,
                        //     authorizeType:1
                        // })
                        Wapi.activityProduct.list(respon => { //上级品牌商授权的营销产品
                            console.log(respon,'resp')
                            this.setState({allPro:respon.data})
                            let obj = [];
                            respon.data.forEach(ele => {
                                obj.push(ele.objectId)
                            })
                            Wapi.authorize.list(r => {
                                this.setState({authPro:r.data})
                            },{actProductId:obj.join('|'),applyCompanyId:nextProps.data.objectId},{limit:-1})
                        },{uid:_user.customer.parentId.join('|')})
                    }
                }
            },this._data)
        }
    }
    showAuth(e,i,v){
        this.setState({showAuth:v})
    }
    
    back(){
        this.setState({showAuth:0})
    }
    render(){
        console.log(this.props.data,'zuixinde')
        return(
            <div style={{background:'#f7f7f7',minHeight:'100%'}}>
                <span style={{display:'inline-block',lineHeight:'48px',paddingLeft:'16px'}}>{this.props.data.name}</span>
                <DropDownMenu value={this.state.showAuth} onChange={this.showAuth} underlineStyle={{borderTop:0}} style={{float:'right'}} labelStyle={{padding:'0 20px 0 6px',lineHeight:'48px'}} iconStyle={{top:14,right:-2}}>
                    <MenuItem value={0} primaryText="已授权" />
                    <MenuItem value={1} primaryText="未授权" />
                </DropDownMenu>
                <div>
                    {
                        this.state.showAuth?
                        <ActAuthorizing data={this.props.data} backAuth={this.back} allPro={this.state.allPro} authPro={this.state.authPro}/>
                        :
                        <ActAuthorized allPro={this.state.allPro} authPro={this.state.authPro}/>
                    }
                </div>
            </div>
        )
    }
}
//已授权
class ActAuthorized extends Component {
    constructor(props,context){
        super(props,context)
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.data = []
    }
  
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data,'data')
    }
    submit(){
        let obj = [];
        this.data.forEach(ele => {
            obj.push(ele.objectId)
        })
        Wapi.authorize.update(res => {
            history.back();
        },{_objectId:obj.join('|'),status:2})
    }
    render(){
        console.log(this.props.allPro,'所有的营销产品')
        let auth = only(this.props.authPro);
        auth.forEach(ele => {
            this.props.allPro.forEach(element => {
                if(ele.actProductId == element.objectId){
                    ele.channel = element.channel;
                    ele.brandName = element.brand;
                    ele.productName = element.name

                }
            })
        })
        console.log(auth,'suthoiie')
        console.log(only(this.props.authPro),'所有在授权表中的产品')
        let items = []
        auth.forEach((ele,index) => {
            let name = ele.channel?'本地安装':'全国安装' 
            if(ele.status == 1){
                 items.push( <MenuItem 
                        rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                        primaryText={name+' '+ele.brandName+ele.productName}
                        key={index}
                        style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                />)
            }
        })
        return(
            <div>
                {items}
                {items.length?<RaisedButton label="取消授权" style={{background:'#f7f7f7',padding:'20px 0'}} onClick={this.submit} secondary={true} fullWidth={true} />:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff',textAlign:'center'}}/>}
            </div>
        )
    }
}
//未授权
class ActAuthorizing extends Component {
    constructor(props,context){
        super(props,context)
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.data = []
    }
    check(e,val){
        if(val){
            this.data.push(JSON.parse(e.target.value))
        }else{
            this.data.splice(this.data.indexOf(JSON.parse(e.target.value)),1)
        }
        console.log(this.data,'data')
    }
    
    submit(){
        let obj = [];
        let aobj = [];
        this.data.forEach(ele => {
            if(ele.actProductId&&ele.status != 1){
                obj.push(ele.objectId)
            }else if(ele.uid){
                aobj.push(ele)
            }
        })
        var create_json = {
            data: []
        }
        aobj.forEach(ele => {
            var op = {
                actProductId: ele.objectId,
                applyCompanyId: this.props.data.objectId,
                applyCompanyName: encodeURIComponent(this.props.data.name),
                approveCompanyId: _user.customer.objectId,
                approveCompanyName: encodeURIComponent(_user.customer.name),
                approveDate:W.dateToString(new Date()),
                authorizeType: 1,   
                brandId: ele.brandId,
                brandName: encodeURIComponent(ele.brand),
                productId: ele.productId,  
                productName: encodeURIComponent(ele.name),
                status: 1
            }
            create_json.data.push(op)
        })
        console.log(aobj,'要添加的obj')
        console.log(obj,'要更新的obj')
        console.log(create_json,'create_json')
        if(create_json.data.length){
            Wapi.authorize.addBatch(res => {
                this.props.backAuth()
                history.back()
            },create_json)
        }
        if(obj.length){
            Wapi.authorize.update(res => {
                this.props.backAuth()
                history.back()
            },{_objectId:obj.join('|'),status:1})
        }
        // console.log(obj,'obj')
    }
    render(){
        console.log(this.props.allPro,'所有的营销产品')
        console.log(only(this.props.authPro),'所有在授权表中的产品')
        let auth = only(this.props.authPro);
        let allPro = this.props.allPro;
        let all = auth
        auth.forEach(ele => {
            this.props.allPro.forEach(element => {
                if(ele.actProductId == element.objectId){
                    ele.channel = element.channel;
                    ele.brandName = element.brand;
                    ele.productName = element.name

                }
            })
        })
        allPro.forEach(ele => {
            auth.forEach(element => {
                if(ele.objectId == element.actProductId){
                    ele.isExist = 1
                }
            })
        })
        console.log(allPro,'authiruz')
        allPro.forEach(ele => {
            if(!ele.isExist){
                all.push(ele)
            }
        })
        // all = auth.concat(allPro)
        console.log(auth,'all')
        let items = []
        all.forEach((ele,index) => {
            if(ele.name){
                let name = ele.channel?'本地安装':'全国安装'
                items.push(<MenuItem 
                            rightIcon={<Checkbox  value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={name+' '+ele.brand+ele.name}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />)
            }else if(ele.applyCompanyId&&ele.status != 1){
                let name = ele.channel?'本地安装':'全国安装'
                items.push(<MenuItem 
                            rightIcon={<Checkbox onCheck={this.check} value={JSON.stringify(ele)} style={{float:'right'}} />}
                            primaryText={name+' '+ele.brandName+ele.productName}
                            key={index}
                            style={{borderBottom: '1px solid #f7f7f7',background:'#fff'}}
                        />)  
            }
        })
        return(
            <div>
                {items}
                {items.length?<RaisedButton label="确认授权" style={{padding:'20px 0' ,background:'#f7f7f7'}} onClick={this.submit} secondary={true} fullWidth={true}/>:<MenuItem primaryText='暂无已授权列表' style={{background:'#fff',textAlign:'center'}}/>}
            </div>
        )
    }
}
function only(data){
    var newArr = [];
    var json = {};
    for(var i = 0; i < data.length; i++){
        if(data[i].actProductId){
            if(!json[data[i].actProductId]){
                newArr.push(data[i]);
                json[data[i].actProductId] = 1;
            }
        }
    }
    return newArr
}
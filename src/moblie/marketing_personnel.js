"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';
import {makeRandomEvent} from '../_modules/tool';


const styles = {
    main:{paddingTop:'50px'},
    card:{padding:'0 10px'},
    box:{
        borderBottom:'1px solid #ccc'
    },
    emp:{
        lineeight:'40px',
        padding:'0 2em'
    },
    a:{
        color: 'rgb(26, 140, 255)',
        marginRight:'2em'
    },
    t:{
        top: '-3px'
    },    
    select:{
        width:'100%',
        textAlign:'left'
    },
};

const EVENT=makeRandomEvent({
    typeAdd:'type_add',
    typeUpdate:'type_update',
    openAddBox:'open_add_box',
    getPerson:'get_person'
});
if(!_user.customer.sellerWxAppKey)
    Wapi.weixin.get(function(res){
        _user.customer.sellerWxAppKey=res.data?res.data.wxAppKey:null;
    },{
        uid:_user.customer.objectId,
        type:1
    });


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<AppDeviceManage/>,thisView);
    thisView.prefetch('person_list.js',2);
});

class AppDeviceManage extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            showAdd:false,
            data:null,
            showPerson:false,
            depId:0,
            depName:''
        }
        this.toList=this.toList.bind(this);
        this.openBox = this.openBox.bind(this);
        this.openPerson = this.openPerson.bind(this);
    }
    componentDidMount() {
        window.addEventListener(EVENT.openAddBox,this.openBox);
        // window.addEventListener(EVENT.getPerson,this.openPerson);
    }
    componentWillUnmount() {
        window.removeEventListener(EVENT.openAddBox,this.openBox);
        // window.removeEventListener(EVENT.getPerson,this.openPerson);
    }
    
    openBox(e){
        let data=e?e.params:{};
        this.setState({data,showAdd:true});
    }
    openPerson(e){
        // let data=e?e.params:{};
        // this.setState({depId:data.objectId,depName:data.name,showPerson:true});
        
    }

    toList(){
        this.setState({showAdd:false,showPerson:false});
    }

    render(){
        let rightIcon=<IconButton onClick={this.openBox}><ContentAdd/></IconButton>;
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.marketing_personnel} 
                        style={{position:'fixed'}} 
                        iconElementRight={rightIcon}
                    />
                    <div name='list' style={styles.main}>
                        <TypeAutoList/>
                    </div>

                    <SonPage title={___.register_type} open={this.state.showAdd} back={this.toList}>
                        <AddBox data={this.state.data}/>
                    </SonPage>
                    
                </div>
            </ThemeProvider>
        );
    }
}

//单个类别
class TypeItem extends Component{
    constructor(props, context) {
        super(props, context);
        this.toUpdate = this.toUpdate.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.update = this.update.bind(this);
        this.getPerson = this.getPerson.bind(this);
    }
    getUrl(){
        if(!_user.customer.sellerWxAppKey){
            W.alert(___.seller_wx_app_null);
            return;
        }
        let opt={
            title:___.invitation_url,
            text:location.origin+'/?location=tempRegister.html&intent=logout&needOpenId=true&parentId='
                +_user.customer.objectId
                +'&departId='+this.props.data.objectId
                +'&wx_app_id='+_user.customer.sellerWxAppKey
        }
        W.alert(opt);
    }
    toUpdate(){
        window.addEventListener(EVENT.typeUpdate,this.update);
        W.emit(window,EVENT.openAddBox,Object.assign({},this.props.data));
    }
    update(e){
        Object.assign(this.props.data,e.params);
        window.removeEventListener(EVENT.typeUpdate,this.update);
        this.forceUpdate();
    }
    getPerson(){
        thisView.goTo('person_list.js',Object.assign({},this.props.data));
        // W.emit(window,EVENT.getPerson,Object.assign({},this.props.data));
    }
    render() {
        return (
            <div style={styles.box}>
                <h4>
                    {this.props.data.name}
                    <FlatButton label={___.edit} onClick={this.toUpdate} primary={true}/>
                </h4>
                <div>
                    <span>{___.register_num+'：'}</span>
                    <a onClick={this.getPerson} style={styles.a}>{this.props.data.total||0}</a>
                    <FlatButton style={styles.t} label={___.register_url} onClick={this.getUrl} primary={true}/>
                </div>
            </div>
        );
    }
}

//单页类别
class TypePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:this.props.data
        }
    }
    
    componentDidMount() {
        let data=this.state.data.concat();
        let totals={};
        data.forEach(d=>totals[d.objectId]=0);
        let depId=data.map(d=>d.objectId).join('|');

        Wapi.employee.list(res=>{
            res.data.forEach(e=>totals[e.departId]++);
            data.forEach(d=>d.total=totals[d.objectId]);
            this.setState({data});
        },{
            departId:depId
        },{
            limit:-1
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data:nextProps.data});
    }
    

    render() {
        let item=this.state.data.map(e=>(<TypeItem data={e} key={e.objectId}/>));
        return (
            <div style={styles.card}>
                {item}
            </div>
        );
    }
}

let Alist=AutoList(TypePage);

//自动加载下一页类别列表
class TypeAutoList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:0
        }
        this.page=1;
        this.loadNextPage = this.loadNextPage.bind(this);
        this.add = this.add.bind(this);
        this.op={
            page:'createdAt',
            sorts:'-createdAt',
            limit:20,
            fields:'isSimProvider,objectId,name,parentId,treePath,adminId,type'
        }
        this._data={
            uid:_user.customer.objectId,
            type:1
        }
    }
    
    componentDidMount() {//初始化数据
        Wapi.department.list(res=>this.setState(res),this._data,Object.assign(this.op,{page_no:this.page}));
        window.addEventListener(EVENT.typeAdd,this.add);
    }
    add(e){
        let newType=e.params;
        newType.total=0;
        let data=[newType].concat(this.state.data);
        let total=this.state.total+1;
        this.setState({data,total});
    }
    componentWillUnmount() {
        window.removeEventListener(EVENT.typeAdd,this.add);
    }
    

    loadNextPage(){
        //加载下一页的方法
        let arr=this.state.data;
        this.page++;
        Wapi.department.list(res=>this.setState({data:arr.concat(res.data)}),this._data,Object.assign(op,{page_no:this.page}));
    }
    
    render() {
        return (
            <Alist 
                max={this.state.total} 
                limit={this.op.limit} 
                data={this.state.data} 
                next={this.loadNextPage} 
            />
        );
    }
}


//添加修改类别
class AddBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            name:props.data?props.data.name:'',
            adminId:0
        };
        this._data={
            type:1,
            uid:_user.customer.objectId
        };
        this.managers=[];
        this.change = this.change.bind(this);
        this.adminChange = this.adminChange.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.setState({
                name:nextProps.data.name,
                adminId:nextProps.data.adminId
            });
        }else{
            this.setState({
                name:'',
                adminId:'0'
            });
        }
        Wapi.employee.list(res=>{
            this.managers=res.data;
            this.forceUpdate();
        },{
            companyId:_user.customer.objectId,
            departId:'>0',
            isQuit:false
        });
    }
    
    change(e,name){
        this.setState({name});
    }
    adminChange(e,v,adminId){
        this.setState({adminId});
    }
    submit(){
        let data=Object.assign({},this.state,this._data);
        if(data.name==''){
            W.alert(___.input_type);
            return;
        }
        if(data.adminId==0){
            W.alert(___.please_select_manager);
            return;
        }
        if(this.props.data&&this.props.data.objectId){
            data._objectId=this.props.data.objectId;
            Wapi.department.update(res=>{
                data.objectId=data._objectId;
                delete data._objectId;
                W.emit(window,EVENT.typeUpdate,data);
                this.cancel();
            },data);
        }else{
            Wapi.department.add(res=>{
                data.objectId=res.objectId;
                W.emit(window,EVENT.typeAdd,data);
                this.cancel();
            },data);
        }
    }
    cancel(){
        history.back();
        this.setState({
            name:''
        });
    }
    render() {
        let managers=this.managers;
        let items=managers.map(ele=><MenuItem key={ele.objectId} value={ele.objectId.toString()} primaryText={ele.name}/>);
        items.unshift(<MenuItem key={0} value={0} primaryText={___.please_select_manager} />);
        return (
            <div style={styles.card}>
                <Input hintText={___.input_type} value={this.state.name} onChange={this.change}/>
                <SelectField floatingLabelText={___.business_namager} value={this.state.adminId} onChange={this.adminChange} style={styles.select} maxHeight={500}>
                    {items}
                </SelectField>
                <div style={{textAlign:'right'}}>
                    <FlatButton label={___.cancel} onClick={this.cancel} primary={true}/>
                    <FlatButton label={___.ok} onClick={this.submit} primary={true}/>
                </div>
            </div>
        );
    }
}
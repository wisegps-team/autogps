"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Checkbox from 'material-ui/Checkbox';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';
import {makeRandomEvent} from '../_modules/tool';
import ImageAdjust from 'material-ui/svg-icons/image/adjust'


const styles = {
    main:{paddingTop:'50px'},
    card:{padding:'0 10px'},
    box:{
        borderBottom:'1px solid #ccc',
        padding:'10px'
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
    search:{
        display: 'flex',
        paddingLeft: '10px',
        paddingRight: '5px',
        alignItems: 'center'
    }
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
thisView.setTitle(___.group_marketing);
let _emply=[];
thisView.addEventListener('load',function(){
    Wapi.employee.list(res=>{
        _emply=res.data;
        ReactDOM.render(<AppDeviceManage/>,thisView);
    },{companyId:_user.customer.objectId},{limit:-1,fields:'name,objectId'})

    thisView.prefetch('person_list.js',2);
    thisView.prefetch('share_register.js',2);
});

class AppDeviceManage extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            showAdd:false,
            data:null,
            showPerson:false,
            depId:0,
            depName:'',
            search:[]
        }
        this.toList=this.toList.bind(this);
        this.openBox = this.openBox.bind(this);
        this.openPerson = this.openPerson.bind(this);
        this.search = this.search.bind(this);
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
    componentDidUpdate(prevProps, prevState) {
        let title=this.state.showAdd?___.register_type:___.group_marketing;
        thisView.setTitle(title);
    }
    
    search(e,val){
        if(!val){
            this.setState({search:[]});
            return;
        }
        let data={
            uid:_user.customer.objectId,
            type:1
        };
        if(_user.employee){
            data.adminId=_user.employee.objectId;
        };
        data.name='^'+val;
        Wapi.department.list(res=>{
            this.setState({search:res.data});
        },data);
    }
    render(){
        let listDis={};
        let searchList=null;
        if(this.state.search.length){
            searchList=<TypePage data={this.state.search}/>;
            listDis.display='none';
        }
        return(
            <ThemeProvider>
                <div>
                    <div style={styles.search}>
                        <Input 
                            onChange={this.search} 
                            hintText={___.search} 
                        />
                        <IconButton 
                            onClick={this.openBox} 
                            style={_user.employee?{display:'none'}:{flex:'0 0'}}
                        >
                            <ContentAdd/>
                        </IconButton>
                    </div>
                    <div name='list' style={listDis}>
                        <TypeAutoList/>
                    </div>
                    {searchList}
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
        this.click = this.click.bind(this);
    }
    getUrl(){
        let wx_app_id=W.getCookie('current_wx');//统一使用当前公众号
        
        let url=location.origin+'/?location=tempRegister.html&intent=logout&needOpenId=true&parentId='
                +_user.customer.objectId
                +'&departId='+this.props.data.objectId
                +'&wx_app_id='+wx_app_id
                +'&name='+this.props.data.name;
        thisView.goTo('share_register.js',url);
    }
    toUpdate(){
        // window.addEventListener(EVENT.typeUpdate,this.update);
        window.addEventListener('eventudpate'+this.props.data.objectId,this.update);
        W.emit(window,EVENT.openAddBox,Object.assign({},this.props.data));
    }
    update(e){
        Object.assign(this.props.data,e.params);
        // window.removeEventListener(EVENT.typeUpdate,this.update);
        window.removeEventListener('eventudpate'+this.props.data.objectId,this.update);
        this.forceUpdate();
    }
    delete(){
        if(this.props.data.total){
            W.alert(___.mp_delete);
            return;
        }
        W.confirm(___.confirm_remove.replace('<%name%>',this.props.data.name),e=>{
            e?Wapi.department.delete(res=>{
                W.alert(___.delete_success);
                this.props.reload();
                // this.forceUpdate();
            },{
                objectId:this.props.data.objectId
            }):null;
        });
        // Wapi.activity.list(res => {
        //     if(res.data&&res.data.length){
        //         W.alert(___.activity_no_delete)
        //     }else{
        //         W.confirm(___.confirm_remove.replace('<%name%>',this.props.data.name),e=>{
        //             e?Wapi.department.delete(res=>{
        //                 W.alert(___.delete_success);
        //                 this.props.reload();
        //                 // this.forceUpdate();
        //             },{
        //                 objectId:this.props.data.objectId
        //             }):null;
        //         });
        //     }
        // },{
        //     sellerTypeId: this.props.data.objectId
        // })
        
    }
    getPerson(){
        thisView.goTo('person_list.js',Object.assign({},this.props.data));
    }
    click(i){
        switch (i) {
            case 0:
                this.toUpdate();
                break;
            case 1:
                this.getUrl();
                break;
            case 2:
                this.delete();
                break;
            default:
                break;
        }
    }
    render() {
        let admin=_emply.find(ele=>ele.objectId==this.props.data.adminId);
        let adminName=___.unconfig;
        if(admin){
            adminName=_emply.find(ele=>ele.objectId==this.props.data.adminId).name||'';
        }
        // console.log(this.props.data,'there props data')
        return (
            <div style={styles.box}>
                <div style={{marginBottom:'8px'}}>
                    {this.props.data.name}
                    <RightIconMenu onClick={this.click}/>
                </div>
                {/* <div style={{fontSize:'12px',color:'#666'}}>
                    <span style={{marginRight:'15px'}}>{___.business_namager+'：'+adminName}</span>
                    <span>{___.register_num+'：'}</span>
                    <a onClick={this.getPerson} style={styles.a}>{this.props.data.total||0}</a>
                </div> */}
                <div style={{position:'relative',fontSize:'12px',marginBottom:'8px'}}>
                    <ImageAdjust style={{width:'12px',height:12,position:'absolute',top:3}}/>
                    <span style={{marginLeft:'15px'}}>{adminName}</span>
                </div>
                <div style={{fontSize:'12px',color:'#666'}}>
                    <span>{'账号'+'：'}</span>
                    <a onClick={this.getPerson} style={styles.a}>{this.props.data.total||0}</a>
                    <span>{'推广'+'：'}</span>
                    <a style={{marginRight:'2em'}}>{this.props.data.promTotal||0}</a>
                    <span>{'预订'+'：'}</span>
                    <a>{this.props.data.bookTotal||0}</a>
                </div>
            </div>
        );
    }
}

class RightIconMenu extends Component{    
    render() {
        let item=[
            <MenuItem key={0} onTouchTap={()=>this.props.onClick(0)}>{___.edit}</MenuItem>,
            <MenuItem key={1} onTouchTap={()=>this.props.onClick(1)}>{___.register}</MenuItem>,
            <MenuItem key={2} onTouchTap={()=>this.props.onClick(2)}>{___.delete}</MenuItem>
        ];
        let items=item;
        if(_user.employee){
            items=[item[1]];
        }
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton style={{
                        width: 'auto',
                        height: 'auto',
                        padding: 0
                    }}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                style={{
                    float: 'right'
                }}
            >
                {items}
            </IconMenu>
        );
    }
}

//单页类别
class TypePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:this.props.data,
            promTotal:0,
            bookTotal:0
        }
        this.state.data.forEach(d=>d.total=___.loading);
    }
    
    componentDidMount() {
        let data=this.state.data.concat();
        //注册
        let totals={};
        data.forEach(d=>totals[d.objectId]=0);
        let depId=data.map(d=>d.objectId).join('|');
        //推广
        let promTotal = {};
        data.forEach(d => promTotal[d.objectId]=0)
        //预订
        let bookTotal = {};
        data.forEach(d => bookTotal[d.objectId]=0);

        Wapi.employee.list(res=>{
            res.data.forEach(e=>totals[e.departId]++);
            // console.log(totals,'totals')
            // console.log(res.data,'employee res data')
            data.forEach(d=>d.total=totals[d.objectId]);
            // console.log(data,'com data')
            Wapi.promotion.list(pro => {
                // console.log(pro.data,'promotion data')
                pro.data.forEach(e => promTotal[e.pertypeId]++);
                data.forEach(d => d.promTotal = promTotal[d.objectId])
                // this.setState
                


                Wapi.activity.list(act => {
                    let actId = act.data.map(ac => ac.objectId).join('|')
                    let activity = {};
                    act.data.forEach(ac => activity[ac.objectId]=0);

                    Wapi.booking.list(bo => {
                        bo.data.forEach(b => activity[b.activityId]++);
                        act.data.forEach(a => a.bookTotal = activity[a.objectId]);
                        act.data.forEach(a => bookTotal[a.sellerTypeId] = a.bookTotal);
                        data.forEach(d => d.bookTotal = bookTotal[d.objectId]);
                        this.setState({data});

                    },{
                        uid: _user.customer.objectId,
                        activityType: 1,
                        activityId: actId
                    },{
                        limit: -1
                    })
                },{
                    sellerTypeId:depId
                },{
                    limit: -1
                })


            },{
                maractcompanyId:_user.customer.objectId,
                martypeId:1,
                pertypeId:depId
            },{
                limit:-1
            })
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
        let item=this.state.data.map(e=>(<TypeItem data={e} key={e.objectId} reload={this.props.reload}/>));
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
        this.reload = this.reload.bind(this);
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
        if(_user.employee){
            this._data.adminId=_user.employee.objectId;
        };
    }
    
    componentDidMount() {//初始化数据
        Wapi.department.list(res=>this.setState(res),this._data,Object.assign(this.op,{page_no:this.page}));
        window.addEventListener(EVENT.typeAdd,this.add);
        window.addEventListener('depart_data_change',(e)=>{
            this.state.data.map(ele=>{
                if(ele.objectId==e.params.oldDep){
                    ele.total--;
                }else if(ele.objectId==e.params.newDep){
                    ele.total++;
                }
            });
            this.forceUpdate();
        });
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
    reload(){
        Wapi.department.list(res=>this.setState(res),this._data,Object.assign(this.op,{page_no:this.page}));
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
                reload={this.reload}
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
        // Wapi.employee.list(res=>{
        //     console.log(res.data,'test marketing employee data')
        //     this.managers=res.data;
        //     this.forceUpdate();
        // },{
        //     companyId:_user.customer.objectId,
        //     departId:'>0',
        //     isQuit:false
        // });

        Wapi.page.get(res => {
            let op = []
            res.data.ACL.forEach(ele => {
                op.push(ele.replace('role:', ''));

            })
            Wapi.role.list(re => {
                console.log(re.data)
                let obj = [];
                re.data.forEach(ele => {
                    obj.push(ele.objectId)
                })
                Wapi.employee.list(ress => {
                    // console.log(ress.data)
                    this.managers=ress.data;
                    this.forceUpdate();
                },{
                    roleId:obj.join('|'),
                    companyId:_user.customer.objectId
                })
            },{
                objectId:op.join('|'),
                uid:_user.customer.objectId
            })
        },{
            name:'集团营销'
        },{
            fields:'ACL'
        })
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
                // W.emit(window,EVENT.typeUpdate,data);
                W.emit(window,'eventudpate'+data.objectId,data);
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
//角色管理

import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Card from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';
import SonPage from '../_component/base/sonPage';
import Input from '../_component/base/input';

import STORE from '../_reducers/main';
import {role_act} from '../_reducers/dictionary';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    appbar:{position:'fixed',top:'0px',left:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'50px',paddingBottom:'20px'},
    sonpage_main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'10px',paddingBottom:'20px'},
    card:{marginTop:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'5px'},
    checkbox: {marginBottom: '16px'},
    hide:{display:'none'},
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            // total:0,
            show_sonpage:false,
            isEdit:false,
        }
        this.curRole={};
        this.roles=[];

        this.addRole=this.addRole.bind(this);
        this.addRoleCancel=this.addRoleCancel.bind(this);
        this.addRoleSubmit=this.addRoleSubmit.bind(this);
        this.editRole=this.editRole.bind(this);
        //暂时去掉角色修改的功能，角色修改页面目前只能查看，不能修改
        this.editRoleCancel=this.editRoleCancel.bind(this);
        this.editRoleSubmit=this.editRoleSubmit.bind(this);
    }
    componentDidMount(){
        // Wapi.role.list(res=>{//获取所有角色
        //     this.roles=res.data;
        //     this.setState({
        //         total:res.total,
        //     });
        // },{objectId:'>0'})
        this.roles=STORE.getState().role;
        this.forceUpdate();
    }
    addRole(){
        this.curRole={};
        this.setState({
            show_sonpage:true,
            isEdit:false,
        });
    }
    addRoleCancel(){
        this.setState({show_sonpage:false});
    }
    addRoleSubmit(data){
        if(data.name==''){
            W.alert(___.name+___.not_null);
            return;
        }
        if(data.pages.length==0){
            W.alert(___.permission+___.not_null);
            return;
        }
        let params={
            name:data.name,
            uid:_user.customer.objectId,
            appId:WiStorm.config.objectId
        };
        Wapi.role.add(res=>{    //新建一个角色
            let par={
                _objectId:data.pages.join('|'),
                ACL:'+role:'+res.objectId
            }
            Wapi.page.update(re=>{  //在所选的page的ACL中添加当前角色
                this.roles.push({name:data.name,objectId:res.objectId});
                this.setState({
                    show_sonpage:false,
                });
                STORE.dispatch(role_act.add(params));
                STORE.dispatch(role_act.get({uid:_user.customer.objectId}));//角色
            },par)
        },params);
    }
    editRole(role){
        Wapi.page.list(res=>{
            role.pages=res.data.map(ele=>ele.objectId);
            this.curRole=role;
            this.setState({
                show_sonpage:true,
                isEdit:true,
            });
        },{ACL:'role:'+role.objectId});
    }
    editRoleCancel(){
        this.setState({show_sonpage:false});
    }
    editRoleSubmit(data){
        // console.log(data,'last role');
        // console.log(this.curRole,'first role')
        if(data.name==''){
            W.alert(___.name+___.not_null);
            return;
        }
        if(data.pages.length==0){
            W.alert(___.permission+___.not_null);
            return;
        }
            
        Wapi.role.update(res=>{  //更新角色
            Wapi.page.list(res=>{
                // role.pages=res.data.map(ele=>ele.objectId);
                let pages = res.data.map(ele=>ele.objectId);
                let op = [];
                let par = {}
                console.log(data.pages)
                if(data.pages.length >= pages.length){
                    data.pages.forEach(e => {
                        if(!pages.includes(e)){
                            op.push(e)
                        }
                    })
                    par = {
                        _objectId:op.join('|'),
                        ACL:'+role:'+data.objectId
                    };
                    Wapi.page.update(re=>{
                        //在所选的page的ACL中添加当前角色
                        // this.roles.push({name:data.name});
                        this.setState({
                            show_sonpage:false,
                        });
                    },par);
                }else{
                    pages.forEach(e => {
                        if(!data.pages.includes(e)){
                            op.push(e)
                        }
                    })
                    par = {
                        _objectId:op.join('|'),
                        ACL:'-role:'+data.objectId
                    };
                    Wapi.page.update(re=>{
                        //在所选的page的ACL中添加当前角色
                        // this.roles.push({name:data.name});
                        this.setState({
                            show_sonpage:false,
                        });
                    },par);
                }
            },{
                ACL:'role:'+data.objectId
            });
            
        },{
            _objectId:data.objectId,
            name:data.name,
        });
    }
    deleteRole(role){
        let _this=this;
        Wapi.employee.list(res => {
            if(res.data&&res.data.length){
                W.alert(___.role_no_delete)
            }else{
                W.confirm(___.confirm_delete_data,function(b){
                    if(b){
                        Wapi.role.delete(res=>{//delete a role
                            _this.roles=_this.roles.filter(ele=>ele.objectId!=role.objectId);
                            STORE.dispatch(role_act.delete(role.objectId));
                            _this.forceUpdate();
                        },{objectId:role.objectId});
                    }
                })  
            }     
        },{
            roleId:role.objectId,isQuit:false
        })
    }
    render(){
        let items=this.roles.map((ele,i)=>
            [<ListItem 
                key={i} 
                primaryText={ele.name} 
                rightIcon={
                    <RightIconMenu edit={()=>this.editRole(ele)} delete={()=>this.deleteRole(ele)}/>
                }
            />,
            <Divider />]
        );
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.role_manage} 
                        style={styles.appbar}
                        iconElementRight={<IconButton onClick={this.addRole}><ContentAdd/></IconButton>}
                    />
                    <div style={styles.main}>
                        <List>
                            {items}
                        </List>
                    </div>
                    <SonPage title={___.role_add} open={this.state.show_sonpage} back={this.addRoleCancel}>
                        <AddRole 
                            role={this.curRole}
                            isEdit={this.state.isEdit} 
                            addSubmit={this.addRoleSubmit} 
                            editCancel={this.editRoleCancel}
                            editSubmit={this.editRoleSubmit}
                        />
                    </SonPage>
                </div>
            </ThemeProvider>
        )
    }
}

class AddRole extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.data={
            name:'',
            pages:[],
        };
        this.nameChange=this.nameChange.bind(this);
        this.pageCheck=this.pageCheck.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.isEdit){
            this.data=Object.assign({},nextProps.role);
        }else{
            this.data={
                name:'',
                pages:[]
            };
        }
    }
    nameChange(e,val){
        this.data.name=val;
    }
    pageCheck(e,val){
        console.log(e,val,'test check')
        if(val){
            this.data.pages.push(parseInt(e.target.name));
            this.forceUpdate();
            // this.setState
        }else{
            this.data.pages=this.data.pages.filter(ele=>ele!=e.target.name);
            this.forceUpdate()
        }
    }
    submit(data){
        console.log(this.props.isEdit)
        if(this.props.isEdit){
            this.props.editSubmit(data)
        }else{
            this.props.addSubmit(data);
        }
        
    }
    render(){
        console.log(this.data.pages,'test pages length')
        let _disabled=this.props.isEdit;
        let pages=_user.pages;
        
        let items=[];
        // _user.pages.forEach(e => {
        //     console.log(e.objectId)
        //     console.log(this.data.pages.includes(e.objectId))
        // })

        let Opages = null;
        if(_user.customer.custTypeId !=1 ){
            Opages = pages.map(e => {
                if(e.name =='公司信息'||e.name=="角色管理"||e.name=="营销产品"||e.name=="公众号管理"||e.name ==='部门管理'||e.name=="人员管理"||e.name=="营销活动"||e.name=="二维码管理"||e.name=="二维码管理"){
                    return e = undefined
                }else{
                    return e
                }
            })
        }else{
            Opages = pages.map(e => e)
        }   
        
        Opages.forEach((e,i) => {
            if(e){
                if(e.name == '供应商管理' || e.name == '我的营销'){
                    Opages.splice(Opages.indexOf(e),1)
                }
            }
        })
        // Opages.splice(Opages.indexOf('供应商管理'),1);
        // Opages.splice(Opages.indexOf('我的营销'),1)
        console.log(Opages,'op')
        if(_disabled){
            items=Opages.map((ele,i)=>{
                if(ele){
                    return(
                         <Checkbox
                            key={i}
                            name={ele.objectId.toString()}
                            label={ele.name}
                            style={styles.checkbox}
                            onCheck={this.pageCheck}
                            checked={this.data.pages.includes(ele.objectId)}
                        />
                    )
                }
            });
        }else{
            items=Opages.map((ele,i)=>{
                if(ele){
                    return(
                         <Checkbox
                            key={i}
                            name={ele.objectId.toString()}
                            label={ele.name}
                            style={styles.checkbox}
                            onCheck={this.pageCheck}
                        />
                    )
                }
            });
        }
        return(
            <div style={styles.sonpage_main}>
                <Input  floatingLabelText={___.name} value={this.data.name} onChange={this.nameChange} />
                <div style={{paddingBottom:'1em'}}>{___.permission}</div>
                <div>{items}</div>

                <div style={_disabled ? styles.hide : styles.bottom_btn_center}>
                    <RaisedButton label={___.ok} primary={true} onClick={()=>this.submit(this.data)} />
                </div>
                <div style={!_disabled ?{display:'none'}:{display:'block',textAlign:'center',paddingTop:5}}>
                    <RaisedButton style={{marginRight:15}} label={'取消'} primary={true} onClick={()=>this.props.editCancel()} />
                    <RaisedButton style={{marginLeft:15}} label={___.ok} primary={true} onClick={()=>this.submit(this.data)} />
                </div>
            </div>
        )
    }
}

class RightIconMenu extends React.Component{
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    
    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                style={{
                    height: '48px',
                    width: '48px',
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    bottom: '0px',
                    margin: 'auto'
                }}
            >
                <MenuItem onTouchTap={this.props.edit}>{'修改'}</MenuItem>                
                {/* <MenuItem onTouchTap={this.props.edit}>{___.see}</MenuItem> */}
                <MenuItem onTouchTap={this.props.delete}>{___.delete}</MenuItem> 
            </IconMenu>
        );
    }
}
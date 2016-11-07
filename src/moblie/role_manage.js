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
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            total:0,
            show_sonpage:false,
            isEdit:false,
        }
        this.curRole={};
        this.roles=[];

        this.addRole=this.addRole.bind(this);
        this.addRoleCancel=this.addRoleCancel.bind(this);
        this.addRoleSubmit=this.addRoleSubmit.bind(this);
        // this.editRole=this.editRole.bind(this);
        // this.editRoleCancel=this.editRoleCancel.bind(this);
        // this.editRoleSubmit=this.editRoleSubmit.bind(this);
    }
    componentDidMount(){
        Wapi.role.list(res=>{//获取所有角色
            this.roles=res.data;
            this.setState({
                total:res.total,
            });
        },{objectId:'>0'})
    }
    addRole(){
        this.setState({
            show_sonpage:true,
            isEdit:false,
        });
    }
    addRoleCancel(){
        this.setState({show_sonpage:false});
    }
    addRoleSubmit(data){
        console.log(data);
        if(data.name==''){
            W.alert(___.name+___.not_null);
            return;
        }
        if(data.pages.length==0){
            W.alert(___.permission+___.not_null);
            return;
        }
        Wapi.role.add(res=>{//新建一个角色
            let par={
                _objectId:data.pages.join('|'),
                ACL:'+role:'+res.objectId
            }
            Wapi.page.update(re=>{
                //在所选的page的ACL中添加当前角色
                this.roles.push({name:data.name,objectId:res.objectId});
                this.setState({
                    show_sonpage:false,
                });
            },par)

        },{
            name:data.name,
            uid:_user.customer.objectId,
            appId:WiStorm.config.objectId
        });
    }
    // editRole(role){
    //     this.curRole=role;
    //     this.setState({
    //         show_sonpage:true,
    //         isEdit:true,
    //     });
    // }
    // editRoleCancel(){
    //     this.setState({show_sonpage:false});
    // }
    // editRoleSubmit(data){
    //     console.log(data);
    //     if(data.name==''){
    //         W.alert(___.name+___.not_null);
    //         return;
    //     }
    //     if(data.pages.length==0){
    //         W.alert(___.permission+___.not_null);
    //         return;
    //     }
    //     Wapi.role.update(res=>{//新建一个角色
    //         let par={
    //             _objectId:data.pages.join('|'),
    //             ACL:'+role:'+res.objectId
    //         }
    //         Wapi.page.update(re=>{
    //             //在所选的page的ACL中添加当前角色
    //             this.roles.push({name:data.name});
    //             this.setState({
    //                 show_sonpage:false,
    //             });
    //         },par);
    //     },{
    //         _objectId:data.objectId,
    //         name:data.name,
    //     });
    // }
    deleteRole(role){
        console.log(role);
        let _this=this;
        W.confirm(___.confirm_delete_role,function(b){
            if(b){
                Wapi.role.delete(res=>{//delete a role
                    _this.roles=_this.roles.filter(ele=>ele.objectId!=role.objectId);
                    _this.forceUpdate();
                },{objectId:role.objectId});
            }
        });
        
    }
    render(){
        let items=this.roles.map((ele,i)=>
            [<ListItem key={i} primaryText={ele.name} rightIcon={<RightIconMenu onClick={()=>this.deleteRole(ele)}/>}/>,
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
                        {/*<div style={styles.bottom_btn_right}>
                            <FlatButton label={___.add} primary={true} onClick={this.addRole} />
                        </div>*/}
                    </div>
                    <SonPage title={___.role_add} open={this.state.show_sonpage} back={this.addRoleCancel}>
                        <AddRole submit={this.addRoleSubmit} isEdit={this.state.isEdit} role={this.curRole}/>
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
        }
        this.nameChange=this.nameChange.bind(this);
        this.pageCheck=this.pageCheck.bind(this);
    }
    
    nameChange(e,val){
        this.data.name=val;
    }
    pageCheck(e,val){
        if(val){
            this.data.pages.push(e.target.name);
        }else{
            this.data.pages=this.data.pages.filter(ele=>ele!=e.target.name);
        }
    }
    render(){
        let pages=_user.pages;
        let items=pages.map((ele,i)=>
            <Checkbox
                key={i}
                name={ele.objectId.toString()}
                label={ele.name}
                style={styles.checkbox}
                onCheck={this.pageCheck}
            />
        )
        return(
            <div style={styles.sonpage_main}>
                <Input floatingLabelText={___.name} onChange={this.nameChange} />
                <div style={{paddingBottom:'1em'}}>{___.permission}</div>
                <div>{items}</div>

                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.ok} primary={true} onClick={()=>{this.props.submit(this.data)}} />
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
                <MenuItem onTouchTap={this.props.onClick}>{___.delete}</MenuItem>
            </IconMenu>
        );
    }
}
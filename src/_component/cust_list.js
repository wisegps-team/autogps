/**
 * 由原本的user_list改造而来，去掉了对redux的依赖,删除和修改也不再依赖redux来传递
 */
import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import AutoList from './base/autoList';
import UserSearch from './user_search';
import SonPage from '../_component/base/sonPage';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {blue500} from 'material-ui/styles/colors';

const sty={
    item:{
        borderBottom: '1px solid #ccc'
    },
    tab:{
        display:'table',
        width:'100%'
    },
    td:{
        display:'table-cell'
    },
    sm:{
        marginTop:'4px',
        display:'block'
    },
    s:{
        padding:'0 10px',
        display: 'flex',
        alignItems: 'center'
    }
}

export const cust_item_sty=sty;

export function CustListHC(Com,isList){
    class Dlist extends Component{
        render() {
            let items;
            if(this.props.data)
                items=this.props.data.map((ele,index)=><Com key={ele.objectId} data={ele}/>);
            else
                items=(<div style={{textAlign:'center',color:'#ccc'}}>
                    <h2>{___.user_list_null}</h2>
                </div>);
            return (
                <List>
                    {items}
                </List>
            );
        }
    }
    let Alist=AutoList(Dlist);
    class CustList extends Component {
        constructor(props, context) {
            super(props, context);
            this.state={
                data:[],
                total:-1,
            }
            this.load = this.load.bind(this);
            this.deleteOne = this.deleteOne.bind(this);
            this.onData = this.onData.bind(this);

            this.op=props.op||{
                page:'objectId',
                sorts:'objectId',
                page_no:1
            }
            
            this.countParams=null;
            this.showCount = this.showCount.bind(this);
        }
        getChildContext(){
            return {
                delete:this.deleteOne,
                showCount:this.showCount,
            };
        }
        componentDidMount() {
            Wapi.customer.list(res=>{
                this.setState(res);
            },this.props.data,this.op);
        }
        shouldComponentUpdate(nextProps, nextState) {
            return (nextState!=this.state);
        }
        deleteOne(id){
            this.setState({
                data:this.state.data.filter(e=>e.objectId!=id),
                total:this.state.total-1
            });
        }
        showCount(cust,intent){
            if(intent=='pop'){
                let paramsPop={
                    from:_user.customer.objectId,
                    to:cust.objectId,
                    type:0,
                }
                this.context.VIEW.postMessage('pushPopCount.js',paramsPop);
                this.context.VIEW.goTo('pushPopCount.js',paramsPop);
            }else{
                let paramsPush={
                    from:cust.objectId,
                    to:_user.customer.objectId,
                    type:1,
                }
                this.context.VIEW.postMessage('pushPopCount.js',paramsPush);
                this.context.VIEW.goTo('pushPopCount.js',paramsPush);
            }
        }
        load(){
            this.op.page_no++;
            Wapi.customer.list(res=>{
                let data=this.state.data.concat(res.data);
                this.setState({data});
            },this.props.data,this.op);
        }
        onData(data){
            if(data&&data.length){
                this._state=this._state||this.state;
                console.log(this._state)
                this.setState({data,total:data.length});
            }else if(this._state){
                this.setState(this._state);
                delete this._state;
            }
        }
        render() {
            let addBut=this.props.label?<RaisedButton label={this.props.label} fullWidth={true} />:null;
            let add=this.props.add?<IconButton onClick={this.props.add}><ContentAdd color={blue500}/></IconButton>:null;
            return (
                <div>
                    {addBut}
                    <div style={sty.s}>
                        <UserSearch onData={this.onData} data={this.props.data}/>
                        {add}
                    </div>
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.data} 
                        next={this.load} 
                    />
                </div>
            );
        }
    }
    CustList.childContextTypes={
        delete:React.PropTypes.func,
        showCount:React.PropTypes.func,
    }
    CustList.contextTypes ={
        VIEW:React.PropTypes.object,
    }

    return CustList;
}




class UserItem extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            data:props.data
        }
        this.operation = this.operation.bind(this);
        this.message = this.message.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data:nextProps.data});
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.data!==this.state.data);
    }

    message(e){
        if(e.data.objectId==this.state.data.objectId){
            let data=Object({},this.state.data,e.data);
            this.setState({data});
        }
        this.context.VIEW.removeEventListener('message',this.message);
    }
    
    operation(index){
        switch(index){
            case 0:
                this.context.VIEW.goTo('cust_add.js',this.state.data);
                this.context.VIEW.addEventListener('message',this.message);
                break;
            case 1:
                console.log('详情');
                break;
            case 2:
                console.log('删除');
                let that=this;
                W.confirm(___.confirm_delete,function(b){
                    if(b)Wapi.customer.delete(res=>that.context.delete(that.state.data.objectId),{
                            objectId:that.state.data.objectId
                        });
                });
                break;
        }
    }
    render() {
        if(!this.state.data.custType){
            let types=STORE.getState().custType;
            let type=types.find(type=>this.state.data.custTypeId==type.id);
            this.state.data.custType=type?type.name:this.state.data.custType;
        }
        let tr=(<div style={sty.tab}>
                <span style={sty.td}>{this.state.data.custType}</span>
                <span style={sty.td}>{this.state.data.contact}</span>
                <span style={sty.td}>{this.state.data.tel}</span>
            </div>);
        let title=(<span>
            {this.state.data.name}
            <small style={sty.sm}>{this.state.data.province+this.state.data.city+this.state.data.area}</small>
        </span>);
        return (
            <ListItem
                rightIcon={<RightIconMenu onClick={this.operation}/>}
                primaryText={title}
                secondaryText={tr}
                style={sty.item}
            />
        );
    }
}
UserItem.contextTypes ={
    VIEW:React.PropTypes.object,
    delete:React.PropTypes.func,
}

class RightIconMenu extends Component{
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.onClick==this.props.onClick)
            return false;
        else
            return true;
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
                <MenuItem onTouchTap={()=>this.props.onClick(0)}>{___.edit}</MenuItem>
                <MenuItem onTouchTap={()=>this.props.onClick(2)}>{___.delete}</MenuItem>
            </IconMenu>
        );
    }
}

let CustList=CustListHC(UserItem);

export default CustList;

/**
 * 由原本的user_list改造而来，去掉了对redux的依赖,删除和修改也不再依赖redux来传递
 */
import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import AutoList from './base/autoList';

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
    }
}

class CustList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:-1
        }
        this.load = this.load.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.op=props.op||{
            page:'objectId',
            sorts:'objectId'
        }
    }
    getChildContext(){
        return {
            delete:this.deleteOne
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
    load(){
        let last=this.props.data[this.props.data.length-1];
        let first=this.props.data[0];
        this.op.max_id=last.objectId,
        Wapi.customer.list(res=>{
            this.setState(res);
        },this.props.data,this.op);
    }
    render() {
        let addBut=this.props.label?<RaisedButton label={this.props.label} fullWidth={true} />:null;
        return (
            <div>
                {addBut}
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
}

class Dlist extends Component{
    render() {
        let items;
        if(this.props.data)
            items=this.props.data.map((ele,index)=><UserItem key={index} data={ele}/>);
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
        let data=Object({},this.state.data,e.data);
        this.setState({data});
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
let Alist=AutoList(Dlist);

export default CustList;

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

class UserList extends Component {
    constructor(props, context) {
        super(props, context);
        
        this.load = this.load.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps==this.props)
            return false;
        else 
            return true;
    }
    
    load(){
        console.log(this.context.STORE);
        let last=this.props.data[this.props.data.length-1];
        let first=this.props.data[0];
        let op={
            max_id:last.objectId,
            page:'objectId',
            sorts:'objectId'
        }
        let ACT=this.context.ACT,STORE=this.context.STORE;
        STORE.dispatch(ACT.fun.get(this.context.data,op));//获取下一页
    }
    render() {
        let items;
        if(this.props.data&&this.props.data.length)
            items=this.props.data.map((ele,index)=><UserItem key={index} data={ele}/>);
        else
            items=(<div style={{textAlign:'center',color:'#ccc'}}>
                <h2>{___.user_list_null}</h2>
            </div>);
        return (
            <AutoList load={this.load} forLoad={(this.props.data.length!=this.props.total)} loading={this.props.loading}>
                {items}
            </AutoList>
        );
    }
}
UserList.contextTypes={
    STORE:React.PropTypes.object,
    VIEW:React.PropTypes.object,
    ACT:React.PropTypes.object,
    data:React.PropTypes.object,
}

class UserItem extends Component{
    constructor(props, context) {
        super(props, context);
        this.operation = this.operation.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.data!==this.props.data);
    }
    
    
    operation(index){
        switch(index){
            case 0:
                this.context.VIEW.goTo('cust_add.js',this.props.data);
                break;
            case 1:
                console.log('详情');
                break;
            case 2:
                console.log('删除');
                let that=this;
                W.confirm(___.confirm_delete,function(b){
                    if(b)Wapi.customer.delete(res=>STORE.dispatch(that.context.ACT.fun.delete(that.props.data.objectId)),{
                            objectId:that.props.data.objectId
                        });
                });
                break;
        }
    }
    render() {
        if(!this.props.data.custType){
            let types=this.context.STORE.getState().custType;
            let type=types.find(type=>this.props.data.custTypeId==type.id);
            this.props.data.custType=type?type.name:this.props.data.custType;
        }
        let tr=(<div style={sty.tab}>
                <span style={sty.td}>{this.props.data.custType}</span>
                <span style={sty.td}>{this.props.data.contact}</span>
                <span style={sty.td}>{this.props.data.tel}</span>
            </div>);
        let title=(<span>
            {this.props.data.name}
            <small style={sty.sm}>{this.props.data.province+this.props.data.city+this.props.data.area}</small>
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
    STORE:React.PropTypes.object,
    VIEW:React.PropTypes.object,
    ACT:React.PropTypes.object
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
                <MenuItem onClick={()=>this.props.onClick(0)}>{___.edit}</MenuItem>
                <MenuItem onClick={()=>this.props.onClick(2)}>{___.delete}</MenuItem>
            </IconMenu>
        );
    }
}
                /*<MenuItem onClick={()=>this.props.onClick(1)}>{___.details}</MenuItem>*/


export default UserList;

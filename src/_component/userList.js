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
        console.log('加载下一页');
        let last=this.props.data[this.props.data.length-1];
        let first=this.props.data[0];
        let data={
            parentId:_user.cust_id
        };
        let op={
            max_id:last.id,
            page:'id',
            sorts:'id'
        }
        let ACT=this.context.ACT,STORE=this.context.STORE;
        STORE.dispatch(ACT.fun.get(data,op));//获取下一页
    }
    render() {
        console.log('userlist渲染了')
        let t1=new Date().getTime();
        let items=this.props.data.map((ele,index)=><UserItem key={index} data={ele}/>);
        console.log(new Date().getTime()-t1);
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
    ACT:React.PropTypes.object
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
                this.context.VIEW.goTo('user_add.js',this.props.data);
                break;
            case 1:
                console.log('详情');
                break;
            case 2:
                console.log('删除');
                let that=this;
                W.confirm(___.confirm_delete,function(b){
                    if(b)Wapi.customer.delete(res=>STORE.dispatch(that.context.ACT.action.delete),{
                            objectId:that.props.objectId
                        });
                });
                break;
        }
    }
    render() {
        if(!this.props.data.user_type_name){
            let types=this.context.STORE.getState().user_type;
            let type=types.find(type=>this.props.data.user_type==type.id);
            this.props.data.user_type_name=type?type.values:this.props.data.user_type;
        }
        let tr=(<div style={sty.tab}>
                <span style={sty.td}>{this.props.data.user_type_name}</span>
                <span style={sty.td}>{this.props.data.contact}</span>
                <span style={sty.td}>{this.props.data.tel}</span>
            </div>);
        let title=(<span>
            {this.props.data.company}
            <small style={sty.sm}>{this.props.data.province+this.props.data.city+this.props.data.district}</small>
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
    VIEW:React.PropTypes.object
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
                // <MenuItem onClick={()=>this.props.onClick(1)}>{___.details}</MenuItem>
                <MenuItem onClick={()=>this.props.onClick(2)}>{___.delete}</MenuItem>
            </IconMenu>
        );
    }
}

export default UserList;

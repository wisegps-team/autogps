import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

export class UserTree extends React.Component{
    constructor(props) {
        super(props);
        
    }
    handleTouch(e){
        let users=this.props.select_users;
        if(users.includes(this.props.data)){
            this.props.userClick(this.props.data,"delete");
        }else if(!users.includes(this.props.data)){
            this.props.userClick(this.props.data,"add");
        }
    }
    render(){
        let users=this.props.select_users;
        let fun=this.props.userClick;
        let children=[];
        if(this.props.data.children)
            children=this.props.data.children.map(function (ele) {
                return <UserTree key={ele.cust_id} data={ele} userClick={fun} select_users={users} />;
            });
        return (
            <ListItem
                primaryText={this.props.data.cust_name}
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                innerDivStyle={{fontSize:'14px',borderBottom:'solid 1px #ccc',paddingTop:'10px',paddingBottom:'10px',paddingLeft:'50px'}}
                nestedItems={children}
                nestedListStyle={{paddingLeft:'15px',paddingTop:'0px',paddingBottom:'0px'}}
                leftCheckbox={<Checkbox style={{marginLeft:'-10px',marginTop:'-5px'}} defaultChecked={users.includes(this.props.data)} onClick={this.handleTouch.bind(this)}/>}
                
            />
        );
    }
}

export default UserTree;
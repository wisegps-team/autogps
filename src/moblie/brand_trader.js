/**
 * 品牌商管理
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add'

import AppBar from '../_component/base/appBar';
import {CustListHC,cust_item_sty} from '../_component/cust_list';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SonPage from '../_component/base/sonPage';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


class App extends Component{
    constructor(props, context) {
        super(props, context);
        this._data={
            objectId:_user.customer.parentId.join('|'),
            custTypeId:'1'
        };
        this.ADD=(_user.customer.custTypeId===0)?(<IconButton onClick={()=>thisView.goTo('cust_add.js',{custTypeId:1})}><ContentAdd/></IconButton>):null;
    }
    getChildContext(){
        return{
            'VIEW':thisView,
        }
    }
    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.brand_trader}  iconElementRight={this.ADD}/>
                <CustList data={this._data}/>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    VIEW:React.PropTypes.object,
}

class TraderItem extends Component{
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.data!==this.props.data);
    }

    render() {
        if(!this.props.data.custType){
            let types=STORE.getState().custType;
            let type=types.find(type=>this.props.data.custTypeId==type.id);
            this.props.data.custType=type?type.name:this.props.data.custType;
        }
        let tr=(<div style={cust_item_sty.tab}>
                <span style={cust_item_sty.td}>{this.props.data.custType}</span>
                <span style={cust_item_sty.td}>{this.props.data.contact}</span>
                <span style={cust_item_sty.td}>{this.props.data.tel}</span>
            </div>);
        let title=(<span>
            {this.props.data.name}
            <small style={cust_item_sty.sm}>{this.props.data.province+this.props.data.city+this.props.data.area}</small>
        </span>);
        return (
            <ListItem
                primaryText={title}
                secondaryText={tr}
                style={cust_item_sty.item}
                rightIcon={
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
                        <MenuItem onTouchTap={()=>this.context.showCount(this.props.data,'push')}>{___.business_statistics}</MenuItem>
                    </IconMenu>}
            />
        );
    }
}

TraderItem.contextTypes ={
    showCount:React.PropTypes.func,
}
let CustList=CustListHC(TraderItem);
/**
 * 供应商管理
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
            objectId:_user.customer.parentId.join('|')
        };
    }
    getChildContext(){
        return{
            'VIEW':thisView,
        }
    }
    render() {
        return (
            <ThemeProvider>
                <AppBar title={___.superior} />
                <CustList data={this._data}/>
            </ThemeProvider>
        );
    }
}
App.childContextTypes={
    VIEW:React.PropTypes.object,
}

const _strVa=[___.group_marketing,___.distribution,___.enterprises,___.carowner_seller];
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
                <span style={cust_item_sty.td}>{this.props.data.contact}</span>
                <span style={cust_item_sty.td}>{this.props.data.tel}</span>
            </div>);

        let arrVa=(this.props.data.other&&this.props.data.other.va) ? this.props.data.other.va.split(',') : [];
        let strVa=___.no_added_service;
        if(arrVa!=[]){
            strVa=arrVa.map(ele=>_strVa[ele]).join(' ');
        }
        if(this.props.data.isInstall){
            if(strVa==___.no_added_service){
                strVa=___.install_shop;
            }else{
                strVa=strVa+' '+___.install_shop;
            }
        }
                
        let title=(<span>
            {this.props.data.name}
            <small style={cust_item_sty.sm}>{this.props.data.custType}</small>
            <small style={cust_item_sty.sm}>{strVa}</small>
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
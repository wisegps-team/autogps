import React, {Component} from 'react';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import FileUpload from 'material-ui/svg-icons/file/file-upload';

import AutoList from './base/autoList';

const op={
    page:'createdAt',
    sorts:'-createdAt',
}


class DeviceList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:-1
        }
        this.page=1;
        this.loadNextPage = this.loadNextPage.bind(this);
    }
    
    componentDidMount() {//初始化数据
        Wapi.deviceLog.list(res=>this.setState({data:res.data,total:res.total}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
    }

    loadNextPage(){
        //加载下一页的方法
        let arr=this.state.data;
        let last=arr[arr.length-1];
        this.page++;
        Wapi.deviceLog.list(res=>this.setState({data:arr.concat(res.data)}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
    }
    
    render() {
        return (
            <Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.loadNextPage} 
            />
        );
    }
}

class DumbList extends Component{
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        let item=this.props.data.map(e=>(<ListItem
                leftAvatar={e.type?(<Avatar 
                        backgroundColor='#BBDEFB'
                        icon={<FileDownload/>}
                    />):(<Avatar  
                        backgroundColor='#C8E6C9'
                        icon={<FileUpload/>}
                    />)}
                primaryText={e.did.join(',')}
                secondaryText={(e.type?'入库':'出库')+'，'+W.dateToString(W.date(e.createdAt))}
                key={e.objectId}
            />));
        return (
            <List>
                {item}
            </List>
        );
    }
}
let Alist=AutoList(DumbList);

export default DeviceList;
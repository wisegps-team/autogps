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

const sty={
    ta:{
        textAlign:'center',
        margin:0
    }
}


class DeviceLogList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:0
        }
        this.page=1;
        this.loadNextPage = this.loadNextPage.bind(this);
        this.add = this.add.bind(this);
    }
    
    componentDidMount() {//初始化数据
        Wapi.deviceLog.list(res=>this.setState({data:res.data,total:res.total}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
        window.addEventListener('device_log_add',this.add);
    }
    add(e){
        e.data;
        let data=[e.data].concat(this.state.data);
        let total=this.state.total+1;
        this.setState({data,total});
    }
    componentWillUnmount() {
        window.removeEventListener('device_log_add',this.add);
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
        return !this.props.data;
    }

    render() {
        let item=this.props.data?this.props.data.map(e=>(<ListItem
                leftAvatar={e.type?(<Avatar 
                        backgroundColor='#BBDEFB'
                        icon={<FileDownload/>}
                    />):(<Avatar  
                        backgroundColor='#C8E6C9'
                        icon={<FileUpload/>}
                    />)}
                primaryText={e.did.join(',')}
                secondaryText={(e.type?___.push:___.pop)+'，'+W.dateToString(W.date(e.createdAt))}
                key={e.objectId}
            />)):(<h3 style={sty.ta}>{___.loading}</h3>);
        return (
            <List>
                {item}
            </List>
        );
    }
}
let Alist=AutoList(DumbList);

export default DeviceLogList;
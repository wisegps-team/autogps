import React, {Component} from 'react';

import ContentCreate from 'material-ui/svg-icons/content/create';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


import WTable from './table';
import Wapi from '../_modules/Wapi/WiStormAPI';
import P from '../_modules/public';
import AddFrom from './add_from';

const styles={
    main:{
        padding:'10px',
        position: 'relative',
    },
    td:{
        padding:'0 5px',
        textAlign:'center',
        height:'40px',
        borderRight: '1px solid #ccc'
    },
    icon:{
        width:'20px',
        height:'20px'
    }
}

const columnProps={
    style:styles.td
}
const rowProps={
    style:{
        height:'40px',
        borderTop: '1px solid #ccc',
        borderLeft: '1px solid #ccc'
    }
}
const headerProps={
    displaySelectAll:false,
    adjustForCheckbox:false
}

let handler={
    dateHandler:function(params){
        if(!params)return '';
        return W.dateToString(W.date(params)).slice(0,10);
    },
    dateTimeHandler:function(params){
        if(!params)return '';
        return W.dateToString(W.date(params));
    },
    selectHandler:function(params,select){
        for(let i=0;i<select.length;i++){
            if(params==select[i].value)
                return select[i].name;
        }
    }
}

class TableManage extends Component {
    constructor(props,content){
        super(props,content);
        this.state={
            total:0,
            data:[],
            limit:props.limit||10,
            state:0, //0正常显示的状态，1正在获取数据中的状态,2打开编辑框的状态
            edit_data:{} //正在编辑的记录
        }
        this.page=1;
        this.data={};//用于存储已经获取过的数据，再回来的时候就不用重新获取了
        P.rebuild(this);
        this.getApi(props);
    }
    componentDidMount() {
        this.api.list((res)=>this.setState(this.handlerData(res)),{
            'seller_ids.seller_id':_user.cust_id
        });
        this.setState({state:1});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (this.state!=nextState);
    }

    getChildContext() {
        return {
            Wapi:this.api,
            table:this.props.table,
            openFrom:this.openFrom,
            add:this.add,
            delete:this.deleteOne,
            update:this.update
        };
    }

    getApi(props){
        this.api=new WiStormAPI(props.table.name,_user.access_token,WiStorm.config.app_key,WiStorm.config.app_secret);
        let keys=[],handler_list=[];
        this.keys=props.table.fields.map(function(ele){
            keys.push(ele.name);//接口需要返回的字段
            //记录需要预处理的字段
            if(ele.type=='Date')handler_list.push({key:ele.name,handler:'dateHandler'});
            if(ele.type=='DateTime')handler_list.push({key:ele.name,handler:'dateTimeHandler'});
            if(ele.validations&&ele.validations.select)handler_list.push({key:ele.name,handler:'selectHandler',params:ele.validations.select});
            return ({'name':ele.desc,'key':ele.name});
        });
        this.keys.push({'name':___.operation});
        this.handler_list=handler_list;

        this.api.get_op={fields:keys.join(',')};
        this.api.list_op={
            fields:this.api.get_op.fields,
            sorts:props.table.key_primary,
            page:props.table.key_primary,
            limit:this.state.limit
        };
    }
    
    handlerData(res){//对服务器返回的数据进行处理
        this.handler_list.map(function(h){
            res.data=res.data.map(function(ele){
                if(h.handler=='selectHandler'){
                    ele['_selectHandler_value'+h.key]=ele[h.key];
                    ele[h.key]=handler[h.handler](ele[h.key],h.params);
                }else
                    ele[h.key]=handler[h.handler](ele[h.key]);
                return ele;
            });
        });
        res.state=0;
        return res;
    }

    bind(){//在P.rebuild里面会把这里返回的方法都bind到当前组件
        return[
            function pageChange(val){
                this.data[this.page]=this.state.data;//把当页数据存储起来
                if(this.data[val]){//如果当前有这个页的数据则直接取出来
                    this.setState({data:this.data[val]});
                }else{//没有这一页的数据则获取
                    this.api.list((res)=>this.setState(this.handlerData(res)),{
                        'seller_ids.seller_id':_user.cust_id,
                        max_id:this.state.data[this.state.data.length-1][this.props.table.key_primary]
                    });
                    this.setState({state:1});
                }
                this.page=val;
            },
            function openFrom(b){
                if(b)
                    this.setState({state:2,edit_data:b});
                else 
                    this.setState({state:0});
            },
            function add(data){
                this.api.add(data,function (res) {
                    if(res.status_code){//出错了
                        W.errorCode(res);
                        return
                    }
                    let newState={
                        edit_data:{}
                    };
                    newState.data=this.state.data.contcat(data);
                    this.setState(newState);
                });
            },
            function deleteOne(key){
                let pkey=this.props.table.key_primary;
                let data={};
                data[pkey]=key;
                this.api.delete(data,function (res) {
                    if(res.status_code){//出错了
                        W.errorCode(res);
                        return
                    }
                    let newState={
                        edit_data:{}
                    };
                    newState.data=this.state.data.filter((ele)=>(ele[pkey]!=key));
                    this.setState(newState);
                });
            },
            function update(data){
                let pkey=this.props.table.key_primary;
                this.api.add(data,function (res) {
                    if(res.status_code){//出错了
                        W.errorCode(res);
                        return
                    }
                    let newState={
                        edit_data:{}
                    };
                    newState.data=this.state.data.map(function(ele){
                        if(data['_'+pkey]==ele[pkey])
                            return Object.assign({},ele,data);
                        else
                            return ele;
                    });
                    this.setState(newState);
                });
            }
        ];
    }
    
    render() {
        return (
            <div style={styles.main}>
                <WTable
                    data={this.state.data} 
                    page={Math.ceil(this.state.total/this.state.limit)}
                    keys={this.keys} 
                    active={Active}
                    
                    pageChange={this.pageChange}

                    columnProps={columnProps}
                    headerColumnProps={columnProps}
                    rowProps={rowProps}
                    headerProps={headerProps}
                />
                <AddFrom open={(this.state.state==2)} table={this.props.table} data={this.state.edit_data}/>
            </div>
        );
    }
}
TableManage.childContextTypes = {
    Wapi:React.PropTypes.object,
    table:React.PropTypes.object,
    openFrom:React.PropTypes.func,
    add:React.PropTypes.func,
    delete:React.PropTypes.func,
    update:React.PropTypes.func
};


class Active extends Component {
    constructor(props,context) {
        super(props,context);
        this.clickCreate = this.clickCreate.bind(this);
        this.delete = this.delete.bind(this);
        this.state={
            open:false
        }
    }
    
    clickCreate(){
        console.log(this.context.table);
        this.context.openFrom(this.props.data);//打开编辑框
    }

    delete(){
        alert('删除名称为'+this.props.data.name);
    }

    render() {
        return (
            <div>
                <ContentCreate onClick={this.clickCreate} style={styles.icon}/>
                <NavigationClose onClick={this.delete} style={styles.icon}/>
            </div>
        );
    }
}

Active.contextTypes = {
    Wapi:React.PropTypes.object,
    table:React.PropTypes.object,
    openFrom:React.PropTypes.func
};


export default TableManage;
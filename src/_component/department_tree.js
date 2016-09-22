import React, {Component} from 'react';

import {MakeTreeComponent} from '../_component/base/tree';

import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';

import {department_act} from '../_reducers/dictionary';
import SonPage from './base/sonPage';
import P from '../_modules/public';
import {getAllChild} from '../_modules/tool';

const sty={
    d:{
        width:'100%',
        wordBreak: 'break-all'
    },
    c:{
        verticalAlign: 'top',
        marginLeft:'1em',
        float: 'right',
    },
    sp:{
        cursor:'pointer'
    }
}

class DepartmentTree extends Component{
    constructor(props, context) {
        super(props, context);
        this._open=props.open;
        this._checked=props.checked;
        this.state={
            data:this.getData()
        }
    }
    componentDidMount() {
        this.unsubscribe = STORE.subscribe(() =>{
            if(this.department!=STORE.getState().department){
                this.department=STORE.getState().department;
                this.setState({data:this.getData()});
            }
        })
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    getChildContext(){
        return {
            mode:this.props.mode,
            select:this.props.onChange,
            onSelect:this.props.onSelect
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(!P.requal(this.props,nextProps)||nextState!=this.state);
    }
    
    
    getData(){
        let arr=STORE.getState().department;
        let data={
            name:_user.customer.name,
            open:this._open,
            checked:this._checked,
            children:getTreePath(arr)
        };
        return data;
    }
    
    
    render() {
        return (
            <DepTree data={this.state.data} check={this.props.check}/>
        );
    }
}
DepartmentTree.childContextTypes={
    mode:React.PropTypes.string,
    select:React.PropTypes.func,
    onSelect:React.PropTypes.func,
}

/**
 * 单个部门
 */
class Department extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            name:props.data.name
        }
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.click = this.click.bind(this);
        this.remove = this.remove.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({name:nextProps.data.name});
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState.name!=this.state.name);
    }

    edit(){
        W.prompt(___.edit_dep,this.props.data.name,t=>{
            if(!t)return;
            let data=this.props.data;
            let that=this;
            Wapi.department.update(function(){
                data.name=t;
                STORE.dispatch(department_act.update(data));
                that.setState({name:t});
            },{
                _objectId:data.objectId,
                name:t
            });
        });
    }

    add(){
        W.prompt(___.input_dep,this.props.data.name,t=>{
            if(!t)return;
            let pid,tp;
            if(this.props.data.objectId){
                pid=this.props.data.objectId.toString();
                tp=this.props.data.treePath+','+pid;
            }else{
                pid='0';
                tp='0';
            }
            let data={
                uid:_user.customer.objectId,
                name:t,
                parentId:pid,
                treePath:tp
            }
            Wapi.department.add(function(res){
                data.objectId=res.objectId;
                STORE.dispatch(department_act.add(data));
            },data);
        });
    }
    click(){
        if(this.context.mode=='select'&&this.context.select&&this.props.data.objectId)
            this.context.select({
                name:this.props.data.name,
                id:this.props.data.objectId
            });
        else
            this.edit();
    }
    remove(){
        let that=this;
        let ids=getAllChild(this.props.data);
        Wapi.employee.list(function(res){
            if(res.data&&res.data.length){
                W.alert(___.department_can_not_remove)
            }else{
                W.confirm(___.confirm_remove_dep,function(b){
                    if(b)
                        Wapi.department.delete(function(res){
                            STORE.dispatch(department_act.delete(that.props.data.objectId));
                        },{
                            objectId:ids.join('|')
                        })
                });
            }
        },{
            departId:ids.join('|')
        });
    }
    
    render() {
        let icons=null;
        if(!this.context.mode){
            icons=[];
            if(this.props.data.objectId){
                icons.push(<ContentRemoveCircleOutline style={sty.c} onClick={this.remove} key={'remove'}/>);
            }
            icons.push(<ContentAddCircleOutline style={sty.c} onClick={this.add} key={'add'}/>);
        }
        return (
            <div style={sty.d} onTouchStart={touchStart} onTouchEnd={touchEnd}>
                <span onClick={this.click} style={sty.sp}>{this.state.name}</span>
                {icons}
            </div>
        );
    }
}
Department.contextTypes={
    mode:React.PropTypes.string,
    select:React.PropTypes.func,
}

const DepTree=MakeTreeComponent(Department);

export class DepartmentSelcet extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            value:___.select_dep,
            isOpen:false,
        }
        this.open=this.open.bind(this);
        this.onChange=this.onChange.bind(this);
        this.back=this.back.bind(this);
    }
    open(){
        this.setState({isOpen:true});
    }
    onChange(value){
        this.setState({
            value:value.name,
        });
        this.props.onChange(value);
        if(WiStorm.agent.mobile){
            history.back();
        }else{
            this.back();
        }
    }
    back(){
        this.setState({isOpen:false});
    }
    componentWillReceiveProps(nextProps){
        let arr=STORE.getState().department;
        let depart=arr.find(ele=>ele.objectId==nextProps.value);
        if(depart){
            this.setState({value:depart.name});
        }else{
            this.setState({value:___.select_dep});
        }
    }
    render(){
        return(
            <div>
                <div onClick={this.open}>{this.state.value}</div>
                <SonPage open={this.state.isOpen} back={this.back} >
                    <DepartmentTree mode={'select'} onChange={this.onChange} open={true}/>
                </SonPage>
            </div>
        );
    }
}

function getTreePath(arr){
    let treeArr=arr.map(e=>{
        return{
            name:e.name,
            parentId:e.parentId,
            treePath:e.treePath,
            objectId:e.objectId,
        }
    });
    treeArr.forEach(e=>e.children=treeArr.filter(a=>(a.parentId==e.objectId)));
    return treeArr.filter(e=>(e.parentId=='0'));
}

function touchStart(e){
    e.target.style.background='#eee';
}
function touchEnd(e){
    e.target.style.background='#fff';
}

export default DepartmentTree;
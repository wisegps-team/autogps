import React, {Component} from 'react';

import {MakeTreeComponent} from '../_component/base/tree';

import ContentAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ContentCreate from 'material-ui/svg-icons/content/create';

import {department_act} from '../_reducers/dictionary';
import SonPage from './base/sonPage';

const sty={
    d:{
        height: '24px',
        width:'100%'
    },
    c:{
        verticalAlign: 'top',
        marginLeft:'1em',
        float: 'right',
    },
}

class DepartmentTree extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            data:this.getData()
        }
    }
    componentDidMount() {
        this.unsubscribe = STORE.subscribe(() =>{
            this.setState({data:this.getData()});
        })
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    getChildContext(){
        return {
            mode:this.props.mode,
            select:this.props.onChange
        }
    }
    getData(){
        let arr=STORE.getState().department;
        let data={
            name:_user.customer.name,
            open:true,
            children:getTreePath(arr)
        };
        return data;
    }
    
    
    render() {
        return (
            <DepTree data={this.state.data} />
        );
    }
}
DepartmentTree.childContextTypes={
    mode:React.PropTypes.string,
    select:React.PropTypes.func,
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
            Wapi.department.update(function(){
                data.name=t;
                STORE.dispatch(department_act.update(data));
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
                data.id=res.objectId;
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
    }
    
    render() {
        let icons=null;
        if(this.context.mode!='select'){
            icons=[
                <ContentCreate style={sty.c} onClick={this.edit} key={0}/>,
                <ContentAddCircleOutline style={sty.c} onClick={this.add} key={1}/>
            ]
        }
        return (
            <div style={sty.d} onClick={this.click} onTouchStart={touchStart} onTouchEnd={touchEnd}>
                {this.state.name}
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
        history.back();
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
                    <DepartmentTree mode={'select'} onChange={this.onChange} />
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
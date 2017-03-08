/**
 * 营销人员列表，部门id在goTo的时候传进来
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';


const sty={
    tem:{
        padding:'10px',
        borderBottom: '1px solid #ccc',
        lineHeight:'30px'
    },
    s:{
        marginRight:'2em'
    },
    p:{
        padding:'10px'
    },
    a:{
        color: 'rgb(26, 140, 255)',
    }
}

var thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.seller);

var category = thisView.prefetch('#editcategory',3);


thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

    
    ReactDOM.render(<EditCategory/>,category);
    category.setTitle("___.seller");

    thisView.prefetch('booking_list.js',2);
});

var _person = {
    departId: 0
}
class App extends Component{
    constructor(props) {
        super(props);
        this.state={
            depId:0,
            name:''
        }
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(!e.params)return;
            this.setState({
                depId:e.params.objectId,
                name:e.params.name
            });
        });
    }
    
    render() {
        return (
            <ThemeProvider>
                <PersonBox depId={this.state.depId}/>
            </ThemeProvider>
        );
    }
}

class PersonBox extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:[]
        }
        this.click = this.click.bind(this);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
    }
    componentDidMount() {
        Wapi.booking.aggr(res=>{
            this.aggr=res.data;
        },{
            "group":{
                "_id":{
                    "sellerId":"$sellerId"
                },
                "status0":{
                    "$sum":"$status0"
                },
                "status1":{
                    "$sum":"$status1"
                },
                "status2":{
                    "$sum":"$status2"
                },
                "status3":{
                    "$sum":"$status3"
                }
            },
            "sorts":"sellerId",
            "uid":_user.customer.objectId
        });
    }
    
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.depId!=this.props.depId){
            this.setState({data:[]});
            Wapi.employee.list(res=>{
                let data=res.data;
                data.forEach(e=>{
                    let a=this.aggr.find(a=>a._id.sellerId==e.objectId);
                    Object.assign(e,{
                        status0:0,
                        status1:0,
                        status2:0,
                        status3:0
                    },a);
                });
                this.setState({data});
            },{
                departId:nextProps.depId
            },{
                limit:-1
            });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        return(nextState.data!=this.state.data);
    }
    
    goList(emp,status){
        thisView.goTo('booking_list.js',{sellerId:emp.objectId,status});
    }
    edit(person){
        // Wapi.department.list(res => {
        //     console.log(res)
        // },{
        //     uid:_user.customer.objectId,type:1
        // })
        // console.log(person,'person')
        _person = person;
        thisView.goTo('#editcategory');
    }
    delete(person){
        // console.log(person)
        if(person.status0||person.status1){
            W.alert(___.per_delete);
            return;
        }
        W.confirm(___.confirm_remove.replace('<%name%>',person.name),e=>{
            e?Wapi.employee.delete(res=>{
                W.alert(___.delete_success);
            },{
                objectId:person.objectId
            }):null;
        });
    }
    click(i,person){
        switch (i) {
            case 0:
                this.delete(person);
                break;
            case 1:
                this.edit(person);
                break;
            default:
                break;
        }
    }
    render() {
        // console.log(this.state.data,'ceshi')
        let emp=this.state.data.map(e=>(
            <div key={e.objectId} style={sty.tem}>
                <div>
                    <span style={sty.s}>{e.name}</span>
                    <span>{e.tel}</span>
                    <RightIconMenu onClick={i=>this.click(i,e)}/>
                </div>
                <div>
                    <span style={sty.s}>{___.booking_status[0]+'：'+e.status0}</span>
                    <span style={sty.s}>{___.booking_status[1]+'：'+e.status1}</span>
                </div>
            </div>
        ));
        return (
            <div style={sty.p}>
                {emp}
            </div>
        );
    }
}


class RightIconMenu extends Component{    
    render() {
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton style={{
                        width: 'auto',
                        height: 'auto',
                        padding: 0
                    }}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                style={{
                    float: 'right'
                }}
            >
                <MenuItem onTouchTap={()=>this.props.onClick(0)}>{___.delete}</MenuItem>
                <MenuItem onTouchTap={()=>this.props.onClick(1)}>修改分类</MenuItem>
            </IconMenu>
        );
    }
}


class EditCategory extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data:[],   
        }
        this.check = this.check.bind(this);
        this.submit = this.submit.bind(this);
        this.objectId='';
        
    }
    componentDidMount(){
        category.addEventListener('show',e => {
            this.forceUpdate();
        });
        Wapi.department.list(res => {
            this.setState({data:res.data})
            console.log(res.data)
        },{
            uid:_user.customer.objectId,type:1
        })
    }
   
    check(e){
        this.objectId = e.target.value;
        console.log(this.objectId)
    }
    submit(e){
        Wapi.employee.update(function(){
            history.back()
        },{
            _objectId:_person.objectId,
            departId:this.objectId
        })
    }
    render() {
        console.log(this.state.data,'1')
        console.log(this.state.depId,'2')
        let items = this.state.data.map((ele,index) => {
           return(<RadioButton
                    key={index}
                    value={ele.objectId.toString()}
                    label={ele.name}
                    style={{marginBottom: 16}}
                />)  
        })
        const defaultvalue = _person.departId.toString()
        console.log(defaultvalue,'dff')
        return (
            <ThemeProvider>
                <div style={{padding:20}}>
                    <div style={{marginBottom:20}}>集团营销分类</div>
                    <RadioButtonGroup name="shipSpeed" onChange={this.check} valueSelected={defaultvalue}>
                       {items} 
                    </RadioButtonGroup>
                    <div style={{width:'100%',display:'block',textAlign:'center',paddingTop:'5px'}}>
                        <RaisedButton label={___.ok} primary={true} onClick={this.submit} />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}


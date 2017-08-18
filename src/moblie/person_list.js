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
        lineHeight:'30px',
        position:'relative',
        paddingLeft:'45px'
    },
    s:{
        marginRight:'2em',
        fontSize:'12px',
        color:'#666666'
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
    category.setTitle(___.seller);

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
            console.log(e.params,'e.params')
            if(e.params){
                this.setState({
                    depId:e.params.objectId,
                    name:e.params.name
                });
            }else if(_person && _person.objectId){
                this.refs.box.getData();
            };
        });
    }
    
    render() {
        return (
            <ThemeProvider>
                <PersonBox ref='box' depId={this.state.depId}/>
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
        this.getData = this.getData.bind(this);
        this.click = this.click.bind(this);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
    }
    componentDidMount() {
        console.log(this.props.depId)
        Wapi.booking.aggr(res=>{
            this.aggr=res.data;
            Wapi.promotion.list(pro => {
                console.log(pro.data,'promotion data')
                this.promotion = pro.data;
                this.getData();
            },{
                maractcompanyId:_user.customer.objectId,
            },{
                limit: -1
            })
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
            this.getData(nextProps.depId);
        }
    }
    getData(depId){
        let departId = depId||this.props.depId;
        console.log(departId,'this.departId')
        this.setState({data:[]});
        Wapi.employee.list(res=>{
            let data=res.data;
            let proTotal = {};
            let proData = [];
            // data.forEach(e => e.proTotal = 0)
            data.forEach(e=>{
                // e.proTotal = {};
                // console.log(this.aggr,'this aggr')
                // console.log(this.promotion,'this promotion')
                let a=this.aggr.find(a=>a._id.sellerId==e.objectId);
                // let b = this.promotion.find(b => b.marpersonId == e.objectId);
                let b = []
                this.promotion.forEach(p => {
                    if(p.marpersonId == e.objectId&&p.pertypeId == departId){
                        b.push(p)
                    }
                })
                e.proTotal = b.length;
                // console.log(b,'this.same data promotion b')
                // if(b){
                //     // if(e.proTotal[b.marpersonId]){
                //     //     e.proTotal[b.marpersonId]=1;
                //     // }else{
                //     //     e.proTotal[b.marpersonId]++;
                //     // }
                //     if(b.marpersonId == e.objectId){
                //         e.proTotal++;
                //     }
                // }
                Object.assign(e,{
                    status0:0,
                    status1:0,
                    status2:0,
                    status3:0
                },a);
                // console.log(e)
            });
            this.setState({data});
        },{
            departId:depId||this.props.depId
        },{
            limit:-1
        });
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
        console.log(this.state.data,'know this state data')
        let emp=this.state.data.map(e=>(
            <div key={e.objectId} style={sty.tem}>
                <div style={{position:'absolute',width:40,height:40,left:0,top:20}}>
                    <img src='../../img/head.png' style={{width:40,height:40}}/>
                </div>
                <div>
                    <span style={{marginRight:'2em'}}>{e.name}</span>
                    <span>{e.tel}</span>
                    <RightIconMenu onClick={i=>this.click(i,e)}/>
                </div>
                <div>
                    <span style={sty.s}>{'推广'+'：'+e.proTotal}</span>
                    <span style={sty.s}>{___.booking_status[0]+'：'+e.status0}</span>
                    <span style={sty.s}>{___.booking_status[1]+'：'+e.status1}</span>
                </div>
            </div>
        ));
        return (
            <div style={sty.p}>
                {emp}
                <div style={emp.length==0?{}:{display:'none'}}>{___.type_no_person}</div>
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
                style={_user.employee?{display:'none'}:{float: 'right'}}
            >
                <MenuItem onTouchTap={()=>this.props.onClick(0)}>{___.delete}</MenuItem>
                <MenuItem onTouchTap={()=>this.props.onClick(1)}>{___.edit_type}</MenuItem>
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
            this.objectId=_person.departId;
            this.forceUpdate();
        });
        Wapi.department.list(res => {
            this.setState({data:res.data})
        },{
            uid:_user.customer.objectId,type:1
        })
    }
   
    check(e){
        this.objectId = e.target.value;
        this.forceUpdate();
    }
    submit(e){
        let data={
            intent:'change',
            oldDep:_person.departId,
            newDep:this.objectId
        }
        Wapi.employee.update(()=>{
            _person.departId=this.objectId;
            W.emit(window,'depart_data_change',data);
            history.back();
        },{
            _objectId:_person.objectId,
            departId:this.objectId
        })
    }
    render() {
        let items = this.state.data.map((ele,index) => {
           return(<RadioButton
                    key={index}
                    value={ele.objectId.toString()}
                    label={ele.name}
                    style={{marginBottom: 16}}
                />)  
        })
        return (
            <ThemeProvider>
                <div style={{padding:20}}>
                    <div style={{marginBottom:20}}>集团营销分类</div>
                    <RadioButtonGroup name="shipSpeed" onChange={this.check} valueSelected={this.objectId}>
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


/**
 * 营销人员列表，部门id在goTo的时候传进来
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';

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

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('booking_list.js',2);
});


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
                <AppBar 
                    title={this.state.name} 
                />
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
    render() {
        let emp=this.state.data.map(e=>(
            <div key={e.objectId} style={sty.tem}>
                <div>
                    <span style={sty.s}>{e.name}</span>
                    <span>{e.tel}</span>
                </div>
                <div>
                    <span style={sty.s}>{___.booking_status[0]+'：'}<a style={sty.a} onClick={()=>this.goList(e,0)}>{e.status0}</a></span>
                    <span style={sty.s}>{___.booking_status[1]+'：'}<a style={sty.a} onClick={()=>this.goList(e,1)}>{e.status1}</a></span>
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
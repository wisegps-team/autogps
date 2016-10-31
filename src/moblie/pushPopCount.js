//做分页后

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import Card from 'material-ui/Card';
import AppBar from '../_component/base/appBar';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';


const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    // list_item:{marginTop:'15px',padding:'10px',borderBottom:'1px solid #999999'},
    card:{margin:'15px',padding:'10px'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    hide:{display:'none'},
    line:{marginTop:'0.5em'},
    bold:{fontWeight:'bold'},
};

var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(e){
    ReactDOM.render(<PushPopCount params={e.params}/>,thisView);
});


class Dlist extends Component{
    constructor(props,context){
        super(props,context);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.data[0].did 
            &&(this.props.data[0].did!=nextProps.data[0].did||this.props.data[0].type!=nextProps.data[0].type)){

            // console.log('Dlist receive nextProps');
            // console.log(ReactDOM.findDOMNode(this.refs.list).scrollTop);
            // console.log(ReactDOM.findDOMNode(this.refs.card0).scrollTop);
            // console.log(this.refs.list.getBoundingClientRect().top);
            // console.log(this.refs.list.getBoundingClientRect().bottom);
            
            // this.refs.list.getBoundingClientRect().top=65;
        }
    }
    
    render() {
        let items=this.props.data.map((ele,i)=>
            <Card key={i} style={styles.card} ref={'card'+i}>
                <div>{ele.brand+' '+ele.model}</div>
                <div style={ele.fromName=='0' ? styles.hide : styles.line}>
                    {ele.type==1 ? ___.fromName+' '+ele.fromName : ___.toName+' '+ele.toName}
                </div>
                <div style={styles.line}>{___.time+' '+W.dateToString(W.date(ele.createdAt))}</div>
                <div style={styles.line}>{___.num+' '+ele.did.length}</div>
                <div style={styles.line}><a onClick={()=>this.context.toDidList(ele)} style={styles.a}>IMEI</a></div>
            </Card>);
        return(
            <div ref='list'>
                {items}
            </div>
        )
    }
}
Dlist.contextTypes ={
    toDidList:React.PropTypes.func,
}
let Alist=AutoList(Dlist);
class PushPopCount extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            curLog:null,
            showDid:false,
            data:[],
            total:-1,
        }
        this.par={
            uid:_user.customer.objectId,
        }
        this.op={
            page_no:1,
            limit:20,
            sorts:'-createdAt',
        }

        this.getData = this.getData.bind(this);
        this.toDidList = this.toDidList.bind(this);
        this.showDidBack = this.showDidBack.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }
    getChildContext(){
        return {
            toDidList:this.toDidList,
        };
    }
    // componentDidMount() {
    //     thisView.addEventListener('message',function (e) {
    //         console.log('收到"'+e.from+'"post过来的信息'+JSON.stringify(e.data));
    //     })
    // }
    
    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.params){
    //         this.par=Object.assign(this.par,nextProps.params);
    //     }
    // }
    componentDidMount() {
        thisView.addEventListener('message',(e)=>{
            console.log('收到"'+e.from+'"post过来的信息'+JSON.stringify(e.data));
            if(e.data){
                if((this.par.modelId && (e.data.modelId!=this.par.modelId || e.data.type!=this.par.type))
                    ||(this.par.from && (this.par.from!=e.data.from || this.par.to!=e.data.to))){
                        
                    this.op.page_no=1;
                    this.state.data=[];
                    // window.scrollTo(0,0);
                    // this.refs.list.scrollTop=0;
                    // console.log(ReactDOM.findDOMNode(this.refs.list).scrollTop);
                    // console.log(this.refs.list.getBoundingClientRect().top);
                    // ReactDOM.findDOMNode(this.refs.list).scrollTop=0;
                    // this.refs.list.getDOMNode().scrollTop=0;
                    this.refs.list.toTop();
                }
                
                this.par=Object.assign(this.par,e.data);
            }
            this.getData();
        });

        if(this.props.params){
            this.par=Object.assign(this.par,this.props.params);
        }
        this.getData();
    }
    
    getData(){
        Wapi.deviceLog.list(res=>{
            this.setState({
                data:res.data,
                total:res.total,
            });
        },this.par,this.op);
    }
    toDidList(log){
        this.setState({
            curLog:log,
            showDid:true
        });
    }
    showDidBack(){
        this.setState({
            curLog:null,
            showDid:false
        });
    }
    nextPage(){
        this.op.page_no++;
        console.log('nextPage');
        Wapi.deviceLog.list(res=>{
            this.setState({
                data:this.state.data.concat(res.data)
            });
        },this.par,this.op);
    }
    render() {
        // console.log('push pop count render');
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        style={{position:'fixed',top:'0px'}}
                    />
                    <div style={styles.main}>
                        <Alist 
                            ref={'list'}
                            max={this.state.total} 
                            limit={20} 
                            data={this.state.data} 
                            next={this.nextPage} 
                        />
                    </div>
                    <SonPage title={this.props.intent=='push'?___.push_record:___.pop_record} open={this.state.showDid} back={this.showDidBack}>
                        <DidList data={this.state.curLog}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}
PushPopCount.childContextTypes={
    toDidList:React.PropTypes.func,
}


class DidList extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            data:{createdAt:'0',did:[]},
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.setState({data:nextProps.data});
        }
    }
    
    render() {
        let data=this.state.data;
        let items=this.state.data.did.map((ele,i)=><p key={i}>{ele}</p>);
        return (
            <div style={styles.card}>
                <div><span style={styles.bold}>{___.time}</span>{' '+W.dateToString(W.date(data.createdAt))}</div>
                <div style={styles.line}><span style={styles.bold}>{___.num}</span>{' '+data.did.length}</div>
                <div style={styles.line}><span style={styles.bold}>{___.device_id}</span></div>
                <div style={{textAlign:'center'}}>{items}</div>
            </div>
        );
    }
}


export default PushPopCount;
//做分页后

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import Card from 'material-ui/Card';
// import AppBar from '../_component/base/appBar';

import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/base/autoList';


const styles = {
    main:{paddingBottom:'20px'},
    // list_item:{marginTop:'15px',padding:'10px',borderBottom:'1px solid #999999'},
    card:{margin:'15px',padding:'10px',borderBottom: '1px solid #ccc'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    hide:{display:'none'},
    line:{marginTop:'0.5em'},
    bold:{fontWeight:'bold'},
    right:{float:'right'}
};

var thisView=window.LAUNCHER.getView();//第一句必然是获取view
let _from='productlog_list';
thisView.addEventListener('load',function(e){
    ReactDOM.render(<PushPopCount params={e.params}/>,thisView);

    _from=e.params.page_from;//判断传过来的page，然后删除此属性
    delete e.params.page_from;

    if(e.params.type==1){
        thisView.setTitle(___.push_count);
    }else if(e.params.type==0){
        thisView.setTitle(___.pop_count);
    }
        
    let didView=thisView.prefetch('#pop',3);
    didView.setTitle(___.pop);
    ReactDOM.render(<DidList/>,didView);
});


class Dlist extends Component{
    constructor(props,context){
        super(props,context);
    }
        
    render() {
        console.log(this.props.data);
        // let items=this.props.data.map((ele,i)=>
        //     <Card key={i} style={styles.card} ref={'card'+i}>
        //         <div>{ele.brand+' '+ele.model}</div>
        //         <div style={ele.fromName=='0' ? styles.hide : styles.line}>
        //             {ele.type==1 ? ___.fromName+' '+ele.fromName : ___.toName+' '+ele.toName}
        //         </div>
        //         <div style={styles.line}>{___.time+' '+W.dateToString(W.date(ele.createdAt))}</div>
        //         <div style={styles.line}>{___.num+' '+ele.did.length}</div>
        //         <div style={styles.line}><a onClick={()=>this.context.toDidList(ele)} style={styles.a}>IMEI</a></div>
        //     </Card>);
        let items=this.props.data.map((ele,i)=>
            <div key={i} style={styles.card} ref={'card'+i}>
                <div style={{float:'right',marginTop:'0.5em',color:'#0000cc'}} onClick={()=>this.context.toDidList(ele)}>{ele.did.length}</div>
                <div style={_from=='cust_list' ? styles.line : styles.hide}>
                    {ele.brand+' '+ele.model}
                </div>
                <div style={styles.line}>{W.dateToString(W.date(ele.createdAt))}</div>
                <div style={ele.type==0 ? styles.line : styles.hide}>
                    {ele.toName}
                </div>
            </div>);
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
    componentDidMount() {
        thisView.addEventListener('message',(e)=>{
            // console.log('收到"'+e.from+'"post过来的信息'+JSON.stringify(e.data));
            
            _from=e.data.page_from;//判断传过来的page，然后删除此属性
            delete e.data.page_from;

            if(e.data){
                //重置par和op
                this.par={
                    uid:_user.customer.objectId,
                }
                this.op={
                    page_no:1,
                    limit:20,
                    sorts:'-createdAt',
                }
                console.log('settitle');
                if(e.data.type==1){//根据传递过来的type修改当前页面的标题（出库或者入库）
                    thisView.setTitle(___.push_count);
                }else if(e.data.type==0){
                    thisView.setTitle(___.pop_count);
                }
                this.state.data=[];                
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
        // console.log('nextPage');
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
                    {/*<AppBar 
                        style={{position:'fixed',top:'0px'}}
                    />*/}
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
                {items}
            </div>
        );
    }
}


export default PushPopCount;
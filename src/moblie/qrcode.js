/**
 * 2016/12/14
 * jianghai
 * 二维码管理页面
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import AutoList from '../_component/base/autoList';
import AppBar from '../_component/base/appBar';
import Input from '../_component/base/input';
import {randomStr} from '../_modules/tool';

var thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.qrcode_manage);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    
    let addView=thisView.prefetch('#add',3);
    ReactDOM.render(<AddQrCode/>,addView);
    addView.setTitle(___.qrcode_manage);
});

const EVENT={
    ADDED:randomStr()
}
const S_URL='https://t.autogps.cn/?s=';

const styles = {
    appBody:{paddingTop:'50px'},
    main:{padding:'10px'},
    center:{textAlign:'center'},
    inputGroup:{display:'block',paddingTop:'1em',paddingBottom:'1em'},
    card:{
        padding:'10px',
        borderBottom:'1px solid #ccc'
    },
    span:{marginRight:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    h2:{
        color:'#ccc',
        textAlign:'center'
    },
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

class Dlist extends Component{
    componentDidMount() {
        //绑定统计
        Wapi.qrLink.aggr(res=>{
            res.data.forEach(ele=>this.props.data.find(e=>e.objectId==ele._id.batchId).bindNum=ele.bindNum);
            this.forceUpdate();
        },{
            "group":{
                "_id":{
                    "batchId":"$batchId",
                    "type":"$type",
                },
                "bindNum":{
                    "$sum":"$status"
                }
            },
            "sorts":"batchId",
            "batchId":this.props.data.map(e=>e.objectId).join('|')
        });

        //扫描统计（未完成）
    }
    
    render() {
        let data=this.props.data
        let items=data.map(ele=>
            <div key={ele.objectId} style={styles.card}>
                <div style={{marginLeft:'3px',marginBottom:'10px'}}>
                    {ele.name}<br/>
                    <span style={{color:'rgb(84, 175, 185)'}}>{S_URL+ele.min+'-'+ele.max}</span>
                </div>
                <div style={{marginLeft:'3px',fontSize:'0.8em'}}>
                    <span style={styles.span}>{___.enabled_num+'：'+(ele.num||0)}</span>
                    <span style={styles.span}>{___.bind_count+'：'+(ele.bindNum||0)}</span>
                    <span style={styles.span}>{___.scan_count+'：'+(ele.scanNum||0)}</span>
                </div>
            </div>
        );
        return (
            <div style={styles.main}>
                {items}
            </div>
        );
    }
}
let Alist=AutoList(Dlist);

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.add = this.add.bind(this);
        this.state={
            total:0,
            data:null,
            search:[]
        };
        this.op={//控制排序字段与页数
            page:'objectId',
            sorts:'objectId',
            page_no:1
        };
        this._data={//筛选条件
            uid:_user.customer.objectId,
            type: '0|1'
        };

        this.next = this.next.bind(this);
        this.added = this.added.bind(this);
        this.search = this.search.bind(this);
    }
    componentDidMount() {
        Wapi.qrDistribution.list(res=>this.setState(res),this._data);
        window.addEventListener(EVENT.ADDED,this.added); 
    }
    componentWillUnmount() {
        window.removeEventListener(EVENT.ADDED,this.added);
    }
    added(e){//添加了一个
        let item=e.params;
        this.setState({
            total:this.state.total+1,
            data:this.state.data.concat([item])
        });
    }
    next(){//加载下一页
        this.op.page_no++;
        Wapi.qrDistribution.list(res=>{
            let data=this.state.data.concat(res.data);
            res.data=data;
            this.setState(res);
        },this._data,this.op);
    }
    add(){
        thisView.goTo('#add');
    }
    search(e,val){
        if(!val){
            this.setState({search:[]});
            return;
        }
        let data=Object.assign({},this._data);
        data.name='^'+val;
        Wapi.qrDistribution.list(res=>{
            this.setState({search:res.data});
        },data);
    }
    render() {
        let list=(this.state.data&&this.state.data.length)?(<Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.next} 
            />):(<h2 style={styles.h2}>{___.qr_list_null}</h2>);
        let listDis={};
        let searchList=null;
        if(this.state.search.length){
            searchList=<Dlist data={this.state.search}/>;
            listDis.display='none';
        }
        return (
            <ThemeProvider>
                <div style={{
                    display: 'flex',
                    paddingLeft: '10px',
                    paddingRight: '5px',
                    alignItems: 'center'
                }}>
                    <Input 
                        onChange={this.search} 
                        hintText={___.search} 
                    />
                    <IconButton onClick={this.add} style={{flex:'0 0'}}><ContentAdd/></IconButton>
                </div>
                <div style={listDis}>
                    {list}
                </div>
                {searchList}
            </ThemeProvider>
        );
    }
}


class AddQrCode extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            type:1,
            name:'',
            num:0,
        }
        this.typeChange = this.typeChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.numChange = this.numChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    typeChange(e,k,value){
        this.setState({type:value});
    }
    nameChange(e,value){
        this.setState({name:value});
    }
    numChange(e,value){
        this.setState({num:value});
    }
    submit(){
        if(!this.state.name||this.state.name==''){
            W.alert('name empty');
            return;
        }
        if(!this.state.num||this.state.num==''){
            W.alert('num empty');
            return;
        }
        let num=parseInt(this.state.num);
        if(isNaN(num)){
            W.alert('请输入正确的数量');
            return;
        }
        let data=Object.assign({},this.state);
        data.num=num;
        data.uid=_user.customer.objectId;
        Wapi.qrDistribution.list(res=>{//获取最后一条记录
            let min=res.data.length?res.data[0].max+1:0;
            data.min=min;
            data.max=min+data.num-1;
            Wapi.qrDistribution.add(res=>{
                data.objectId=res.objectId;
                W.emit(window,EVENT.ADDED,data);
                history.back();
                this.setState({
                    name:'',
                    num:''
                });
            },data);
        },{
            objectId:'>0'
        },{
            sorts:'-objectId',
            page:'objectId',
            limit:1
        });
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <div>
                    <div style={combineStyle(['main','center'])}>
                        
                        <div style={styles.inputGroup}>
                            <span >{___.type}</span>
                            <span style={{paddingLeft:'1em',paddingTop:'20px'}}>
                                <SelectField name='type' value={this.state.type} onChange={this.typeChange} style={{width:'200px',textAlign:'left'}} labelStyle={{top:'0px'}}>
                                    <MenuItem value={1} primaryText={___.act_data} />
                                    {/*<MenuItem value={2} primaryText="移车卡" />*/}
                                </SelectField>
                            </span>
                        </div>
                        <div style={styles.inputGroup}>
                            <span >{___.name}</span>
                            <span style={{paddingLeft:'1em'}}>
                                <Input name='name' value={this.state.name} onChange={this.nameChange} style={{height:'30px',width:'200px'}} inputStyle={{height:'20px'}}/>
                            </span>
                        </div>
                        <div style={styles.inputGroup}>
                            <span >{___.num}</span>
                            <span style={{paddingLeft:'1em'}}>
                                <Input 
                                    name='num' 
                                    value={this.state.num} 
                                    onChange={this.numChange} 
                                    style={{height:'30px',width:'200px'}} 
                                    inputStyle={{height:'20px'}}
                                    type="tel"
                                />
                            </span>
                        </div>

                        <RaisedButton onClick={this.submit} label={___.ok} primary={true} style={{marginTop:'20px'}}/>
                    </div>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


export default App;

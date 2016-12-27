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

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    
    let addView=thisView.prefetch('#add',3);
    ReactDOM.render(<AddQrCode/>,addView);
});

const EVENT={
    ADDED:randomStr()
}
const S_URL='http://autogps.cn/?s=';

const styles = {
    appBody:{paddingTop:'50px'},
    main:{padding:'10px'},
    center:{textAlign:'center'},
    inputGroup:{display:'block',paddingTop:'1em',paddingBottom:'1em'},
    card:{margin:'10px',padding:'10px'},
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
        render() {
            let data=this.props.data
            let items=data.map(ele=>
                <Card key={ele.objectId} style={styles.card}>
                    <div style={{marginLeft:'3px',marginBottom:'10px'}}>{ele.name}</div>
                    <div style={{marginLeft:'3px',fontSize:'0.8em'}}>
                        <span style={styles.span}>{___.enabled_num+'：'+(ele.openNum||0)}</span>
                        <span style={styles.span}>{___.bind_count+'：'+(ele.bindNum||0)}</span>
                        <span style={styles.span}>{___.scan_count+'：'+(ele.scanNum||0)}</span>
                    </div>
                    <div style={styles.bottom_btn_right}>
                        <FlatButton label={___.print_qr} primary={true} onClick={e=>W.alert(S_URL+ele.min+'-'+ele.max)}/>
                    </div>
                </Card>
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
            data:null
        };
        this.op={//控制排序字段与页数
            page:'objectId',
            sorts:'objectId',
            page_no:1
        };
        this._data={//筛选条件
            uid:_user.customer.objectId
        };

        this.next = this.next.bind(this);
        this.added = this.added.bind(this);
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
        Wapi.customer.list(res=>{
            let data=this.state.data.concat(res.data);
            res.data=data;
            this.setState(res);
        },this._data,this.op);
    }
    add(){
        thisView.goTo('#add');
    }
    render() {
        let list=(this.state.data&&this.state.data.length)?(<Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.next} 
            />):(<h2 style={styles.h2}>{___.qr_list_null}</h2>);
        return (
            <ThemeProvider>
                <AppBar 
                    title={___.qrcode_manage}
                    style={{position:'fixed',top:'0px'}}
                    iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
                />
                <div style={styles.appBody}>
                    {list}
                </div>
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
        if(this.state.name==''){
            W.alert('name empty');
            return;
        }
        if(this.state.num==''){
            W.alert('num empty');
            return;
        }
        let data=Object.assign({},this.state);
        data.uid=_user.customer.objectId;
        Wapi.qrDistribution.list(res=>{//获取最后一条记录
            let min=res.data.length?res.data[0].max+1:0;
            data.min=min;
            data.max=min+data.num-1;
            Wapi.qrDistribution.add(res=>{
                data.objectId=res.objectId;
                W.emit(window,EVENT.ADDED,data);
                history.back();
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
                <AppBar 
                    title={___.add}
                    style={{position:'fixed',top:'0px'}}
                />
                <div style={styles.appBody}>
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

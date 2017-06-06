import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { blue500 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import TextField from 'material-ui/TextField'
import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("一物一码");
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

});

const S_URL='http://autogps.cn/?s=';

class App extends Component {
    constructor(props,context){
        super(props,context)
        this.state ={
            data:[],
            total:null,
            showCar: false,
            searchKey:'',
            search:[]
        }
        this._data = {
            uid:_user.customer.objectId,
            type:2
        }
        this.op={//控制排序字段与页数
            page:'objectId',
            sorts:'objectId',
            page_no:1
        };
        this.showCar = this.showCar.bind(this);
        this.hideCar = this.hideCar.bind(this);        
        this.next = this.next.bind(this);
        this.search = this.search.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e => {
            // console.log(e)
            Wapi.qrDistribution.list(res=>this.setState(res),this._data);
            this.forceUpdate()
        })
        
    }
    showCar() {
        this.setState({ showCar: true })
        this.forceUpdate()
    }
    hideCar() {
        this.setState({ showCar: false })
        this.forceUpdate()
    }
    next(){
        this.op.page_no++;
        Wapi.qrDistribution.list(res=>{
            let data=this.state.data.concat(res.data);
            res.data=data;
            this.setState(res);
        },this._data,this.op);
    }
    search(e,val){
        if(!val){
            this.setState({search:[]});
            this.setState({searchKey: ''});
            return;
        }else{
            this.setState({searchKey: val});
        }
        let data=Object.assign({},this._data);
        data.name='^'+val;
        let that = this;
        Wapi.qrDistribution.list(res=>{
            that.setState({search:res.data});
            that.forceUpdate();
        },data);
    }
    render(){
        // console.log(this.state.data)
        let list=(this.state.data&&this.state.data.length)?(<Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.next} 
            />):null;
        let listDis={};
        // let searchList=null;
        // if(this.state.searchKey !== '' || this.state.search.length){
        //     searchList=<Dlist data={this.state.search}/>;
        //     listDis.display='none';
        // }else{

        //     listDis.display='block';
        // }
        return(
            <ThemeProvider>
                <div style={{background:'#f7f7f7',minHeight:'100vh'}}>
                    <div style={{background:'#f7f7f7', height: 48, lineHeight: 48}}>
                        {/*{
                            this.state.data&&this.state.data.length?
                            <TextField 
                                hintText={___.search}
                                onChange={this.search}
                                style={{width:'85%',background:'#fff'}} 
                                hintStyle={{paddingLeft:10}}
                                inputStyle={{padding: '0px 0px 0px 10px'}}
                                underlineStyle={{bottom:'0px',borderBottomColor:'#f7f7f7'}} 
                                underlineFocusStyle={{borderBottomColor:'#2196f3'}}
                            />
                            :
                            null
                        }*/}
                        <IconButton style={{ float: 'right', verticalAlign: 'center' }} onClick={this.showCar}><ContentAdd color={blue500} /></IconButton>
                    </div>
                    <div style={listDis}>
                        {list}
                    </div>                    
                    {/*{searchList}*/}
                    <div style={{ borderBottom: '1px solid #f7f7f7', padding: '10px', background: '#fff', fontSize: 12 }}>
                        <p style={{ textIndent: '2em', marginTop: 0, marginBottom: 0 }}>{'点击＋根据印刷数量创建挪车贴号段，将号段链接分别生成二维码后即可设计印刷挪车贴。'}</p>
                    </div>                      
                </div>
                <SonPage open={this.state.showCar} back={this.hideCar}>
                    <MoveCar />
                </SonPage>
            </ThemeProvider>
        )
    }
}



class Dlist extends Component {
    constructor(props,context){
        super(props,context)
        this.delete = this.delete.bind(this);
    }
    delete(name, objectId, bind_num) {
        var that = this;
        return function(){
            if(bind_num > 0){
                 W.alert('该号段已有绑定，无法删除！');
                 return;
            }
            W.confirm(___.confirm_remove.replace('<%name%>', name), e => {
                e ? Wapi.qrDistribution.delete(res => {
                    // W.alert(___.delete_success);
                    W.emit(thisView,'show');//触发事件
                    // this.forceUpdate();
                }, {
                    objectId: objectId
                }) : null;
            });
        }
    }
    render() {
        let data=this.props.data
        // console.log(data,'data')
        let items=data.map(ele=>
            <div key={ele.objectId} style={{ padding:'10px',borderBottom:'1px solid #f7f7f7'}}>
                <div style={{marginLeft:'3px',marginBottom:'10px'}}>
                    {ele.name}
                    <RightIconMenu onClick={this.delete(ele.name, ele.objectId, ele.bind_num)}/>
                    <br/>
                    <span style={{color:'rgb(84, 175, 185)'}}>{S_URL+ele.min+'-'+ele.max}</span>
                </div>
                <div style={{marginLeft:'3px',fontSize:'0.8em'}}>
                    <span style={{marginRight:'1em'}}>{'数量'+'：'+(ele.num||0)}</span>
                    <span style={{marginRight:'1em'}}>{'绑定'+'：'+(ele.bind_num||0)}</span>
                    <span style={{marginRight:'1em'}}>{"挪车"+'：'+(ele.move_num||0)}</span>
                </div>
            </div>
        );
        return (
            <div style={{background:'#fff'}}>
                {items}
            </div>                    
        )
    }
}
let Alist=AutoList(Dlist);

class RightIconMenu extends Component{    
    render() {
        let item=[
            <MenuItem key={0} onTouchTap={()=>this.props.onClick()}>{___.delete}</MenuItem>
        ];
        let items=item;
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
                {items}
            </IconMenu>
        );
    }
}

//创建一物一码挪车贴
class MoveCar extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            type: 2,
            name: '',
            num: '',
        }
        // this.typeChange = this.typeChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.numChange = this.numChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    nameChange(e, value) {
        this.setState({ name: value });
        console.log(value)
    }
    numChange(e, value) {
        this.setState({ num: value });
        console.log(value)
    }
    submit() {
        if (!this.state.name || this.state.name == '') {
            W.alert('请输入名称');
            return;
        }
        if (!this.state.num || this.state.num == '') {
            W.alert('请输入印刷数量');
            return;
        }
        let num = parseInt(this.state.num);
        // console.log(num!=this.state.num)
        if ((this.state.num != num)) {
            W.alert('请输入正确的数量');
            return;
        }
        if (isNaN(num)) {
            W.alert('请输入正确的数量');
            return;
        }
        let data = Object.assign({}, this.state);
        data.num = num;
        data.uid = _user.customer.objectId; //创建者uid
        Wapi.qrDistribution.list(res => {//获取最后一条记录的最大值
            let min = res.data.length ? res.data[0].max + 1 : 0;
            data.min = min;
            data.max = min + data.num - 1;
            Wapi.qrDistribution.add(res => {
                data.objectId = res.objectId;
                // W.emit(window, 'addOneQr', data);
                W.emit(thisView,'show');//触发事件
                history.back();
                this.setState({
                    name: '',
                    num: ''
                });
            }, data);
        }, {
                objectId: '>0'
            }, {
                sorts: '-objectId',
                page: 'objectId',
                limit: 1
            });
    }
    render() {
        return (
            <div style={{ background: '#f7f7f7', minHeight: '100vh', paddingTop: 20 }}>
                <div style={{ background: '#fff' }}>
                    <TextField
                        hintText="名称"
                        value={this.state.name}
                        onChange={this.nameChange}
                        style={{ width: '100%' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ padding: '0px 0px 0px 10px' }}
                        underlineStyle={{ bottom: 0, borderBottomColor: '#f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                    <TextField
                        hintText="印刷数量"
                        value={this.state.num}
                        onChange={this.numChange}
                        style={{ width: '100%' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ padding: '0px 0px 0px 10px' }}
                        underlineStyle={{ bottom: '0px', borderBottomColor: '#f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <RaisedButton label="创建" primary={true} onClick={this.submit} />
                </div>
            </div>
        )
    }
}

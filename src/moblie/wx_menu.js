import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '../_theme/default';


import { Menu, MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import { List, ListItem } from 'material-ui/List';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { blue500 } from 'material-ui/styles/colors';
import Input from '../_component/base/input';
import Dialog from 'material-ui/Dialog';
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard';
import ContentClear from 'material-ui/svg-icons/content/clear'
import dragula  from 'react-dragula';


let _par = null
const thisView = window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("自定义菜单");
thisView.addEventListener('load', function (e) {
    ReactDOM.render(<App />, thisView);
    console.log(e.params,'am');
    _par = e.params
});


const domain = [
    WiStorm.config.domain.user,
    location.hostname
]
const stys={
    p:{
        borderBottom: '1px solid #ccc',
        paddingBottom:'1em'
    },
    pp:{
        padding:'10px'
    },
    wxbox:{'padding':'10px',textAlign:'right'},
    box:{
        display:'flex',
        flexWrap: 'wrap'
    },
    b:{
        flex:'1 0 50%'
    },
    h4:{textAlign:'left'},
    m:{
        marginTop: '10px',
        marginLeft: '10px'
    },
    menu:{
        display:'flex',
        position: 'absolute',
        width: '100%',
        bottom: '0px',
        borderTop: '1px solid #aaa',
        textAlign: 'center',
        background:'#f4f4f4',
        color: '#000'
    },
    mi:{
        flex:'1 1 33%',
        // width:'33%',
        lineHeight:'3em',
        borderRight:'1px solid #aaa',
        position: 'relative'
    },
    k:{
        borderRight: '1px solid rgb(170, 170, 170)',
        padding: '0 0.6em',
        paddingTop: '0.8em'
    },
    son_menu:{
        display:'inline-block',
        border: '1px solid #aaa',
        background:'#fafafa',
        // borderBottom: '0px',
        position: 'absolute',
        left: 0,
        bottom: 57,
        width: '98%'
    },
    so_menu1:{
        display:'inline-block',
        border: '1px solid #aaa',
        background:'#fafafa',
        // borderBottom: '0px',
        position: 'absolute',
        left: 0,
        bottom: 57,
        width: '98%'
    },
    sm:{
        // padding:'0 1em',
        borderBottom:'1px solid #aaa'
    },
    sw:{
        width: '200%',
        position: 'absolute',
        bottom: '100%',
        right: '-50%'
    },
    add:{
        margin:' 0 1.5em',
        verticalAlign: 'middle',
    },
    add1:{
        verticalAlign: 'middle',
    },
    save:{
        marginTop:'20vh',
        marginLeft:'30%',
        width:'40%'
    }
}
const sty = {
    h4: { textAlign: 'left', wordBreak: 'break-all' },
    wxbox: { padding: '10px', textAlign: 'left', background: '#f7f7f7', height: '100%' },
    title: {fontSize: '16px', fontWeight: 'bold', padding: '5px'},
    subtitle: {fontSize: '14px', fontWeight: 'bold', padding: '5px'},
    content: {fontSize: '14px', padding: '2px', color: '#666', wordBreak: 'break-all'},
    buttonbar: {textAlign: 'center'},
    input: {top: '-4px', height: '40px', fontSize: '14px'},
    inputContent: {fontSize: '14px', padding: '0px 2px 0px 2px'},
    highlight: {color: blue500}
}

class App extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            top:0,
            left:0
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        //拖拽
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    componentDidMount(){
        console.log(_par,'par');
        thisView.addEventListener('show',function (e) {
            // _this.setState({
            //     books:[],
            //     total:0,
            // });
            // _this.page=1;
            if(e.params){
                // _this._data=e.params;
                console.log(e.params,'do')
            }else{
                // _this._data=_par;
                console.log(_par,'par')
            }
            // this.gotData=false;
            // _this.getData(_this._data);
        });
    }
    handleMouseEnter(e){
        // this.setState({cursor:'move'});
        console.log(e)
    }
    handleMouseLeave(e){
        // this.setState({cursor:'pointer',isDragging:false});
        console.log(e)
    }
    handleClick(){
        // var newS = false;
        // this.setState({display: newS});
        // this.props.callbackParent(newS);
        console.log(e)
    }
    handleMouseDown(e){
        // this.setState({
        //     top:e.touches[0].pageY,
        //     left:e.touches[0].pageX,
        //     isDragging:true});
        console.log(e.touches[0].pageX,e.touches[0].pageY,'start');
        e.touches[0].target.style.top=e.touches[0].pageY
        e.touches[0].target.style.left=e.touches[0].pageX
        console.log(e.touches[0].target.style);
        console.log(this.refs['user'].style,'dfd')
    }
    handleMouseMove(e){
        e.touches[0].target.style.top=e.touches[0].pageY
        e.touches[0].target.style.left=e.touches[0].pageX
        // console.log(e.touches[0].target.style.top)
        this.forceUpdate()

    //     if(this.state.isDragging === true){
    //     const moveX = e.pageX - this.state.clientx +this.props.top;
    //     const moveY = e.pageY - this.state.clienty+this.props.left;
    //     this.props.callbackParent1(moveX,moveY);
    // }else{
    //         return false;
    //     }
        // document.addEventListener('mousemove',e=>{
        //     console.log(e)
        // })
        var e = e||window.event;
        // console.log(e.target)
        // console.log(e.touches[0],'move');
        console.log(e.touches[0].pageX,e.touches[0].pageY,'start')
    }
    handleMouseUp(e){
        // e.preventDefault();
        // this.setState({
        //     isDragging:false,
        //     clientx:null,
        //     clienty:null
        // });
        e.preventDefault()
        console.log(e.touches,e.targetTouches,'up')
    }
    render(){
        let bt = [1,3,5];
        let top = this.state.top;
        let left = this.state.left
        let itme = bt.map((ele,index)=>{
            return(<div 
                    key={index} 
                    ref={'user'}
                    style={{background:'#44f3f3',position:'relative'}} 
                    onMouseEnter ={this.handleMouseEnter} 
                    onTouchCancel={this.handleMouseLeave} 
                    onTouchStart={this.handleMouseDown} 
                    onTouchMove={this.handleMouseMove} 
                    onTouchEnd={this.handleMouseUp}>{ele}</div>)
        })
        return(
            <ThemeProvider style={{ background: '#f7f7f7', minHeight: '100vh' }}>
                <div>
                    {/*{itme}*/}
                    {/*<Appa />*/}
                    <MenuBox/>
                </div>  
            </ThemeProvider>
        )
    }
}


class MenuBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            button:[],
            showDilog:false,
            wx:null,
            edit:false,
            name:null,
            url:null,
            showurl:false,
            wxMenu:null,
            value:0,
            menuValue:0,
            menuSort:false,
            firCan:false,
            secCan:false
        }
        this.addFirstButton = this.addFirstButton.bind(this);
        this.addSecondButton = this.addSecondButton.bind(this);
        this.selectFirst = this.selectFirst.bind(this);
        this.selectSecond = this.selectSecond.bind(this);
        this.getValueName = this.getValueName.bind(this);
        this.getValueUrl = this.getValueUrl.bind(this);
        this.submit = this.submit.bind(this);
        this.menuValue = this.menuValue.bind(this);
        this.close = this.close.bind(this);
        this.finish = this.finish.bind(this);
        this.delete = this.delete.bind(this);
        this.menuSort = this.menuSort.bind(this);
        this.finishSort = this.finishSort.bind(this);
        this.firstBut = 0;
        this.secondBut = null;
        this.value = {};
        this.flat = 0;
        this.same = null;
        this.shorts = false;
        this.secondButton = null;
        this.firstButton = null;
        this.secCan = false;
        this.firCan = false;
        this.secSor = null;
        this.sub_button = null;

        
    }
    componentDidMount(){
        thisView.addEventListener('show', e=>{
            if(e.params){
                // _this._data=e.params;
                console.log(e.params,'df')
                this.getwxMenu(e.params)
            }else{
                // _this._data=_par;
                this.getwxMenu(_par)
                console.log(_par,'fd')
            }
        });
        
    }
    
    getwxMenu(wx){
        this.setState({wx:wx})
        Wapi.weixin.get(res => {
            console.log(res,'resresres');
            this.setState({button:res.data.menu.button||[]})
        },{
            wxAppKey:wx.wxAppKey
        },{
            fields:'objectId,uid,name,type,wxAppKey,fileName,menu,wxAppSecret,template'
        })
        Wapi.wxMenu.list(res => {
            this.setState({wxMenu:res.data})
            if(res.data.length){
                this.setState({value:0})
                this.value.name = res.data[0].menuName;
                this.value.url = res.data[0].menuUrl;
            }else{
                this.setState({value:1})
            }
        },{
            objectId:'>0'
        })
    
    }
    addFirstButton(){
        this.setState({showDilog:true})
        this.state.button.forEach(ele => {
            ele.isshow = false
        })
        let op = {
            "type": "view", 
            "name": "菜单名称", 
            "url": "", 
            "isshow":true,
            "sub_button": [ ]
        }
        this.state.button.push(op)
        this.firstBut = this.state.button.length-1;
        console.log(this.state.button)
        this.setState({button:this.state.button});
        if(this.state.value === 0){
            if(this.state.wxMenu.length){
                this.value.name = this.state.wxMenu[0].menuName;
                this.value.url = this.state.wxMenu[0].menuUrl;
            }
        }
    }
    addSecondButton(ele,index){
        if(ele.sub_button.length){
            this.setState({showDilog:true})
            ele.sub_button.forEach(eles => {
                eles.isshow = false;
            })
            let op = {
                "type": "view", 
                "name": "二级菜单", 
                "url": "", 
                "isshow":true,
            }
            ele.sub_button.push(op);
            this.secondBut = ele.sub_button.length-1
            this.state.button[index] = ele;
            this.firstBut = index
            this.setState({button:this.state.button});
            if(this.state.value === 0){
                if(this.state.wxMenu.length){
                    this.value.name = this.state.wxMenu[0].menuName;
                    this.value.url = this.state.wxMenu[0].menuUrl;
                }
            }
        }else{
            W.confirm('添加子菜单后，一级菜单的内容将被清除。确定添加子菜单？',e=>{
                if(e){
                    this.setState({showDilog:true})
                    ele.sub_button.forEach(eles => {
                        eles.isshow = false;
                    })
                    let op = {
                        "type": "view", 
                        "name": "二级菜单", 
                        "url": "", 
                        "isshow":true,
                    }
                    ele.sub_button.push(op);
                    this.secondBut = ele.sub_button.length-1
                    this.state.button[index] = ele;
                    this.firstBut = index
                    this.setState({button:this.state.button});
                    if(this.state.value === 0){
                        if(this.state.wxMenu.length){
                            this.value.name = this.state.wxMenu[0].menuName;
                            this.value.url = this.state.wxMenu[0].menuUrl;
                        }
                    }
                }else{
                    return false;
                }
            })
        }
    }
    selectFirst(e,i){
        // this.shorts?this.setState({firCan:true}):null
        this.shorts?this.firCan = true:null
        // this.state.menuSort?null:this.state.button[i].isshow?this.setState({edit:true}):null;
        if(!this.state.menuSort){
            this.state.button[i].isshow?this.setState({edit:true}):null;
            this.state.button.forEach(ele => {
                ele.isshow = false;
                ele.sub_button.forEach(e=>{
                    e.isshow = false;
                })
            })
            e.isshow = true;
            this.state.button[i] = e;
            this.setState({name:e.name});
            this.value.name = e.name
            if(e.sub_button.length){
                this.value.url="http://"
            }else{
                this.value.url = e.url
                this.setState({url:e.url});
                this.setState({showurl:true})
            }
            if(this.state.value === 0){
                if(this.state.wxMenu.length){
                    this.value.name = this.state.wxMenu[0].menuName;
                    this.value.url = this.state.wxMenu[0].menuUrl;
                }
            }
            console.log(this.flat,'flat')
            this.setState({button:this.state.button})
            console.log(e,i);
            this.firstBut = i;
            this.flat++;
        }
        
    }
    selectSecond(el,id,ele,index){
        if(this.shorts){
            // this.setState({secCan:true});
            // this.setState({firCan:false})
            this.secCan = true;
            this.firCan = false;
        }
        console.log('selectSecond');
        console.log(el,id,ele,index)
        ele.sub_button.forEach(e => {
            e.isshow = false;
        })
        // this.state.menuSort?null:el.isshow = true
        if(!this.state.menuSort){
            el.isshow = true
            ele.sub_button[id] = el;
            this.state.button[index] = ele
            this.setState({button:this.state.button})

            this.setState({edit:true});
            this.setState({showurl:true})
            this.secondBut = id;
            this.firstBut = index;
            this.setState({name:el.name})
            this.setState({url:el.url})
            this.value.name = el.name;
            this.value.url = el.url;
            if(this.state.value === 0){
                if(this.state.wxMenu.length){
                    this.value.name = this.state.wxMenu[0].menuName;
                    this.value.url = this.state.wxMenu[0].menuUrl;
                }
            } 
        }
        
        
    }
    getValueName(e,i){
        this.value.name = i;
        this.setState({name:i})
    }
    getValueUrl(e,i){
        this.value.url = i;
        this.setState({url:i})
        console.log(this.value);
    }
    
    submit(){
        if(!this.value.name){
            W.alert('请输入菜单名称');
            return;
        }
        var reg = /^[a-zA-z]+:\/\/[^\s]*/
        
        if(!this.value.url){
            W.alert('请输入跳转网址');
            return
        }
        if(!reg.test(this.value.url)){
            W.alert('请输入正确的网址');
            return;
        }
    
        console.log(this.firstBut,'flat');
        let i = this.firstBut;
        if(typeof this.secondBut == "number" && this.secondBut >= 0){
            this.state.button[i].sub_button[this.secondBut].name = this.value.name;
            this.state.button[i].sub_button[this.secondBut].url = this.value.url
        }else{
            console.log(this.secondBut);
            console.log(this.state.button[i])
            this.state.button[i].name = this.value.name;
            this.state.button[i].url= this.value.url;
        }
        this.setState({button:this.state.button})
        this.setState({showDilog:false});
        this.setState({edit:false});
        this.setState({url:null});
        this.setState({name:null});
        this.setState({showurl:false})
        this.state.wxMenu.length?this.setState({value:0}):this.setState({value:1})
        this.setState({menuValue:0})
        this.state.value?this.value = {}:null;
        this.secondBut = null;
        this.flat = 0;
    }
    close(){
        if(this.state.showDilog){
            if(typeof this.secondBut == "number" && this.secondBut >= 0){
                this.state.button[this.firstBut].sub_button.splice(this.secondBut,1);
            }else{
                this.state.button.splice(this.firstBut,1)
            }
        }
        this.setState({button:this.state.button})
        // console.log(this.state.button,'btt')
        this.setState({showDilog:false});
        this.setState({edit:false});
        this.setState({showurl:false})
        this.setState({url:null});
        this.setState({name:null});
        this.state.wxMenu.length?this.setState({value:0}):this.setState({value:1})
        this.setState({menuValue:0})
        this.state.value?this.value = {}:null;
        this.secondBut = null;
        this.flat = 0;
    }
    finish(){
        this.state.button.forEach((ele,index) => {
            if(ele.sub_button.length){
                delete ele.url;
                delete ele.type;
                ele.sub_button.forEach(e => {
                    delete e.isshow
                })
            }else{
                if(!ele.url){
                    W.alert('第'+(index+1)+'个菜单'+ele.name+'未设置链接')
                }
            }
            delete ele.isshow
        })
        W.loading(true,'正在更新')
        Wapi.weixin.update(res => {
            if(res.status_code == 0){
                Wapi.serverApi.setMenu(re => {
                    W.loading(false)
                    if(!re.errcode){
                        W.alert(___.update_su);
                    }
                    else{
                        if(this.state.button.length){
                            W.alert(___.menu_fail);
                        }else{
                            W.alert('菜单不能为空，'+___.menu_fail)
                        }
                    } 
                },{
                    wxAppKey:this.state.wx.wxAppKey
                })
            }
        },{
            _objectId:this.state.wx.objectId,
            menu:{'button':this.state.button}
        })
        console.log(this.state.button,'this.button');
        this.setState({button:this.state.button});
        this.flat = 0;
    }
    delete(es,i,ess,j){
        console.log(es,i,ess,j)
        if(j >= 0){ //二级菜单
            W.confirm('确定要删除该菜单？',e => {
                if(e){
                    es.sub_button.splice(j,1);
                    this.state.button[i] = es;
                    console.log(es)
                    // this.setState({button:this.state.button});
                    if(!es.sub_button.length){
                        this.state.button[i].type = 'view';
                        // this.forceUpdate();
                        // this.setState
                    }
                    this.setState({button:this.state.button});
                }else{
                    return;
                }
            })
        }else{ //以及菜单
            W.confirm('确定要删除该菜单？',e => {
                if(e){
                    this.state.button.splice(i,1)
                    this.setState({button:this.state.button})
                }else{
                    return
                }
            })
        }
    }

    changeValue(e,i,v){
        this.setState({value:v})
        if(v === 1){
            this.value.name = this.state.name;
            this.value.url = this.state.url
        }else{
            if(this.state.wxMenu.length){
                this.value.name = this.state.wxMenu[0].menuName;
                this.value.url = this.state.wxMenu[0].menuUrl;
            }
            
        }
    }
    menuValue(e,i,v){
        this.setState({menuValue:v})
        this.value.name = this.state.wxMenu[v].menuName;
        this.value.url = this.state.wxMenu[v].menuUrl;
        console.log(this.value,'this.value')
    }

    menuSort(d){
        this.setState({menuSort:true});
        this.firstButton = this.state.button
        this.state.button.forEach(ele =>{
            ele.isshow = false;
            ele.sub_button.forEach(e =>{
                e.isshow = false
            })
        })
        var that = this;
        var container = document.getElementsByClassName('container')[0];
        var users = document.getElementsByClassName('users')
        console.log(container,'container');
        console.log(users,'users');
        let thiss = true;
        for(var i = 0;i<users.length;i++){
            let index = i;
            dragula([users[i]],{
                moves: function (el, source, handle, sibling) {
                    return that.secCan; // elements are always draggable by default
                }
            }).on('drag', function (el) {
                console.log(el,'drag1');
                // thiss = false;
                that.firstButton = that.state.button;
            }).on('drop', function (el, target, source, sibling) {
                thiss = true
                console.log(el,container,'drop1');
                console.log(that.state.button,'11')
                let its = [] 
                // console.log(target.children[0].id)
                for(var j = 0;j<target.children.length;j++){
                    // console.log(target.children[j].id)
                    if(target.children[j].id){
                        // console.log(target.children[j].id);
                        // console.log(that.state.button[index].sub_button,'bu')
                        // console.log(that.state.button[index].sub_button[target.children[j].id.slice(1)],'1')
                        its.push(that.state.button[index].sub_button[target.children[j].id.slice(1)])
                    }
                }
                console.log(its,'ist')
                console.log(that.state.button,'12')
                // that.firstButton[index].sub_button = its;
                that.sub_button = its;
                that.secSor = index;
                console.log(that.state.button,'13')
                // that.setState({firCan:true})
            }).on('over', function (el, container) {
                console.log(el,container,'over1')
            }).on('out', function (el, container) {
                console.log(el,container,'out1')
            });
        }
        
        
        dragula([container],{
            moves: function (el, source, handle, sibling) {
                return that.firCan; 
            }
        }).on('drag', function (el) {
            console.log(el,'drag')
        }).on('drop', function (el, target, source, sibling) {
            // el.className += ' ex-moved';
            console.log(el,container,'drop')
            let its = [] 
            for(var i = 0;i<target.children.length;i++){
                if(target.children[i].id){
                    its.push(that.state.button[target.children[i].id.slice(1)])
                }
            }
            console.log(its,'ist')
            that.firstButton = its
        }).on('over', function (el, container) {
            // console.log(el,container,'over')
        }).on('out', function (el, container) {
            // console.log(el,container,'out')
        });
        this.shorts = true
    }
    finishSort(){
        // console.log(this.firstButton,'fir');
        // console.log(this.secSor,'123')
        // console.log(this.sub_button,'1234')
        if(this.secSor !== null){
            this.firstButton[this.secSor].sub_button = this.sub_button;
        }
        this.secSor = null
        this.setState({button:[]});
        var timer = setTimeout(() => {
            this.setState({button:this.firstButton});
            this.setState({menuSort:false});
        },300)
        this.shorts = false;
        this.firCan = false;
        this.secCan = false;
    }
    render() {
        // console.log()
        console.log(this.firCan,'d')
        console.log(this.state.firCan,'dd')
        console.log(this.state.menu,'wxzmenu');
        console.log(this.state.button,'button')
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.close}
            />,
            <FlatButton
                label="确定"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.submit}
            />,
        ];
        let dis=Object.assign({},stys.mi);
        dis.color='#aaa';
        let  menu = null;
        let icon1 = {
            bottom: '-5px',
            display: 'inline-block',
            width: 0,
            height: 0,
            borderWidth:'6px',
            borderStyle: 'dashed',
            borderColor: 'transparent',
            borderBottomWidth: 0,
            borderTopColor: '#fafafa',
            borderTopStyle: 'solid',
            position: 'absolute',
            left: '50%',
            marginLeft: '-6px',
        }
        let icon2 = {
            bottom: '-6px',
            display: 'inline-block',
            width: 0,
            height: 0,
            borderWidth: '6px',
            borderStyle: 'dashed',
            borderColor: 'transparent',
            borderBottomWidth: 0,
            borderTopColor: '#d0d0d0',
            borderTopStyle: 'solid',
            position: 'absolute',
            left: '50%',
            marginLeft: '-6px',
        }
        // if(this.firstButton){
        //     this.state.button = this.firstButton
        // }
        let item = null;
        // this
        // this.state.button.splice(1,1)

        item = this.state.button.map((ele,index)=>{
            let its = ele.sub_button.map((el,id) => {
                return(
                    <div id={'s'+id} style={el.isshow?{border:'1px solid #44b549',color:'#44b549',fontSize:14,position:'relative'}:{fontSize:14,position:'relative'}}  key={id} >
                        <span onClick={() => this.selectSecond(el,id,ele,index)} 
                            style={
                                id==4?
                                {margin:'0 5px 0 5px',display:'block',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}
                                :
                                {display:'block',margin:'0 5px 0 5px',borderBottom:'1px solid #ccc',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}
                        >
                            {this.state.menuSort?<span>☰</span>:null}{el.name}
                        </span>
                        {this.state.menuSort?null:<span onClick={() =>{this.delete(ele,index,el,id)}} style={{position:'absolute',top:0,right:3}}><ContentClear style={{height:15,width:15,position:'relative',top:3}}/></span>}
                    </div>
                )
            })
            its.length < 5?its.push(<div style={this.state.menuSort?{display:'none'}:{display:'block'}}  key={6} onClick={() =>this.addSecondButton(ele,index)}><ContentAdd style={stys.add} /></div>):null
            let sorts = this.state.menuSort&&!ele.sub_button.length
            return(<div id={'f'+index} style={stys.mi} key={index} >
                        <span  style={ele.isshow?{position:'relative',fontSize:14,border:'1px solid #44b549',color:'#44b549',display:'inline-block',width:'99%',height:'96%',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}:{position:'relative',fontSize:14,display:'inline-block',width:'99%',height:'100%',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}} onClick={()=>this.selectFirst(ele,index)} >
                            {this.state.menuSort?<span>☰</span>:ele.sub_button.length?<span style={{background:'#44b549',borderRadius:'5px',width:'7px',height: '7px', verticalAlign: 'middle', display: "inline-block",marginRight: '2px',marginTop: '-2px'}}></span>:null}
                            {ele.name}
                        </span>
                        {!this.state.menuSort?<span onClick={() =>{this.delete(ele,index)}} style={{position:'absolute',top:0,right:3}}><ContentClear style={{height:15,width:15,position:'relative',top:3}}/></span>:null}
                            {/*{*/}
                                {/*ele.isshow?*/}
                                <div className="users" style={sorts?{display:'none'}:its.length?stys.son_menu:{}}>
                                    {its}
                                    {
                                        !its.length?
                                        null
                                        :
                                        <span>
                                            <i style={icon2}></i>
                                            <i style={icon1}></i>
                                        </span>
                                    }
                                </div>
                                {/*:*/}
                                {/*null*/}
                            {/*}*/}
                    </div>)
        })
        // item.splice(1,1)
        let wxMenu = null;
        if(this.state.wxMenu){
            wxMenu = this.state.wxMenu.map((ele,index) => {
                return(
                     <MenuItem key={index} value={index} primaryText={ele.menuName} />
                )
            })            
        }
        let sorts = this.state.button.length>1?false:true
        console.log(this.firstBut,this.secondBut,'test first second')
        return (
            <div>
                <RaisedButton disabled={this.state.menuSort} label={___.submit} primary={true} style={stys.save} onClick={this.state.menuSort?()=>{}:this.finish}/>
                {this.state.menuSort?<RaisedButton disabled={sorts} label="完成" primary={true} style={{display:'block',marginTop:10,width:'40%',marginLeft:'30%'}} onClick={this.finishSort}/>:<RaisedButton disabled={sorts} label="排序" primary={true} style={{display:'block',marginTop:10,width:'40%',marginLeft:'30%'}} onClick={this.menuSort}/>}
                <div style={stys.menu} className='container'>
                    <div style={stys.k} draggable="false">
                        <HardwareKeyboard/>
                    </div>
                    {/*<span >*/}
                        {item}
                    {/*</span>*/}
                    {
                        this.state.button.length<3?<div onClick={this.addFirstButton} style={this.state.menuSort?{display:'none'}:stys.mi}>{this.state.button.length>0?<ContentAdd style={stys.add} />:<span><ContentAdd style={stys.add1}/>添加菜单</span>}</div>:null
                    }
                </div>
                <Dialog
                    title="请输入"
                    titleStyle={{borderBottom:'none',lineHeight:'43px',height:43,padding:'5px 0',textAlign:'center',fontSize:'16px'}}
                    actions={actions}
                    modal={false}
                    style={{zIndex:1499}}
                    open={this.state.showDilog}
                    contentStyle={{width:'85%',zIndex:1499}}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    bodyStyle={{padding:'0 24px'}}
                    actionsContainerStyle={{textAlign:'center',fontSize:'14px',borderTop:0}}
                    >
                    <div>
                        <SelectField value={this.state.value} style={{width:'100%'}} onChange={this.changeValue.bind(this)} >
                            {
                                this.state.wxMenu?(
                                this.state.wxMenu.length?
                                <MenuItem value={0} primaryText="系统菜单" />
                                :
                                <MenuItem value={0} primaryText={null} />)
                                :
                                <MenuItem value={0} primaryText={null} />
                            }
                            <MenuItem value={1} primaryText="自定义菜单" />
                        </SelectField>
                       {
                            this.state.value==0?
                            <SelectField value={this.state.value} style={{width:'100%'}} onChange={this.menuValue} >
                                {wxMenu}
                            </SelectField>
                            :
                            <div>
                            <TextField
                                hintText={this.secondBut != null ?"名称(字数不超过8个汉字或16个字母)":"名称(字数不超过4个汉字或8个字母)"}
                                style={{ width: '100%' }}
                                onChange={this.getValueName}
                            />
                            <TextField
                                hintText="链接"
                                style={{ width: '100%' }}
                                onChange={this.getValueUrl}
                            />
                            </div>
                       } 
                    </div>
                </Dialog>
                <Dialog
                    title="编辑"
                    titleStyle={{borderBottom:'none',lineHeight:'43px',height:43,padding:'5px 0',textAlign:'center',fontSize:'16px'}}
                    actions={actions}
                    modal={false}
                    style={{zIndex:1499}}
                    open={this.state.edit}
                    contentStyle={{width:'85%',zIndex:1499}}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    bodyStyle={{padding:'0 24px'}}
                    actionsContainerStyle={{textAlign:'center',fontSize:'16px',borderTop:0}}
                    >
                    <div>
                        {
                            this.state.showurl?
                            <div>
                                <SelectField value={this.state.value} style={{width:'100%'}} onChange={this.changeValue.bind(this)} >
                                    {
                                        this.state.wxMenu?(
                                        this.state.wxMenu.length?
                                        <MenuItem value={0} primaryText="系统菜单" />
                                        :
                                        <MenuItem value={0} primaryText={null} />)
                                        :
                                        <MenuItem value={0} primaryText={null} />
                                    }
                                    <MenuItem value={1} primaryText="自定义菜单" />
                                </SelectField>
                                {
                                    this.state.value==0?
                                    <SelectField value={this.state.value} style={{width:'100%'}} onChange={this.menuValue} >
                                        {wxMenu}
                                    </SelectField>
                                    :
                                    <div>
                                        <TextField
                                            hintText="菜单名称"
                                            value={this.state.name}
                                            style={{ width: '100%' }}
                                            onChange={this.getValueName}
                                        />
                                        <TextField
                                            hintText="跳转网页"
                                            value={this.state.url}
                                            style={{ width: '100%' }}
                                            onChange={this.getValueUrl}
                                        />
                                    </div>
                                }
                            </div>
                            :
                            <TextField
                                hintText="菜单名称"
                                value={this.state.name}
                                style={{ width: '100%' }}
                                onChange={this.getValueName}
                            />
                        }
                    </div>
                </Dialog>
            </div>
        );
    }
}







require('../_sass/home.scss');
class Appa extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state ={
            data:[1,2,5,6]
        }
        this.show = this.show.bind(this);
        this.value = []
    }
    componentDidMount(){
        var that = this;
        var container = ReactDOM.findDOMNode(this);
        dragula([container])
        .on('drag', function (el) {
            console.log(el,'drag')
        }).on('drop', function (el, target, source, sibling) {
            // el.className += ' ex-moved';
            console.log(el,container,'drop')
            console.log(el, 's',target.children, 't',source.children,'l', sibling);
            console.log(document.getElementsByClassName('container')[0].children);
            let its = [] 
            console.log(target.children[0].id)
            for(var i = 0;i<target.children.length;i++){
                its[i] = that.state.data[target.children[i].id]
            }
            console.log(its,'ist')
            that.value = its
        }).on('over', function (el, container) {
        }).on('out', function (el, container) {
        });
    }
    shouldComponentUpdate(nextState){
        console.log(nextState,'df');
        return false;
    }
    show(i){
        console.log(i)
        console.log(ReactDOM.findDOMNode(this))
        console.log(this.state.data);
        console.log(this.value)
        this.setState({data:this.value})
    }
    render () {
        // let it = [1,2,5,6];
        let it = this.state.data
        console.log(it,'e')
        let item = it.map((e,i)=>{return(<div id={i} data={i} onClick={()=>{this.show(i)}} style={{background:'#44f3f3'}} key={i} >{e}</div>)})
        return <div className='container'>
            {item}
        </div>;
    }
    
}
import React, {Component} from 'react';

import SonPage from './base/sonPage';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentClear from 'material-ui/svg-icons/content/clear'
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
// import {List, ListItem} from 'material-ui/List';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before'
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next'

class Advert_manage extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            show: false,
            data:[],
            showBig:false,
            type:0
        }
        this.showAdd = this.showAdd.bind(this);
        this.hide = this.hide.bind(this);
        this.getAd = this.getAd.bind(this);
        this.search = this.search.bind(this);
        this.showBig = this.showBig.bind(this);
        this.hideBig = this.hideBig.bind(this);
        this.searchValue = '';
        this.show_big = null;
        this.edit = false;
        this.typeChange = this.typeChange.bind(this);
        this.delete = this.delete.bind(this);
    }
    componentDidMount() {
        this.getAd(this.state.type);
        window.addEventListener('getAd',e => {
            this.getAd(this.state.type);
        })
        setTimeout(() => {console.log(1234567897894561223456789)},1000)
    }
    componentWillUnmount() {
        window.removeEventListener('getAd',e=> {console.log(e)});
    }
    //获取广告列表
    getAd(type){
        let op = {};
        if(_user.customer.custTypeId === 9){
            if(type == 1){
                op = {
                    objectId:'>0',
                    status:1 
                }
            }else if(type == 0){
                op = {
                    objectId:'>0',
                    status:0 
                }
            }
        }else{
            op = {
                uid:_user.customer.objectId
            }
        }
        Wapi.advertisement.list(res => {
             this.setState({data:res.data})
        },op,{limit:-1});
        
        
    }
    search(e,v){
        this.searchValue = v;
        this.forceUpdate()
    }

    showBig(e,i){
        // console.log(e,i)
        // console.log(this.state.data[i])
            this.show_big = this.state.data[i];
            let obj = this.show_big.objectId;
            let uid = this.show_big.uid;
        if(e === 1){ //预览
            this.setState({showBig: true})
        }else if(e === 2){ //修改
            this.setState({show:true});
            this.edit = true;
        }else if(e === 3){ //审核
            this.audit(obj,0)
        }else if(e === 4){ //发布
            this.audit(obj,1,uid)
        }else if(e===5){
            this.delete(obj)
        }
    }
    delete(obj){
        Wapi.advertisement.delete(res => {
            this.getAd()
        },{objectId:obj})
    }
    //发布
    audit(obj,type,uid){
        let op = {_objectId:obj}
        type == 1 ? op.status = 1 : op.status = 0 
        type == 1 ? op.approveDate = W.dateToString(new Date()):null
        console.log(op,type,uid)
        let _this = this;
        if(uid){
            Wapi.advertisement.list(ad => {
                let obj = [];
                ad.data.forEach(ele => {
                    if(ele.status == 1){
                        obj.push(ele.objectId)
                    }
                });
                if(obj.length){
                    Wapi.advertisement.update(re => {
                        Wapi.advertisement.update(res => {
                            _this.getAd(_this.state.type)
                        },op)
                    },{
                        _objectId:obj.join('|'),
                        status:2
                    })
                }else{
                    Wapi.advertisement.update(res => {
                        _this.getAd(_this.state.type)
                    },op)
                }
                
            },{
                uid:uid
            },{
                limit:-1
            })
        }else{
             Wapi.advertisement.update(res => {
                _this.getAd(_this.state.type)
            },op)
        }
        
    }
    hideBig(){
        this.setState({showBig: false})
    }
    showAdd(){
        this.setState({show:true})
    }
    hide(){
        this.setState({show:false});
        this.edit = false;
    }
    typeChange(e,v){
        this.setState({type:v})
        this.getAd(v)
    }
    render(){
        console.log(this.state.data,'all ad data')
        let status = ['待审核','已发布','已停用']
        let item = this.state.data.filter(ele => ele.ad_name.indexOf(this.searchValue) > -1)
        console.log(item,'item')
        item = item.map((ele,index) => {
            return(<div key={index} style={{background:'#fff',borderBottom:'1px solid #f7f7f7',display:'flex',padding:'8px 0'}}>
                <img src={ele.small_img[0].imgUrl} width="30%" height="79px" style={{verticalAlign:'middle',borderRadius:18,border: '0px solid #ccc'}}/>
                
                <div style={{display:'inline-block',fontSize:'12px',position:'relative',width:'70%',boxSizing:'border-box',paddingLeft:'10px',lineHeight:'20px'}}>
                    <div style={{fontSize:16}}>
                        <span>{ele.ad_name}</span>
                        <span style={{fontSize:14,marginLeft:10}}>{status[ele.status]}</span>
                    </div>
                    <div>{'提交时间：'}{W.dateToString(W.date(ele.applyDate))}</div>
                    {
                        ele.approveDate?
                        <div>{'审核时间：'}{W.dateToString(W.date(ele.approveDate))}</div>:null
                    }
                    <div>{'小图尺寸：'}{ele.small_img[0].size}</div> 
                    <RightIconMenu data={Object.assign({},ele,{index:index})} onClick={this.showBig}/> 
                </div>
            </div>)
        })
        return(
            <div>
                {
                    _user.customer.custTypeId == 9 ?
                    <div style={{position:'absolute',top:0,lineHeight:'48px',left:100}}>
                        <DropDownMenu value={this.state.type} onChange={this.typeChange} underlineStyle={{ borderTop: 0 }} labelStyle={{ padding: '0 20px 0 6px', lineHeight: '48px' }} iconStyle={{ top: 14, right: -2 }}>
                            <MenuItem value={0} primaryText="审核" /> 
                            <MenuItem value={1} primaryText="发布" />                   
                        </DropDownMenu>   
                    </div> :
                    null
                }
                
                <div>
                    <TextField
                        hintText="广告名称"
                        value={this.searchValue}
                        onChange={this.search}
                        style={{ width: '100%',backgroundColor:'#fff' }}
                        hintStyle={{ paddingLeft: 10 }}
                        inputStyle={{ padding: '0px 0px 0px 10px' }}
                        underlineStyle={{ bottom: 0, borderBottom: '0px solid #f7f7f7' }}
                        underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                    />
                    {item}
                </div>
                {/* <div>

                </div> */}
                <SonPage open={this.state.show} back={this.hide}>
                    <AddAd back={this.hide} data={this.show_big} edit={this.edit}/>
                </SonPage>
                <SonPage open={this.state.showBig} back={this.hideBig}>
                    <BigImg data={this.show_big}/>
                </SonPage> 
            </div>
        )
    }
}

class AddAd extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            name:'',
            open:false
        }
        this.fileUpload = this.fileUpload.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.showImg = this.showImg.bind(this);
        this.delete = this.delete.bind(this);
        this.hideImg = this.hideImg.bind(this);
        this.submit = this.submit.bind(this);
        this.small = [];
        this.big = [];
        this.img = null;
        this.edit = false;
        this.data = null;
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps,'nextProps')
        this.edit = nextProps.edit;
        this.data = nextProps.data;
        if(nextProps.edit){
            this.small = nextProps.data.small_img;
            this.big = nextProps.data.big_img;
            // this.edit = 
            this.setState({name:nextProps.data.ad_name})
        }else{
            this.small = [];
            this.big = [];
            this.state.name = ''
        }
    }
    fileUpload(e,types){
        console.log('file upload');

        let imgData = {};
        // console.log(e.target.files);
        let h=e.target;
        // console.log(h,'hh')
		if(!h.files.length){
			W.alert("未选择文件");
			return;
		}
        var type=h.value.split('.').pop().toLocaleLowerCase();
        // console.log(h.value,'h.value')
        var file =h.files[0];
        console.log(file,'file')
        imgData.name = file.name;
        if((type!="jpg"&&type!="png"&&type!="jpeg")){
            h.value="";
            h.files=null;
            W.alert("抱歉，仅支持的jpg或png或者jpeg图片");
            return;
        }
        W.loading(true,"正在上传文件，请稍等");
        // setTimeout(() => {
        //     W.loading(false)
        // },1000)

    
        let _this = this;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var data = e.target.result;
            var mb = (e.total/1024)/1024;
            console.log(mb,e.total,'dddff')
            if(mb>= 2){
                W.loading(false)
                W.alert('文件大小大于2M，无法上传！');
                return;
            } 
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.src= data;
            image.onload=function(){
                var width = image.width;
                var height = image.height;
                imgData.size = width+'*'+height;
                // console.log(imgData,'data\n',types);
                // imgData.imgUrl = "http://img2.bibibaba.cn/photo/1501841119382.jpg@!baba"
                // if(types == 1){
                //     _this.small.push(imgData)
                // }else if(types === 2){
                //     _this.big.push(imgData)
                // }
                // _this.forceUpdate();
                Wapi.file.upload(res=>{
                    W.loading(false);
                    if (res && res.status_code) {
                        W.errorCode(res);
                        return;
                    }
                    imgData.imgUrl = res.image_file_url;
                    // console.log(imgData,'data/n',types);
                    // console.log(res);
                    if(types == 1){
                        _this.small.push(imgData)
                    }else if(types === 2){
                        _this.big.push(imgData)
                    }
                    _this.forceUpdate();
                    _this.showImg(imgData)
                },file,function(s){
                    W.loading(true,"正在上传文件，请稍等……"+parseInt(s*100)+'%');
                });
            };
            
        };
    }
    nameChange(e,value){
        this.setState({name: value})
    }
    delete(ele,index,i){
        // console.log(ele,index);
        if(i === 1){
            this.small.splice(index,1)
        }else if(i === 2){
            this.big.splice(index,1)
        }
        this.forceUpdate();
    }
    showImg(ele){
        console.log(2)
        let imgHeight = window.screen.height - 250+'px'
        this.img = <img  style={{marginTop:100}} width="100%" height={imgHeight} src={ele.imgUrl} />
        // this.img = <img width="100%" height={imgHeight} style={{marginTop:100}} src="http://img2.bibibaba.cn/photo/1501831405717.jpg@!baba" />
        this.setState({open:true})
    }
    hideImg(){
        this.setState({open:false})
    }
    submit(){
        console.log(this.small,'small picture')
        console.log(this.big,'big picture')
        console.log(this.state.name,'ad name')
        if(!this.state.name){
            W.alert('请输入名称！')
            return;
        }
        if(!this.small.length){
            W.alert('请上传小图！');
            return;
        }
        if(!this.big.length){
            W.alert('请上传大图！');
            return;
        }
        if(this.edit){
            let op = {
                _objectId: this.data.objectId,
                ad_name: this.state.name,
                status: 0,
                small_img: this.small,
                big_img: this.big
            }
            Wapi.advertisement.update(res => {
                this.props.back();
                W.emit(window,'getAd')
            },op)
        }else{
            let op = {
                ad_name: this.state.name,
                uid: _user.customer.objectId,
                status: 0,
                applyDate: W.dateToString(new Date()),
                small_img: this.small,
                big_img: this.big
            }
            Wapi.advertisement.add(res => {
                console.log(res,'res');
                this.props.back();
                W.emit(window,'getAd')
            },op)
        }
        
    }
    render(){
        let showWid = window.screen.width - 40
        let sty = {
            file:{  
				position: 'relative',  
				display: 'inline-block',  
				background: '#fff',  
				border: '1px solid #2196f3',  
				borderRadius: '4px',  
				padding: '0px 13px',  
				overflow: 'hidden',  
				color: '#2196f3',  
				textDecoration: 'none',  
				textIndent: 0,  
				lineHeight: '37px',  
				fontSize: '30px',
                fontWeight: 100,
                width:'88px',
                textAlign:'center'
            },
            input: {  
				position: 'absolute',  
                height:44,
                width:'112px',
				right: 0,  
				top: 0,  
				opacity: 0,  
            }, 
            showImg:{
                display: 'block',
                position: 'fixed',
                height: '100%',
                width:showWid,
                padding:'0 20px',
                top: '0px',
                left: '0px',
                opacity: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.54)',
                willChange: 'opacity',
                transform: 'translateZ(0px)',
                transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                zIndex: 1400,
            }
        }
        console.log(this.small,'small')
        console.log(this.big,'big')
        let labWidth = window.screen.width-96
        let small = this.small.map((ele,index) => {
            return(
                <Chip
                    onRequestDelete={() => {this.delete(ele,index,1)}}
                    onTouchTap={() =>{this.showImg(ele)}}
                    style={{ margin: 4,backgroundColor:'#fff'}}
                    key={index}
                    labelStyle={{fontSize:'14px',width:labWidth,display:'flex'}}
                    >
                    {/* <Avatar src="http://img2.bibibaba.cn/photo/1501831405717.jpg@!baba" />  */}
                     <Avatar src={ele.imgUrl} /> 
                    <span>{'小图'}</span>
                    <span style={{margin:'0 5px',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden',width:'62%'}}>{ele.name}</span>
                    <span>{ele.size}</span>
                </Chip> 
            )
        })
        let big = this.big.map((ele,index) => {
            return(
                <Chip
                    onRequestDelete={() => {this.delete(ele,index,2)}}
                    onTouchTap={() =>{this.showImg(ele)}}
                    style={{ margin: 4,backgroundColor:'#fff'}}
                    key={index}
                    labelStyle={{fontSize:'14px',width:labWidth,display:'flex'}}
                    >
                    {/* <Avatar src="http://img2.bibibaba.cn/photo/1501831405717.jpg@!baba" />  */}
                     <Avatar src={ele.imgUrl} /> 
                    <span>{'大图'}</span>
                    <span style={{margin:'0 5px',textOverflow:'ellipsis',whiteSpace:'nowrap',overflow:'hidden',width:'62%'}}>{ele.name}</span>
                    <span>{ele.size}</span>
                </Chip> 
            )
        })
        
        return(
            <div style={{background:'#f7f7f7',minHeight:'100vh',padding:'0 10px'}}>
                 <div> 
                    <div style={{background:'#fff',position:'relative',top:20}}>
                        <TextField
                            hintText="广告名称"
                            value={this.state.name}
                            onChange={this.nameChange}
                            style={{ width: '100%' }}
                            hintStyle={{ paddingLeft: 10 }}
                            inputStyle={{ padding: '0px 0px 0px 10px' }}
                            underlineStyle={{ bottom: 0, borderBottom: '0px solid #f7f7f7' }}
                            underlineFocusStyle={{ borderBottomColor: '#2196f3' }}
                        />
                    </div>
                    <div style={{margin:'40px 0 20px'}}>
                        <div style={{background: '#fff',height: '44px',display:'inline-block',position:'relative'}}>
                            <a style={sty.file}><span style={{fontSize:'16px',position:'relative',top:'-2px'}}>{'小图'}</span>
                                <input style={sty.input} type="file" name="inputf" accept="image/*" onChange={e=>this.fileUpload(e,1)}/>  
                            </a> 
                            <span style={{position:'absolute',color:'#2196f3',width:116,bottom:'-18px',left:12,fontSize:8}}>{'宽：746高：355'}</span>
                        </div>
                        <div style={{background: '#fff',height: '44px',float:'right',display:'inline-block',position:'relative'}}>
                            <a style={sty.file}><span style={{fontSize:'16px',position:'relative',top:'-2px'}}>{'大图'}</span>
                                <input style={sty.input} type="file" name="inputf" accept="image/*" onChange={e=>this.fileUpload(e,2)}/>  
                            </a> 
                            <span style={{position:'absolute',color:'#2196f3',width:58,bottom:'-18px',left:35,fontSize:8}}>{'宽：746'}</span>
                        </div>
                    </div>
                    <div style={{width:'100%',overflow:'hidden'}}>
                         {small}
                         {big}
                    </div>
                    </div>
                    <Dialog
                        modal={true}
                        open={false}
                        bodyStyle={{padding:0}}
                        actions={[<FlatButton
                            label="确定"
                            primary={true}
                            onTouchTap={this.hideImg}
                        />]}
                        actionsContainerStyle={{textAlign:'center'}}
                        >
                        {/* <img  width="100%" height={imgHeight} src="http://img2.bibibaba.cn/photo/1501831405717.jpg@!baba" /> */}
                        {this.img}
                    </Dialog>
                    {/* <div></div> */}
                    <div style={this.state.open ? sty.showImg : {display:'none'}}>
                        {this.img}
                        <span style={{position:'absolute',top:69,right:2}} onClick={this.hideImg}><ContentClear /></span>
                    </div>
                    {
                        this.small.length||this.big.length?
                        <div style={{textAlign:'center',marginTop:100}}>
                            <RaisedButton label="提交" primary={true}  onClick={this.submit} />
                        </div>:null
                    }
                    
                {/* </div> */}
            </div>
        )
    }
}


class RightIconMenu extends Component{     
    render() {
        console.log(this.props.data,'props.data')
        let index = this.props.data.index;
        let status = this.props.data.status;
        let menu=[
            <MenuItem key={1} onTouchTap={()=>this.props.onClick(1,index)}>{'预览'}</MenuItem>,
            // <MenuItem key={2} onTouchTap={()=>this.props.onClick(2,index)}>{'修改'}</MenuItem>,
            <MenuItem key={3} onTouchTap={()=>this.props.onClick(3,index)}>{'审核'}</MenuItem>,
            <MenuItem key={4} onTouchTap={()=>this.props.onClick(4,index)}>{'发布'}</MenuItem>,
            <MenuItem key={5} onTouchTap={()=>this.props.onClick(5,index)}>{'删除'}</MenuItem>
        ];
        let showMenu = [];
        _user.customer.custTypeId === 9 ? (status == 0 ? showMenu=[menu[0],menu[2]] : showMenu=[menu[0],menu[1]]) : showMenu=[menu[0]/*,menu[1]*/,menu[3]]
   
        return (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                }
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                style={{
                    height: '48px',
                    width: '48px',
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    bottom: '0px',
                    margin: 'auto'
                }}
            >
                {showMenu}
            </IconMenu>
        );
    }
}

class BigImg extends Component{
    render(){
        console.log(this.props.data,'idnd')
        let bigImg = null;
        this.props.data? bigImg = this.props.data.big_img:null;
        // bigImg = bigImg.
        if(bigImg){
            bigImg = bigImg.map((ele,index) => {
                return(<img key={index} src={ele.imgUrl} style={{width:'100%',verticalAlign:'middle',}}/>)
            })
        }
        return(<div>
            {this.props.data?this.props.data.small_img.length>1?<Slider key={-1} slides= {this.props.data.small_img} time="3000" click={() => {console.log()}}/>:null:null}
            {bigImg}
        </div>)
    }
}
class Slider extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            activeSlide: 0,
        }
        this.nextSlide = this.nextSlide.bind(this);
        this.previousSlide = this.previousSlide.bind(this);
        this.onChildChange = this.onChildChange.bind(this);
        this.liselect = this.liselect.bind(this);
        this.timer = null;
    }
    nextSlide(){
        var slide = this.state.activeSlide + 1 < this.props.slides.length ? this.state.activeSlide + 1 : 0;
        this.setState({activeSlide: slide});
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), this.props.time)
    }
    previousSlide() {
        var slide = this.state.activeSlide - 1 < 0 ? this.props.slides.length - 1 : this.state.activeSlide - 1;
        this.setState({activeSlide: slide});
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), this.props.time)
    }
    componentDidMount() {
        this.timer = setInterval(() => this.nextSlide(), this.props.time);
    }
    onChildChange(newVal){
        // var that = this.this;
        // var that = this;
        if(newVal == "向左"){
            this.previousSlide();
        }else if(newVal == "向右"){
            this.nextSlide()
        }
    }
    liselect(v){
        this.setState({activeSlide:v});
        clearInterval(this.timer);
        this.timer = setInterval(() => this.nextSlide(), this.props.time)
    }
    render(){
        var _this = this;
        var slides = this.props.slides;
        // console.log(slides,'slidessssssssssssssssss')
        let lis = null;
        var slide = null;
        if(slides){
            let width = window.screen.width
            let left = -width * _this.state.activeSlide
            let sty = {
                position:'relative',
                left: left,
            }
            slide = slides.map((ele,index) => {
                return(
                    <Slide 
                        style={sty}
                        img={ele.imgUrl} 
                        active={_this.state.activeSlide} 
                        key={index}
                        link={ele.link}
                        change={_this.onChildChange}
                        click={this.props.click}
                    />
                )
            })
            lis = slides.map((ele,index) => {
                if(index == this.state.activeSlide){
                    return(<li key={index} style={{height:10,width:10,background:'#666',float:'left',marginLeft:5,borderRadius:5}} onClick={() => {this.liselect(index)}}></li>)
                }else{
                    return(<li key={index} style={{height:10,width:10,background:'#fff',float:'left',marginLeft:5,borderRadius:5}} onClick={() => {this.liselect(index)}}></li>)
                }
            })
        }
       
        let width = slide.length * 15;
        let Mleft = -width/2 + 'px'
        return(
            <div style={{overflow:'hidden',width:'100%',height:'100%',position:'relative',display:'flex',flexWrap:'nowarp'}}>
                {/* <div> */}
                {slide}
                {/* </div> */}
                 <div style={{height:50,width:50,position:'absolute',top:'50%',marginTop:'-25px',right:0,}} onClick={ev=>{this.nextSlide()}}>
                    {/* <i className="fa fa-4x fa-arrow-circle-right"></i> */}
                    <ImageNavigateNext style={{width:50,height:50}} color={'rgba(0,0,0,0.1)'}/>
                </div>
                <div style={{height:50,width:50,position:'absolute',top:'50%',marginTop:'-25px',left:0,}} onClick={ev=>{this.previousSlide()}}>
                    {/* <i className="fa fa-4x fa-arrow-circle-left"></i> */}
                    <ImageNavigateBefore style={{width:50,height:50}} color={'rgba(0,0,0,0.1)'}/>
                 </div> 
                 <ul style={{listStyle:'none',position:'absolute',bottom:5,margin:0,padding:0 ,width:width, boxSizing: 'border-box', left: '50%',marginLeft: Mleft}}>
                     {lis}
                 </ul>
            </div>
            
        ) 
    }
    
}
class Slide extends Component{
    constructor(props,context){
        super(props,context)
        this.state = {
            startX:"",
            startY:"",
            endX:'',
            endY:''
        }
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.GetSlideAngle = this.GetSlideAngle.bind(this);
        this.GetSlideDirection = this.GetSlideDirection.bind(this);
    }
    touchStart(ev){
        console.log(ev.touches[0],'touchstart')
        this.setState({
            startX: ev.touches[0].pageX,
            startY: ev.touches[0].pageY
        })
    }
    touchEnd(ev){
        // console.log(ev.changedTouches[0],'touchend')
        let endX = ev.changedTouches[0].pageX;
        let endY = ev.changedTouches[0].pageY;
        // console.log(this.state.startX,this.startY,'statxtyt')
        var direction = this.GetSlideDirection(this.state.startX, this.state.startY, endX, endY);
        // console.log(direction,'direction')
        switch(direction) {
            case 0:
                console.log("没滑动");
                break;
            case 1:
                console.log("向上");
                break;
            case 2:
                console.log("向下");
                break;
            case 3:
                console.log("向左");
                this.props.change("向左")
                break;
            case 4:
                console.log("向右");
                this.props.change("向右")
                break;
            default:
        }
    }
    GetSlideAngle(dx, dy){
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    GetSlideDirection(startX,startY,endX,endY){
        var dy = startY - endY;
        var dx = endX - startX;
        // console.log(dy,dx,'dx,dx')
        var result = 0;
        if(Math.abs(dx) < 2 && Math.abs(dy) < 2){
            return result;
        }
        var angle = this.GetSlideAngle(dx,dy);
        // console.log(angle,'angle')
        if(angle >= -45 && angle < 45){
            result = 4
        }else if(angle >= 45 && angle < 135){
            result = 1;
        }else if(angle >= -135 && angle < -45){
            result = 2
        }else if((angle >= 135 && angle <= 180)||(angle >= -180 && angle < -135)){
            result = 3;
        }
        return result
    }
    render(){
        let width = window.screen.width;
        const {style} = this.props;
        return(
            <div>
                <div style={style}>
                    <img onTouchStart={this.touchStart} onTouchEnd={this.touchEnd} onClick={this.props.click} style={{width:width,height:210}} src={this.props.img} onTouchStart={ev=>{this.touchStart(ev)}}/>
                </div>
            </div>
        )
    }
}
export default Advert_manage
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import Input from '../_component/base/input';
import AreaSelect from '../_component/base/areaSelect';
import AppBar from '../_component/base/appBar';
import MapsPlace from 'material-ui/svg-icons/maps/place'
import WMap from '../_modules/WMap';
import SonPage from '../_component/base/sonPage';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ImageAdjust from 'material-ui/svg-icons/image/adjust';
import Checkbox from 'material-ui/Checkbox';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search'

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding: '10px'
    },
    wxbox:{'padding':'10px',textAlign:'right'},
    h4:{textAlign:'left'},
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            edit:false
        }
        this.edit = this.edit.bind(this);
        this.back = this.back.bind(this);
    }
    
    edit(){
        this.setState({edit:true});
    }
    back(){
        this.setState({edit:false});
    }
    render() {
        let box=this.state.edit?(<EditBox back={this.back}/>):(<ShowBox edit={this.edit}/>);
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.company_info}/>
                <div style={sty.p}>
                    {box}
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


const _strVa=[___.group_marketing,___.distribution,___.enterprises,___.carowner_seller];
class ShowBox extends Component{
    render() {
        let cust=_user.customer;
        let button=(cust.uid==_user.uid)?(<FlatButton label={___.edit} onClick={this.props.edit} primary={true} />):null;

        let arrVa=(cust.other && cust.other.va) ? cust.other.va.split(',') : [];
        let strVa=___.no_added_service;
        if(arrVa!=[]){
            strVa=arrVa.map(ele=>_strVa[ele]).join(' ');
        }
        if(cust.isInstall){
            if(strVa==___.no_added_service){
                strVa=___.install_shop;
            }else{
                strVa=strVa+' '+___.install_shop;
            }
        }
        return (
            <div style={sty.p}>
                <h2>{cust.name}</h2>
                {/* <p>{___.cust_type+'：'+cust.custType}</p> */}
                {/* <p>{___.value_added_service+'：'+strVa}</p> */}
                <p>{___.person+'：'+cust.contact}</p>
                <p>{___.cellphone+'：'+cust.tel}</p>
                <address>{___.address+'：'+(cust.province||'')+(cust.city||'')+(cust.area||'')+(cust.address||'')}</address>
                <div style={{textAlign:'right',marginTop:'15px'}}>
                    {button}
                </div>
            </div>
        );
    }
}


class EditBox extends Component{
    constructor(props, context) {
        super(props, context);
        this.fromData={};
        this.change = this.change.bind(this);
        this.save = this.save.bind(this);
        this.getPoi = this.getPoi.bind(this);
        this.area = null;
        this.address = null
    }
    getChildContext(){
        return {
            getPoi:this.getPoi
        }
    }
    getPoi(a,b,callback){
        console.log(1);
        console.log(a,b)
        Wapi.area.get(res => {
            console.log(res,'get area')
            let area = {
                province:a.province,
                provinceId:res.data.provinceId,
                city:a.city,
                cityId:res.data.parentId,
                area:a.area,
                areaId:res.data.id
            }
            this.area = area;
            this.address = b;
            callback();
            this.fromData['address']=b;
            this.fromData['area'] = area;
            this.forceUpdate();
        },{
            name:a.area
        })
    }
    componentDidMount() {
        let cust=_user.customer;
        let area={
            province:cust.province,
            provinceId:cust.provinceId,
            city:cust.city,
            cityId:cust.cityId,
            area:cust.area,
            areaId:cust.areaId
        }
        this.area = area;
        this.address = cust.address;
        this.forceUpdate();
    }
    
    change(e,val){
        if(e.currentTarget){
            let name=e.currentTarget.name;
            this.fromData[name]=val;
        }else
            this.fromData['area']=e;
    }

    save(){
        let data=Object.assign({},this.fromData);
        Object.assign(data,this.fromData.area);
        data._uid=_user.uid;
        let that=this;
        Wapi.customer.update(function(res){
            delete data._uid;
            Object.assign(_user.customer,data);
            W.setSetting('user',_user);
            that.props.back();
        },data);
    }

    render() {
        let cust=_user.customer;
        console.log(this.fromData)
        // let area={
        //     province:cust.province,
        //     provinceId:cust.provinceId,
        //     city:cust.city,
        //     cityId:cust.cityId,
        //     area:cust.area,
        //     areaId:cust.areaId
        // }
        // console.log(area)
        return (
            <div style={sty.p}>
                <Input value={cust.name} name='name' onChange={this.change} hintText={___.name}/>
                {/* <p>{___.cust_type+'：'+cust.custType}</p> */}
                <Input value={cust.contact} name='contact' onChange={this.change} hintText={___.person}/>
                <Input value={cust.tel} name='tel' onChange={this.change} hintText={___.cellphone}/>
                <div style={{position:'relative'}}>                
                    <AreaSelect onChange={this.change} value={this.area} style={{width:'90%'}}/> 
                    <Position style={{position:'absolute',top:12,right:5}}/>
                </div>
                <Input value={this.address} name='address' onChange={this.change} hintText={___.address}/>     
                {/* <Position /> */}
                <div style={{textAlign:'right',marginTop:'15px'}}>
                    <FlatButton label={___.cancel} onClick={this.props.back} default={true} />                
                    <FlatButton label={___.save} onClick={this.save} primary={true} />
                </div>
            </div>
        );
    }
    
}
EditBox.childContextTypes = {
    getPoi: React.PropTypes.func
} 

class Position extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            opo:false
        }
        this.map = null;
        this.mapinit = this.mapinit.bind(this);
        this.back = this.back.bind(this);
    }
    componentDidMount() {
        
    }
    
    mapinit(){
        
        //  console.log(123);
         this.setState({opo:true})
    }
    back(){
        this.setState({opo:false})
    }
    render(){
        return(
            <div {...this.props}>
                <span onClick={this.mapinit}><MapsPlace /></span>
                {/* <div id="allmap" style={this.state.opo?{display:'block'}:{display:'none'}}></div> */}
                <SonPage open={this.state.opo} back={this.back}>
                    {/* <Maps /> */}
                    {this.state.opo?<Maps back={this.back}/>:<div></div> }
                </SonPage>
            </div>
        )
    }
}

class Maps extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            Pois: null,
            searchD:null,
            target:''
        }
        this.search = this.search.bind(this);
        this.select = this.select.bind(this);
        this.mapinit = this.mapinit.bind(this);
        this.selectS = this.selectS.bind(this);
        this.change = this.change.bind(this);
        this.addOverlay = this.addOverlay.bind(this);
        this.delOverlay = this.delOverlay.bind(this);
        this.submit = this.submit.bind(this);
        this.flat = null;
    }
    componentDidMount() {
        if(typeof WMap!='undefined'&&WMap.ready){//已经加载好
            this.mapinit();
        }else{
            window.addEventListener('W.mapready',this.mapinit);
        }
    }
    //初始化定位/拖拽
    mapinit(){
        this.flat = -1;
        this.map=new WMap("allmap");
        var myGeo=new WMap.Geocoder();
        this.setState({searchD:null})
        if(WiStorm.agent.mobile){
            // alert(1)
            this.map.addControl(new WMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM,anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset: new WMap.Size(5, 20)}));//添加缩放控件
        }else{
            this.map.enableScrollWheelZoom();//启用滚轮放大缩小
        }
        let that = this
        this.map.centerAndZoom(new WMap.Point(114.025974,22.546054),11)
        //定位
        var geolocation = new WMap.Geolocation();
        console.log(geolocation)
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                that.setState({searchD:null})
                that.addOverlay(r.point)
                that.map.centerAndZoom(new WMap.Point(r.point.lng, r.point.lat), 15);  
                myGeo.getLocation(new WMap.Point(r.point.lng,r.point.lat),function(result){
                    // console.log(result,'result')
                    result.isSelec = true;
                    that.setState({Pois:result})

                });
            }
            else {
                alert('failed'+this.getStatus());
            }        
        },{enableHighAccuracy: true});
        //点击定位
        var geolocationControl = new WMap.GeolocationControl();
        geolocationControl.addEventListener("locationSuccess", function(e){
            // 定位成功事件
            that.setState({searchD:null}) 
            that.flat = -1
            that.setState({target:''})
            myGeo.getLocation(new WMap.Point(e.point.lng,e.point.lat),function(result){
                // console.log(result,'result')
                result.isSelec = true;
                // console.log(result,'result')
                that.setState({Pois:result})

            });
        });
        this.map.addControl(geolocationControl);
        //拖拽位置
        this.map.addEventListener("dragend", function(){  
            that.setState({searchD:null});
            that.flat = -1;
            that.setState({target:''})
            that.delOverlay()
            var center = that.map.getCenter(); //地图中心点   
            let mk = that.addOverlay(center)  //添加标注
            
            myGeo.getLocation(new WMap.Point(center.lng,center.lat),function(result){
                result.isSelec = true;
                that.setState({Pois:result})
                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 100,     // 信息窗口高度
                    title: result.business,
                }
                let addr = null
                if(result.surroundingPois.length){
                    addr = result.surroundingPois[0].address==" "?result.address:result.surroundingPois[0].address
                    opts.title = result.surroundingPois[0].title ; // 信息窗口标题
                }else{
                    addr = result.address
                }
                var infoWindow = new WMap.InfoWindow(addr, opts);  // 创建信息窗口对象 
                mk.addEventListener("click", function(){          
                    that.map.openInfoWindow(infoWindow,center); //开启信息窗口
                }); 
            });
        });  
    }
    //选择定位/拖拽到的地址
    select(index,point){
        this.flat = index;
        this.delOverlay();
        this.addOverlay(point) 
        if(index == -1){
            this.state.Pois.isSelec = true
            // this.addOverlay(point) 
            this.state.Pois.surroundingPois.forEach((e,ix) => {
                e.isSelec = false;
            })
        }else {
            this.state.Pois.isSelec = false
            // this.addOverlay(point)
            this.state.Pois.surroundingPois.forEach((e,ix) => {
                e.isSelec = false;
                if(index==ix){
                    e.isSelec = true
                }
            })
        }
        this.setState({Pois:this.state.Pois})
    }
    //选择搜索到的地址
    selectS(index,point){
        this.flat = index;
        this.delOverlay();
        this.addOverlay(point)
        this.state.searchD.forEach((e,ix)=> {
            e.isSelec = false;
            if(index == ix){
                e.isSelec = true;
            }
        })
        this.setState({searchD:this.state.searchD})
    }
    change(e){
        this.setState({target:e.target.value})
    }
    //搜索地址
    search(value){
        // console.log(value)
        this.flat = 0;
        this.setState({Pois:null})
        var myGeo=new WMap.Geocoder();        
        var that = this;
        var options = {
            forceLocal:'false',
            onSearchComplete: function(results){
                // 判断状态是否正确
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    // let itme = local.getResults();
                    // console.log(itme)
                    // var s = [];
                    var sData = []
                    for (var i = 0; i < results.getCurrentNumPois(); i ++){
                        let inx = i;
                        myGeo.getLocation(new WMap.Point(results.getPoi(i).point.lng,results.getPoi(i).point.lat),function(re){
                            console.log(re,'result')
                            let op = re
                            // op.address = re.address;
                            // op.addressComponents = re.addressComponents;
                            // op.point = re.point;
                            op.title = results.getPoi(inx).title
                            sData.push(op)
                            if(sData.length){
                                sData[0].isSelec = true
                                that.addOverlay(sData[0].point) 
                            }
                            that.setState({searchD:sData})
                        });
                    }
                }
            }
	    };
        var local = new WMap.LocalSearch(this.map, options);
        local.search(value);
    }
    //添加标注
    addOverlay(point){
        var mk = new WMap.Marker(point);
        this.map.addOverlay(mk);
        this.map.panTo(point); 
        return mk;
    }
    //删除标注
    delOverlay(){
        var allOverlay = this.map.getOverlays();
        for(var i = 0;i<allOverlay.length;i++){
            this.map.removeOverlay(allOverlay[i])
        }
    }
    submit(){
        let address1 = null;
        let address2 = null;
        let address3 = null;
        if(this.state.Pois){
            let addr = this.state.Pois.addressComponents
            address1 = addr.province + addr.city + addr.district;
            address3 = {
                province:addr.province,
                city: addr.city,
                area: addr.district
            }
            if(this.flat == -1){
                address2 = addr.street + addr.streetNumber
            }else{
                let addrs = this.state.Pois.surroundingPois[this.flat]
                let addre = addrs.address;
                if(addr.district){
                    if(addrs.address.indexOf(addr.district)>-1){
                        let ite = addrs.address.split(addr.district)
                        addre = ite[1]
                    }else if(addrs.address.indexOf(addr.city)>-1){
                        let ite = addrs.address.split(addr.city)
                        addre = ite[1]
                    }
                }
                address2 = addre + addrs.title
            }
        }else if(this.state.searchD){
            let addr = this.state.searchD[this.flat].addressComponents
            let addrs = this.state.searchD[this.flat]
            address1 = addr.province + addr.city + addr.district;
            address3 = {
                province:addr.province,
                city: addr.city,
                area: addr.district
            }
            let addre = addrs.address;
            if(addr.district){
                if(addrs.address.indexOf(addr.district)>-1){
                    let ite = addrs.address.split(addr.district)
                    addre = ite[1]
                }else if(addrs.address.indexOf(addr.city)>-1){
                    let ite = addrs.address.split(addr.city)
                    addre = ite[1]
                }
            }
            address2 = addre + addrs.title
        }
        console.log(address1,address2)
        this.context.getPoi(address3,address2,this.props.back)      
    }

    render(){
        console.log(this.flat,'how flat')
        let height = (window.screen.height-40)/2;
        let width = (window.screen.width-20)/3;
        let widths = window.screen.width/2-16;
        console.log(this.state.Pois,'pois');
        console.log(this.state.searchD,'searchD')
        let item = [];
        if(this.state.Pois){
            if(this.state.Pois.surroundingPois.length){
                item = this.state.Pois.surroundingPois.map((ele,index) => {
                    return(
                        <div onClick={()=>this.select(index,ele.point)} key={index} style={{padding:'5px 10px',paddingRight:'36px',borderBottom:'1px solid #ccc',height:40,lineHeight:'20px',position:'relative'}}>
                            <h3 style={{margin:0,fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ele.title}</h3>
                            <div style={{fontSize:14,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ele.address}</div>
                            {
                                ele.isSelec?
                                    <Checkbox
                                        checkedIcon={<ImageAdjust />}
                                        checked={true}
                                        uncheckedIcon={<ImageAdjust />}
                                        label=""
                                        labelPosition="left"
                                        style={{position:'absolute',right:12,top:15,width:40}}
                                    />:null
                            }
                        </div>
                    )
                })
            }
            item.unshift(
                <div onClick={()=>this.select(-1,this.state.Pois.point)} key={-1} style={{padding:'5px 10px',paddingRight:'36px',borderBottom:'1px solid #ccc',minHeight:30,lineHeight:'30px',position:'relative'}}>
                    <div style={{fontSize:14,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{this.state.Pois.address}</div>
                    {
                        this.state.Pois.isSelec?
                            <Checkbox
                                checkedIcon={<ImageAdjust />}
                                checked={true}
                                uncheckedIcon={<ImageAdjust />}
                                label=""
                                labelPosition="left"
                                style={{position:'absolute',right:12,top:10,width:40}}
                            />:null
                    }
                </div>
            )
        }
        if(this.state.searchD){
            if(this.state.searchD.length){
                item = this.state.searchD.map((ele,index) => {
                    return(
                        <div onClick={()=>this.selectS(index,ele.point)} key={index} style={{padding:'5px 10px',paddingRight:'36px',borderBottom:'1px solid #ccc',height:40,lineHeight:'20px',position:'relative'}}>
                            <h3 style={{margin:0,fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ele.title}</h3>
                            <div style={{fontSize:14,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ele.address}</div>
                            {
                                ele.isSelec?
                                    <Checkbox
                                        checkedIcon={<ImageAdjust />}
                                        checked={true}
                                        uncheckedIcon={<ImageAdjust />}
                                        label=""
                                        labelPosition="left"
                                        style={{position:'absolute',right:12,top:15,width:40}}
                                    />:null
                            }
                        </div>
                    )
                })
            }
        }
        return(
            <div>
                <div style={{height:'30px',lineHeight:'30px',padding:'5px 10px',background:'#000'}}>
                    <span style={{display:'inline-block',width:width,color:'#fff'}}><span onClick={this.props.back}>{'取消'}</span></span>
                    <span style={{display:'inline-block',width:width,textAlign:'center',color:'#fff'}}>{'位置'}</span>
                    <span style={{display:'inline-block',width:width,textAlign:'right',color:'#fff'}}><span onClick={this.submit}>{'确定'}</span></span>
                </div>
                <div>
                    <TextField 
                        style={{width:'90%',height:38}}
                        value={this.state.target}
                        hintStyle={{bottom:8}}
                        hintText={(<div style={{position:'relative',left:widths}}>{'搜索'}</div>)}
                        underlineStyle={{bottom:0}}
                        underlineFocusStyle={{bottom:0}}
                        onChange={this.change}
                    />
                    <span onClick={() => {this.search(this.state.target)}} style={{width:'10%',height:37,borderBottom:'1px solid #ccc',display:'inline-block',position:'absolute',textAlign:'center'}}>
                        <ActionSearch style={{width:'70%',height:38,color:"#5acc18"}} />
                    </span>
                </div>
                <div id="allmap" style={{height:height,width:'100%'}}></div>
                 <div style={{height:height-38,overflow:'auto'}} >
                        {item} 
                </div> 
            </div>
        )
        
    }
}
Maps.contextTypes = {
    getPoi: React.PropTypes.func
}
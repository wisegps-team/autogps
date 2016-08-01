"use strict";
import React, {Component} from 'react';

import WMap from '../_modules/WMap';
import {getStatusDesc,getAllState} from '../_modules/car_state';


class Map extends Component {
    constructor(props){
        super(props);
        this.mapinit = this.mapinit.bind(this);
    }

    componentDidMount() {
        if(WMap.ready){//已经加载好
            this.mapinit();
        }else{
            window.addEventListener('W.mapready',this.mapinit());
        }
    }

    componentWillReceiveProps(nextProps) {//收到新props
        if(nextProps.cars.length!=this.props.cars.length){
            let view=nextProps.cars.map(function (ele) {
                return new WMap.Point(ele.active_gps_data.b_lon, ele.active_gps_data.b_lat);
            });
            this.map.setViewport(view);//设置合适的层级大小
        }
    }
    mapinit(){
        this.map=new WMap(this.props.id);
        this.map.enableScrollWheelZoom();//启用滚轮放大缩小
        this.map.addControl(new WMap.NavigationControl());
        this.map.infoWindow=new WMap.InfoWindow('',{
            width : 350,     // 信息窗口宽度
            height: 200     // 信息窗口高度
        });
        let div=document.createElement('div');
        this.map.infoWindow.setContent(div);
        this.map.infoWindow._div=div;
        this.map.infoWindow._close=function(){};
        this.map.infoWindow.addEventListener('close',function(){
            if(this._close)
                this._close();
        })
        this.forceUpdate();
    }

    render() {
        let children;
        if(this.map){
            let windowOpen=false;
            children=this.props.cars.length?this.props.cars.map(function (ele) {
                windowOpen=(this.props.active==ele.obj_id)
                return (<Car 
                    key={ele.obj_id}
                    map={this.map}
                    data={ele} 
                    carClick={this.props.carClick} 
                    open={windowOpen}
                />);
            },this):[];
        }
        return (<div {...this.props}>
            {children}
            {this.props.children}
        </div>);
    }
}

class Car extends Component{
    constructor(props){
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state={
            tracking:false
        };
    }
    componentDidMount(){
        this.marker=this.props.map.addMarker({
            img:'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',
            w:28,
            h:28,
            lon:this.props.data.active_gps_data.b_lon,
            lat:this.props.data.active_gps_data.b_lat
        });
        this.marker.addEventListener("click",this.openWindow);
        
        if(this.props.open){//打开infowindow
            this.marker.openInfoWindow(this.getWindow());
        }
        this.setMarker();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.open){
            let win=this.getWindow();
            if(!this.props.open)
                this.marker.openInfoWindow(win);
        }
        if(this.props.data.active_gps_data.b_lon!=nextProps.data.active_gps_data.b_lon||this.props.data.active_gps_data.b_lat!=nextProps.data.active_gps_data.b_lat){
            let pos=new WMap.Point(nextProps.data.active_gps_data.b_lon,nextProps.data.active_gps_data.b_lat);
            this.marker.setPosition(pos);
            if(this.state.tracking){
                //跟踪当中
                let tracking_line=this.state.tracking_line.concat(pos);
                this.setState(Object.assign({},this.state,{tracking_line}));
            }
        }
        this.setMarker();
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.tracking){//跟踪状态
            if(!this.state.tracking||nextState.tracking_line.length!=this.state.tracking_line.length){//开始跟踪
                let polyline = new WMap.Polyline(
                    nextState.tracking_line,
                    {
                        strokeColor:"blue", 
                        strokeWeight:5, 
                        strokeOpacity:0.5
                    }
                );
                if(this.polyline)this.props.map.removeOverlay(this.polyline);
                this.props.map.addOverlay(polyline); 
                this.polyline=polyline;
            }
        }else if(this.polyline){
            this.props.map.removeOverlay(this.polyline); 
            this.polyline=undefined;
        }
    }
    componentDidUpdate(){
        console.log('已经更新');
    }
    componentWillUnmount() {//移除
        if(this.props.open){
            this.props.map.infoWindow._close=null;
        }
        this.props.map.removeOverlay(this.marker);
        this.marker=undefined;
        if(this.polyline){
            this.props.map.removeOverlay(this.polyline);
            this.polyline=undefined;
        }
    }

    openWindow(){
        this.props.carClick(this.props.data.obj_id);
    }
    getWindow(){
        var div=this.props.map.infoWindow._div;
        let new_div=info(this.props.data,this);
        if(div._content)
            div.replaceChild(new_div,div._content);
        else
            div.appendChild(new_div);
        div._content=new_div;
        this.props.map.infoWindow._close=null;
        setTimeout(()=>this.props.map.infoWindow._close=()=>this.props.carClick(0),500);//避免从一个车点到另一个车会触发这个方法

        return this.props.map.infoWindow;
    }
    setMarker(){
        let imgs=[
            'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',//停止
            'http://web.wisegps.cn/stylesheets/objects/normal_run_0.gif',//行驶
            'http://web.wisegps.cn/stylesheets/objects/normal_offline_0.gif'//离线
        ];
        let state=getStatusDesc(this.props.data,2);
        let icon=this.marker.getIcon();
        icon.setImageUrl(imgs[state.state]);
        this.marker.setIcon(icon);
        if(this.props.data.active_gps_data.direct)
            this.marker.setRotation(this.props.data.active_gps_data.direct);
    }
    track(start){//开始跟踪或者取消
        if(start){
            let pos=new WMap.Point(this.props.data.active_gps_data.b_lon,this.props.data.active_gps_data.b_lat);
            this.setState({
                tracking:true,
                tracking_line:[pos]
            });
        }else if(this.state.tracking){           
            this.setState({
                tracking:false,
                tracking_line:[]
            });
        }
    }
    render(){
        return null;
    }
}

function info(data,thisCar) {
    let g,gt;
    if(data.active_gps_data.gps_flag==2){
        g='_g',gt=___.gps_location;
    }else{
        g='',gt=___.no_gps_location;
    }
    let model=(data.call_phones.length&&data.call_phones[0].obj_model)?'('+data.call_phones[0].obj_model+')':'';
    let desc=getAllState(data);

    let div=document.createElement('div');
    div.style.fontSize='14px';
    div.innerHTML=W.replace('<p><span><font style="font-size: 15px; font-weight:bold; font-family:微软雅黑;">'+data.obj_name+model+'</font></span><img src="http://web.wisegps.cn/images/wifi'+desc.signal_l+'.png" title="___.signal'+desc.singal_desc+'"/><img src="http://web.wisegps.cn/images/gps'+g+'.png" title="'+gt+'"/></p><table style="width: 100%;"><tbody><tr><td><font color="#244FAF">___.car_state：</font>'+desc.desc+'</td><td><font color="#244FAF">___.state：</font>'+desc.status_desc+'</td></tr><tr><td colspan="2"><font color="#244FAF">___.gps_time：'+desc.gps_time+'</font></td></tr><tr><td colspan="2"><font color="#244FAF">___.position_description：</font><span class="location">___.getting_position</span></td></tr><tr><td width="50%"><font color="#244FAF">___.management：</font>'+data.call_phones[0].manager+'</td><td><font color="#244FAF">___.cellphone：</font>'+data.call_phones[0].phone1+'</td></tr><tr><td width="50%"><font color="#244FAF">___.driver：</font>'+data.call_phones[0].driver+'</td><td><font color="#244FAF">___.cellphone：</font>'+data.call_phones[0].phone+'</td></tr></tbody></table>');
    
    let b=document.createElement('button');
    b.innerText=thisCar.state.tracking?___.untrack:___.track;
    b.addEventListener('click',function(){
        thisCar.track(!thisCar.state.tracking);
        this.innerText=thisCar.state.tracking?___.untrack:___.track;
    });
    div.appendChild(b);

    let geo=new WMap.Geocoder();
    geo.getLocation(new WMap.Point(data.active_gps_data.b_lon,data.active_gps_data.b_lat),function(res){
        if(res)
            div.querySelector('.location').innerText=res.address;
    });
    return div;
}




















export default Map;
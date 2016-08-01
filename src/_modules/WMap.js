/**
 * 百度地图封装类
 * 需要监听到window的W.mapready事件之后才能使用
 * 目的是封装百度地图，简化使用，目前非常不完善，只有几个基本方法
 */
W.include("http://api.map.baidu.com/api?v=2.0&ak=647127add68dd0a3ed1051fd68e78900&callback=__WMap_mapInit");

//类构造
function WMap(id,lat,lon,zoom){
	lat=lat||116.417854;
	lon=lon||39.921988;
	zoom=zoom||15;
	var map = new BMap.Map(id);//地图实例化
	map.centerAndZoom(new BMap.Point(lat,lon),zoom);
    //控件
    var zoomControl = new BMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM,anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset: new BMap.Size(5, 20)});
    map.addControl(zoomControl);//添加缩放控件
    // map.addEventListener("tilesloaded", function(){W(".anchorBL").style.display="none";});//隐藏地图底部文字
    Object.assign(map,WMap.prototype);
    return map
}

WMap.prototype.moveTo=function(lon,lat){
	this.panTo(new BMap.Point(lon,lat));
}

//添加一个标点,传递标点的构造信息，目前只需要lat,lon
WMap.prototype.addMarker=function(data){
    if(!data){return;}
	var marker;
    if(data.img){
    	var icon = new BMap.Icon(data.img, new BMap.Size(data.w,data.h));
    	marker = new BMap.Marker(new BMap.Point(data.lon,data.lat),{icon:icon});
    }else
    	marker = new BMap.Marker(new BMap.Point(data.lon,data.lat));
	this.addOverlay(marker);  
    return marker;
}

//异步加载百度地图需要一个全局方法，以供类似jsonp方式的使用
window.__WMap_mapInit=function(){
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("W.mapready", false, false);
	window.dispatchEvent(evt);
	Object.assign(WMap,BMap);
	WMap.ready=200;
}


export default WMap;
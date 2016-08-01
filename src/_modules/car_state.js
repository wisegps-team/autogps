const ALERT_SOS = 0x3001;              //紧急报警
const ALERT_OVERSPEED = 0x3002;        //超速报警
const ALERT_VIRBRATE = 0x3003;         //震动报警       
const ALERT_MOVE = 0x3004;             //位移报警       
const ALERT_ALARM = 0x3005;            //防盗器报警     
const ALERT_INVALIDRUN = 0x3006;       //非法行驶报警   
const ALERT_ENTERGEO = 0x3007;         //进围栏报警     
const ALERT_EXITGEO = 0x3008;          //出围栏报警     
const ALERT_CUTPOWER = 0x3009;         //断电报警       
const ALERT_LOWPOWER = 0x300A;         //低电压报警     
const ALERT_GPSCUT = 0x300B;           //GPS天线断路报警
const ALERT_OVERDRIVE = 0x300C;        //疲劳驾驶报警   
const ALERT_INVALIDACC = 0x300D;       //非法启动       
const ALERT_INVALIDDOOR = 0x300E;      //非法开车门  

// show_mode 
// 1: 车辆列表中
// 2: 实时监控中
// 3: 轨迹回放中
export function getStatusDesc(vehicle, show_mode) {
    /*
    离线，1--显示SIM卡号, 2--离线1个小时内小时显示“离线 <1小时“，超过1个小时，显示离线“离线 xx个小时”
    在线，有效定位，速度超过10公里，显示：行驶，其他状态 xx公里/小时，速度低于等于10公里，显示：静止，其他状态
    在线，无效定位，如果信号小于指定值，速度超过10公里，显示：盲区，速度低于等于10公里，显示：静止
    */
    var res={
        state:0,//0停止，1行驶，2离线，3装卸，4断电
        desc:'',
        speed:0,
        delay:0
    };
    var alerts=vehicle.active_gps_data.uni_alerts;
    // 如果数据接收时间在10分钟以内，认为在线，否则为离线
    var now = new Date();
    var rcv_time = W.date(vehicle.active_gps_data.rcv_time);
    res.delay = parseInt(Math.abs(now - rcv_time) / 1000 / 60);//把相差的毫秒数转换为分钟
    if (show_mode == 3 || res.delay < 1440) {
        if(alerts.indexOf(ALERT_CUTPOWER) > -1){
            res.desc = "断电";
            res.state =4;
        }else if(alerts.indexOf(ALERT_SOS) > -1){
            res.desc = "装卸";
            res.state =3;
        }else if(vehicle.active_gps_data.speed > 5){
            res.state =1;
            if(show_mode == 2){
                res.speed=vehicle.active_gps_data.speed.toFixed(0);
                res.desc = "行驶 " + res.speed + "km/h";                
            }else{
                res.desc = "行驶";
            }
        }else{
            res.desc = "停止";
        }
    } else {
        res.desc = "离线" + parseInt(res.delay/ 60 / 24) + "天";
        res.state =2;        
    }
    return res;
}

export function getUniAlertsDesc(uni_alerts) {
    var desc = "";
    for (var i = 0; i < uni_alerts.length; i++) {
        switch (uni_alerts[i]) {
            case ALERT_SOS: desc += ",装卸"; break;
            case ALERT_OVERSPEED: desc += ",超速报警"; break;
            case ALERT_VIRBRATE: desc += ",震动报警"; break;
            case ALERT_MOVE: desc += ",位移报警"; break;
            case ALERT_ALARM: desc += ",防盗器报警"; break;
            case ALERT_INVALIDRUN: desc += ",非法行驶报警"; break;
            case ALERT_ENTERGEO: desc += ",进围栏报警"; break;
            case ALERT_EXITGEO: desc += ",出围栏报警"; break;
            case ALERT_CUTPOWER: desc += ",断电报警"; break;
            case ALERT_LOWPOWER: desc += ",低电压报警"; break;
            case ALERT_GPSCUT: desc += ",GPS断线报警"; break;
            case ALERT_OVERDRIVE: desc += ",疲劳驾驶报警"; break;
            case ALERT_INVALIDACC: desc += ",非法点火报警"; break;
            case ALERT_INVALIDDOOR: desc += ",非法开门报警"; break;
        }
    }
    return desc;
}


export function getAllState(data){
    let res=getStatusDesc(data,2);
    
    let f=parseInt(data.active_gps_data.signal/5);
    f=(f>4)?4:f;
    f=(f<1)?1:f;
    let ft='差差弱良强';
    res.signal_desc=ft[f];
    res.signal_l=f;
    res.status_desc=(data.active_gps_data.uni_status.indexOf(8196)!=-1)?'启动':'熄火';
    res.gps_time=W.dateToString(W.date(data.active_gps_data.gps_time));
    return res;
}
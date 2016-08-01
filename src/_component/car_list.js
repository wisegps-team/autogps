import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List , ListItem,MakeSelectable} from 'material-ui/List';
// import ContentInbox from 'material-ui/svg-icons/content/inbox';
import FontIcon from 'material-ui/FontIcon';

import {getStatusDesc} from '../_modules/car_state';
let SelectableList = MakeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends React.Component {
        constructor(props) {
            super(props);
            this.handleRequestChange=this.handleRequestChange.bind(this);
        }
        handleRequestChange(event, index){
            // console.log(event);
            this.props.carClick(index)
        };

        render() {
            return (
            <ComposedComponent
                value={this.props.active}
                onChange={this.handleRequestChange}
            >
                {this.props.children}
            </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

export class CarList extends React.Component {
    render(){
        let items=this.props.data.map(function (ele) {
            let uni_status=(ele.active_gps_data.uni_status.indexOf(8196)!=-1)?'启动':'熄火';
            let status=getStatusDesc(ele,1);//status.desc行驶
            let stopTime=new Date(ele.active_gps_data.last_active_stop_time).getTime();
            let nowTime=new Date().getTime();
            let stop_duration=formatStopTime(nowTime-stopTime);
            let speed=ele.active_gps_data.speed.toFixed(0) + "km/h";
            let status_show=uni_status+" "+status.desc+" "+stop_duration;
            if(status.desc=="行驶"){
                status_show=uni_status+" "+status.desc+" "+speed;
            }else if(status.desc.slice(0,2)=="离线"){
                status_show=uni_status+" "+status.desc;
            }

            return <ListItem
                primaryText={ele.obj_name}
                secondaryText={
                    <span style={{color: '#999',fontSize:'12px'}}>{status_show}</span>
                }
                key={ele.obj_id}
                value={ele.obj_id}
                innerDivStyle={{paddingTop:'5px',paddingBottom:'5px',fontSize:'14px'}}
            />
        });
        return React.createElement(SelectableList, Object.assign({}, this.props, { children:items}))
    }
}

// class CarItem extends React.Component {
//     render(){
//         return(
//             <ListItem
//                 primaryText={this.props.data.obj_name}
//                 secondaryText={
//                     <span style={{color: '#333'}}>{this.props.data.active_gps_data.device_id}</span>
//                 }
//             />
//         );
//     }
// }


function formatStopTime(stop_time){
    stop_time=stop_time/1000/60;
    if(stop_time < 60){
        return stop_time.toFixed(0) + "分";
    }else{
        var stop_hour = stop_time / 60;
        var stop_min = stop_time % 60;
        return stop_hour.toFixed(0) + "时" + stop_min.toFixed(0) + "分";
    }
}

export default CarList;
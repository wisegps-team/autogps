import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import STORE from '../_reducers/monitor';
import {ACT} from '../_actions';

import {UserTree} from '../_component/user_tree';
import TableManage from '../_component/tableManage';

require('../_sass/monitor.scss');

injectTapEventPlugin();//启用react触摸屏

window.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>
        ,W('#APP'));
});

class App extends Component {
    componentDidMount(){
        STORE.dispatch(ACT.fun.getUsers());//异步的action
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar
                        title={___.admin_wisegps}
                        style={{
                            zIndex:1301,
                            position:'fixed',
                            top:0
                        }}
                    />
                    <Drawer open={true}>
                        <div
                            style={{
                                paddingTop:'50px'
                            }}
                        >
                            <UserTree data={this.props.user} userClick={userClick} select_users={this.props.select_users} />
                        </div>
                    </Drawer>
                    <div className='container'>
                        <TableManage table={table}/>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

const APP=connect(function select(state) {
    let sta={
        user:state.user,
        select_users:state.select_users
    };
    return sta;
})(App);

function userClick(data,intent){
    if(intent=="delete"){
        STORE.dispatch(ACT.fun.selectUsersDelete(data));
    }else if(intent=="add"){
        STORE.dispatch(ACT.fun.selectUsersAdd(data));
    }
}

let table={
    tid: 1,
    name: 'vehicle',
    desc: '车辆明细表',
    key_primary:'obj_id',
    fields: [
        {
            name: 'obj_id',
            desc:'车辆ID',
            type: 'Number',//String,Number,Boolean,Date,Array,Object
            default: '@AutoInc',//#AutoInc: 自增变量,#UniqueId: 分布式唯一ID,#Now: 当前时间
            display:'none'//TextBox: 文本框,ButtonTextBox: 带按钮文本框,Select: 选择框,DatePicker: 日期选择框,TimePicker: 时间选择框,DateTimePicker: 日期时间选择框,UserDefined: 自定义            
        },
        {
            name: 'seller_id',
            desc:'商户ID',
            type: 'Number',
            default:1286,
            display:'Select',
            validations: {
                select: [{value:1286,name:'当前商户'}]
            },
            messages: {
            }
        },
        {
            name:'mobile',            
            desc:'联系手机',
            type: 'String',
            display:'TextBox',
            validations: {
                rangelength: [11,11]
            },
            messages: {
                rangelength:'请输入合法手机号码'
            }
        },
        {
            name:'obj_name',            
            desc:'车牌号',
            type: 'String',
            display:'TextBox',
            validations: {
                rangelength: [7,7]
            },
            messages: {
                rangelength:'请输入合法车牌号'
            }
        },
        {
            name:'device_id',            
            desc:'设备id',
            type: 'Number',
            default: 0,
            display:'TextBox',
            validations: {
            },
            messages: {
            }
        },
        {
            name:'car_brand',
            desc:'车辆品牌',
            type:'String',
            display:'TextBox'
        },
        {
            name:'mileage',
            desc:'行驶里程',
            type:'Number',
            display:'TextBox'
        },
        {
            name:'maintain_last_date',
            desc:'最后保养时间',
            type:'Date',
            display:'DatePicker',
            validations: {
                date:true
            },
            messages: {
                date:'请输入正确的最后保养时间'
            }
        },
        {
            name:'business_status',
            desc:'业务状态',
            type:'Number',
            default:2,
            validations: {
                select:[{name:'在店',value:1},{name:'离店',value:2}]
            },
            messages: {
                date:'业务状态只能填写数字1或者2，1代表在店，2代表离店'
            }
        },{
            name:'last_arrive_time',
            desc:'最后到店',
            type:'DateTime',
            validations: {
                dateTime:true
            },
            messages: {
                date:'请输入正确的最后到店时间'
            }
        },{
            name:'arrive_count',
            desc:'到店次数',
            type:'Number',
            default:0
        }
    ],
    indexs: {
        id: 1,
        name: -1
    },
    create_time: '2016-07-20T02:17:18.000Z',
    update_time: '2016-07-20T02:17:18.000Z'
}

var code="b573bcc9b949e6c593d1fb6d206f6c69";

export const ACT ={
    action:{
        SELECT_CAR:'SELECT_CAR',
        SELECT_USERS:'SELECT_USERS',
        SELECT_USERS_ADD:'SELECT_USERS_ADD',
        SELECT_USERS_DELETE:'SELECT_USERS_DELETE',
        SHOW_CARS:'SHOW_CARS',
        GET_USERS:'GET_USERS',
        GET_CARS:'GET_CARS',
        GETED_USERS:'GETED_USERS',
        GETED_CARS:'GETED_CARS'
    },
    'const':{
        all:'ALL'
    },
    fun:{
        addSelect:function (user_id) {
            return {type: ACT.action.ADD_SELECT,user_id};
        },
        selectCar:function (car) {
            return {type: ACT.action.SELECT_CAR,car};
        },
        selectUsers:function(user){
            return {type: ACT.action.SELECT_USERS,user};
        },
        selectUsersAdd:function(user){//添加select_users里的用户
            return {type: ACT.action.SELECT_USERS_ADD,user};
        },
        selectUsersDelete:function(user){//删除select_users里的用户
            return {type: ACT.action.SELECT_USERS_DELETE,user};
        },
        showCars:function(cars){
            return {type: ACT.action.SHOW_CARS,cars};
        },
        getUsers:function (getCar) {//异步获取用户资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                dispatch(ACT.fun.startGetUsers());
                W.get(AJAX[0].url,AJAX[0].data,function (res) {
                    dispatch(ACT.fun.getedUsers(res));
                    dispatch(ACT.fun.selectUsers(res.data));
                    if(getCar){
                        let users=res.data.map(ele=>ele.cust_id).join(',');
                        dispatch(ACT.fun.getCars(users));                        
                    }
                },AJAX[0].dataType);
            }
        },
        startGetUsers:function () {
            return {type: ACT.action.GET_USERS};
        },
        getCars:function (users) {//异步获取车辆资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                dispatch(ACT.fun.startGetCars());
                W.get(AJAX[1].url.replace('$user$',users),AJAX[1].data,function (res) {
                    dispatch(ACT.fun.getedCars(res));
                    setTimeout(()=>dispatch(ACT.fun.getCars(users)),10000);//10秒轮询
                },AJAX[1].dataType);
            }
        },
        startGetCars:function () {
            return {type: ACT.action.GET_CARS};
        },
        getedUsers:function (data) {
            return {type: ACT.action.GETED_USERS,data};
        },
        getedCars:function (data) {
            return {type: ACT.action.GETED_CARS,data};
        }
        
    }
};






const AJAX=[
    {//获取子用户
        "url":"http://web.wisegps.cn/app/customer/237/customer",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "page_no":1,
            "page_count":1000
        },
        "timeout":10000
    },
    {//获取车辆
        "url":"http://web.wisegps.cn/app/customer/$user$/active_gps_data",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "update_time": "1700-01-01", 
            "mode": "multi"
        }
    },
    {//未读消息
        "url":"http://web.wisegps.cn/app/customer/237/noti_unread2",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "t":1467702757914
        },
        "timeout":10000
    },
    {//未读警告
        "url":"http://web.wisegps.cn/app/customer/237/alert_unread",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "update_time":"1700-01-01",
            "t":1467702765610
        },
        "timeout":10000
    }
]
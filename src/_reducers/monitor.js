import {Redux,createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { ACT } from '../_actions';

const initialState = {
    user:{},
    cars:[],
    show_cars:ACT.const.all,
    select_users:ACT.const.all,
    select_car:0
};
var user_ids=[];//全部用户的id
var obj_ids=[];//全部车辆的id

function monitorApp(state = initialState, action) {
    switch (action.type) { //涉及多个state属性的放到这里
        case ACT.action.SELECT_USERS_DELETE:{
            let deleteUsers=findChildren(action.user);
            let oldUsers=(state.select_users=="ALL"?findChildren(state.user):state.select_users);
            let newUsers=oldUsers.filter(ele=>!deleteUsers.includes(ele));
            let newUserIds=newUsers.map(ele=>ele.cust_id);
            let oldCars=(state.show_cars=="ALL"?state.cars:state.show_cars);
            let newCars=oldCars.filter(ele=>newUserIds.includes(ele.cust_id));
            return Object.assign({},state,{
                select_users:newUsers,
                show_cars:newCars
            });
        }
        case ACT.action.SELECT_USERS_ADD:{
            let addUsers=findChildren(action.user);
            let oldUsers=(state.select_users=="ALL"?findChildren(state.user):state.select_users);
            let newUsers=oldUsers.concat(addUsers);
            let newUserIds=newUsers.map(ele=>ele.cust_id);
            let oldCars=(state.show_cars=="ALL"?state.cars:state.show_cars);
            let newCars=state.cars.filter(ele=>newUserIds.includes(ele.cust_id));
            return Object.assign({},state,{
                select_users:newUsers,
                show_cars:newCars
            });
        }
    }
    return {
        user:userReducer(state.user,action),
        cars:carsReducer(state.cars,action),
        select_users:selectUsersReducer(state.select_users,action),
        show_cars:showCarsReducer(state.show_cars,action),
        select_car:selectCarReducer(state.select_car,action)
    };
}

function userReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.GET_USERS://开始获取用户数据
            console.log('GET_USERS:开始获取用户数据');
            return state;
        case ACT.action.GETED_USERS://获取到用户数据
            console.log('GETED_USERS:获取到用户数据');
            let arr=action.data.data;
            let cust_id=237;
            let user=arr.find(ele=>(ele.cust_id==cust_id));
            arr.forEach(function (ele) {
                let _id=ele.cust_id;
                user_ids.push(_id);
                ele.children=arr.filter(ele=>(ele.parent_cust_id==_id));
            });
            return user;
        default:
            return state
    }
}
function carsReducer(state = [], action) {
    switch (action.type) {
        case ACT.action.GET_CARS://开始获取车辆数据
            console.log('GET_CARS:开始获取车辆数据');
            return state;
        case ACT.action.GETED_CARS://获取到车辆数据
            console.log('GETED_USERS:获取到车辆数据');
            let arr=action.data;
            arr.forEach((ele)=>{
                obj_ids.push(ele.obj_id);
            });
            return action.data;
        default:
            return state
    }
}
function selectUsersReducer(state = ACT.const.all, action) {
    switch (action.type) {
        case ACT.action.SELECT_USERS:{
            return action.user;
        }
        default:
            return state
    }
}
function showCarsReducer(state = ACT.const.all, action) {
    switch (action.type) {
        case ACT.action.SHOW_CARS:
            return state;
        default:
            return state;
    }
}
function selectCarReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.SELECT_CAR:
            return action.car;
        default:
            return state;
    }
}

//工具，传入一个user,递归获取它和它的所有children
function findChildren(par){
    let children=[];
    children.push(par);
    par.children.forEach((ele)=>{children=children.concat(findChildren(ele))});
    return children;
}





let STORE=createStore(
    monitorApp,
    applyMiddleware(//应用中间件，为了可以使用异步action
        thunkMiddleware //为了可以使用异步action
    )
);



export default STORE;
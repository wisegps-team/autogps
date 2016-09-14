import {Redux,createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import customerReducer from './customer';
import dictionaryReducer from './dictionary';

const initialState = {
    custType:[],//用户类型字典
    brand:[],//品牌类型字典
    department:[],
    customer:{
        data:[],    //客户列表
        total:-1,    //总客户数
        loading:false
    },//所有的客户
    user:{
        data:[],    //用户列表
        total:-1,    //总用户数
        loading:false
    },//所有的用户
    
};

function main(state = initialState, action) {
    return {
        customer:customerReducer(state.customer,action,'customer'),
        user:customerReducer(state.user,action,'user'),
        custType:dictionaryReducer(state.custType,action,'custType'),
        brand:dictionaryReducer(state.brand,action,'brand'),
        department:dictionaryReducer(state.department,action,'department'),
    };
}





let STORE=createStore(
    main,
    applyMiddleware(//应用中间件，为了可以使用异步action
        thunkMiddleware //为了可以使用异步action
    )
);

window.STORE=STORE;



export default STORE;
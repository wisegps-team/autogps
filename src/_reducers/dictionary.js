/**
 * 处理各种字典表的获取和更新
 */
'use strict';
import {WAPI} from '../_modules/Wapi';

let dictionary={};



export default function dictionaryReducer(state,action,name){
    if(action.name!=name)return state;
    let ACT=dictionary[name];
    let data;
    switch(action.type){
        case ACT.action.geted:
            return action.data;
        case ACT.action.add:
            return [action.data].concat(state);
        case ACT.action.delete:
            return state.filter(ele=>(ele.id!=action.id));
        case ACT.action.update:
            return state.map(function(ele) {
                if(ele.id==action.data.id)
                    return action.data;
                else
                    return ele;
            });
        default:
            return state;
    }
}

class dictionaryAction{
    constructor(name) {
        let acts=['geted','add','delete','update'];
        this.action={};
        this.name=name;
        this.api=new WAPI(name,_user.access_token);
        acts.forEach((ele)=>this.action[ele]=ele+'_'+name);
        dictionary[name]=this;
    }
    get(data,op){
        let that=this;
        return function(dispatch) {
            that.api.list(function(res){
                dispatch(that.geted(simulationData.data));
            },data,op)
        }
    }
    geted(data){
        return {
            type:this.action.geted,
            data:data,
            name:this.name
        };
    }
    add(newData){
        return {
            type:this.action.add,
            data:newData,
            name:this.name
        }
    }
    delete(objId){
        return {
            type:this.action.delete,
            id:objId,
            name:this.name
        }
    }
    update(newData){
        return {
            type:this.action.delete,
            data:newData,
            name:this.name
        }
    }
}



export const user_type_act=new dictionaryAction('user_type');




let simulationData={
    data:[
        {
            id:1,
            values:'品牌商',
            type:1,
            user_type:[1]
        },
        {
            id:2,
            values:'运营商',
            type:1,
            user_type:[2]
        },
        {
            id:3,
            values:'代理商',
            type:1,
            user_type:[2]
        },
        {
            id:4,
            values:'集团用户',
            type:2,
            user_type:[2,3]
        },
        {
            id:5,
            values:'服务商',
            user_type:[]
        },
        {
            id:6,
            values:'个人用户',
            user_type:[]
        }
    ],
    total:10
}

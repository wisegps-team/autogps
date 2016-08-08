/**
 * 管理客户或者用户的state字段
 */
"use strict";

export const custAct=creatAction('customer');
export const userAct=creatAction('user');

let act={
    customer:custAct,
    user:userAct
} 

export default function customerReducer(customer,action,name) {
    if(action.name!=name)return customer;
    let ACT=act[name];
    let data;
    switch(action.type){
        case ACT.action.getting:
            return Object.assign({},customer,{loading:true});
        case ACT.action.geted:
            action.data.data=customer.data.concat(action.data.data);
            action.data.loading=false;
            return Object.assign({},customer,action.data);
        case ACT.action.add:
            data=[action.data].concat(customer.data);
            return Object.assign({},customer,{data});
        case ACT.action.delete:
            data=customer.data.filter(ele=>(ele.id!=action.id));
            return Object.assign({},customer,{data});
        case ACT.action.update:
            data=customer.data.map(function(ele) {
                if(ele.id==action.data.id)
                    return action.data;
                else
                    return ele;
            });
            return Object.assign({},customer,{data});
        default:
            return customer;
    }
}

function creatAction(name) {
    let acts=['get','getting','geted','add','delete','update'];
    let action={};
    acts.forEach((ele)=>action[ele]=ele+'_'+name);
    let fun={
        get:function (data,op) {//异步获取,所以是返回一个方法而不是一个json
            return function(dispatch) {
                dispatch(fun.getting());
                Wapi.customer.list(function(res){
                    dispatch(fun.geted(Object.assign({},simulationData)));
                },data,op)
            }
        },
        getting:function(){
            return {
                type:action.getting,
                name:name
            };
        },
        geted:function(data){
            return {
                type:action.geted,
                data:data,
                name:name
            };
        },
        add:function(user){
            return {
                type:action.add,
                data:user,
                name:name
            }
        },
        delete:function(id){
            return {
                type:action.delete,
                id:id,
                name:name
            }
        },
        update:function(user){
            return {
                type:action.update,
                data:user,
                name:name
            }
        }
    };
    return {action,fun};
}



let simulationData={
    data:[
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:1,//用户类别ID
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'深圳微车联信息技术有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:2,//用户类别ID（可选多类别）
                city:"深圳",
                city_id:11,
                district:"宝安区",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:3,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:4,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:5,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:1,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:3,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:2,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:4,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            },
            {
                id:1,
                company:'xxx有限公司',//客户名称／所属地区／类别／联系人／联系电话
                user_type:2,//用户类别ID（可选多类别）
                city:"广州",
                city_id:11,
                district:"天河",
                district_id:111,
                province:"广东省",
                province_id:1,
                admin_id : Number,    // 管理员ID
                parent_id : Number,	  //上级用户ID
                dealer_id: Number,    //经销商ID
                contact:'李先生',
                tel:'16497682264'
            }
        ],
        total:200
}

// for(let i=0;i<4;i++){
//     simulationData.data=simulationData.data.concat(simulationData.data);
// }

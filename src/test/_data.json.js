let custType=[
    {
        id:1,
        name:'品牌商',
        appId:[1],
        useType:[1],
        userType:5
    },
    {
        id:2,
        name:'通讯运营商',
        appId:[1],
        useType:[2],
        userType:1
    },
    {
        id:3,
        name:'沃管车代理商',
        appId:[1],
        useType:[],
        userType:2
    },
    {
        id:4,
        name:'政企用户',
        appId:[2],
        useType:[2,3],
        userType:8
    },
    {
        id:5,
        name:'品牌代理商',
        appId:[1],
        useType:[1,5],
        userType:2
    },
    {
        id:6,
        name:'服务运营商',
        appId:[],
        useType:[],
        userType:1
    },
    {
        id:7,
        name:'私家车主',
        appId:[],
        useType:[],
        userType:7
    }
];

let user=[
    {
        name:'深圳市卫网科技有限公司',
        short:'卫网科技',
        uid:''
    }
]

let brand=[
    {
        company:'深圳市卫网科技有限公司',
        name:'沃管车'
    }
]

let product=[
    {
        company:'深圳市卫网科技有限公司',
        name:'W13智能终端',
        brand:'沃管车'
    }
]

const DATA={
    custType,user,brand,product
};
export default DATA

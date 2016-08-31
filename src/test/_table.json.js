/**
 * 应用数据库定义，没做一个更改必须更改版本号
 */
let version=18;//版本号

//地区表
export const area={
    name: 'area',             //表名
    desc: '地区字典表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '索引id',
            'type': 'Number',
            'display': 'TextBox',
            'unique':true,
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'id为必填'
            }
        },{
            'name': 'name',
            'desc': '地区名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'地区名称为必填'
            }
        },{
            'name': 'parentId',
            'desc': '上级地区id',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'上级地区id为必填，顶级填1'
            }
        },{
            'name': 'level',
            'desc': '地区级别',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'地区级别为必填'
            }
        },{
            'name': 'areaCode',
            'desc': '区号',
            'unique':true,
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },{
            'name': 'zipCode',
            'desc': '邮政编码',
            'unique':true,
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },{
            'name': 'provinceId',
            'desc': '所属省级id',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },{
            'name': 'provinceName',
            'desc': '所属省级名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        }
    ],
    indexDefine: [
        {id:1},
        {name:1},
        {parentId:1},
        {level:1}
    ]
}

//客户表
export const customer={
    name: 'customer',             //表名
    desc: '客户表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '用户id',
            'type': 'String',
            'display': 'TextBox',
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'用户id为必填'
            }
        },
        {
            'name': 'name',
            'desc': '公司或客户名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'名称为必填'
            }
        },
        {
            'name': 'treePath',
            'desc': '节点路径树',
            'type': 'String',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'parentId',
            'desc': '父客户id',
            'type': 'Array',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'父客户id为必填'
            }
        },
        {
            'name': 'tel',
            'desc': '联系电话',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'联系电话为必填'
            }
        },
        {
            'name': 'custTypeId',
            'desc': '用户类型',
            'type': 'Number',
            'query': true
        },
        {
            'name': 'custType',
            'desc': '用户类型名称',
            'type': 'String',
            'query': true
        },
        {
            'name': 'province',
            'desc': '省份名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'provinceId',
            'desc': '省份id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'city',
            'desc': '城市名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'cityId',
            'desc': '城市id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'area',
            'desc': '行政区名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'areaId',
            'desc': '行政区id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'address',
            'desc': '详细地址',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'contact',
            'desc': '联系人名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'logo',
            'desc': '商标url地址',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'sex',
            'desc': '联系人性别',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'dealer_id',
            'desc': '经销商id',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'short',
            'desc': '公司简称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'bill_type',
            'desc': '发票类型',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'id_code',
            'desc': '纳税人识别码',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'company_address',
            'desc': '注册地址',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'company_telphone',
            'desc': '注册电话',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'bank',
            'desc': '开户银行',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'bank_num',
            'desc': '银行账户',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        }
    ],
    indexDefine: [
        {uid:1},
        {name:1},
        {provinceId:1},
        {cityId:1},
        {areaId:1},
        {tel:1},
        {treePath:1},
        {parentId:1},
        {dealer_id:1}
    ]
}

//客户类型表
export const custType={
    name: 'custType',             //表名
    desc: '客户类型字典表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '类别id',
            'type': 'Number',
            'unique':true,
            'display': 'TextBox',
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'类别id为必填'
            }
        },
        {
            'name': 'name',
            'desc': '类别名称',
            'type': 'String',
            'display': 'TextBox',
            'unique':true,
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'类别名称为必填'
            }
        },
        {
            'name': 'appId',
            'desc': '可使用应用',
            'type': 'Array',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'useType',
            'desc': '使用类别',
            'type': 'Array',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'userType',
            'desc': '对应的用户类别',
            'type': 'Number',
            'display': 'TextBox',
            'query': true
        }
    ],
    indexDefine: [
        {id:1},
        {name:1},
        {appId:1},
        {useType:1}
    ]
}

//部门表
export const department={
    name: 'department',             //表名
    desc: '部门字典表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '所属用户id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'所属用户id为必填'
            }
        },
        {
            'name': 'name',
            'desc': '部门名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'部门名称为必填'
            }
        },
        {
            'name': 'adminId',
            'desc': '管理员id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'部门名称为必填'
            }
        },
        {
            'name': 'parentId',
            'desc': '上级部门id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'上级部门id为必填'
            }
        },
        {
            'name': 'treePath',
            'desc': '部门节点路径树',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        }
    ],
    indexDefine: [
        {uid:1},
        {adminId:1},
        {parentId:1},
        {treePath:1}
    ]
}

//员工表
export const employee={
    name: 'employee',             //表名
    desc: '人员表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '用户id',
            'type': 'String',
            'display': 'TextBox',
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'用户id为必填'
            }
        },
        {
            'name': 'companyId',
            'desc': '公司id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'公司id为必填'
            }
        },
        {
            'name': 'departId',
            'desc': '部门id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'部门id为必填'
            }
        },
        {
            'name': 'type',
            'desc': '类型(管理员/驾驶员/客户经理)',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'类型为必填'
            }
        },
        {
            'name': 'name',
            'desc': '姓名',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'姓名为必填'
            }
        },
        {
            'name': 'sex',
            'desc': '性别',
            'type': 'Number',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'idcard',
            'desc': '身份证',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'tel',
            'desc': '电话',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'email',
            'desc': '邮箱',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'wechat',
            'desc': '微信号',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'licenseType',
            'desc': '准驾车型',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'firstGetLicense',
            'desc': '首次获取驾照日期',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                date:'首次获取驾照日期必须为合法日期'
            }
        },
        {
            'name': 'licenseExpireIn',
            'desc': '驾照过期时间',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                date:'驾照过期时间必须为合法日期'
            }
        },
    ],
    indexDefine: [
        {uid:1},
        {departId:1},
        {idcard:1},
        {tel:1},
        {wechat:1},
        {email:1}
    ]
}

//车辆表
export const vehicle={
    name: 'vehicle',             //表名
    desc: '车辆表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'name',
            'desc': '车牌号',
            'type': 'String',
            'display': 'TextBox',
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'所属用户id为必填'
            }
        },
        {
            'name': 'uid',
            'desc': '所属用户id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },
        {
            'name': 'departId',
            'desc': '部门id',
            'type': 'String',
            'display': 'TextBox',
            'query': true    //可查询字段
        },
        {
            'name': 'brandId',
            'desc': '品牌id',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'brand',
            'desc': '品牌名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'model',
            'desc': '车系名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'modelId',
            'desc': '车系id',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'type',
            'desc': '车款名称',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'typeId',
            'desc': '车款id',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'desc',
            'desc': '车型描述',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'frameNo',
            'desc': '车架号',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'engineNo',
            'desc': '发动机号',
            'type': 'String',
            'display': 'TextBox',
            'query': true    
        },
        {
            'name': 'buyDate',
            'desc': '购买日期',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                required:'购买日期必须为合法日期'
            }
        },
        {
            'name': 'mileage',
            'desc': '行驶里程',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,
            'validations': {
                min:0
            },
            'messages': {
                required:'里程不能小于0'
            }
        },
        {
            'name': 'maintainMileage',
            'desc': '下次保养里程',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,
            'validations': {
                min:0
            },
            'messages': {
                required:'下次保养里程不能小于0'
            }
        },
        {
            'name': 'insuranceExpireIn',
            'desc': '保养到期日',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                required:'保养到期日必须为合法日期'
            }
        },
        {
            'name': 'inspectExpireIn',
            'desc': '年检到期日',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                required:'年检到期日必须为合法日期'
            }
        },
        {
            'name': 'serviceType',
            'desc': '服务类型',
            'type': 'Number',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'feeType',
            'desc': '收费标准',
            'type': 'Number',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'serviceRegDate',
            'desc': '服务注册日',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                required:'服务注册日必须为合法日期'
            }
        },
        {
            'name': 'serviceExpireIn',
            'desc': '服务到期日',
            'type': 'Date',
            'display': 'TextBox',
            'query': true,
            'validations': {
                date:true
            },
            'messages': {
                required:'服务到期日必须为合法日期'
            }
        },
        {
            'name': 'did',
            'desc': '绑定设备的did',
            'type': 'String',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'drivers',
            'desc': '司机列表',
            'type': 'Array',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'managers',
            'desc': '管理人员列表',
            'type': 'Array',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'dispatch',
            'desc': '是否调度管理',
            'type': 'Boolean',
            'display': 'TextBox',
            'query': true
        }
    ],
    indexDefine: [
        {uid:1},
        {departId:1},
        {name:1},
        {frameNo:1},
        {engineNo:1},
        {did:1},
    ]
}

//设备表
export const iotDevice={
    name: '_iotDevice',             //表名
    desc: '设备表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'did',
            'desc': '设备序列号',
            'unique':true,
            'type': 'String',
            'display': 'TextBox',
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'uid',
            'desc': '用户id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'status',
            'desc': '设备状态',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'commType',
            'desc': '通讯方式',
            'type': 'Number',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'commSign',
            'desc': '物联网卡标识',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'model',
            'desc': '设备型号',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true,
                select:[{value:1,name:1},{value:2,name:2}]
            }
        },
        {
            'name': 'hardwareVersion',
            'desc': '硬件版本',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'softwareVersion',
            'desc': '软件版本',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'activedIn',
            'desc': '激活时间',
            'type': 'Date',
            'display': 'TextBox',
            'query': true
        },
        {
            'name': 'expiredIn',
            'desc': '过期时间',
            'type': 'Date',
            'query': true
        },
        {
            'name': 'activeGpsData',
            'desc': '最新定位数据',
            'type': 'Object',
            'query': true
        },
        {
            'name': 'activeObdData',
            'desc': '最新CAN数据',
            'type': 'Object',
            'query': true
        },
        {
            'name': 'params',
            'desc': '最新设备参数',
            'type': 'Object',
            'query': true
        },
        {
            'name': 'ip',
            'desc': '所属服务器ip',
            'type': 'String',
            'query': true
        },
        {
            'name': 'port',
            'desc': '连接端口',
            'type': 'Number',
            'query': true
        },
        {
            'name': 'binded',
            'desc': '是否已被绑定',
            'type': 'Boolean',
            'query': true
        },
        {
            'name': 'bindDate',
            'desc': '绑定时间',
            'type': 'Date',
            'query': true
        },
        {
            'name': 'bindName',
            'desc': '绑定车辆的车牌号',
            'type': 'String',
            'query': true
        }
    ],
    indexDefine: [
        {did:1},
        {uid:1},
        {statue:1},        
        {commSign:1},
        {model:1},
        {binded:1}
    ]
}

//定位表
export const iotGpsData={
    name: '_iotGpsData',             //表名
    desc: '定位表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'did',
            'desc': '设备序列号',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'lon',
            'desc': '原始经度',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'lat',
            'desc': '原始纬度',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'speed',
            'desc': '速度',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'direct',
            'desc': '方向',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'gpsFlag',
            'desc': 'gps定位标志',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'mileage',
            'desc': '累计里程',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'fuel',
            'desc': '累计油耗',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'temp',
            'desc': '温度',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'air',
            'desc': '空气质量',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'signal',
            'desc': 'gsm信号',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'voltage',
            'desc': '电瓶电压',
            'type': 'Number',
            'query': true    //可查询字段
        },
        {
            'name': 'status',
            'desc': '终端状态',
            'type': 'Array',
            'query': true    //可查询字段
        },
        {
            'name': 'alerts',
            'desc': '终端报警',
            'type': 'Array',
            'query': true    //可查询字段
        },
        {
            'name': 'gpsTime',
            'desc': '定位时间',
            'type': 'Date',
            'query': true    //可查询字段
        }
    ],
    indexDefine: [
        {did:1}
    ]
}

//日志表
export const iotLog={
    name: '_iotLog',             //表名
    desc: '日志表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'did',
            'desc': '设备序列号',
            'type': 'String',
            'query': true    //可查询字段
        },
        {
            'name': 'content',
            'desc': '原始数据',
            'type': 'String',
            'query': true    //可查询字段
        },
        {
            'name': 'ip',
            'desc': '所属服务器ip',
            'type': 'String',
            'query': true    //可查询字段
        },
        {
            'name': 'port',
            'desc': '连接端口',
            'type': 'Number',
            'query': true    //可查询字段
        },
    ],
    indexDefine: [
        {did:1}
    ]
}

//设备出入库日志表
export const deviceLog={
    name: 'deviceLog',             //表名
    desc: '设备出入库日志表',            //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'did',
            'desc': '出入库的设备',
            'type': 'Array',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'type',
            'desc': '操作类型',
            'type': 'Number',
            'query': true,
            'validations':{
                digits:true,
                select:[{value:1,name:'入库'},{value:0,name:'出库'}]
            }
        }
    ],
    indexDefine: [
        {did:1},
        {type:1}
    ]
}

//仓库统计表
export const deviceTotal={
    name: 'deviceTotal',             //表名
    desc: '仓库统计表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'custId',
            'desc': '公司id',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'type',
            'desc': '终端型号',
            'type': 'Number',
            'query': true,
            'validations':{
                digits:true,
                required:true
            }
        },
        {
            'name': 'inNet',
            'desc': '入网数量',
            'type': 'Number',
            'query': true,
            'validations':{
                digits:true
            }
        },
        {
            'name': 'register',
            'desc': '注册数量',
            'type': 'Number',
            'query': true,
            'validations':{
                digits:true
            }
        },
        {
            'name': 'onLine',
            'desc': '在线数量',
            'type': 'Number',
            'query': true,
            'validations':{
                digits:true
            }
        }
    ],
    indexDefine: [
        {custId:1},
        {type:1}
    ]
}

//品牌表
export const brand={
    name: 'brand',             //表名
    desc: '品牌表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'company',
            'desc': '公司名',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'uid',
            'desc': '公司id',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'name',
            'desc': '品牌名称',
            'type': 'String',
            'query': true,
            'validations':{
                required:true
            }
        }
    ],
    indexDefine: [
        {companyId:1},
        {name:1},
        {company:1}
    ]
}

//产品表
export const product={
    name: 'product',             //表名
    desc: '产品表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'name',
            'desc': '产品名称',
            'type': 'String',
            'query': true,
            'validations':{
                required:true
            }
        },
        {
            'name': 'company',
            'desc': '公司名',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'uid',
            'desc': '公司id',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
        {
            'name': 'brand',
            'desc': '品牌名称',
            'type': 'String',
            'query': true,
            'validations':{
                required:true
            }
        },
        {
            'name': 'brandId',
            'desc': '品牌id',
            'type': 'String',
            'query': true,
            'validations':{
                required:true
            }
        }
    ],
    indexDefine: [
        {name:1},
        {companyId:1},
        {company:1},
        {brandId:1},
        {brand:1}
    ]
}


let TABLES=[
    area,customer,custType,department,employee,vehicle,iotDevice,iotGpsData,iotLog
    ,brand,product,deviceTotal
];
let old_vareion=localStorage.getItem('table.json.js.version');
localStorage.setItem('table.json.js.version',version);
if(version==old_vareion){
    TABLES=[];
}

export default TABLES;

/**
 * 应用数据库定义，每做一个更改必须更改版本号
 */
let version=149;//版本号

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
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
        },{
            'name': 'zipCode',
            'desc': '邮政编码',
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
        {
            id:1,
            unique:true
        },
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
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: true,      //是否更新数据表
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
        },
        {
            'name': 'other',
            'desc': '其他信息',
            'type': 'Object',
            'query': true,    //可查询字段
        },
        {
            'name': 'wxAppKey',
            'desc': '微信公众号app key',
            'type': 'String',
            'query': true
        },
        {
            'name': 'wxAppSecret',
            'desc': '微信app secret',
            'type': 'String',
            'query': true,
        },
        {
            'name': 'isInstall',
            'desc': '是否安装网点',//定义改为是否为经销商字段名沿用 20170222
            'type': 'Number',
            'query': true,
        },{
            'name': 'parentEme',
            'desc': '父级的客户经理',
            'type': 'Object',//由于多对多关系，所以以父级uid为键名，父级指定的人员id为值；如父级uid为1233，客户经理为1234，则本字段则为{"1233":"1234"}
            'query': true,
        },{
            'name': 'parentMng',//由于不方便查找，上一个字段改成这一个，改为使用数组存储
            'desc': '父级的客户经理',
            'type': 'Array',//格式改为['一个父级公司id|一个对应的客户经理id','另一个父级公司id|另一个对应的客户经理id']
            'display': 'TextBox',
            'query': true,
        },{
            'name': 'Authorize',//++170412方便查找客户权限
            'desc': '父级的客户经理',
            'type': 'Array',
            'query': true,
        },{
            'name': 'appId',
            'desc': '对应的appid',
            'type': 'Number',
            'query': true,
        },{
            'name': 'onecar_bind',  //++170427统计一物一码绑定次数
            'desc': '一物一码绑定次数',
            'type': 'Number',
            'query': true,
        },{
            'name': 'onecar_move', //++170427统计一物一码挪车次数
            'desc': '一物一码挪车次数',
            'type': 'Number',
            'query': true,
        },{
            'name': 'car_bind', //++170427统计普通二维码绑定次数
            'desc': '普通绑定次数',
            'type': 'Number',
            'query': true,
        },{
            'name': 'car_move', //++170427统计普通二维码挪车次数
            'desc': '普通挪车次数',
            'type': 'Number',
            'query': true,
        }
    ],
    indexDefine: [
        {
            uid:1,
            unique:true
        },
        {name:1},
        {provinceId:1},
        {cityId:1},
        {areaId:1},
        {tel:1},
        {treePath:1},
        {parentId:1},
        {dealer_id:1},
        {appId:1}
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
        },
        {
            'name': 'role',
            'desc': '对应的角色',
            'type': 'String',
            'query': true
        },
        {
            'name': 'roleId',
            'desc': '对应的角色Id',
            'type': 'String',
            'query': true
        },
    ],
    indexDefine: [
        {
            id:1,
            unique:true
        },
        {
            name:1,
            unique:true
        },
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
        },{
            'name': 'type',
            'desc': '部门类型（0或者空都是用户创建类型，1非本公司部门，如营销人员类别）',
            'type': 'Number',
            'query': true 
        },{
            'name': 'isSimProvider',
            'desc': 'type等于1时使用',
            'type': 'Boolean',
            'query': true 
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
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
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
            'name': 'role',
            'desc': '角色类型(管理员/驾驶员/客户经理)',
            'type': 'String',
            'query': true    //可查询字段
        },
        {
            'name': 'roleId',
            'desc': '角色Id',
            'type': 'String',
            'query': true    //可查询字段
        },
        {
            'name': 'isDriver',
            'desc': '是否驾驶人员',
            'type': 'Boolean',
            'query': true    //可查询字段
        },
        {
            'name': 'isQuit',
            'desc': '是否离职',
            'type': 'Boolean',
            'query': true    //可查询字段
        },
        {
            'name': 'quitDate',
            'desc': '离职时间',
            'type': 'Date',
            'query': true    //可查询字段
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
            'type': 'Array',
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
        {
            'name': 'type',
            'desc': '人员类型（0默认，1编外人员，如兼职营销）',
            'type': 'Number',
            'query': true,
        },
        {
            'name': 'appId',
            'desc': '对应的appid',
            'type': 'Number',
            'query': true,
        }
    ],
    indexDefine: [
        {
            uid:1,
            unique:true
        },
        {departId:1},
        {idcard:1},
        {tel:1},
        {wechat:1},
        {email:1},
        {appId:1}
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
    isUpdate:true,
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
            'name': 'deviceType',
            'desc': '绑定设备的型号',
            'type': 'String',
            'query': true
        },
        {
            'name': 'drivers',
            'desc': '驾驶员数组',
            'type': 'Array',
            'query': true
        },
        {
            'name': 'managers',
            'desc': '管理人员数组',
            'type': 'Array',
            'query': true
        },{
            'name': 'isDispatch',
            'desc': '是否调度管理',
            'type': 'Boolean',
            'query': true
        },{
            'name': 'mid', //++170421
            'desc': '一物一码id',
            'type': 'String',
            'query': true
        }
    ],
    indexDefine: [
        {uid:1},
        {departId:1},
        {
            name:1,
            unique:true
        },
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
            'type': 'String',
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
            'name': 'modelId',
            'desc': '设备型号id',
            'type': 'String',
            'display': 'TextBox',
            'query': true,    //可查询字段
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
            'name': 'vehicleName',
            'desc': '绑定车牌号',
            'type': 'String',
            'query': true
        },
        {
            'name': 'vehicleId',
            'desc': '绑定车objectId',
            'type': 'String',
            'query': true
        },
        {
            "query" : true,
            "type" : "Object",
            "desc" : "位置索引字段",
            "name" : "loc"
        },
        {
            "query" : true,
            "type" : "String",
            "desc" : "服务商id",
            "name" : "serverId"
        }
    ],
    indexDefine: [
        {
            did:1,
            unique:true
        },
        {
            uid:1,
            loc : "2dsphere"
        },
        {statue:1},        
        {commSign:1},
        {model:1},
        {modelId:1},
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
        },
        {
            'name': 'rcvTime',
            'desc': '接收时间',
            'type': 'Date',
            'query': true
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
            'name': 'uid',
            'desc': '对应的客户id',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            }
        },
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
        },
        {
            'name': 'from',
            'desc': '设备来源',
            'type': 'String',
            'query': true
        },
        {
            'name': 'fromName',
            'desc': '设备来源公司名',
            'type': 'String',
            'query': true
        },
        {
            'name': 'to',
            'desc': '设备去向',
            'type': 'String',
            'query': true
        },
        {
            'name': 'toName',
            'desc': '设备去向公司名',
            'type': 'String',
            'query': true
        },
        {
            'name': 'brand',
            'desc': '品牌名',
            'type': 'String',
            'query': true
        },
        {
            'name': 'brandId',
            'desc': '品牌id',
            'type': 'String',
            'query': true
        },
        {
            'name': 'model',
            'desc': '型号',
            'type': 'String',
            'query': true
        },
        {
            'name': 'modelId',
            'desc': '型号id',
            'type': 'String',
            'query': true
        },
        {
            'name': 'outCount',
            'desc': '出库数量',
            'type': 'Number',
            'query': true
        },
        {
            'name': 'inCount',
            'desc': '入库数量',
            'type': 'Number',
            'query': true
        },{//0,待发货；1，已发货待签收；2，已签收
            'name': 'status',
            'desc': '状态',
            'type': 'Number',
            'query': true
        }
    ],
    indexDefine: [
        {uid:1},
        {did:1},
        {type:1},
        {from:1},
        {to:1}
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
            'name': 'uid',
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
        {uid:1},
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
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
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

export const iotStat = {
    name: '_iotStat',
    desc: '日统计表',
    isSystem: true,
    isApi: true,
    isPrivate: true,
    isCache: true,
    cacheField: 'createdAt',
    fieldDefine: [
        {
            'name': 'did',
            'desc': '设备ID',
            'type': 'String',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'day',
            'desc': '统计日期',
            'type': 'Date',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'distance',
            'desc': '行驶里程',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'duration',
            'desc': '行驶时间',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'fuel',
            'desc': '行驶耗油',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'avgSpeed',
            'desc': '平均速度',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'alertTotal',
            'desc': '报警统计计数',
            'type': 'Object',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        }
    ],
    indexDefine: [
        {
            'did': 1,
            'day': 1
        }
    ]
};

export const iotCommand= {
    name: '_iotCommand',
    desc: '指令发送表',
    isSystem: true,
    isApi: true,
    isPrivate: true,
    isCache: false,
    cacheField: 'createdAt',
    fieldDefine: [
        {
            'name': 'did',
            'desc': '设备ID',
            'type': 'String',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'cmdType',
            'desc': '命令字',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'params',
            'desc': '命令参数',
            'type': 'Object',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'sendFlag',
            'desc': '发送状态',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'content',
            'desc': '原始数据',
            'type': 'String',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        }
    ],
    indexDefine:[
        {
            'did': 1,
            'createdAt': 1
        }
    ]
};

export const iotAlert= {
    name: '_iotAlert',
    desc: '报警表',
    isSystem: true,
    isApi: true,
    isPrivate: true,
    isCache: true,
    cacheField: 'createdAt',
    fieldDefine: [
        {
            'name': 'did',
            'desc': '设备ID',
            'type': 'String',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'alertType',
            'desc': '报警类型',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'speedLimit',
            'desc': '超速限速',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'lon',
            'desc': '经度',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'lat',
            'desc': '纬度',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'speed',
            'desc': '速度',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'direct',
            'desc': '方向',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'mileage',
            'desc': '里程',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },
        {
            'name': 'fuel',
            'desc': '油耗',
            'type': 'Number',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        }
    ],
    indexDefine: [
        {
            'did': 1,
            'day': 1
        }
    ]
};

//预定表
export const booking={
    name: 'booking',             //表名
    desc: '预定表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'activityId',
            'desc': '活动id',
            'type': 'String',
            'query': true,    //可查询字段
        },
        {
            'name': 'mobile',
            'desc': '预定手机号',
            'type': 'String',
            'primary': true,  //主键字段
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'手机号为必填'
            }
        },{
            'name': 'sellerId',
            'desc': '营销人员id',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'营销人员id为必填'
            }
        },{
            'name': 'sellerName',
            'desc': '营销人员',
            'type': 'String',
            'query': true
        },{
            'name': 'uid',//活动创建者公司的id
            'desc': '代理商id',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'代理商id为必填'
            }
        },{
            'name': 'status',
            'desc': '状态',
            'type': 'Number',
            'query': true,    //可查询字段
            'validations':{
                required:true,
                digits:true,
                select:[
                    {value:0,name:'预定'},
                    {value:1,name:'已注册未结算'},
                    {value:2,name:'已结算未确认'},
                    {value:3,name:'已确认'}
                ]
            }
        },{
            'name': 'status0',
            'desc': '预定状态',
            'type': 'Number',
            'query': true,    //可查询字段
            'validations':{
                required:true,
                digits:true,
                select:[
                    {value:1,name:'已预定'}
                ]
            }
        },{
            'name': 'status1',
            'desc': '注册状态',
            'type': 'Number',
            'query': true,    //可查询字段
            'validations':{
                required:true,
                digits:true,
                select:[
                    {value:0,name:'未注册'},
                    {value:1,name:'已注册'}
                ]
            }
        },{
            'name': 'status2',
            'desc': '结算状态',
            'type': 'Number',
            'query': true,    //可查询字段
            'validations':{
                required:true,
                digits:true,
                select:[
                    {value:0,name:'未结算'},                    
                    {value:1,name:'已结算'}
                ]
            }
        },{
            'name': 'status3',
            'desc': '确认状态',
            'type': 'Number',
            'query': true,    //可查询字段
            'validations':{
                required:true,
                digits:true,
                select:[
                    {value:0,name:'未确认'}, 
                    {value:1,name:'已确认'}
                ]
            }
        },{
            'name': 'name',
            'desc': '客户姓名',
            'type': 'String',
            'query': true,    //可查询字段
            'validations': {
                required:true
            },
            'messages': {
                required:'客户姓名为必填'
            }
        },{
            'name': 'carType',
            'desc': '车型对象',
            'type': 'Object',
            'query': true,    //可查询字段
        },{
            'name': 'resTime',
            'desc': '注册时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'payTime',
            'desc': '结算时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'confirmTime',
            'desc': '确认时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'money',
            'desc': '结算金额',
            'type': 'Number',
            'query': true,
        },{
            'name': 'did',
            'desc': '购买的设备(用于防止作假)',
            'type': 'String',
            'query': true,
        },{
            'name': 'openId',
            'desc': '微信openId',
            'type': 'String',
            'query': true,
        },{
            'name': 'installId',
            'desc': '安装点的uid',
            'type': 'String',
            'query': true,
        },{
            'name': 'install',
            'desc': '安装点的名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'installDate',
            'desc': '预约的安装时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'type',
            'desc': '预订类型（0，为自己预订；1，为他人预订）',
            'type': 'Number',
            'query': true,
        },{
            'name': 'userName',
            'desc': '车主姓名',
            'type': 'String',
            'query': true,
        },{
            'name': 'userMobile',
            'desc': '车主手机号',
            'type': 'String',
            'query': true,
        },{
            'name': 'payMoney',
            'desc': '预付金额',
            'type': 'Number',
            'query': true,
        },{
            'name': 'payStatus',
            'desc': '预付状态(0,未预付，1预付订金，2，预付全款加安装费)',
            'type': 'Number',
            'query': true,
        },{
            'name': 'orderId',
            'desc': '订单id',
            'type': 'String',
            'query': true,
        },{
            'name': 'activityType',
            'desc': '活动类别',//参考活动表的类别（0，车主营销，1，集团营销，2，员工营销，3渠道营销）
            'type': 'Number',
            'query': true,
        },{
            'name': 'userOpenId',//后台注册时跟注册openId一样
            'desc': '车主openId',
            'type': 'String',
            'query': true,
        },{
            'name': 'product',
            'desc':'预订产品信息',//name名称，id产品id，brand品牌，price设备款，installationFee安装费，reward佣金,actProductId营销产品id
            'type':'Object',
            'query':true
        },{
            'name': 'receiptDate',
            'desc': '收款时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'selectInstallDate',
            'desc': '选择安装网点时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'res',
            'desc': '注册相关信息',//openId注册openid，name注册姓名，mobile注册手机，seller销售商，productId注册的产品型号id，product产品型号，price价格，installationFee安装费，reward佣金
            'type': 'Object',
            'query': true
        },{
            'name': 'receipt',
            'desc': '货款支付金额',//顶级系统支付给销售商（预付款扣除手续费）
            'type': 'Number',
            'query': true,
        },{
            'name': 'receiptId',//与上面销售商ID重复，已删除
            'desc': '货款收款id',//销售商ID
            'type': 'String',
            'query': true,
        },{
            'name': 'commissionDate',
            'desc': '支付佣金时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'commission',
            'desc': '实际支付佣金',//（若注册产品佣金>预订产品佣金，则佣金为两者之和除于2，若注册产品佣金<预订产品佣金,则佣金为注册产品佣金）
            'type': 'Number',
            'query': true,
        },{
            'name': 'commissionId',//与上面营销人员ID重复，已删除
            'desc': '佣金收款id',//营销人员ID
            'type': 'String',
            'query': true,
        },{
            'name': 'managerId',
            'desc': '客户经理id',
            'type': 'String',
            'query': true,
        },{
            'name': 'userId',
            'desc': '预订人user表objectId',
            'type': 'String',
            'query': true,
        }
    ],
    indexDefine: [
        {
            mobile:1,
            unique:true
        },
        {
            did:1,
            unique:true
        },
        {status:1},
        {activityId:1},
        {sellerId:1},
        {uid:1},
        {openId:1}
    ]
}

//活动表
export const activity={
    name: 'activity',             //表名
    desc: '活动表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '用户id',
            'type': 'String',
            'query': true,    //可查询字段
        },{
            'name': 'type',//（0，车主营销，1，集团营销，2，员工营销，3渠道营销）
            'desc': '活动类型',
            'type': 'Number',
            'query': true,
        },{
            'name': 'name',
            'desc': '活动名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'url',
            'desc': '活动链接',
            'type': 'String',
            'query': true
        },{
            'name': 'imgUrl',
            'desc': '广告图片链接',
            'type': 'String',
            'query': true
        },{
            'name': 'status',
            'desc': '活动状态',
            'type': 'Number',//0已终止 1进行中
            'query': true
        },{
            'name': 'reward',
            'desc': '佣金标准',
            'type': 'Number',
            'query': true
        },{
            'name': 'pay',
            'desc': '支付方式（0现金支付）',
            'type': 'Number',
            'query': true
        },{
            'name': 'deposit',
            'desc': '订金标准',
            'type': 'Number',
            'query': true
        },{
            'name': 'offersDesc',
            'desc': '优惠描述',
            'type': 'String',
            'query': true
        },{
            'name': 'price',
            'desc': '终端价格',
            'type': 'Number',
            'query': true
        },{
            'name': 'installationFee',
            'desc': '安装费用',
            'type': 'Number',
            'query': true
        },{
            'name': 'actProductId',
            'desc': '营销产品ID',
            'type': 'String',
            'query': true
        },{
            'name': 'channel',
            'desc': '安装渠道',//0为全国安装，1为本地安装
            'type': 'Number',
            'query': true
        },{
            'name': 'getCard',
            'desc': '客户经理开卡',
            'type': 'Boolean',
            'query': true
        },{
            'name': 'principal',
            'desc': '负责人名称',
            'type': 'String',
            'query': true
        },{
            'name': 'principalId',
            'desc': '负责人id',
            'type': 'String',
            'query': true
        },{
            'name': 'principalTel',
            'desc': '负责人电话',
            'type': 'String',
            'query': true
        },{
            'name': 'sellerType',
            'desc': '销售类别',
            'type': 'String',
            'query': true
        },{
            'name': 'sellerTypeId',
            'desc': '销售类别Id',
            'type': 'String',
            'query': true
        },{
            'name': 'brand',
            'desc': '产品品牌',
            'type': 'String',
            'query': true
        },{
            'name': 'product',
            'desc': '产品型号',
            'type': 'String',
            'query': true
        },{
            'name': 'productId',
            'desc': '产品型号Id',
            'type': 'String',
            'query': true
        },{
            'name': 'wxAppKey',
            'desc': '微信appkey',
            'type': 'String',
            'query': true
        },{
            'name': 'count',
            'desc': '计算提成',
            'type': 'Boolean',
            'query': true
        },{
            'name': 'tel',
            'desc': '咨询电话',
            'type': 'String',
            'query': true
        }
    ],
    indexDefine: [
        {status:1},
        {uid:1},
        {type:1},
        {name:1},
    ]
}

//公众号表
export const weixin={
    name: 'weixin',             //表名
    desc: '微信公众号表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate:true,
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '所属公司id',
            'type': 'String',
            'query': true,    //可查询字段
        },{
            'name': 'type',
            'desc': '类型（0服务号，1营销号）',
            'type': 'Number',
            'query': true,
        },{
            'name': 'name',
            'desc': '公众号名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'wxAppKey',
            'desc': '微信appid',
            'type': 'String',
            'query': true
        },{
            'name': 'wxAppSecret',
            'desc': '微信密钥',
            'type': 'String',
            'query': true
        },{
            'name': 'template',
            'desc': '所有的模板',
            'type': 'Object',
            'query': true
        },{
            'name': 'menu',
            'desc': '自定义菜单',
            'type': 'Object',
            'query': true
        },{
            'name': 'fileName',
            'desc': '文件凭证名',
            'type': 'String',
            'query': true
        }

    ],
    indexDefine: [
        {uid:1},
        {wxAppKey:1}
    ]
}

//二维码映射表
export const qrData={
    name: 'qrData',             //表名
    desc: '二维码映射表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '数据id',
            'type': 'Number',
            'default':'@AutoInc',
            'query': true,    //可查询字段
        },{
            'name': 'data',
            'desc': '对应的数据',
            'type': 'Object',
            'query': true,    //可查询字段
        }
    ],
    indexDefine: [
        {id:1}
    ]
}

//营销产品表
export const activityProduct={
    name: 'activityProduct',             //表名
    desc: '营销产品表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '所属公司',
            'type': 'String',
            'query': true,
        },{
            'name': 'productId',
            'desc': '产品id',
            'type': 'String',
            'query': true,
        },{
            'name': 'name',
            'desc': '产品名',
            'type': 'String',
            'query': true,
        },{
            'name': 'brandId',
            'desc': '品牌id',
            'type': 'String',
            'query': true,
        },{
            'name': 'brand',
            'desc': '品牌名称',
            'type': 'String',
            'query': true, 
        },{
            'name': 'price',
            'desc': '产品价格',
            'type': 'Number',
            'query': true,
        },{
            'name': 'installationFee',
            'desc': '安装费用',
            'type': 'Number',
            'query': true,
        },{
            'name': 'reward',
            'desc': '佣金标准',
            'type': 'Number',
            'query': true,
        },{
            'name': 'productUrl',
            'desc': '产品介绍链接',
            'type': 'String',
            'query': true,
        },{
            'name': 'channel',
            'desc': '安装渠道',//0全国安装，1本地安装
            'type': 'Number',
            'query': true,
        },{
            'name': 'createdActivity',
            'desc': '是否创建过活动',
            'type': 'Boolean',
            'query': true 
        },{
            'name': 'custId',
            'desc': '使用过的商家',//使用此营销产品创建过营销活动的cust
            'type': 'Array',
            'query': true 
        }
    ],
    indexDefine: [
        {uid:1}
    ]
}

//二维码批号表，显示已分配的某一批二维码的信息
export const qrDistribution={
    name: 'qrDistribution',             //表名
    desc: '二维码分配表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: true,
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '数据id',
            'type': 'String',
            'query': true,
        },{
            'name': 'name',
            'desc': '名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'uid',
            'desc': '所属公司的objectId',
            'type': 'String',
            'query': true,
        },{
            'name': 'type',
            'desc': '二维码类型',//0普通短链接，1营销资料，2移车卡等
            'type': 'Number',
            'query': true,
        },{
            'name': 'num',
            'desc': '数量',
            'type': 'Number',
            'query': true,
        },{
            'name': 'max',
            'desc': '最大编号',//当前批次二维码的最大编号
            'type': 'Number',
            'query': true, 
        },{
            'name': 'min',
            'desc': '最小编号',//当前批次二维码的最小编号
            'type': 'Number',
            'query': true,
        },{
            'name': 'bind_num',
            'desc': '绑定次数',//当前批次绑定次数 //++170427
            'type': 'Number',
            'query': true,
        },{
            'name': 'move_num',
            'desc': '挪车次数',//当前批次挪车次数  //++170427
            'type': 'Number',
            'query': true,
        }
    ],
    indexDefine: [
        {uid:1}
    ]
}

//二维码与活动映射表
export const qrLink={
    name: 'qrLink',             //表名
    desc: '二维码与活动映射表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: true,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: false,      //是否更新数据表
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '二维码id',
            'type': 'String',
            'query': true,
        },{
            'name': 'url',
            'desc': '分享链接',
            'type': 'String',
            'query': true,
        },{
            'name': 'sellerId',
            'desc': '营销人员id',
            'type': 'String',
            'query': true,
        },{
            'name': 'act',
            'desc': '活动id',
            'type': 'String',
            'query': true,
        },{
            'name': 'i',
            'desc': '数据id',
            'type': 'Number',
            'default':'@AutoInc',
            'query': true, 
        },{
            'name': 'type',
            'desc': '类型',//0普通短链接，1营销资料，2移车卡，3活动分享链接，4渠道注册链接，5人员注册链接
            'type': 'Number',//同一个批次的二维码type相同
            'query': true,
        },{
            'name':'batchId',
            'desc':'批次id',
            'type':'String',
            'query':true
        },{
            'name':'batchName',
            'desc':'批次名称',
            'type':'String',
            'query':true
        },{
            'name':'status',//已绑定为1，未绑定为0，方便统计
            'desc':'状态',//统计用
            'type':'Number',
            'query':true
        },{
            'name':'uid',
            'desc':'所属客户',//当前用户所属公司ID
            'type':'String',
            'query':true
        }
    ],
    indexDefine: [
        {uid:1}
    ]
}

//营销产品授权表
export const authorize={
    name: 'authorize',             //表名
    desc: '授权表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: true,      //是否更新数据表
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '数据id',
            'type': 'Number',
            'default':'@AutoInc',
            'query': true, 
        },{
            'name': 'actProductId', //!!170406 业务（1营销推广/2政企业务/3平台运行/4扫码移车）//服务（serviceProject）
            'desc': '营销产品ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'productId',
            'desc': '产品型号ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'authorizeType', //++170406  1产品/2服务/3业务
            'desc': '授权类型',
            'type': 'Number',
            'query': true,
        },{
            'name': 'productName',
            'desc': '产品名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'brandId',
            'desc': '品牌ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'brandName',
            'desc': '品牌名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'applyCompanyName',
            'desc': '申请公司名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'applyCompanyId',
            'desc': '申请公司ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'applyUserName',
            'desc': '申请人姓名',
            'type': 'String',
            'query': true,
        },{
            'name': 'applyUserId',
            'desc': '申请人ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'applyDate',
            'desc': '申请日期',
            'type': 'Date',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },{
            'name': 'approveCompanyName',
            'desc': '审核公司名称',
            'type': 'String',
            'query': true,
        },{
            'name': 'approveCompanyId',
            'desc': '审核公司ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'approveUserName',
            'desc': '审核人姓名',
            'type': 'String',
            'query': true,
        },{
            'name': 'approveUserId',
            'desc': '审核人ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'approveDate',
            'desc': '审核日期',
            'type': 'Date',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },{
            'name': 'cancelUserName',//取消授权相关字段现在定义为‘暂停’ /20170308
            'desc': '取消授权人姓名',
            'type': 'String',
            'query': true,
        },{
            'name': 'cancelUserId',
            'desc': '取消授权人ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'approveDate',
            'desc': '取消授权日期',
            'type': 'Date',
            'default': '',
            'display': '',
            'query': true,    //可查询字段
            'validations': {
            },
            'messages': {
            }
        },{
            'name': 'status',
            'desc': '状态',
            'type': 'Number',   //0待审核／1已授权／2已暂停
            'query': true,
        }
    ],
    indexDefine: [
        {uid:1}
    ]
}

export const promotion={
    name: 'promotion',             //表名
    desc: '推广统计表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: false,      //是否更新数据表
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'id',
            'desc': '推广Id',
            'type': 'Number',
            'default':'@AutoInc',
            'query': true,
        },{
            'name': 'time',
            'desc': '时间',
            'type': 'Date',
            'query': true,
        },{
            'name': 'type',
            'desc': '类别', //发送给朋友0／分享到朋友圈1／扫码阅读2／微信阅读3 /绑定二维码4
            'type': 'Number',
            'query': true,
        },{
            'name': 'qrcodeId',
            'desc': '营销二维码Id',
            'type': 'String',
            'query': true,
        },{
            'name': 'marpersonId',
            'desc': '营销人员Id',
            'type': 'String',
            'query': true,
        },{
            'name': 'maractivityId',
            'desc': '营销活动Id',
            'type': 'String',
            'query': true,
        },{
            'name': 'publiceId',
            'desc': '公众号Id',
            'type': 'String',
            'query': true,
        },{
            'name': 'readerId',
            'desc': '阅读人Id',
            'type': 'String',
            'query': true,
        },{
            'name': 'marcompanyId',
            'desc': '营销人员所属公司ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'maractcompanyId',
            'desc': '营销活动所属公司ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'martypeId',
            'desc': '营销类别ID', //（0，车主营销，1，集团营销，2，员工营销，3渠道营销）
            'type': 'Number',
            'query': true,
        },{
            'name': 'pertypeId',
            'desc': '营销人员类别ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'commission',
            'desc': '计算提成',
            'type': 'Boolean',
            'query': true,
        },{
            'name': 'busmanageId',
            'desc': '业务经理ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'marproductId',
            'desc': '营销产品ID',
            'type': 'String',
            'query': true,
        },{
            'name': 'brandId',
            'desc': '产品品牌',
            'type': 'String',
            'query': true,
        },{
            'name': 'productId',
            'desc': '产品型号',
            'type': 'String',
            'query': true,
        }
    ],
    indexDefine: [
        {uid:1}
    ]
} 
export const serviceProject={
    name: 'serviceProject',             //表名
    desc: '服务项目表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: false,      //是否更新数据表
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'itemType',
            'desc': '服务项目',
            'type': 'String',
            'query': true,
        },{
            'name': 'itemName',
            'desc': '服务内容',
            'type': 'Array',
            'query': true,
        },{
            'name': 'serverId',
            'desc': '服务商id',
            'type': 'String',
            'query': true,
        }
    ],
    indexDefine: [
        {uid:1}
    ]

}

//事件表
export const iotEvent = {
    name: 'iotEvent',             //表名
    desc: '事件表',             //表描述
    type: 1,             //类型(0:基础表, 1:用户表)
    isApi: true,           //是否开放API
    isPrivate: false,       //是否隐私数据, 如果是调用API时需要访问令牌
    isCache: true,         //数据是否启用缓存
    isUpdate: true,      //是否更新数据表
    cacheField: 'updatedAt',       //缓存日期字段
    fieldDefine: [
        {
            'name': 'uid',
            'desc': '用户ID',
            'type': 'Number',
            'query': true,
        },{
            'name': 'did',
            'desc': '设备标识号',
            'type': 'String',
            'query': true,
        },{
            'name': 'eventType',
            'desc': '事件类型',
            'type': 'Number',
            'query': true,
        },{
            'name': 'eventStatus',
            'desc': '事件状态',
            'type': 'Number',
            'query': true,
        }
    ],
    indexDefine: [
        {uid:1}
    ]
}


// let TABLES=[
//     area,customer,custType,department,employee,vehicle,iotDevice,iotGpsData,iotLog
//     ,brand,product,deviceTotal,deviceLog,iotStat,iotCommand,iotAlert,booking,activity,
//     weixin,qrData,activityProduct,qrDistribution,qrLink,authorize,promotion
// ];
let TABLES=[
    weixin
]
let old_vareion=localStorage.getItem('table.json.js.version');
localStorage.setItem('table.json.js.version',version);
window._fields={};
TABLES.forEach(t=>{
    _fields[t.name]=t.fieldDefine.map(f=>f.name).join(',')+',objectId,createdAt,updatedAt,creator';
});
if(version==old_vareion){
    TABLES=[];
}

export default TABLES;

import WiStormAPI from './WiStormAPI.js';
import config from './config.js';


export function WAPI(name,token){
	WiStormAPI.call(this,name,token,config.app_key,config.app_secret,{devKey:config.dev_key});
	this.get_op={
		fields:'objectId,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WAPI.prototype=new WiStormAPI();
/**
 * 用户信息相关api类
 * @constructor
 */
function WUserApi(token){
    WiStormAPI.call(this,'user',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,userType,username,mobile,mobileVerified,email,emailVerified,authData'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WUserApi.prototype=new WiStormAPI();//继承父类WiStormAPI

WUserApi.prototype.login=function(callback,data,op){
	var OP={};
	Object.assign(OP,op);				    //把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".login"; 		//接口名称
	
	data.password=this.md5(data.password);//md5加密
	this.getApi(data,callback,OP);			         //使用“GET”请求，异步获取数据
}

/**
 * 注册
 * mobile: 手机(手机或者邮箱选其一)
 * email: 邮箱(手机或者邮箱选其一)
 * password: 密码
 * valid_type: 验证设备类型 1: 通过手机号  2:通过邮箱
 * valid_code: 收到的验证码
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.register=function(callback,data,op){
	var OP={
		fields:'uid'			//默认返回的字段
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".register"; 				//接口名称
	data.password=this.md5(data.password);
	
	this.getApi(data,callback,OP);
}

/**
 * 检查账号或者用户名是否存在
 * mobile: 手机号
 * cust_name: 用户名
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.checkExists=function(callback,data,op){
	var OP={
		fields:'exist'			//默认返回的字段
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".exists";//接口名称
	this.getApi(data,callback,OP);
}


/**
 * 重置密码
 * 参数:
 * account: 手机号码或者邮箱地址
 * passsword: md5(登陆密码)
 * valid_type: 验证设备类型 1: 通过手机号  2:通过邮箱
 * valid_code: 收到的验证码
 * @param {Object} callback
 * @param {Object} data
 * @param {Object} op
 */
WUserApi.prototype.resetPassword=function(callback,data,op){
	var OP={
		fields:'status_code'			//默认返回的字段
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".password.reset";//接口名称
	data.password=this.md5(data.password);
	
	this.getApi(data,callback,OP);
}


/**
 * 获取用户授权令牌access_token
 * data包含：
 *     account:登录手机或邮箱
 *     passsword:密码
 * @param {Function} callback
 * @param {json} data，账户密码
 * @param {OP} op
 */
WUserApi.prototype.getToken=function(callback,data,op){
	var OP={
		fields:'access_token'			//默认返回的字段
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".access_token"; //接口名称
	data.password=this.md5(data.password);
	this.getApi(data,callback,OP);
}

/**
 * 绑定第三方登录帐号id
 * data包含：
 *     account:登录手机或邮箱
 *     passsword:密码
 * @param {Function} callback
 * @param {json} data，账户密码
 * @param {OP} op
 */
WUserApi.prototype.bind=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".bind"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 创建一条崩溃/错误记录
 * @param {Object} data
 * @param {Object} callback
 * @param {Object} op
 */
WUserApi.prototype.createCrash=function(data,callback,op){
	var OP={
		fields:'status_code,exception_id'
	};
	Object.assign(OP,op);
	OP.method='wicare.crash.create';
	
	this.getApi(data,callback,OP);
}

/**
 * 分销商各层级注册
 * @param {Object} data 必须parent_open_id，parent_mobile,mobile,password,valid_code,valid_type
 * @param {Object} callback
 * @param {Object} op
 */
WUserApi.prototype.distributorRegister=function(callback,data){
	data.method=this.apiName+'.distributor.register';
	this.safetyGet(data,callback);
}

/**
 * 验证邀请手机和openid是否有效
 * @param {Object} data 需要parent_open_id，parent_mobile
 * @param {Object} callback
 * @param {Object} op
 */
WUserApi.prototype.distributorCheck=function(callback,data){
	data.method=this.apiName+'.distributor.checkParent';
	this.safetyGet(data,callback);
}

/**
 * 客户签到
 * @param {Function} callback
 * @param {json} data,open_id
 * @param {OP} op
 */
WUserApi.prototype.checkin=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".checkin"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

/**
 * 客户分享
 * @param {Function} callback
 * @param {json} data，open_id
 * @param {OP} op
 */
WUserApi.prototype.share=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);				//把用户传入的配置覆盖默认配置
	OP.method=this.apiName+".share"; 		//接口名称
	
	this.getApi(data,callback,OP);
}

WUserApi.prototype.add=function(callback,data,op){
	var OP={
		fields:'status_code'
	};
	Object.assign(OP,op);
	OP.method=this.apiName+".create"; //接口名称
	if(data.obj_name)
		data.obj_name=data.obj_name.toUpperCase();
	this.getApi(data,callback,OP);
}

WUserApi.prototype.getQrcode=function(callback,data,op){
	data.method=this.apiName+'.getQrcode';
	this.safetyGet(data,callback);
}
/**
 * 添加绑定商户
 * 参数:
 *     cust_id: 用户ID
 *     seller_id: 商户ID
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WUserApi.prototype.addSeller=function(callback,data,op){
	var D={
		access_token:data.access_token,
		_cust_id:data.cust_id
	};
	delete data.cust_id;
	delete data.access_token;
	D.seller_ids="+"+JSON.stringify(data);
	this.update(callback,D,op);
}

/**
 * 删除绑定商户
 * 参数:
 *     cust_id: 用户ID
 *     seller_id: 商户ID
 * @param {Object} callback
 * @param {Object} data 				
 * @param {Object} op
 */
WUserApi.prototype.deleteSeller=function(callback,data,op){
	data._cust_id=data.cust_id;
	data.seller_ids="-"+data.seller_id.toString();
	delete data.seller_id;
	delete data.cust_id;
	this.update(callback,data,op);
}


/**
 * 通讯接口api类
 * @constructor
 */
function WCommApi(token){
	WiStormAPI.call(this,'comm',token,config.app_key,config.app_secret);
}
WCommApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 参数:
 * mobile: 手机号码
 * type: 发送短信类型
 * 1: 普通校验码信息
 * 2: 忘记密码校验信息
 * @param {Object} callback
 * @param {Object} mobile
 */
WCommApi.prototype.sendSMS=function(callback,mobile,type){
	var Data={
		method:this.apiName+".sms.send",
		mobile:mobile,
		type:type
	};
	
	this.getApi(Data,callback);	
}

//验证验证码
WCommApi.prototype.validCode=function(callback,data,op){
	var OP={
		fields:'valid'			//默认返回的字段
	};
	this.jsonConcat(OP,op);
	OP.method=this.apiName+".validCode";//接口名称
	this.getApi(data,callback,OP);
}

/*
 * 推送微信
 * data包含：
 * from:消息来源（字符串）
 * content：内容
 * open_id：接收者open_id
 * link：链接
 * remark:说明
 */
WCommApi.prototype.sendWeixin=function(callback,data){
	var url="http://h5.bibibaba.cn/send_weixin.php";
	var now = new Date();
    var op = {
        "first": {
            "value": data.content,
            "color": "#173177"
        },
        "keynote1": {
            "value": data.from,
            "color": "#173177"
        },
        "keynote2": {
            "value": W.dateToString(now),
            "color": "#173177"
        },
        "remark": {
            "value": data.remark,
            "color": "#173177"
        }
    };
    var OP={
		template_id:"FB1J1WM7tYMFPe0dScOBRc0MmGaOA_2VnBaNE1hnzH4",
		data:encodeURIComponent(JSON.stringify(op)),
		open_id:data.open_id,
		url:encodeURIComponent(data.link)
	}
	var ajaxSetting={
		dataType:"json",//服务器返回json格式数据
		data:OP,
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:callback,
		error:function(xhr,type,errorThrown){//异常处理；
			throw ("apiError:"+type);
		}
	}
	this.ajax(url,ajaxSetting);
}


/**
 * 文件接口api类
 * @constructor
 */
function WFileApi(token){
	WiStormAPI.call(this,'file',token,config.app_key,config.app_secret);
}
WFileApi.prototype=new WiStormAPI();//继承父类WiStormAPI的方法

/**
 * 
 * @param {Function} callback,上传成功之后调用
 * @param {File} file，要上传的文件对象，使用html5文件api
 * @param {Function} updateProgress，上传进度发生改变时调用，传入一个0-1之间的小数
 * @param {json} op，接口配置
 */
WFileApi.prototype.upload=function(callback,file,updateProgress,op){
	var OP={
		format: 'json',   //返回数据格式
	    v: '2.0',         //接口版本
	    sign_method: 'md5',//签名方式
		fields:'待定'	//默认返回的字段
	};
	OP.timestamp=W.dateToString(new Date());
	OP.app_key=this.appKey;
	this.jsonConcat(OP,op);
	OP.method="wicare.file.upload"; 
	var url=this.makeUrl(OP);//签名并构建路径
	
	var oData = new FormData();
	oData.append("image",file,file.name);

	var oReq = new XMLHttpRequest();
	oReq.open("POST",url,true);
	
	if(updateProgress){
		oReq.upload.addEventListener("progress",function(event){
			if(event.lengthComputable){
			    var percentComplete = event.loaded / event.total;
			    updateProgress(percentComplete);
			}
		});
	}
	oReq.onload = function(oEvent) {
		if (oReq.status == 200) {
			var json;
			try{
				json=JSON.parse(oReq.responseText);
			}catch(e){
				//TODO handle the exception
				json=oReq.responseText;
			}
			callback(json);
		} else {
		  	callback("Error " + oReq.status + " occurred uploading your file.<br \/>");
		}
	};
	oReq.send(oData);
}

/**
 * 
 * @param {Function} callback,上传成功之后调用
 * @param {String} dataUrl，要上传的文件base64编码
 * @param {Function} updateProgress，上传进度发生改变时调用，传入一个0-1之间的小数
 * @param {json} op，接口配置
 */
WFileApi.prototype.base64=function(callback,data,updateProgress,op){
	var method=this.apiName+'.base64'; 
	data.dataUrl=data.dataUrl.replace(/data:.*;base64,/,'');
	var url=this.safetyUrl+'?method='+method;
	var oData = new FormData();
	oData.append("image",data.dataUrl);
	oData.append("imageName",data.name);
	oData.append("suffix",data.suffix);

	var oReq = new XMLHttpRequest();
	oReq.open("POST",url,true);
	
	if(updateProgress){
		oReq.upload.addEventListener("progress",function(event){
			if(event.lengthComputable){
			    var percentComplete = event.loaded / event.total;
			    updateProgress(percentComplete);
			}
		});
	}
	oReq.onload = function(oEvent) {
		if (oReq.status == 200) {
			var json;
			try{
				json=JSON.parse(oReq.responseText);
			}catch(e){
				//TODO handle the exception
				json=oReq.responseText;
			}
			callback(json);
		} else {
		  	callback("Error " + oReq.status + " occurred uploading your file.<br \/>");
		}
	};
	oReq.send(oData);
}

function WDeveloperApi(token){
    WiStormAPI.call(this,'developer',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'dev_id,user_name,email,dev_type,user_id,dev_name,dev_key,dev_secret,access_apis,create_time'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"dev_id",
		page:"dev_id",
		limit:"20"
	}
}
WDeveloperApi.prototype=new WiStormAPI();//继承父类WiStormAPI

function WAppApi(token){
    WAPI.call(this,'app',token);
	this.get_op={
		fields:'app_id,dev_id,app_name,app_logo,app_key,app_secret,data_privilege,create_time,update_time'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"app_id",
		page:"app_id",
		limit:"20"
	}
}
WAppApi.prototype=new WAPI();//继承父类WiStormAPI

function WTableApi(token){
	WAPI.call(this,'table',token);
	this.get_op={
		fields:'name,desc,type,isApi,isPrivate,isCache,cacheField,fieldDefine,indexDefine'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"tid",
		page:"tid",
		limit:"20"
	}
}
WTableApi.prototype=new WAPI();//继承父类WiStormAPI

/**
 * 角色表
 */
function WRoleApi(token){//角色
	WiStormAPI.call(this,'role',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,name,roles,users,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WRoleApi.prototype=new WiStormAPI();//继承父类WiStormAPI

/**
 * 页面表
 */
function WPageApi(token){
	WiStormAPI.call(this,'page',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,appId,key,name,url,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WPageApi.prototype=new WiStormAPI();//继承父类WiStormAPI


/**
 * 功能表
 */
function WFeatureApi(token){
	WiStormAPI.call(this,'feature',token,config.app_key,config.app_secret);
	this.get_op={
		fields:'objectId,pageId,key,name,createdAt,updatedAt'//默认返回的字段
	}
	this.list_op={
		fields:this.get_op.fields,
		sorts:"objectId",
		page:"objectId",
		limit:"20"
	}
}
WFeatureApi.prototype=new WiStormAPI();//继承父类WiStormAPI

const Wapi={
    user:new WUserApi(_user?_user.access_token:null),
    developer:new WDeveloperApi(_user?_user.access_token:null),
    app:new WAppApi(_user?_user.access_token:null),
    table:new WTableApi(_user?_user.access_token:null),
    file:new WFileApi(_user?_user.access_token:null),
    comm:new WCommApi(_user?_user.access_token:null),
	role:new WRoleApi(_user?_user.access_token:null),
	page:new WPageApi(_user?_user.access_token:null),
	feature:new WFeatureApi(_user?_user.access_token:null),
	//以下为非核心表
	customer:new WAPI('customer',_user?_user.access_token:null),//客户表
	area:new WAPI('area',_user?_user.access_token:null),//地区表
	employee:new WAPI('employee',_user?_user.access_token:null),//员工表
	vehicle:new WAPI('vehicle',_user?_user.access_token:null),//车辆表
	device:new WAPI('_iotDevice',_user?_user.access_token:null),//终端表
	gps:new WAPI('_iotGpsData',_user?_user.access_token:null),//定位数据表
	log:new WAPI('_iotLog',_user?_user.access_token:null),//日志数据表
	//字典表
	department:new WAPI('department',_user?_user.access_token:null),//部门表
	cust_type:new WAPI('custType',_user?_user.access_token:null),//客户类型表
};
window.Wapi=Wapi;
export default Wapi;
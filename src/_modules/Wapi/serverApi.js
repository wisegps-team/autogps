/**
 * 可操作服务器资源，例如在服务器上存文件
 */
import WiStormAPI from './WiStormAPI.js';

class ServerApi{
    constructor(props, context) {
		this.url='http://h5.bibibaba.cn/server_api.php';
		this.ajax=WiStormAPI.prototype.ajax;
	}
    get(data={},success,dataType='json'){
		let opt={
			data,
			dataType,
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success,
			error:function(xhr,type,errorThrown){//异常处理；
				throw ("apiError:"+type);
			}
		}

		this.ajax(this.url,opt);
	}
    saveConfigFile(callback,data){
        data.method='wx_config_file';
		this.get(data,callback);
    }
}

export default ServerApi;
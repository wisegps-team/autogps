/**
 * 关于项目所有的配置
 */
const CONFIG={}

//本地测试时使用
console.debug(
W.setCookie('_app_config_','{"smsEngine":{"emay":{"host":"sdk999ws.eucp.b2m.cn","port":8080,"cdkey":"9SDK-EMY-0999-JCXUR","password":"512967"}},"devKey":"86e3ddeb8db36cbf68f10a8b7d05e7ac","devSecret":"b4c36736d48a1cdf5bb0b7e8c0d0e3a4","objectId":770816593482616800,"desc":"\u5ba2\u6237\/\u7ec8\u7aef\u7ba1\u7406\u5e73\u53f0","name":"\u536b\u7f51\u79d1\u6280\u7ba1\u7406\u5e73\u53f0","enterUrl":"\/autogps\/index.html","devId":763995219921342500,"appKey":"0642502f628a83433f0ba801d0cae4ef","appSecret":"15fe3ee5197e8ba810512671483d2697","sid":770813724780007400,"wxAppKey":"wx76f1169cbd4339c1"}',30)
);

let keys=W.getCookie('_app_config_');
try {
    keys=JSON.parse(keys);
    Object.assign(CONFIG,keys);
    ___.app_name=CONFIG.name;
} catch (error) {
    alert('app key error');
}


export default CONFIG;
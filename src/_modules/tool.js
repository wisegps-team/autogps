/**
 * 通用工具函数
 */

/**
 * 获取随机字符串
 * @param {Number} len 字符串长度，默认值为32
 */
export function randomStr(len=32){
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = chars.length;
　　var pwd = '';
　　for (let i = 0; i < len; i++) {
　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
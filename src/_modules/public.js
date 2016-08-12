/**
 * 用于组件通用的一些mixins
 */



export var  P={
    rebuild:function (com) {
        if(typeof com.bind=='function')
            com.bind().forEach(function(fn) {
                com[fn.name]=fn.bind(com);
            }, this);
    },
    requal:function(a,b){
        if(typeof a=='undefined'&&typeof a==typeof b){
            let e=true;
            for(let k in b){
                if(a[k]!=b[k])e=false;
            }
            return e;
        }else
            return (a==b);
    }
}


export default P;
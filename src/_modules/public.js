/**
 * 用于组件通用的一些mixins
 */



export var  P={
    rebuild:function (com) {
        if(typeof com.bind=='function')
            com.bind().forEach(function(fn) {
                com[fn.name]=fn.bind(com);
            }, this);
    }
}


export default P;
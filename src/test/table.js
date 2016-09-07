import Wapi,{WAPI} from '../_modules/Wapi';
import TABLES from './_table.json.js';
import DATA from './_data.json.js';

window.DATA=DATA;
let T;
Wapi.table.list(function(res){
    T=res.data||[];
    console.log('当前数据库',T);
    //更新table
    for(let i=0;i<TABLES.length;i++){
        let tab=TABLES[i];
        if(tab.fieldDefine.length){
            setTimeout(()=>addTable(tab),i*1000);
        }
    }
},{creator:'>0'})

window.getTableFields=function getTableFields(table){
    let arr=table.fieldDefine;
    let fields=arr.map(ele=>ele.name).join(',');
    return fields;
}

window.addTable=function addTable(table){
    if(T.find(ele=>ele.name==table.name)){
        Wapi.table.delete(function(res){
            console.log('删除表成功');
            Wapi.table.add(res=>console.log('重新创建表成功',res,getTableFields(table)),table);
        },{
            name:table.name
        })
    }else{
        Wapi.table.add(res=>console.log('创建表成功',res,getTableFields(table)),table);
    }
}

//导入数据
window.addData=function addData(name,dataArr){
    let api=new WAPI(name,_user.access_token);
    let id=setInterval(send,100);
    function send(){
        if(!dataArr.length){
            clearInterval(id);
            return;
        }
        let data=dataArr.shift();
        api.add(function(res){
            if(res.status_code){
                console.log('导入出错',data);
            }
        },data,{err:true});
    }
}

//清除数据
window.clearData=function clearData(name){
    let api=new WAPI(name,_user.access_token);
    api.delete(function(res){
        console.log('已清空'+name);
    },{
        objectId:'>0'
    })
}






function changeArea(ele){
    ele.name=ele.areaName;
    delete ele.areaName;
    return ele;
}
window.addEventListener('load',function(){
    // let data=areaArray.map(changeArea);
    // addData('area',data);
    // clearData('area');

    //用户类型
    // clearData('custType');
    // addData('custType',DATA.custType);
})



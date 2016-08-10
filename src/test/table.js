import Wapi,{WAPI} from '../_modules/Wapi';
import TABLES from './_table.json.js';
import DATA from './_data.json.js';

function addTable(table){
    Wapi.table.get(function(res){
        if(res.data){
            table._name=table.name;
            Wapi.table.update(res=>console.log(res),table);
        }else{
            Wapi.table.add(res=>console.log(res),table);
        }
    },{
        name:table.name
    });
}

function addData(name,dataArr){
    let api=new WAPI(name,_user.access_token);
    let id=setInterval(send,500);
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

//更新table
for(let i=0;i<TABLES.length;i++){
    let tab=TABLES[i];
    if(tab.fieldDefine.length){
        setTimeout(()=>addTable(tab),i*1000);
    }
}


function changeArea(ele){
    ele.name=ele.areaName;
    delete ele.areaName;
    return ele;
}
window.addEventListener('load',function(){
    let data=areaArray.slice(0,10).map(changeArea);
    addData('area',data);
})



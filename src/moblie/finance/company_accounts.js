import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    line:{margin:'0px 15px',padding:'15px 5px',borderBottom:'1px solid #dddddd'},
    line_right:{float:'right'},
};


let _companies=[
    {
        objectId:111,
        name:'XX公司',
        balance:111,
    },{
        objectId:222,
        name:'YY公司',
        balance:222,
    }
];
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.toBill = this.toBill.bind(this);
    }
    toBill(company){
        console.log(company);
        // thisView.goTo('./bill_list.js',company);
    }
    render() {
        let data=_companies;
        let items=data.map(ele=>
            <div key={ele.objectId} style={styles.line} onClick={()=>this.toBill(ele)}>
                <div style={styles.line_right}>{toMoneyFormat(ele.balance)}</div>
                <div >{ele.name}</div>
            </div>
        )
        return (
            <div>
                {items}
            </div>
        );
    }
}

export default App;

//工具方法 金额转字符
function toMoneyFormat(money){
    let str=money.toString();
    if(str.includes('.')){
        return '￥' + str;
    }else{
        return '￥' + str +'.00';
    }
}
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import AppBar from '../../_component/base/appBar';
import AutoList from '../../_component/base/autoList';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    main:{
        padding:'10px',
        marginTop:'50px',
    },
    income:{
        color:'#009900',
        fontSize:'20px'
    },
    expenses:{
        color:'#990000',
        fontSize:'20px'
    },
    bill:{
        padding:'5px 10px',
        borderBottom:'1px solid #cccccc'
    },
    bill_remark:{
        fontSize:'14px',
        color:'#666666',
        paddingTop:'5px'
    },
}

let _list=[
    {
        objectId:1,
        amount:'-1.00',
        createdAt:'2016-11-11',
        remark:'buy something',
    },
    {
        objectId:2,
        amount:'2.00',
        createdAt:'2016-12-12',
        remark:'sell something',
    }
]
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.company={};
        this.data=[];
        this.total=0;
        this.nextPage = this.nextPage.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            console.log(e.params);//这里的params最好是把公司id和公司名称一起传过来
            this.company=e.params;
            this.data=_list;
            this.total=_list.length;
            this.forceUpdate();
        });
    }
    nextPage(){
        console.log('next page');
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    style={sty.appbar}
                    title={this.company.name}
                />
                <div style={sty.main}>
                    <Alist 
                        max={this.total} 
                        limit={20} 
                        data={this.data} 
                        next={this.nextPage} 
                    />
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

export default App;

class DList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let items=this.props.data.map((ele)=>
            <div key={ele.objectId} style={sty.bill}>
                <div style={(ele.amount>=0) ? sty.income : sty.expenses}>
                    {(ele.amount>=0) ? ('+'+(ele.amount)) : (ele.amount)}
                </div>
                <div style={sty.bill_remark}>{W.dateToString(new Date(ele.createdAt))}</div>
                <div style={sty.bill_remark}>{decodeURIComponent(ele.remark)}</div>
            </div>
        );
        return(
            <div>
                {items}
            </div>
        )
    }
}
let Alist=AutoList(DList);


//工具方法 金额转字符
function toMoneyFormat(money){
    let str=money.toString();
    if(str.includes('.')){
        return '￥' + str;
    }else{
        return '￥' + str +'.00';
    }
}
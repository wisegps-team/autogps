import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import AutoList from '../../_component/base/autoList';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    line:{margin:'0px 15px',padding:'15px 5px',borderBottom:'1px solid #dddddd'},
    line_right:{float:'right'},
};


class App extends Component {
    constructor(props,context){
        super(props,context);
        this.page=1;
        this.total=0;
        this.data=[];
        this.nextPage = this.nextPage.bind(this);
        this.getData = this.getData.bind(this);
        this.toBill = this.toBill.bind(this);
    }
    getChildContext(){
        return {
            toBill:this.toBill
        };
    }
    componentDidMount() {
        this.getData();
    }
    nextPage(){
        this.page++;
        this.getData();
    }
    getData(){
        Wapi.user.getAccountList(res=>{
            console.log('get account list');
            this.total=res.total;
            let _data=res.data;

            let uids=_data.map(ele=>ele.uid);
            let strUids=uids.join('|');
            
            Wapi.customer.list(re=>{
                console.log('get customer info');
                let custs=re.data;
                _data.map(ele=>{
                    ele.name=___.deleted;
                    let target=custs.find(item=>item.uid==ele.uid);
                    if(target){
                        ele.name=target.contact||___.no_name;
                    }
                })
                this.data=this.data.concat(_data);
                this.forceUpdate();
            },{uid:strUids})
            
        },{
            account_type:1,
            page:this.page,
            limit:20
        });
    }
    toBill(company){
        console.log(company);
        thisView.goTo('./bill_list.js',company);
    }
    render() {
        return (
            <div>
                <Alist 
                    max={this.total} 
                    limit={20} 
                    data={this.data} 
                    next={this.nextPage} 
                />
            </div>
        );
    }
}
App.childContextTypes={
    toBill:React.PropTypes.func
}

export default App;

class DList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let data=this.props.data;
        let items=data.map((ele,i)=>
            <div key={i} style={styles.line} onClick={()=>this.context.toBill(ele)}>
                <div style={styles.line_right}>{toMoneyFormat(ele.balance)}</div>
                <div >{ele.name}</div>
            </div>
        )
        return(
            <div>
                {items}
            </div>
        )
    }
}
DList.contextTypes={
    toBill: React.PropTypes.func
};
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
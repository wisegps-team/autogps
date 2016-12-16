import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data={};
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            console.log(e.params);//这里的params最好是把公司id和公司名称一起传过来
            this.data=e.params;
            this.forceUpdate();
        });
    }
    render() {
        return (
            <div style={{padding:'1em'}}>
                {/*<p>objectId: {this.data.objectId}</p>*/}
                {/*<p>uid: {this.data.uid}</p>*/}
                <p>订单号: {this.data.oid}</p>
                {/*<p>tid: {this.data.tid}</p>*/}
                {/*<p>billType: {this.data.billType}</p>*/}
                <p>金额: {this.data.amount}</p>
                {/*<p>balance: {this.data.balance}</p>*/}
                <p>备注: {decodeURIComponent(this.data.remark)}</p>
                {/*<p>creator: {this.data.creator}</p>*/}
                <p>创建时间: {W.dateToString(new Date(this.data.createdAt))}</p>
                {/*<p>updatedAt: {this.data.updatedAt}</p>*/}
            </div>
        );
    }
}

export default App;
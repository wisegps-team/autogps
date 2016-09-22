import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';

import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingTop:'50px',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    card:{marginTop:'1em',padding:'0.5em 1em'},
    table_td_right:{paddingLeft:'1em'},
}

let _res={
    code:0,
    data:[
        {
            sellerId:'111',
            name:'小明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            sellerId:'222',
            name:'明明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            sellerId:'333',
            name:'xixi',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
    ]
}

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('partTime_bills.js',2);
});


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            sellers:[],
            total:0,
        }
        this.page=1;
    }
    getChildContext(){
        return {
            settlement:this.settlement
        };
    }
    settlement(seller){
        console.log(seller);
        
        thisView.postMessage('partTime_bills.js',{
            title:'sellerId',
            content:seller.sellerId
        });
        // thisView.goTo('partTime_bills.js');
    }
    componentDidMount(){
        this.setState({sellers:_res.data})
    }
    loadNextPage(){
        let arr=this.state.sellers;
        this.page++;
        // Wapi.employee.list(res=>{
        //     this.setState({sellers:arr.concat(res.data)});
        // },{
        //     companyId:_user.customer.objectId,
        // },{
        //     limit:20,
        //     page_no:this.page
        // });
    }
    render(){
        console.log(this.state.sellers)
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.partTime_sellers} 
                        style={styles.appbar}
                    />
                    <Alist 
                        max={this.state.total} 
                        limit={20} 
                        data={this.state.sellers} 
                        next={this.loadNextPage} 
                    />
                </div>
            </ThemeProvider>
        )
    }
}
App.childContextTypes={
    settlement:React.PropTypes.func
}


class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        console.log(this.props.data);
        let items=this.props.data.map(ele=>
            <Card style={styles.card} key={ele.sellerId}>
                <table>
                    <tbody>
                        <tr>
                            <td>{ele.name}</td>
                            <td style={styles.table_td_right}>{ele.tel}</td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>预定：{ele.status0}</td>
                            <td style={styles.table_td_right}>注册：{ele.status1}</td>
                            <td >
                                <FlatButton label={'结算'} primary={true} onClick={()=>this.context.settlement(ele)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        );
        return(
            <div style={styles.main}>
                {items}
            </div>
        )
    }
}
 DumbList.contextTypes={
    settlement: React.PropTypes.func
};
let Alist=AutoList(DumbList);
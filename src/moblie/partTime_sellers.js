//微信营销页面 兼职销售人员列表

import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';


const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingTop:'50px',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
    card:{marginTop:'1em',padding:'0.5em 1em'},
    table_td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
}

//测试用数据
let _res={
    code:0,
    data:[
        {
            uid:'111',
            name:'小明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            uid:'222',
            name:'明明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            uid:'333',
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
    thisView.prefetch('partTime_count.js',2);
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
        // thisView.postMessage('partTime_count.js',{
        //     title:'sellerId',
        //     content:seller
        // });
        thisView.goTo('partTime_count.js',seller);
    }
    componentDidMount(){
        Wapi.employee.list(res=>{
            console.log(res);
            this.setState({
                sellers:res.data,
                total:res.total,
            });
        },{
            companyId:_user.customer.objectId,
            departId:'-1',
        })

        //测试用数据
        // this.setState({sellers:_res.data});
    }
    getUrl(){
        let opt={
            title:___.invitation_url,
            text:location.origin+'/?location=tempRegister.html&intent=logout&parentId='+_user.customer.objectId
        }
        W.alert(opt);
    }
    loadNextPage(){
        let arr=this.state.sellers;
        this.page++;
        Wapi.employee.list(res=>{
            this.setState({sellers:arr.concat(res.data)});
        },{
            companyId:_user.customer.objectId,
            departId:'-1',
        },{
            limit:20,
            page_no:this.page
        });
    }
    render(){
        console.log(this.state.sellers)
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.partTime_sellers} 
                        style={styles.appbar}
                        iconElementRight={
                            <IconButton onTouchTap={this.getUrl}><ContentAdd/></IconButton>
                        }
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
            <Card style={styles.card} key={ele.uid}>
                <table style={{whiteSpace:'nowrap'}}>
                    <tbody>
                        <tr>
                            <td>{ele.name}</td>
                            <td style={styles.table_td_right}>{ele.tel}</td>
                        </tr>
                    </tbody>
                </table>
                <table style={{whiteSpace:'nowrap',fontSize:'0.8em'}}>
                    <tbody>
                        <tr>
                            <td>预定用户：{ele.status0}</td>
                            <td style={styles.table_td_right}>注册用户：{ele.status1}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={"佣金结算"} primary={true} onClick={()=>this.context.settlement(ele)} />
                </div>
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
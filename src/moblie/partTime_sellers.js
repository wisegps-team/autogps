//微信营销页面 兼职销售人员列表

import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

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
            show_event_page:false,
        }
        this.page=1;
        this.eventUrl='';

        this.getEventUrl=this.getEventUrl.bind(this);
        this.saveEventUrl=this.saveEventUrl.bind(this);
    }
    getChildContext(){
        return {
            settlement:this.settlement
        };
    }
    settlement(seller){
        thisView.goTo('partTime_count.js',seller);
    }
    componentDidMount(){
        let sellers=[];
        Wapi.employee.list(res=>{
            sellers=res.data;
            let par={
                "group":{
                    "_id":{
                        "sellerId":"$sellerId"
                    },
                    "status0":{
                        "$sum":"$status0"
                    },
                    "status1":{
                        "$sum":"$status1"
                    },
                    "status2":{
                        "$sum":"$status2"
                    },
                    "status3":{
                        "$sum":"$status3"
                    }
                },
                "sorts":"sellerId",
                "uid":_user.customer.objectId
            }
            Wapi.booking.aggr(resAggr=>{
                let arr=resAggr.data;
                sellers.map(ele=>{
                    let booking=arr.find(item=>item._id.sellerId==ele.objectId);
                    if(booking){
                        ele.status0=booking.status0;
                        ele.status1=booking.status1;
                        ele.status2=booking.status2;
                        ele.status3=booking.status3;
                    }else{
                        ele.status0=0;
                        ele.status1=0;
                        ele.status2=0;
                        ele.status3=0;
                    }
                })
                this.setState({
                    sellers:sellers,
                    total:res.total,
                });
            },par);
        },{
            companyId:_user.customer.objectId,
            departId:'-1',
        });

        //测试用数据
        // this.setState({sellers:_res.data});
    }
    getInviteUrl(){
        let opt={
            title:___.invitation_url,
            text:location.origin+'/?location=tempRegister.html&intent=logout&parentId='+_user.customer.objectId
        }
        W.alert(opt);
    }
    getEventUrl(){
        let _this=this;
        W.prompt(___.input_action_papge,'',function(url){
            if(!url)return;
            W.prompt(___.input_action_title,'',function(title){
                _this.saveEventUrl(url,title);
                W.alert(___.set_action_success);
            })
        });
    }
    saveEventUrl(url,title){
        if(!url)return;

        let _title=title||'';

        let _customer=_user.customer;
        let _other=_user.customer.other||{};
        _other.url=url;
        _other.title=_title;

        Wapi.customer.update(res=>{
            _user.customer.other=_other;
        },{
            _objectId:_user.customer.objectId,
            other:_other,
        })
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
        console.log(this.state.sellers);
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.partTime_sellers} 
                        style={styles.appbar}
                        iconElementRight={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                <MenuItem primaryText={___.invitation_url} onTouchTap={this.getInviteUrl}/>
                                <MenuItem primaryText={___.action_papge} onTouchTap={this.getEventUrl}/>
                            </IconMenu>
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
        let items=this.props.data.map((ele,index)=>
            <Card style={styles.card} key={index}>
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
                            <td>{___.customer_booked+" "+ele.status0}</td>
                            <td style={styles.table_td_right}>{___.customer_registed+" "+ele.status1}</td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.commission_pay} primary={true} onClick={()=>this.context.settlement(ele)} />
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
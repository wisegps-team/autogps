//注册信息
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';
import DeviceLogList from '../_component/device_list';
import ProductLogList from '../_component/productlog_list';
import {reCode} from '../_modules/tool';
import UserSearch from '../_component/user_search';
import AutoList from '../_component/base/autoList';


const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    card:{margin:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    line:{marginTop:'1em'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


class App extends Component {
    constructor(props,context){
        super(props,context);
        this.limit=20;
        this.total=-1;
        this.page_no=1;
        this.carOwners=[];

        this.nextPage = this.nextPage.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        this.getData();
    }
    nextPage(){
        this.page_no++;
        this.getData();
    }
    getData(){
        console.log(this.page_no);
        // this.total=_carOwners.length;
        // this.carOwners=_carOwners.slice(0,this.page_no*this.limit+this.limit);
        // this.forceUpdate();

        Wapi.customer.list(res=>{//获取当前用户名下的车主
            this.total=res.total;
            // this.carOwners=res.data;
            let carOwners=res.data;
            
            let arrCarOwnersId=carOwners.map(ele=>ele.objectId);//车主的objectId数组
            let strCarOwnersId=arrCarOwnersId.join('|');

            Wapi.device.list(re=>{//根据车主id数组查找车主的设备
                let data=re.data;

                carOwners.forEach(ele=>{
                    data.find(item=>{
                        if(item.uid==ele.objectId){
                            ele.model=item.model;
                            ele.did=item.did;
                        }
                    });
                });

                this.carOwners=this.carOwners.concat(carOwners);
                this.forceUpdate();
            },{uid:strCarOwnersId});

        },{
            parentId:_user.customer.objectId
        },{
            limit:this.limit,
            page_no:this.page_no,
        });
    }
    
    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.register_info}
                        style={{position:'fixed'}}
                    />
                    <div name='list' style={styles.main}>
                        {/*items*/}
                        <Alist 
                            max={this.total} 
                            limit={20} 
                            data={this.carOwners} 
                            next={this.nextPage} 
                        />
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}


class DList extends Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let data=this.props.data;
        
        let items=data.map((ele,i)=>
            <Card key={i} style={styles.card}>
                <table>
                    <tbody>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.cellphone}</td>
                            <td style={styles.td_right}>{ele.tel}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.device_type}</td>
                            <td style={styles.td_right}>{ele.model}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{'IMEI '}</td>
                            <td style={styles.td_right}>{ele.did}</td>
                        </tr>
                        <tr style={styles.line}>
                            <td style={styles.td_left}>{___.register_date}</td>
                            <td style={styles.td_right}>{ele.createdAt.slice(0,10)}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>);
        return(
            <div>
                {items}
            </div>
        )
    }
}
let Alist=AutoList(DList);

export default App;
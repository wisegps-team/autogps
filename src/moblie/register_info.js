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
    list_item:{marginTop:'1em',padding:'0.5em',borderBottom:'1px solid #999999'},
    card:{margin:'1em',padding:'0.5em'},
    card_left:{display:'table-cell',width:'75px',whiteSpace:'nowrap'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    show:{paddingTop:'50px'},
    hide:{display:'none'},
    a:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em',marginBottom:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    w:{width:'100%'},
    line:{marginTop:'1em'},
};


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const _carOwner={
    tel:'13566669999',
    model:'W20',
    did:'123456',
    register_date:'2016-10-25'
}
const _carOwners=[];
for(let i=0;i<10;i++){
    let owner=Object.assign({},_carOwner);
    owner.did=owner.did+i;
    _carOwners.push(owner);
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.limit=3;
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
        this.total=_carOwners.length;
        this.carOwners=_carOwners.slice(0,this.page_no*this.limit+this.limit);
        this.forceUpdate();
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
                            <td style={styles.td_right}>{ele.register_date}</td>
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
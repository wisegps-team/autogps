import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';

import Input from '../_component/base/input';
import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.product_authorize);
thisView.addEventListener('load',function(e){
    ReactDOM.render(<App/>,thisView);
    console.log(e);
});

const styles = {
    main:{padding:'15px'},
    input_page:{textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'10px'},
    select:{width:'100%',textAlign:'left'},
    list_item:{borderBottom: '1px solid #ccc'},
    icon:{height: '48px',width: '48px',position: 'absolute',right: '0px',top: '0px',bottom: '0px',margin: 'auto'},
    card:{paddingBottom:'10px',borderBottom:'1px solid #ccc'},
    to:{horizontal: 'right', vertical: 'top'},
    variable:{color:'#009688'},
    link:{color:'#0000cc'},
    line:{marginTop:'10px'},
    spans:{width:'140px',display:'table-cell'},
    menu_item:{height:'40px'},
    no_data:{marginTop:'15px',display:'block',width:'100%',textAlign:'center'},
    hide:{display:'none'},
    search_head:{width:'100%',display:'block'},
    add_icon:{float:'right',marginRight:'15px',color:"#2196f3"},
    search_box:{marginLeft:'15px',marginTop:'15px',width:'80%',display:'block'},
    span_left:{fontSize:'0.8em',color:'#666666'},
    span_right:{fontSize:'0.8em'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

class App extends Component {
    constructor(props,context){
        super(props,context);
    }
    componentDidMount(){
        let _this=this;
        thisView.addEventListener('show',function (e) {
            console.log(e.params);
        });
    }
    render() {
        return (
            <div>
                authorize
            </div>
        );
    }
}

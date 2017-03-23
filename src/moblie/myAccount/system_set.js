import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';

import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionFace from 'material-ui/svg-icons/action/face';
import LinearProgress from 'material-ui/LinearProgress';

import AppBar from '../../_component/base/appBar';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle(___.system_set);
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    appbar:{
        position:'fixed',
        top:'0px'
    },
    p:{
        padding: '10px',
    },
    logo:{
        top:'0px',
        bottom:'0px',
        margin: 'auto',
        height:'40px',
        width:'40px'
    },
    limg:{
        width: '100%',
        height: '100%'
    },
    list:{
        borderBottom:'1px solid #dddddd'
    },
}

class App extends Component {
    render() {
        return (
            <ThemeProvider>
            <div>
                {/*<AppBar title={___.system_set}/>*/}
                <div style={sty.p}>
                    <ShowBox/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

class ShowBox extends Component{
    constructor(props, context) {
        super(props, context);

        this.items=[
            {
                objId:795526092659232800,
                url:'company_info',
                item:<ListItem 
                    key={0}
                    primaryText={___.company_info} 
                    onClick={()=>{thisView.goTo('../company_info.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:778518425667506200,
                url:'brand_manage',
                item:<ListItem 
                    key={1}
                    primaryText={___.brand_set} 
                    onClick={()=>{thisView.goTo('../brand_manage.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:803070882535837700,
                url:'role_manage',
                item:<ListItem 
                    key={2}
                    primaryText={___.role} 
                    onClick={()=>{thisView.goTo('../role_manage.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:773357884674281500,
                url:'department',
                item:<ListItem 
                    key={3}
                    primaryText={___.department}
                    onClick={()=>{thisView.goTo('../department.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:773357884854636500,
                url:'employee',
                item:<ListItem 
                    key={4}
                    primaryText={___.employee} 
                    onClick={()=>{thisView.goTo('../employee.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:792915075680833500,
                url:'wx_config',
                item:<ListItem 
                    key={5}
                    primaryText={___.public_number} 
                    onClick={()=>{thisView.goTo('../wx_config.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:803882340127477800,
                url:'selling_product',
                item:<ListItem 
                    key={6}
                    primaryText={___.selling_product} 
                    onClick={()=>{thisView.goTo('../selling_product.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:793341505392742400,
                url:'seller_activity',
                item:<ListItem 
                    key={7}
                    primaryText={___.seller_activity} 
                    onClick={()=>{thisView.goTo('../seller_activity.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:813277522786652200,
                url:'qrcode',
                item:<ListItem 
                    key={8}
                    primaryText={___.qrcode_manage} 
                    onClick={()=>{thisView.goTo('../qrcode.js')}}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
        ]

    }
	
    render() {
        // let pages=_user.pages.map(ele=>ele.objectId);
        // let showItems=this.items.filter(ele=>pages.includes(ele.objId));
        let urls=_user.pages.map(ele=>ele.url.split('/').pop());
        let showItems=this.items.filter(ele=>urls.includes(ele.url));
        let listItems=showItems.map(ele=>ele.item);
        return (
            <div>
                <List>
                    {listItems}
                </List>
            </div>
        );
    }
}

class Logo extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            completed:0
        }
        this.uploadLogo = this.uploadLogo.bind(this);
    }
    
    uploadLogo(){
        return;
       
    }
    render() {
        let logo=_user.logo?(<Avatar src={_user.logo} onClick={this.uploadLogo} style={sty.limg}/>):
        (<ActionFace onClick={this.uploadLogo} style={sty.limg}/>);
        let progress=this.state.completed?<LinearProgress mode="determinate" value={this.state.completed}/>:null;
        return (
            <span {...this.props}>
                {logo}
                {progress}
            </span>
        );
    }
}

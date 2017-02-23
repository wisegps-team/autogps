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
                item:<ListItem 
                    key={0}
                    primaryText={___.company_info} 
                    onClick={this.companyInfo}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:778518425667506200,
                item:<ListItem 
                    key={1}
                    primaryText={___.brand_set} 
                    onClick={this.brandManage}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:803070882535837700,
                item:<ListItem 
                    key={2}
                    primaryText={___.role} 
                    onClick={this.roleManage}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:773357884674281500,
                item:<ListItem 
                    key={3}
                    primaryText={___.department}
                    onClick={this.department}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:773357884854636500,
                item:<ListItem 
                    key={4}
                    primaryText={___.employee} 
                    onClick={this.employee}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
            {
                objId:792915075680833500,
                item:<ListItem 
                    key={5}
                    primaryText={___.public_number} 
                    onClick={this.wxConfig}
                    rightIcon={<NavigationChevronRight />}
                    style={sty.list}
                />
            },
        ]

		this.companyInfo = this.companyInfo.bind(this);
		this.roleManage = this.roleManage.bind(this);
		this.department = this.department.bind(this);
		this.employee = this.employee.bind(this);
		this.wxConfig = this.wxConfig.bind(this);
    }
	
	companyInfo(){
		thisView.goTo('../company_info.js')
	}
	
	brandManage(){
		thisView.goTo('../brand_manage.js')
	}
	
	roleManage(){
		thisView.goTo('../role_manage.js')
	}
	
	department(){
		thisView.goTo('../department.js')
	}
	
	employee(){
		thisView.goTo('../employee.js')
	}
	
	wxConfig(){
		thisView.goTo('../wx_config.js')
	}
	
	
    render() {
        let pages=_user.pages.map(ele=>ele.objectId);
        let showItems=this.items.filter(ele=>pages.includes(ele.objId));
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

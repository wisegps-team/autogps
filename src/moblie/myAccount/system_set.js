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
		this.companyInfo = this.companyInfo.bind(this);
		this.roleManage = this.roleManage.bind(this);
		this.department = this.department.bind(this);
		this.employee = this.employee.bind(this);
		this.wxConfig = this.wxConfig.bind(this);
    }
	
	companyInfo(){
		thisView.goTo('../company_info.js')
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
       
        return (
            <div>
                <List>
                    <ListItem 
                        primaryText={___.company_info} 
						onClick={this.companyInfo}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    <ListItem 
                        primaryText={___.role} 
						onClick={this.roleManage}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
                    <ListItem 
                        primaryText={___.department}
						onClick={this.department}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
					<ListItem 
                        primaryText={___.employee} 
						onClick={this.employee}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
					<ListItem 
                        primaryText={___.public_number} 
						onClick={this.wxConfig}
                        rightIcon={<NavigationChevronRight />}
                        style={{borderBottom:'1px solid #dddddd'}}
                    />
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

//角色管理

import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import Card from 'material-ui/Card';

import AppBar from '../_component/base/appBar';
import AutoList from '../_component/base/autoList';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


const styles={
    appbar:{position:'fixed',top:'0px',left:'0px'},
    main:{width:'90%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'60px',paddingBottom:'20px',},
    card:{marginTop:'1em',padding:'0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            total:0,
            roles:[],
        }
        // this.roles=[];
    }
    // getChildContext(){
    //     return {
    //     };
    // }
    componentDidMount(){
        Wapi.role.list(res=>{
            console.log(res);
            // this.roles=res.data;
            this.setState({
                total:res.total,
                roles:res.data,
            });
        },{objectId:'>0'})
    }
    loadNextPage(){
        console.log('next page')
    }
    render(){
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.role_manage} 
                        style={styles.appbar}
                    />
                    <div style={styles.main}>
                        <Alist 
                            max={this.state.total} 
                            limit={20} 
                            data={this.state.roles} 
                            next={this.loadNextPage} 
                        />
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}
// App.childContextTypes={
// }


class DumbList extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render() {
        let cards=this.props.data.map((ele,i)=>{
            <Card key={i} style={styles.card}>
                <div>{ele.name}</div>
            </Card>
        })
        return(
            <div>
                {cards}
            </div>
        )
    }
}
//  DumbList.contextTypes={
// };
let Alist=AutoList(DumbList);


//我的营销>营销资料
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import AppBar from '../../_component/base/appBar';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    thisView.prefetch('scan_count.js',2);
});

const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    card:{margin:'10px',padding:'0px 10px 10px',borderBottom:'1px solid #cccccc'},
    line:{paddingTop:'0.5em'},
    count:{marginRight:'1em'},
    link:{color:'#009688',marginRight:'1em'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data=[];
        this.toScan = this.toScan.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            if(e.params){
                console.log('show bind count, act = ' + e.params.act);
            }
        });
        this.data=[1,2,3,5];
        this.forceUpdate();
    }
    toScan(data){
        thisView.goTo('scan_count.js',data);
    }
    removeBind(data){
        console.log('remove bind');
    }
    render() {
        let items=this.data.map((ele,i)=>
            <div key={i} style={styles.card}>
                <div style={styles.line}>二维码id</div>
                <div style={styles.line}>
                    <span onClick={()=>this.toScan(ele)} style={styles.link}>{___.scan_count}11</span>
                    <span onClick={()=>this.removeBind(ele)} style={styles.link}>{___.remove_bind}</span>
                </div>
            </div>
        )
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.bind_count} 
                    style={{position:'fixed',top:'0px'}}
                />
                <div style={styles.main}>
                    {items}
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
export default App;


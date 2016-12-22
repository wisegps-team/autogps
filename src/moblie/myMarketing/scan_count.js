//我的营销>营销资料
"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../../_theme/default';
import AppBar from '../../_component/base/appBar';


var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles = {
    main:{paddingTop:'50px',paddingBottom:'20px'},
    appbody:{padding:'10px'},
    card:{margin:'1em',padding:'0px 0.5em 0.5em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'},
    line:{marginTop:'0.5em'},
    top_btn_right:{width:'100%',display:'block',textAlign:'right'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    count:{marginRight:'1em'},
    link:{color:'#009688'},
    table:{paddingTop:'12px',paddingBottom:'10px',paddingLeft:'5px'},
    spans:{marginBottom:'10px',fontSize:'0.8em',paddingLeft:'5px'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

class App extends Component {
    constructor(props,context){
        super(props,context);
    }
    componentDidMount() {
        thisView.addEventListener('show',e=>{
            console.log(e.params);
        });
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.scan_count} 
                    style={{position:'fixed',top:'0px'}}
                />
                <div style={styles.main}>
                    scan count
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
export default App;


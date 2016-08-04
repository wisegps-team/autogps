/**
 * 08/03
 * 小吴
 * 客户管理页，展示客户列表，添加客户，删除客户
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {ThemeProvider} from '../_theme/default';

import Fab from '../_component/base/fab';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

class App extends Component{
    constructor(props, context) {
        super(props, context);
        
    }

    render() {
        return (
            <ThemeProvider>
            <div>
                <Fab onClick={()=>1}/>
            </div>
            </ThemeProvider>
        );
    }
    
}
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AppBar from '../_component/base/appBar';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    main:{paddingTop:'50px',paddingBottom:'20px'},
    tabs:{position: 'fixed',width: '100vw',bottom: '0px'},
};

class App extends Component {
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.raning}
                    style={{position:'fixed'}}
                />
                <div style={styles.main}>
                    功能待开放，敬请期待。
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


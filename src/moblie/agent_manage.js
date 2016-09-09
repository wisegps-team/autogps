/**
 * 09/09
 * 小吴
 * 代理商管理，主要功能是 展示代理商的统计信息，弹出邀约链接
 */
"use strict";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import SocialShare from 'material-ui/svg-icons/social/share';
import IconButton from 'material-ui/IconButton';

import AppBar from '../_component/base/appBar';
import Input from '../_component/base/input';


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
                <AppBar iconElementRight={<IconButton onClick={getUrl}><SocialShare/></IconButton>}/>
            </div>
            </ThemeProvider>
        );
    }
}

function getUrl(){
    W.alert(location.origin+'?intent=logout&register=true&parentId='+_user.customer.objectId);
}
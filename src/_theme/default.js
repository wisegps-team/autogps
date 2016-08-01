import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {deepOrange500,brown500,teal700,grey400,pinkA200,grey100,grey500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import ALERT from './alert';




const muiTheme = getMuiTheme({
    fontFamily: '微软雅黑',
    palette: {
        primary1Color: brown500,
        primary2Color: teal700,
        primary3Color: grey400,
        accent1Color: deepOrange500,
        accent2Color: grey100,
        accent3Color: grey500,
    },   
    appBar: {
        height: 50
    }
});

export class ThemeProvider  extends React.Component {
    render(){
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}
ALERT(ThemeProvider);//弹出框
export default ThemeProvider;
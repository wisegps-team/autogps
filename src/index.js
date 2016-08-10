"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';

import Login from './_component/login';
import Register from './_component/login/register';
import Wapi from './_modules/Wapi';

require('./_sass/index.scss');//包含css

window.addEventListener('load',function(){
    ReactDOM.render(<App/>,W('#main'));
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
        }
    }

    componentDidMount(){
        
    }
    loginSuccess(res){
        let min=-Math.floor((W.date(res.data.expire_in).getTime()-new Date().getTime())/60000);
        W.setCookie("access_token", res.data.access_token,min);
        
        Wapi.customer.get(function(result){
            let user=Object.assign({},result.data,res.data);
            W._loginSuccess(user);
            top.location="src/moblie/home.html";
        },{
            uid:res.data.uid
        });
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <Login onSuccess={this.loginSuccess} className='login' />
                    <Register onSuccess={res=>console.log(res)} />
                </div>
            </ThemeProvider>
        );
    }
}
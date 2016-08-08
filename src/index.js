"use strict";
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';

import {ThemeProvider} from './_theme/default';

import Login from './_component/login';
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
        W.setCookie("access_token", res.access_token,1);
        W._loginSuccess(res);
		success(res);
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <Login onSuccess={this.loginSuccess} className='login' />
                </div>
            </ThemeProvider>
        );
    }
}

'http://localhost:8081/index.html?openid=oudYOuExhc3pse6f5ZX1re9C3s_I&nickname=%E7%9E%8E%E5%AD%90%E9%9D%A2&sex=1&language=zh_CN&city=Foshan&province=Guangdong&country=CN&headimgurl=http://wx.qlogo.cn/mmopen/Q3auHgzwzM66cfEaq06eXsEiaaFdyGQHfibib8NePop0ibeCjicHiafGRU5iaibwRvaibmQibGmgbpAUMECpibCYjpuSzM9NtKiapjC7KMHJpwnrN66G8M8/0&privilege=Array&unionid=o_irQt2StLOq0XUG4azfLf60buUg&status_code=0&cust_type=3&cust_id=1478&cust_name=%E5%B0%8F%E5%90%B4&access_token=f1b3afaf9bbedfcb0ca3f0465a1d2e7e157c1ea55ad8d2dbcaa7083d125d360c130c6d36750f64040e82c3d8ac0881a4&valid_time=2016-07-29T08:50:14.066Z&sso_login=sso_login&open_id=oudYOuExhc3pse6f5ZX1re9C3s_I&state=sso_login'
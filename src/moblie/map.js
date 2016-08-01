"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Redux,createStore,applyMiddleware} from 'redux';
import {Provider,connect} from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import AppBar from 'material-ui/AppBar';

import monitorApp from '../_reducers/monitor';
import {ACT} from '../_actions';

import {ThemeProvider} from '../_theme/default';
import {CarList} from '../_component/car_list';

console.log('map加载了');
var thisView=window.LAUNCHER.getView();//第一句必然是获取view
if(!window.STORE){
    window.STORE=createStore(
        monitorApp,
        applyMiddleware(//应用中间件，为了可以使用异步action
            thunkMiddleware //为了可以使用异步action
        )
    );
    injectTapEventPlugin();//启用react触摸屏
    // 每次 state 更新时，打印日志
    // 注意 subscribe() 返回一个函数用来注销监听器
    let unsubscribe = STORE.subscribe(() =>
        console.log(STORE.getState())
    )
}

thisView.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <APP/>
        </Provider>
        ,thisView);
});


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            drawer:true
        }
    }

    componentDidMount(){
        // STORE.dispatch(ACT.fun.getUsers(true));//异步的action
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar
                    title={___.title}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonTouchTap={()=>this.setState({drawer:true})}
                    />
                    <CarList 
                        data={this.props.show_cars} 
                        carClick={carClick} 
                        active={this.props.select_car}
                    />
                </div>
            </ThemeProvider>
        );
    }
}

const APP=connect(function select(state) {
    let sta={};
    Object.assign(sta,state);
    sta.show_cars=(sta.show_cars==ACT.const.all)?sta.cars:sta.show_cars;
    return sta;
})(App);

function  carClick(data) {
    STORE.dispatch(ACT.fun.selectCar(data));
    late(()=>thisView.goTo('monitor.js'));
}

function late(fun) {
    setTimeout(fun,1000);
}
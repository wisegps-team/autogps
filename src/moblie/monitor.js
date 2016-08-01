"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import AppBar from 'material-ui/AppBar';

import STORE from '../_reducers/monitor';
import {ACT} from '../_actions';

import {ThemeProvider} from '../_theme/default';
import {CarList} from '../_component/car_list';
import {UserTree} from '../_component/user_tree';

console.log('monitor加载了');
var thisView=window.LAUNCHER.getView();//第一句必然是获取view



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
        STORE.dispatch(ACT.fun.getUsers(true));//异步的action
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
                    <UserTree data={this.props.user} userClick={userClick} select_users={this.props.select_users} />
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
    late(()=>thisView.goTo('map.js'));
}

function userClick(data,intent){
    if(intent=="delete"){
        STORE.dispatch(ACT.fun.selectUsersDelete(data));
    }else if(intent=="add"){
        STORE.dispatch(ACT.fun.selectUsersAdd(data));
    }
}

function late(fun) {
    setTimeout(fun,1000);
}

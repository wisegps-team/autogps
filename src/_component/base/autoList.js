/**
 * 08/004
 * 小吴
 * 带自动加载的列表组件
 */
"use strict";
import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';

class AutoList extends Component {
    constructor(props, context) {
        super(props, context);

        this._loaded=!props.loading;
    }
    
    componentDidMount() {
        if(!AutoList._lists.length)
            document.addEventListener('scroll',AutoList.scroll);
        if(this.props.forLoad)
            AutoList._lists.push(this);
    }
    componentWillUnmount() {
        AutoList._lists=AutoList._lists.filter((ele)=>ele!=this);
        if(!AutoList._lists.length)
            document.removeEventListener('scroll',AutoList.scroll);
    }
    componentWillReceiveProps(nextProps) {
        this._loaded=!nextProps.loading;
        if(this.props.forLoad!=nextProps.forLoad){
            if(nextProps.forLoad)
                AutoList._lists.push(this);
            else
                AutoList._lists=AutoList._lists.filter((ele)=>ele!=this);
        }   
    }
    
    load(){
        if(this._loaded){
            this._loaded=false;
            this.props.load();
        }
    }
    render() {
        let loading=null;
        if(this.props.forLoad)
            loading=(<div ref='loading'>{'正在加载……'}</div>);
        return (
            <List {...this.props}>
                {this.props.children}
                {loading}
            </List>
        );
    }
}

AutoList._lists=[];

AutoList.scroll=function(){
    let sh=window.screen.availHeight;
    AutoList._lists.forEach(function(element) {
        let r=element.refs.loading?element.refs.loading.getBoundingClientRect():{};
        if((r.top||r.bottom)&&r.top<sh)
            element.load();
    });
}

export default AutoList;
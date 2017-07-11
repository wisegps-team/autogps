
// "use strict";
// import React, {Component}  from 'react';
// import ReactDOM from 'react-dom';


import Wapi from './_modules/Wapi';
import {getOpenIdKey,changeToLetter} from './_modules/tool';
// import {ThemeProvider} from './_theme/default';
// window.onload=function(){
    function test(){
        Wapi.customer.list(res=>{console.log(res)},{objectId:'>0'})
    }
// }   



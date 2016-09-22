import React from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';

import AppBar from '../_component/base/appBar';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

let _sellerId='';
thisView.addEventListener('message',function (e) {
    _sellerId=e.data.content
    console.log(_sellerId);
})

let _res={
    code:0,
    data:[
        {
            sellerId:'111',
            name:'小明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            sellerId:'222',
            name:'明明',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
        {
            sellerId:'333',
            name:'xixi',
            tel:'12345678909',
            //status:0/1/2/3,//预定/注册/结算/确认
            status0:10,//包含后面的
            status1:9,
            status2:5,
            status3:3,
        },
    ]
}

const styles={
    appbar:{position:'fixed',top:'0px'},
    main:{width:'90%',paddingTop:'50px',paddingBottom:'20px',marginLeft:'5%',marginRight:'5%'},
}

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount(){
        let sellerId=_sellerId;
    }
    render(){
        return(
            <ThemeProvider>
                <div>
                    <AppBar 
                        style={styles.appbar}
                    />
                    <div style={styles.main}>
                        partTime_bills
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}
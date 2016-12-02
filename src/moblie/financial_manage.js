import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {Tabs, Tab} from 'material-ui/Tabs';

import AppBar from '../_component/base/appBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {List, ListItem} from 'material-ui/List';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    main:{margin:'10px'},
    income:{color:'#009900'},
    expenses:{color:'#990000'},
}

const _tempDeposit={str:'显示统计预订款的收付情况'};
const _preDeposit={str:'显示各代理商／经销商及营销账号／车主账户余额，可以查询往来明细。'};

let record={
    objectId:1,
    money:233,
    remark:'remark',
    income:true,
}
let records=[];
for(let i=5;i--;){
    let r=Object.assign({},record);
    r.objectId=i;
    r.income=!(i%2);
    records[i]=r;
}
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.data={
            tempDeposit:{},
            preDeposit:{},
        }
    }
    componentDidMount() {
        this.data.tempDeposit=_tempDeposit;
        this.data.preDeposit=_preDeposit;
        this.forceUpdate();
    }
    
    render() {
        console.log(this.data);
        let data=records;
        let items=data.map(ele=>
            <ListItem 
                key={ele.objectId}
                primaryText={ele.income ? ('+'+ele.money) : ('-'+ele.money)} 
                style={ele.income ? styles.income : styles.expenses}
                secondaryText={ele.remark}
            />
        );
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.financial_manage}
                    iconElementRight={
                        <IconMenu
                            iconButtonElement={
                                <IconButton><MoreVertIcon /></IconButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                            <MenuItem primaryText={___.recharge} />
                            <MenuItem primaryText={___.withdraw_cash} />
                        </IconMenu>
                    }
                />
                <div style={styles.main}>
                    <List>
                        {items}
                    </List>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
export default App;

class TempDeposit extends Component {
    render() {
        return (
            <div>
                {this.props.data.str}
            </div>
        );
    }
}

class PreDeposit extends Component {
    render() {
        return (
            <div>
                {this.props.data.str}
            </div>
        );
    }
}

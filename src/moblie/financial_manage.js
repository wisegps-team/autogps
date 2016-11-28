import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import {Tabs, Tab} from 'material-ui/Tabs';

import AppBar from '../_component/base/appBar';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const styles={
    main:{margin:'10px'}
}

const _tempDeposit={str:'显示统计预订款的收付情况'};
const _preDeposit={str:'显示各代理商／经销商及营销账号／车主账户余额，可以查询往来明细。'};

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
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.financial_manage}/>
                <Tabs>
                    <Tab label={'暂存款'}>
                        <TempDeposit data={this.data.tempDeposit}/>
                    </Tab>
                    <Tab label={'预存款'}>
                        <PreDeposit data={this.data.preDeposit}/>
                    </Tab>
                </Tabs>
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
